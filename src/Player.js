class Player {

    constructor(type, gameBoard) {
        this.type = type; 
        this._gameBoard = gameBoard;
    }
    
    get gameBoard() {
        return this._gameBoard;
    }

}

export default Player; 