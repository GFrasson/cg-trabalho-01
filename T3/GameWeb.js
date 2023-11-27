import { Game } from './Game.js';
import { Ball } from './entities/Ball.js';

export class GameWeb extends Game {
    constructor() {
        super();
        Game.instance = this;
    }

    render() {
        this.executeStep();
        this.ballSpeedSecondaryBox.changeMessage(`Ball speed: ${Ball.speed}`);
    
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.getCamera().getTHREECamera());
    }
}
