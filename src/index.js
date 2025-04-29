import "./styles.css"
import GameLogic from "./GameLogic.js";
import UIManager from "./UIManager.js";

const logic = new GameLogic(); 
logic.initializeGame(); 

const manager = new UIManager(10, 10, logic); 
manager.setUpScreens(); 
