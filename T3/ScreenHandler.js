export class ScreenHandler {
    constructor(game, renderCallback) {
        this.game = game;
        this.renderCallback = renderCallback;
    }

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
        this.game.eventHandler.listenMousedownEvent();
        this.game.gameScreen = true;
    
        this.hideStartingScreen();
        this.renderCallback();
    }

    onRestartGameButtonClick() {
        this.hideGamePausedScreen();
        this.game.toggleRestartGame();
    }

    onNextStageButtonClick() {
        this.hideStageCompleteScreen();
        this.game.nextStage();
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
