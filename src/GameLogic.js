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

    /**
     * Stages the ships: not on the gameboard yet, but keeps tracks of the ships  
     * @returns the ships placed in an array 
     */
    initializeShipsBeforePlacement() {
        const shipArr = []; 

        GameLogic.SHIPLENGTHS.forEach((length) => {
            const newShip = new Ship(length, "E", this.shipID++);
            newShip.isStaged = true; 
            shipArr.push(newShip); 
            this.stagedShips.set(newShip.id, newShip);
            this.allShips.set(newShip.id, newShip);
        });
        return shipArr; 
    }

    generateEnemyBoard() {
        //replace with more sophisiticated function later 
        const ship0 = new Ship(2, 'E', 0);
        const ship1 = new Ship(3, 'S', 1);
        const ship2 = new Ship(3, 'W', 2);
        const ship3 = new Ship(4, 'N', 3);
        const ship4 = new Ship(5, 'E', 4);

        this.computerPlayer.gameBoard.placeShip(ship0, [1,1]); 
        this.computerPlayer.gameBoard.placeShip(ship1, [0,4]); 
        this.computerPlayer.gameBoard.placeShip(ship2, [4,4]); 
        this.computerPlayer.gameBoard.placeShip(ship3, [6,7]); 
        this.computerPlayer.gameBoard.placeShip(ship4, [9,1]); 
    }

    generatePlayerBoard() {
        //replace with more sophisiticated function later 
        const ship0 = new Ship(2, 'E', 0);
        const ship1 = new Ship(3, 'S', 1);
        const ship2 = new Ship(3, 'W', 2);
        const ship3 = new Ship(4, 'N', 3);
        const ship4 = new Ship(5, 'E', 4);

        this.mainPlayer.gameBoard.placeShip(ship0, [1,1]); 
        this.mainPlayer.gameBoard.placeShip(ship1, [0,4]); 
        this.mainPlayer.gameBoard.placeShip(ship2, [4,4]); 
        this.mainPlayer.gameBoard.placeShip(ship3, [6,7]); 
        this.mainPlayer.gameBoard.placeShip(ship4, [9,1]); 
    }

    generateEnemyAttack() {
        //for now, randomly chooses a square and attacks that one. 
        let coord = null; 
        const available = Array.from(this.mainPlayer.gameBoard.stillValid);
        const randomTargetIndex = Math.floor(Math.random() * available.length);
        coord = available[randomTargetIndex].split(",");
        this.playerBoard.receiveAttack(coord); 
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