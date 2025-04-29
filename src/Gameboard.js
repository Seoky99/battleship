/*
* For example, Gameboard(4,4) consists of: 
* [[null, null, null, null]
*  [null, null, null, null]
*  [null, null, null, null]
*  [null, null, null, null]]
* where the top left position is 0,0 
* Coordinates are [row, col].
*/
class GameBoard {

    static directionVector = Object.freeze({
        "E": [0, 1], 
        "W": [0, -1], 
        "N": [-1, 0], 
        "S": [1, 0]
    });

    constructor(height, width) {
        this.NUM_ROWS = height; 
        this.NUM_COLS = width; 

        this.ships = new Map(); 
        
        this._attempted = new Set(); 
        this._stillValid = new Set(); 

        this._missed = new Set(); 

        this.shipArr = []; 
        for (let i = 0; i < height; i++) {
            const newRow = []; 
            for (let j = 0; j < width; j++) {
                newRow.push(null); 
                this._stillValid.add(`${i},${j}`);
            }
            this.shipArr.push(newRow); 
        }
    }

    get cells() {
        return this.shipArr; 
    }

    get shipMap() {
        return this.ships; 
    }

    get missed() {
        return this._missed; 
    }

    get attempts() {
        return this._attempted;
    }

    get stillValid() {
        return this._stillValid;
    }

    /**
     * Returns what is at coordinate: ship/null. 
     * @param {*} coord - coordinate [r, c]
     * @returns - the ship instance if there is a ship, null if not
     */
    cellAt(coord) {
        return this.shipArr[coord[0]][coord[1]];
    } 

    /**
     * Checks if the coordinate is empty or not. 
     * @param {*} coord - coordinate [r, c]
     * @returns - True if is empty (no ship) at coordinate. 
     */
    coordIsEmpty(coord) {
        return this.shipArr[coord[0]][coord[1]] === null;
    }

    /**
     * Checks if the given coordinate is in bounds of the gameboard, include orientation and a length to check 
     * if a ship headed at coord is in bounds.  
     * @param {*} coord - Coordinate [r, c]
     * @param {*} orientation - Orientation out of [NESW]
     * @param {*} length - Length of ship 
     * @returns True if in bounds, false if not. 
     */
    checkBounds(coord, orientation=null, length=null) {

        const [coordR, coordC] = coord; 
        const originalCoordValid = coordR >= 0 && coordR < this.NUM_ROWS && coordC >= 0 && coordC < this.NUM_COLS;

        if (orientation === null && length === null) {
            return originalCoordValid; 
        }

        const newCoordR = coordR + GameBoard.directionVector[orientation][0] * (length-1);  
        const newCoordC = coordC + GameBoard.directionVector[orientation][1] * (length-1);

        return originalCoordValid && (newCoordR >= 0 && newCoordR < this.NUM_ROWS && newCoordC >= 0 && newCoordC < this.NUM_COLS);
    }

    /**
     * Checks if the given ship headed at coord collides with other ships or is out of bounds. 
     * @param {*} coord - Coordinate [r, c]
     * @param {*} orientation - Orientation out of [NESW]
     * @param {*} length Length of ship 
     * @returns - True if valid, false if not. 
     */
    checkValidity(coord, orientation, length, ship=null) {

        if (!(this.checkBounds(coord, orientation, length))) {
            return false; 
        }

        const [coordR, coordC] = coord; 
        const [dRow, dCol] = GameBoard.directionVector[orientation];  

        for (let i = 0; i < length; i++) {
            const newCoord = [coordR + dRow * i, coordC + dCol * i];  

            if (!(this.coordIsEmpty(newCoord))) {
                if (ship === null || ship !== this.cellAt(newCoord)) {
                    return false;     
                }
            }
        }
        return true; 
    }

    /**
     * Returns a list [coordinates, isValid] marking the reachable cells that are valid from coord in the direction of orientation. 
     * For instance, for a 3x3 board, a ship of length 3 on (0, 1) results in [[[0,1],true]], [[0,2],true]]]. If there is a ship on 0,2, it will be false. 
     * @param {*} coord - Coordinate [r, c]
     * @param {*} orientation - Orientation out of [NESW]
     * @param {*} length Length of ship 
     * @returns - Returns a list of [coordinates, isValid]
     */
    getValidListOfCells(coord, orientation, length, ship=null) {

        if (!(this.checkBounds(coord))) {
            throw new Error("coord out of bounds");
        }

        const [coordR, coordC] = coord; 
        const [dRow, dCol] = GameBoard.directionVector[orientation];  
        const validCells = []; 

        for (let i = 0; i < length; i++) {
            const newCoord = [coordR + dRow * i, coordC + dCol * i];  
            let isValid = true; 

            if (!(this.checkBounds(newCoord))) {
                return validCells; 
            }

            if (!(this.coordIsEmpty(newCoord))) {
                if (ship === null || ship !== this.cellAt(newCoord)) {
                    isValid = false;    
                }
            }

            validCells.push([newCoord, isValid]);
        }

        return validCells;
    }

