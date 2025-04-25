class UI {

    constructor(height, width, logic) {
        this.NUM_ROWS = height; 
        this.NUM_COLS = width; 
        this.board = null; 

        this.logic = logic; 

        this.selectedShipID = null; 
        this.selectedShipOrientation = null; 
        this.selectedIsMoving = false;

    }

    init() {
        //this.createWelcomeScreen(); 
        
    }

    createWelcomeScreen() {

        const contentDiv = document.createElement("div"); 
        
        const titleScreen = document.createElement("h1"); 
        titleScreen.textContent = "BATTLESHIP";
        titleScreen.classList = "welcome-title"; 
        contentDiv.appendChild(titleScreen);

        const startButton = document.createElement("button"); 
        startButton.textContent = "Start";
        startButton.classList = "start-button"; 
        startButton.addEventListener("click", this.createPickScreen.bind(this));
        contentDiv.appendChild(startButton); 

        document.querySelector(".content-box").appendChild(contentDiv);
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
        const shipBox = document.createElement("div"); 
        const ships = this.createShipButtons();  

        ships.forEach(ship => {
            shipBox.appendChild(ship); 
        });

        shipOuterBox.appendChild(shipBox); 
        content.appendChild(shipOuterBox);

        const cellBox = document.createElement("div"); 
        cellBox.classList="cell-box";
     
        shipOuterBox.append(cellBox);

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
                cellBox.appendChild(shipCell);
            })
        })
    }

    cellOnClick(shipCell) {

        const shipIsStaged = this.logic.stagedMap.has(this.selectedShipID); 
        let ship = this.logic.stagedMap.get(this.selectedShipID); 
        const coords = shipCell.dataset.coord.split(",").map(Number); 

        console.log(this.logic.playerBoard.coordIsEmpty(coords));

        if (shipIsStaged) {
            const successful = this.logic.playerBoard.placeShip(ship, shipCell.dataset.coord.split(",").map(Number));
            
            if (successful) {
                this.logic.stagedMap.delete(this.selectedShipID);
                this.renderButton(this.selectedShipID);
                this.selectedShipID = null; 
                this.selectedShipOrientation = null; 
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

    rotateOnKey() {

        const directions = {'E': 'S', 'S': 'W', 'W': 'N', 'N': 'E'};

        document.addEventListener("keydown", (e) => {
            const keyName = e.key; 

            if (keyName === "r") {
                
                if (this.selectedShipID !== null) {

                    if (!(this.selectedIsMoving)) {
                        this.logic.rotateShipByID(this.selectedShipID, directions[this.logic.stagedMap.get(this.selectedShipID).orientation]); 
                    } else {
                        this.selectedShipOrientation = directions[this.selectedShipOrientation];
                    }
                }
            }

        }, false);
    }

    renderButton(shipID) {
        const button = document.querySelector(`button[data-id="${shipID}"]`);
        button.classList = 'staged'; 
    }





}

export default UI; 