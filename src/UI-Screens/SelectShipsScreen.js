class SelectShipsScreen {

    constructor(height, width, logic, nextScreenCallback) {
        this.NUM_ROWS = height; 
        this.NUM_COLS = width; 
        this.board = null; 

        this.logic = logic; 

        this.selectedShipID = null; 
        this.selectedShipOrientation = null; 
        this.selectedIsMoving = false;

        this.hoveredCells = [];
        this.lastHovered = null;

        this.nextScreenCallback = nextScreenCallback; 
    }

    createPickScreen() {

        this.rotateOnKey(); 

        const content = document.querySelector(".content-box");
        content.replaceChildren(); 

        const caption = document.createElement("p"); 
        caption.textContent = `Place your ships by clicking on the ship and clicking 
        on the gameboard! After clicking, you may rotate the ship by clicking the Rotate Button.`;
        caption.classList = "caption"; 
        content.appendChild(caption); 

        const shipOuterBox = document.createElement("div");
        shipOuterBox.classList="ship-outer-box";

        const cellBox = document.createElement("div"); 
        cellBox.classList="cell-box";
        shipOuterBox.append(cellBox);

        const shipButtonsBox = document.createElement("div"); 
        const ships = this.createShipButtons();  

        ships.forEach(ship => {
            shipButtonsBox.appendChild(ship); 
        });

        shipButtonsBox.classList = "ship-buttons";

        const confirmButton = document.createElement("button"); 
        confirmButton.textContent = "Confirm";
        confirmButton.classList = "confirm-button";
        confirmButton.addEventListener("click", () => this.nextScreenCallback());
        shipButtonsBox.appendChild(confirmButton);

        shipOuterBox.appendChild(shipButtonsBox); 
        content.appendChild(shipOuterBox);

        this.renderBoard();
    }

    createShipButtons() {
        const shipArr = []; 

        this.logic.initializeShipsBeforePlacement().forEach((ship) => {

            let shipButton = document.createElement("button");
            shipButton.setAttribute('data-id', ship.id);
            shipButton.setAttribute('data-length', ship.shipLength);  
            shipButton.textContent = `LENGTH ${ship.shipLength}`;
            shipButton.classList = "ship"; 
            shipButton.addEventListener("click", () => {
                this.selectedShipID = ship.id;
                this.selectedShipOrientation = ship.orientation;
            });  

            shipArr.push(shipButton); 
        });

        return shipArr; 
    }

    renderBoard() {
        const cellBox = document.querySelector(".cell-box"); 
        cellBox.replaceChildren();

        this.logic.playerBoard.cells.forEach((shipRow, i) => {
            shipRow.forEach((ship, j) => {

                const shipCell = document.createElement("button"); 
                shipCell.setAttribute("data-coord", `${i},${j}`);
                shipCell.textContent = `B(${i}, ${j})`; 
                shipCell.classList="cell";

                if (ship !== null) {
                    shipCell.setAttribute("data-id", ship.id);
                    shipCell.setAttribute("data-orientation", ship.orientation);
                }
                
                shipCell.addEventListener("click", () => this.cellOnClick(shipCell));
                shipCell.addEventListener("mouseover", () => this.cellOnMouseover(shipCell));
                shipCell.addEventListener("mouseout", () => this.cellOnMouseout())

                cellBox.appendChild(shipCell);
            })
        })
    }

    cellOnClick(shipCell) {
        let ship = null; 
        let shipIsStaged = null; 

        if (this.selectedShipID === null) {
            shipIsStaged = false; 
        } else {
            shipIsStaged = this.logic.allShips.get(Number(this.selectedShipID)).isStaged; 
            ship = this.logic.allShips.get(Number(this.selectedShipID)); 
        }

        const coords = shipCell.dataset.coord.split(",").map(Number); 

        if (shipIsStaged) {

            ship.orientation = this.selectedShipOrientation;
            const successful = this.logic.playerBoard.placeShip(ship, shipCell.dataset.coord.split(",").map(Number));

            if (successful) {
                ship.isStaged = false;  
                this.renderButton(this.selectedShipID);
                this.selectedShipID = null; 
                this.selectedShipOrientation = null; 
            } else {
                ship.orientation = 'E';
            }

        } else if (this.selectedIsMoving && this.selectedShipID !== null) {
        
            ship = this.logic.playerBoard.shipMap.get(Number(this.selectedShipID));

            if (ship.orientation !== this.selectedShipOrientation) {
                this.logic.playerBoard.rotateMoveByShipRef(ship, coords, this.selectedShipOrientation);
            } else if (this.logic.playerBoard.moveShipByShipRef(ship, coords)) {
                this.selectedIsMoving = false; 
            } 

            this.selectedShipID = null;  
            this.selectedShipOrientation = null; 

        } else if (!(this.logic.playerBoard.coordIsEmpty(coords))) {

            this.selectedShipID = shipCell.dataset.id; 
            this.selectedShipOrientation = shipCell.dataset.orientation;
            this.selectedIsMoving = true; 
        } 

        this.renderBoard();
    }

    cellOnMouseover(shipCell) {

        if (this.selectedShipID !== null && this.selectedShipOrientation !== null) {

            this.lastHovered = shipCell; 
            const ship = this.logic.allShips.get(Number(this.selectedShipID)); 
            const coords = shipCell.dataset.coord.split(",").map(Number); 

            const validCells = this.logic.playerBoard.getValidListOfCells(coords, this.selectedShipOrientation, ship.shipLength, ship);

            this.hoveredCells = [];

            validCells.forEach((elt) => {
                const [ coords, isValid ] = elt; 

                const cell = document.querySelector(`[data-coord="${coords[0]},${coords[1]}"]`);
                cell.classList.add(isValid ? "hover-valid" : "hover-invalid");
                this.hoveredCells.push(cell); 
            });
        }
    }

    /*updateHover() {

        let shipCell = this.lastHovered;

        if (this.selectedShipID !== null && this.selectedShipOrientation !== null) {

            this.lastHovered = shipCell; 
            const ship = this.logic.allShips.get(Number(this.selectedShipID)); 
            const coords = shipCell.dataset.coord.split(",").map(Number); 

            const validCells = this.logic.playerBoard.getValidListOfCells(coords, this.selectedShipOrientation, ship.shipLength, ship);

            this.hoveredCells = [];

            validCells.forEach((elt) => {
                const [ coords, isValid ] = elt; 

                const cell = document.querySelector(`[data-coord="${coords[0]},${coords[1]}"]`);
                cell.classList= isValid ? "hover-valid" : "hover-invalid";
                if (isValid) {
                    this.hoveredCells.push(cell); 
                }
            });
        }
    }  */

    cellOnMouseout() {

        this.hoveredCells.forEach((cell) => {
            cell.classList.remove("hover-valid");
            cell.classList.remove("hover-invalid");
        })

        this.hoveredCells = [];
    }   

    rotateOnKey() {
        const directions = {'E': 'S', 'S': 'W', 'W': 'N', 'N': 'E'};

        document.addEventListener("keydown", (e) => {
            const keyName = e.key; 

            if (keyName === "r") {
                if (this.selectedShipID !== null) {
                    this.selectedShipOrientation = directions[this.selectedShipOrientation];
                }

                /*if (this.lastHovered !== null) {
                    this.updateHover(); 
                } */
            }

        }, false);
    }

    renderButton(shipID) {
        const button = document.querySelector(`button[data-id="${shipID}"]`);
        button.classList = 'staged'; 
    }
}

export default SelectShipsScreen; 