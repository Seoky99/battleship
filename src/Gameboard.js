/*
* Gameboard(4,4) consists of: 
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

        this.ships = new Set(); 
        this.missed = []; 
        this.shipArr = []; 

        for (let i = 0; i < height; i++) {
            const newRow = []; 
            for (let j = 0; j < width; j++) {
                newRow.push(null); 
            }
            this.shipArr.push(newRow); 
        }
    }

    get gameBoard() {
        return this.shipArr; 
    }

    coordIsEmpty(coord) {
        return this.shipArr[coord[0]][coord[1]] === null;
    }

    /**
     * 
     * @param {*} coord 
     * @param {*} orientation 
     * @param {*} length 
     * @returns 
     * 
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
     * 
     * @param {*} ship
     * @param {*} orientation 
     * Places a new ship at coord facing orientation {N, E, S, W}. 
     * If successful, returns true. If this ship is placed out of bounds, returns false.  
     */
    placeShip(ship, coord) {

        const length = ship.shipLength; 
        const orientation = ship.orientation; 
        const [ coordR, coordC ] = coord; 

        if (this.ships.has(ship)) {
            throw new Error("Same ship added");
        }

        if (!(this.checkBounds(coord, orientation, length))) {
            return false;
        }

        const [dRow, dCol] = GameBoard.directionVector[ship.orientation];  

        for (let i = 0; i < length; i++) {
            const newCoord = [coordR + dRow * i, coordC + dCol * i];  

            if (!(this.coordIsEmpty(newCoord))) {
                return false; 
            } else {
                this.shipArr[newCoord[0]][newCoord[1]] = ship;
            }
        }
        
        this.ships.add(ship);
        this.printBoard();
        console.log(this.ships);
        return true; 
    }

    receiveAttack(coord) {
        if (!(this.checkBounds(coord))) {
            return false; 
        }

        const [r, c] = coord;

        if (!(this.coordIsEmpty(coord))) {
            const ship = this.shipArr[r][c];
            ship.hit();  
        } else {
            this.missed.push(coord); 
        }
        return true; 
    }

    allSunk() {
        for (const ship of this.ships) {
            if (ship.isSunk()) {
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