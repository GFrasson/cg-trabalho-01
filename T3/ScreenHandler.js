import { Game } from "./Game.js";

export class ScreenHandler {
    constructor() {}

    listenScreenEvents() {
        this.listenStartGameButtonClick();
        this.listenRestartGameButtonClick();
        this.listenNextStageButtonClick();
    }

    listenStartGameButtonClick() {
        document.getElementById('startButton').addEventListener('click', () => this.onStartGameButtonClick());
    }

    listenRestartGameButtonClick() {
        document.getElementById('restart-game').addEventListener('click', () => this.onRestartGameButtonClick());
    }
    
    listenNextStageButtonClick() {
        document.getElementById('next-stage').addEventListener('click', () => this.onNextStageButtonClick());
    }

    onStartGameButtonClick() {
        Game.getInstance().eventHandler.listenMousedownEvent();
        Game.getInstance().gameScreen = true;
    
        this.hideStartingScreen();
        Game.getInstance().render();
    }

    onRestartGameButtonClick() {
        this.hideGamePausedScreen();
        Game.getInstance().toggleRestartGame();
    }

    onNextStageButtonClick() {
        this.hideStageCompleteScreen();
        Game.getInstance().nextStage();
    }

    showGamePausedScreen() {
        const gamePausedScreen = document.querySelector('#game-paused-screen');
        gamePausedScreen.style.display = 'flex';
    }

    hideGamePausedScreen() {
        const gamePausedScreen = document.querySelector('#game-paused-screen');
        gamePausedScreen.style.display = 'none';
    }

    showStartingScreen() {
        const startingScreenDiv = document.getElementById('starting-screen');
        startingScreenDiv.style.display = 'flex';
    }

    hideStartingScreen() {
        const startingScreenDiv = document.getElementById('starting-screen');
        startingScreenDiv.style.display = 'none';
    }

    showStageCompleteScreen() {
        const stageCompleteScreen = document.querySelector('#stage-complete-screen');
        stageCompleteScreen.style.display = 'flex';
    }

    hideStageCompleteScreen() {
        const stageCompleteScreen = document.querySelector('#stage-complete-screen');
        stageCompleteScreen.style.display = 'none';
    }
}
