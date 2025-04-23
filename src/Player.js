import GameBoard from "./Gameboard";

class Player {

    constructor(type, gameBoardHeight, gameBoardWidth) {
        this.type = type; 
        this.gameBoard = new GameBoard(gameBoardHeight, gameBoardWidth);
    }

}

export default Player; 