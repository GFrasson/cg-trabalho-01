import { Game } from "./Game.js";

export class EventHandler {
    constructor() {}

    listenMousedownEvent() {
        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                if (!Game.getInstance().startGame) {
                    Game.getInstance().toggleStartGame();
                } else if (!Game.getInstance().getBall().isLauched) {
                    Game.getInstance().getBall().launch(() => Game.getInstance().startTimerToUpdateBallSpeed());
                }
            }
        });
    }

    listenMousemoveEvent() {
        window.addEventListener('mousemove', (event) => {
            if (!Game.getInstance().pausedGame) {
                Game.getInstance().getBackground().onMouseMove(event, Game.getInstance().getCamera(), Game.getInstance().getHitter());

                const ball = Game.getInstance().getBall();
                if (!ball.isLauched) {
                    const hitterPosition = Game.getInstance().getHitter().getPosition();
                    const ballTHREEObject = ball.getTHREEObject();
                    ballTHREEObject.position.copy(hitterPosition);
                    ballTHREEObject.position.z -= 2;
                    // ballTHREEObject.position.x += 2.5;
                }
            }
        });
    }

    listenKeydownEvent() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Enter':
                    Game.getInstance().toggleFullScreen();
                    break;
                case 'r':
                    if (Game.getInstance().startGame) {
                        Game.getInstance().toggleRestartGame();
                    }
                    break;
                case ' ': // Space
                    if (Game.getInstance().gameScreen) {
                        Game.getInstance().togglePauseGame();
                    }
                    break;
                case 'g':
                    Game.getInstance().nextStage();
                    break;
                default:
                    break;
            }
        });
    }

    listenResizeEvent(renderer) {
        window.addEventListener(
            'resize',
            () => Game.getInstance().getCamera().onWindowResize(renderer, window.innerHeight * Game.getInstance().getCamera().aspectRatio, window.innerHeight),
            false
        );
    }
}
