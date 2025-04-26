import GameBoard from "./Gameboard.js"; 
import Player from "./Player.js"; 
import Ship from "./Ship.js"; 

class GameLogic {

    static SHIPLENGTHS = [2, 3, 3, 4, 5]; 

    constructor() {
        this.mainPlayer = null;
        this.computerPlayer = null; 
        this.shipID = 0; 
        this.stagedShips = new Map(); 

        this.allShips = new Map(); 

        this.initializeGame(); 
    }

    initializeGame() {
        const mainPlayerGameboard = new GameBoard(10, 10);
        const computerPlayerGameboard = new GameBoard(10, 10); 

        this.mainPlayer = new Player("main", mainPlayerGameboard);
        this.computerPlayer = new Player("computer", computerPlayerGameboard);  
    }

    initializeShipsBeforePlacement() {
        const shipArr = []; 

        //create Ship instances here! 
        GameLogic.SHIPLENGTHS.forEach((length) => {
            const newShip = new Ship(length, "E", this.shipID++);
            newShip.isStaged = true; 
            shipArr.push(newShip); 
            this.stagedShips.set(newShip.id, newShip);
            this.allShips.set(newShip.id, newShip);
        });
        return shipArr; 
    }

    intializeAttacks() {

    }

    generateEnemyBoard() {
        
    }



    rotateShipByID(id, newOrientation) {
        if (this.allShips.has(id)) {
            this.allShips.get(id).orientation = newOrientation; 
        }
    }


    get playerBoard() {
        return this.mainPlayer.gameBoard; 
    }

    get enemyBoard() {
        return this.computerPlayer.gameBoard; 
    }

    get stagedMap() {
        return this.stagedShips; 
    }
}

export default GameLogic; 