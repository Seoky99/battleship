class WelcomeScreen {

    constructor(logic, nextScreenCallback) {
        this.logic = logic; 
        this.nextScreenCallback = nextScreenCallback;
    }

    createWelcomeScreen() {
        const contentDiv = document.createElement("div"); 
        
        const titleScreen = document.createElement("h1"); 
        titleScreen.textContent = "BATTLESHIP";
        titleScreen.classList = "welcome-title"; 
        contentDiv.appendChild(titleScreen);

        const startButton = document.createElement("button"); 
        startButton.textContent = "Start";
        startButton.classList = "start-button"; 
        startButton.addEventListener("click", () => this.nextScreenCallback());
        contentDiv.appendChild(startButton); 

        document.querySelector(".content-box").appendChild(contentDiv);
    }


}

export default WelcomeScreen; 