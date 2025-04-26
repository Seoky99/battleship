import BattleScreen from "./UI-Screens/BattleScreen";
import SelectShipsScreen from "./UI-Screens/SelectShipsScreen";
import WelcomeScreen from "./UI-Screens/WelcomeScreen";

class UIManager {

    constructor(height, width, logic) {
        this.height = height; 
        this.width = width; 
        this.logic = logic; 
    }

    setUpScreens() {

        const battleScreen = new BattleScreen(this.logic); 
        const selectShipsScreen = new SelectShipsScreen(this.height, this.width, this.logic, battleScreen.createBattleScreen.bind(battleScreen)); 
        const welcomeScreen = new WelcomeScreen(this.logic, selectShipsScreen.createPickScreen.bind(selectShipsScreen)); 

        welcomeScreen.createWelcomeScreen(); 
    }


}

export default UIManager; 