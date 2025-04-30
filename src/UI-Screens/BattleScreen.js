class BattleScreen {

    constructor(logic, nextScreenCallback) {
        this.logic = logic;  
        this.nextScreenCallback = nextScreenCallback; 

        this.computerIsThinking = false; 
    }

    createBattleScreen() {
        const content = document.querySelector(".content-box");
        content.replaceChildren();

        const battleTitle = document.createElement("h1"); 
        battleTitle.textContent = "Battle!";  
        battleTitle.classList = "battle-title"; 
        content.appendChild(battleTitle);

        const battleBox = document.createElement("div");
        battleBox.classList = "battle-box";

        const playerContentBoard = document.createElement("div");
        playerContentBoard.classList.add("player-content", "cell-box");
        battleBox.appendChild(playerContentBoard);
        
        const enemyContentBoard = document.createElement("div"); 
        enemyContentBoard.classList.add("enemy-content", "cell-box"); 
        battleBox.appendChild(enemyContentBoard); 

        content.appendChild(battleBox); 

        const messageBox = document.createElement("div"); 
        messageBox.classList = "message-box"; 

        const message = document.createElement("p"); 
        message.textContent = "Testing a message function";
        message.classList = "message";
        messageBox.appendChild(message);
        content.appendChild(messageBox); 

        //comment this 
        this.logic.generatePlayerBoard(); 
        
        
        this.logic.generateEnemyBoard();

        this.renderBoard(true);
        this.renderBoard(false);
    }

    renderBoard(boardIsPlayer) {

        let board = boardIsPlayer ? this.logic.playerBoard : this.logic.enemyBoard; 
        const cellBox = document.querySelector(`.${boardIsPlayer ? "player" : "enemy"}-content`); 
        cellBox.replaceChildren();

        //later, separate the rendering depending on type of player
        board.cells.forEach((shipRow, i) => {
            shipRow.forEach((ship, j) => {

                const shipCell = document.createElement("button"); 
                shipCell.setAttribute("data-coord", `${i},${j}`);
                shipCell.textContent = `B(${i}, ${j})`; 
                shipCell.classList="cell";
                
                if (ship !== null) {
                    shipCell.setAttribute("data-id", ship.id);
                    shipCell.setAttribute("data-orientation", ship.orientation);

                    if (ship.isSunk()) {
                        shipCell.classList.add("sunk");
                    } else if (ship.hitSet.has(`${i},${j}`)) {
                        shipCell.classList.add("hit");
                    }
                }

                if (ship === null) {
                    if (board.missed.has(`${i},${j}`)) {
                        shipCell.classList.add("missed");
                    }
                }
                
                shipCell.addEventListener("click", () => this.handleEnemyClick(shipCell));
    
                cellBox.appendChild(shipCell);
            })
        })
    }

    async handleEnemyClick(shipCell) {
        if (this.computerIsThinking) {
            return; 
        }

        const coords = shipCell.dataset.coord.split(",").map(Number);
        this.logic.enemyBoard.receiveAttack(coords);

        this.renderBoard(false);

        if (this.logic.enemyBoard.allSunk()) {
            this.nextScreenCallback("Shining Victory", true); 
            return; 
        }

        this.computerIsThinking = true; 
        this.updateMessageBox("Computer is thinking...");
        await new Promise(resolve => setTimeout(resolve, 500));

        this.logic.generateEnemyAttack(); 

        this.renderBoard(true);

        if (this.logic.playerBoard.allSunk()) {
            this.nextScreenCallback("Miserable Defeat", false); 
            return; 
        }

        this.computerIsThinking = false; 
        this.updateMessageBox("Done!");
    }

    updateMessageBox(message) {
        const messageBox = document.querySelector(".message");
        messageBox.textContent = message; 
    }

}

export default BattleScreen; 