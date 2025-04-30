import GameBoard from "./Gameboard.js"; 
import Player from "./Player.js"; 
import Ship from "./Ship.js"; 

class GameLogic {

    constructor() {
        this.mainPlayer = null;
        this.computerPlayer = null; 
        this.shipID = 0; 
        this.stagedShips = new Map(); 

        this.allShips = new Map(); 

        this.clues = [];
        //this.deleteThisTesting = false; 

        this.initializeGame(); 
    }

    static SHIPLENGTHS = [2, 3, 3, 4, 5]; 
    static deleteDirectionVector = Object.freeze({
        'E': ['N', 'S'],
        'W': ['N', 'S'], 
        'N': ['E', 'W'], 
        'S': ['E', 'W']
    });

    initializeGame() {
        const mainPlayerGameboard = new GameBoard(10, 10);
        const computerPlayerGameboard = new GameBoard(10, 10); 

        this.mainPlayer = new Player("main", mainPlayerGameboard);
        this.computerPlayer = new Player("computer", computerPlayerGameboard);  
    }

    /**
     * Stages the ships: these ships are not on the gameboard yet
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
        const ship0 = new Ship(2, 'S', 0);
        const ship1 = new Ship(3, 'S', 1);
        const ship2 = new Ship(3, 'S', 2);
        const ship3 = new Ship(4, 'S', 3);
        const ship4 = new Ship(5, 'S', 4);

        this.mainPlayer.gameBoard.placeShip(ship0, [1,1]); 
        this.mainPlayer.gameBoard.placeShip(ship1, [1,2]); 
        this.mainPlayer.gameBoard.placeShip(ship2, [1,3]); 
        this.mainPlayer.gameBoard.placeShip(ship3, [1,4]); 
        this.mainPlayer.gameBoard.placeShip(ship4, [1,5]); 
    }

    generateEnemyAttack() {
        //randomly choose a position if there are no clues. If you hit, add a clue 
        if (this.clues.length === 0) {
            this.generateRandomAttack();
            return;
        }

        let [ coordList, orientationList ] = this.clues[0]; 

        if (orientationList.length > 0) {
            this.clueHasOrientation();

        } else {
            coordList.forEach(coord => {

                const validOrientations = this.mainPlayer.gameBoard.getValidOrientationsFromOneStep(coord); 

                if (validOrientations.length > 0) {
                    this.clues.push([[coord], validOrientations]);
                }
            })
            this.clues.shift();
            this.generateEnemyAttack();
        }
    }

    generateRandomAttack() {
        let coord = null; 
        const available = Array.from(this.mainPlayer.gameBoard.stillValid);
        const randomTargetIndex = Math.floor(Math.random() * available.length);
        coord = available[randomTargetIndex].split(",").map(elt => Number(elt));
        //coord = this.deleteThisTesting ? [8, 8] : [1, 1];

        console.log(`Random coord is: ${coord}`);
        if (this.playerBoard.receiveAttack(coord)) {

            const validOrientations = this.mainPlayer.gameBoard.getValidOrientationsFromOneStep(coord);

            if (validOrientations.length > 0) {
                this.clues.push([[coord], this.mainPlayer.gameBoard.getValidOrientationsFromOneStep(coord)]);
            }
        } 
    }

    clueHasOrientation() {
        let currentClue = this.clues[0];         
        let [ coordList, orientationList ] = this.clues[0]; 

        const chosenOrientation = orientationList[0]; 
        let coord = chosenOrientation==='E' || chosenOrientation==='S' ? coordList[coordList.length - 1] : coordList[0]; 
        const [ r, c ] = coord; 
        const newCoord = [r + GameBoard.directionVector[chosenOrientation][0], c + GameBoard.directionVector[chosenOrientation][1]]; 
        
        if (this.playerBoard.receiveAttack(newCoord)) {
            currentClue[1] = orientationList.filter(elt => !(GameLogic.deleteDirectionVector[chosenOrientation].includes(elt)));                
            
            chosenOrientation === 'E' || chosenOrientation === 'S' ? coordList.push(newCoord) : coordList.unshift(newCoord);

            if (this.mainPlayer.gameBoard.coordSunkAt(newCoord)) {

                coordList = coordList.filter(coord => !(this.mainPlayer.gameBoard.coordSunkAt(coord)));
                coordList.forEach(remainingCoord => {
                    this.clues.push([[remainingCoord], this.mainPlayer.gameBoard.getValidOrientationsFromOneStep(remainingCoord)]);
                })
                this.clues.shift(); 
                //this.deleteThisTesting = true;
                return; 
            }

            //modify orientation if not valid 
            if (!(this.mainPlayer.gameBoard.getValidOrientationsFromOneStepAndOrientation(newCoord, chosenOrientation))) {
                currentClue[1] = orientationList.filter(elt => elt !== chosenOrientation);
            }
        } else {
            currentClue[1] = orientationList.filter(elt => elt !== chosenOrientation);
        }
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