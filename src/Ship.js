class Ship {

    constructor(length, orientation) {
        this._length = length; 
        this._numBeenHit = 0; 
        this._beenSunk = false; 
        this._orientation = orientation; 
    }

    hit() {
        this._numBeenHit++; 
    }

    isSunk() {
        return this._numBeenHit >= this._length; 
    }

    get shipLength() {
        return this._length; 
    }

    get orientation() {
        return this._orientation; 
    }

}

export default Ship;