import BattleScreen from "./UI-Screens/BattleScreen";
import SelectShipsScreen from "./UI-Screens/SelectShipsScreen";
import WelcomeScreen from "./UI-Screens/WelcomeScreen";
import EndingScreen from "./UI-Screens/EndingScreen";

class UIManager {

    constructor(height, width, logic) {
        this.height = height; 
        this.width = width; 
        this.logic = logic; 
    }

    setUpScreens() {

        const endingScreen = new EndingScreen(); 
        const battleScreen = new BattleScreen(this.logic, endingScreen.createEndingScreen.bind(endingScreen)); 
        //const selectShipsScreen = new SelectShipsScreen(this.height, this.width, this.logic, battleScreen.createBattleScreen.bind(battleScreen)); 
        //const welcomeScreen = new WelcomeScreen(this.logic, selectShipsScreen.createPickScreen.bind(selectShipsScreen));  

        //welcomeScreen.createWelcomeScreen(); 

        battleScreen.createBattleScreen();
    }
}

export default UIManager; 