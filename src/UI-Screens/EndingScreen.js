class EndingScreen {

    constructor() {
    }

    createEndingScreen(message, playerHasWon) {
        const contentBox = document.querySelector(".content-box");
        contentBox.replaceChildren(); 
        const msg = document.createElement("h1"); 
        msg.textContent = playerHasWon ? "You've won!" : "You've lost!"; 
        contentBox.appendChild(msg);
    }
}

export default EndingScreen;