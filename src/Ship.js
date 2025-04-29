class Ship {

    constructor(length, orientation, id) {
        this._length = length; 
        this._orientation = orientation; 
        this._id = id; 
        this._headCoord = null; 

        this._numBeenHit = 0; 
        this._beenSunk = false; 

        this._isStaged = false; 

        this._hitCoords = new Set(); 
    }

    hit(coord) {
        this._numBeenHit++; 

        console.log("is hit");

        if (typeof(coord) !== "string") {
            coord = coord.join(","); 
        }

        this._hitCoords.add(coord);
    }

    isSunk() {
        return this._numBeenHit >= this._length; 
    }

    get hitSet() {
        return this._hitCoords; 
    }

    get shipLength() {
        return this._length; 
    }

    get orientation() {
        return this._orientation; 
    }

    set orientation(newOrientation) {
        this._orientation = newOrientation; 
    }

    get id() {
        return this._id; 
    }

    get head() {
        return this._headCoord; 
    }

    set head(coord) {
        this._headCoord = coord; 
    }

    get isStaged() {
        return this._isStaged; 
    }

    set isStaged(isStage) {
        this._isStaged = isStage; 
    }

}

export default Ship;