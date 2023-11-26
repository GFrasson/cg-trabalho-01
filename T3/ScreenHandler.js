export class ScreenHandler {
    constructor(game, renderCallback) {
        this.game = game;
        this.renderCallback = renderCallback;
    }

    listenScreenEvents() {
        this.listenStartGameButtonClick();
        this.listenRestartStageButtonClick();
        this.listenRestartGameButtonClick();
        this.listenNextStageButtonClick();
        this.listenCelebrateButtonClick();
    }

    listenStartGameButtonClick() {
        document.getElementById('startButton').addEventListener('click', () => this.onStartGameButtonClick());
    }

    listenRestartStageButtonClick() {
        document.getElementById('restart-stage').addEventListener('click', () => this.onRestartStageButtonClick());
    }

    listenRestartGameButtonClick() {
        document.getElementById('restart-game').addEventListener('click', () => this.onRestartGameButtonClick());
    }
    
    listenNextStageButtonClick() {
        document.getElementById('next-stage').addEventListener('click', () => this.onNextStageButtonClick());
    }

    listenCelebrateButtonClick() {
        document.getElementById('celebrate').addEventListener('click', () => new JSConfetti().addConfetti());
    }

    onStartGameButtonClick() {
        this.game.eventHandler.listenMousedownEvent();
        this.game.gameScreen = true;
    
        this.hideStartingScreen();
        this.renderCallback();
    }

    onRestartStageButtonClick() {
        this.hideGamePausedScreen();
        this.game.toggleRestartStage();
    }

    onRestartGameButtonClick() {
        this.hideGameOverScreen();
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

    showEndGameScreen() {
        const endGameScreen = document.querySelector('#end-game-screen');
        endGameScreen.style.display = 'flex';
    }

    hideEndGameScreen() {
        const endGameScreen = document.querySelector('#end-game-screen');
        endGameScreen.style.display = 'none';
    }

    showGameOverScreen() {
        const gameOverScreen = document.querySelector('#game-over-screen');
        gameOverScreen.style.display = 'flex';
    }

    hideGameOverScreen() {
        const gameOverScreen = document.querySelector('#game-over-screen');
        gameOverScreen.style.display = 'none';
    }
}
