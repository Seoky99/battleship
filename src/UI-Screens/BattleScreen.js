class BattleScreen {

    constructor(logic) {
        this.logic = logic;  
    }

    createBattleScreen() {
        const content = document.querySelector(".content-box");

        content.replaceChildren();
        const hi = document.createElement("h1");
        hi.textContent = "hi"; 
        content.appendChild(hi);
    }

}

export default BattleScreen; 