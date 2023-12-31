export class EventHandler {
    constructor(game) {
        this.game = game;
    }

    listenMousedownEvent() {
        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                if (!this.game.startGame) {
                    this.game.toggleStartGame();
                } else if (!this.game.getBall().isLauched) {
                    this.game.getBall().isLauched = true;
                }
            }
        });
    }

    listenMousemoveEvent() {
        window.addEventListener('mousemove', (event) => {
            if (!this.game.pausedGame) {
                this.game.getBackground().onMouseMove(event, this.game.getCamera(), this.game.getHitter());
        
                const ball = this.game.getBall();
                if (!ball.isLauched) {
                    const hitterPosition = this.game.getHitter().getPosition();
                    const ballTHREEObject = ball.getTHREEObject();
                    ballTHREEObject.position.copy(hitterPosition);
                    ballTHREEObject.position.z -= 2;
                    ballTHREEObject.position.x += 2.5;
                }
            }
        });
    }

    listenKeydownEvent() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Enter':
                    this.game.toggleFullScreen();
                    break;
                case 'r':
                    if (this.game.startGame) {
                        this.game.toggleRestartGame();
                    }
                    break;
                case ' ': // Space
                    if (this.game.gameScreen) {
                        this.game.togglePauseGame();
                    }
                    break;
                default:
                    break;
            }
        });
    }

    listenResizeEvent(renderer) {
        window.addEventListener(
            'resize',
            () => this.game.getCamera().onWindowResize(renderer, window.innerHeight * this.game.getCamera().aspectRatio, window.innerHeight),
            false
        );
    }
}
