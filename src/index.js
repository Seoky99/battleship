import GameBoard from "./Gameboard.js";
import "./styles.css"
import userInterface from "./UI.js"; 
import Ship from "./Ship.js";
import GameLogic from "./GameLogic.js";

const logic = new GameLogic(); 
logic.initializeGame(); 

const UI = new userInterface(10, 10, logic); 

UI.createWelcomeScreen();  


/*const newShip = new Ship(2, 'E', 0);
const newShip2 = new Ship(3, 'E', 1);
const newShip4 = new Ship(4, 'S', 3);

// Only successful placements:
board.placeShip(newShip, [0, 1]);
board.placeShip(newShip2, [2, 1]);
board.placeShip(newShip4, [0, 0]); */



function testFunction() {
    return 3; 
}

export default testFunction;