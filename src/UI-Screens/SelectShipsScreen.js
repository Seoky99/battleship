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

    /**
     * Initializes and returns a ship Document element for each initialized staged ship.
     * @returns an array of ship Button Document elements 
     */
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

    /**
     * Renders the board, attaching data coordinates and event listeners to each cell. 
     */
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
                }
                
                shipCell.addEventListener("click", () => this.cellOnClick(shipCell));
                shipCell.addEventListener("mouseover", () => this.cellOnMouseover(shipCell));
                shipCell.addEventListener("mouseout", () => this.cellOnMouseout()); 

                cellBox.appendChild(shipCell);
            })
        })
    }

    /**
     * On a cell click: 
     *  If the ship associated with the cell is staged (not placed yet), attempt to place it on the board on this cell. 
     *  Otherwise, if the current selected ship is moving to this cell, place it on this cell. 
     *  Otherwise, select this cell. 
     * @param {*} shipCell 
     */
    cellOnClick(shipCell) {
        let ship = this.selectedShipID === null ? null : this.logic.allShips.get(Number(this.selectedShipID)); 
        let shipIsStaged = this.selectedShipID === null ? false : this.logic.allShips.get(Number(this.selectedShipID)).isStaged; 
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
            if (ship.orientation !== this.selectedShipOrientation) {
                this.logic.playerBoard.moveShipByShipRef(ship, coords, this.selectedShipOrientation);
            } else {
                if (this.logic.playerBoard.moveShipByShipRef(ship, coords)) {
                    this.selectedIsMoving = false; 
                }
            } 
            this.selectedShipID = null;  
            this.selectedShipOrientation = null; 

        } else if (!(this.logic.playerBoard.coordIsEmpty(coords))) {
            this.selectedShipID = shipCell.dataset.id; 
            this.selectedShipOrientation = this.logic.allShips.get(Number(this.selectedShipID)).orientation;
            this.selectedIsMoving = true; 
        } 

        this.renderBoard();
    }

    /**
     * Attach hover styles on each cell reachable from the moused-over cell 
     * @param {*} shipCell : Document ship element 
     */
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

    /**
     * Remove hover classes from elements currently in the hover cell list. 
     */
    cellOnMouseout() {
        this.hoveredCells.forEach((cell) => {
            cell.classList.remove("hover-valid");
            cell.classList.remove("hover-invalid");
        })
        this.hoveredCells = [];
    }   

    /**
     * On a "R" press, alter the current selected ship orientation. 
     */
    rotateOnKey() {
        const directions = {'E': 'S', 'S': 'W', 'W': 'N', 'N': 'E'};

        document.addEventListener("keydown", (e) => {
            const keyName = e.key; 

            if (keyName === "r") {
                if (this.selectedShipID !== null) {
                    this.selectedShipOrientation = directions[this.selectedShipOrientation];
                }

                if (this.lastHovered !== null) {
                    this.cellOnMouseout(); 
                    this.cellOnMouseover(this.lastHovered); 
                } 
            }
        }, false);
    }

    /**
     * Add a style for buttons that correspond to non-staged ships.  
     * @param {} shipID 
     */
    renderButton(shipID) {
        const button = document.querySelector(`button[data-id="${shipID}"]`);
        button.classList = 'staged'; 
    }
}

export default SelectShipsScreen; 