    /**
     * Places a new ship at coord facing orientation {N, E, S, W}. 
     * @param {*} ship
     * @param {*} orientation 
     * @returns - True if successfully placed, false if not. 
     */
    placeShip(ship, coord) {

        const length = ship.shipLength; 
        const orientation = ship.orientation; 
        const [ coordR, coordC ] = coord; 

        if (this.ships.has(ship.id)) {
            throw new Error("Same ship added");
        } 

        if (!(this.checkValidity(coord, orientation, length))) {
            return false;
        }

        const [dRow, dCol] = GameBoard.directionVector[ship.orientation];  

        for (let i = 0; i < length; i++) {
            const newCoord = [coordR + dRow * i, coordC + dCol * i];  
            this.shipArr[newCoord[0]][newCoord[1]] = ship;
        }
        
        this.ships.set(ship.id, ship);
        ship.head = coord; 

        this.printBoard();
        return true; 
    }

    /**
     * If there is no ship at oldCoord, returns. 
     * If there is a ship at oldCoord, it moves it to newCoord.  
     * @param {*} oldCoord - coordinate moved from 
     * @param {*} newCoord - coordinate moved to 
     */
    moveShip(oldCoord, newCoord) {

        if (!(this.checkBounds(oldCoord)) || !(this.checkBounds(newCoord))) {
            throw new Error("out of bounds");
        }

        const ship = this.shipArr[oldCoord[0]][oldCoord[1]]; 

        if (ship === null) {
            return; 
        }

        this.eraseShip(ship);
        this.placeShip(ship, newCoord); 
    }

    moveShipByShipRef(ship, newCoord) {

        if (!(this.checkBounds(newCoord))) {
            throw new Error("out of bounds");
        }

        if (!(this.checkValidity(newCoord, ship.orientation, ship.shipLength, ship))) {
            return false; 
        }

        this.eraseShip(ship);
        this.placeShip(ship, newCoord);

        return true; 
    }

    rotateMoveByShipRef(ship, newCoord, newOrientation) {
        
        if (!(this.checkBounds(newCoord))) {
            throw new Error("out of bounds");
        }

        if (!(this.checkValidity(newCoord, newOrientation, ship.shipLength, ship))) {
            return false; 
        }

        this.eraseShip(ship);
        ship.orientation = newOrientation; 
        this.placeShip(ship, newCoord);

        return true; 
    }

    /**
     * Erases the ship from the gameboard. 
     * @param {*} ship - Ship object 
     */

    eraseShip(ship) {
        const headCoord = ship.head; 
        const orientation = ship.orientation; 

        for (let i = 0; i < ship.shipLength; i++) {
            const newCoordR = headCoord[0] + GameBoard.directionVector[orientation][0] * i;
            const newCoordC = headCoord[1] + GameBoard.directionVector[orientation][1] * i;
            this.shipArr[newCoordR][newCoordC] = null; 
        }
        this.printBoard();
        this.ships.delete(ship.id);
    }

    /**
     * If there is a ship at coordinate, marks a hit on that ship. Otherwise logs a miss. 
     * @param {*} coord - coordinate [r, c]
     * @returns - True if coordinate is in bounds, false if not. 
     */
    receiveAttack(coord) {
        if (!(this.checkBounds(coord))) {
            return false; 
        }
        
        const [r, c] = coord;

        const keyCoord = coord.join(",");

        this._attempted.add(keyCoord); 
        this._stillValid.delete(keyCoord); 

        if (!(this.coordIsEmpty(coord))) {
            const ship = this.shipArr[r][c];            
            ship.hit(coord);  

            console.log("here");
        } else {
            this.missed.add(keyCoord);
            console.log("here2");
        }
        return true; 
    }

    /**
     * Checks if every ship on the gameboard has been sunk. 
     * @returns - True if every ship is sunk, False if not. 
     */
    allSunk() {
        for (const ship of this.ships.values()) {
            if (!(ship.isSunk())) {
                return false;
            }
        }
        return true; 
    }

    printBoard() {
        let stringRepr = ``; 
        for (let i = 0; i < this.NUM_ROWS; i++) {
            for (let j = 0; j < this.NUM_COLS; j++) {
                if (this.coordIsEmpty([i, j])) {
                    stringRepr += `[NULL0]`;
                } else {
                    stringRepr += `[SHIP${this.shipArr[i][j].shipLength}]`;
                }
            }
            stringRepr += `\n`; 
        }
        console.log(stringRepr); 
    }
}

export default GameBoard;