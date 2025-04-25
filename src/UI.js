class UI {

    constructor(height, width, logic) {
        this.NUM_ROWS = height; 
        this.NUM_COLS = width; 
        this.board = null; 

        this.logic = logic; 

        this.selectedShip = null; 
        this.selectedShipOrientation = null; 

        this.placedShips = new Set(); 
    }

    init() {
        this.createWelcomeScreen(); 
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

        this.rotateOnKey(); 


         //testing only 
         const renderButton = document.createElement("button"); 
         renderButton.textContent = "RENDER";
         renderButton.classList = "start-button"; 
         renderButton.addEventListener("click", (e) => this.renderBoard());
         shipOuterBox.appendChild(renderButton); 
 
    }

    createShipButtons() {
        const shipArr = []; 

        this.logic.initializeShipsBeforePlacement().forEach((ship) => {

            let shipButton = document.createElement("button");
            shipButton.setAttribute('data-id', ship.id);
            shipButton.setAttribute('data-length', ship.shipLength);  
            shipButton.textContent = `LENGTH ${ship.shipLength}`;
            shipButton.classList = "ship"; 
            shipButton.addEventListener("click", (e) => {
                this.selectedShip = ship.id;
            });  

            shipArr.push(shipButton); 
        });

        return shipArr; 
    }

    renderBoard() {

        const cellBox = document.querySelector(".cell-box"); 
        cellBox.replaceChildren();

        //change so the event listener is delegated 

        this.logic.playerBoard.cells.forEach((shipRow, i) => {
            shipRow.forEach((ship, j) => {

                const shipCell = document.createElement("button"); 
                shipCell.setAttribute("data-coord", `${i},${j}`);
                shipCell.textContent = `B(${i}, ${j})`; 
                shipCell.classList="cell";

                if (ship !== null) {
                    shipCell.setAttribute("data-id", ship.id);
                } else {
                    shipCell.addEventListener("click", () => this.cellOnClick(shipCell));
                }

                cellBox.appendChild(shipCell);
            })
        })
    }

    cellOnClick(shipCell) {

        const hasShip = this.logic.stagedMap.has(this.selectedShip); 
        const ship = this.logic.stagedMap.get(this.selectedShip); 

        if (hasShip) {
            const successful = this.logic.playerBoard.placeShip(ship, shipCell.dataset.coord.split(",").map(Number));
            
            if (successful) {
                this.logic.stagedMap.delete(this.selectedShip);
                //temporary
                this.renderButton(this.selectedShip);
                this.selectedShip === null; 

            }
        }

        this.renderBoard();
    }

    rotateOnKey() {

        const directions = {'E': 'S', 'S': 'W', 'W': 'N', 'N': 'E'};

        document.addEventListener("keydown", (e) => {
            const keyName = e.key; 

            if (keyName === "r") {
                
                console.log("hi");
                if (this.selectedShip !== null) {
                    console.log(directions[this.logic.stagedMap.get(this.selectedShip).orientation]);

                    this.logic.rotateShipByID(this.selectedShip, directions[this.logic.stagedMap.get(this.selectedShip).orientation]); 
                    console.log("hi2");
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