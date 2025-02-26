import { AnimatedSprite, Ticker } from "pixi.js";
import { ResouceManager } from "../ResourceManage";
import { config } from "../constants";
import gsap from "gsap";
import { random } from "../utils/utils";

enum State {
    PLAY,
    STOP,
}

export class Coin {
    public state: State;
    public animatedSprite: AnimatedSprite;
    private rotationSide: 1 | -1;

    constructor() {
        this.state = State.STOP;
        this.animatedSprite = new AnimatedSprite(
            ResouceManager.getAnimation("coin_flip")
        );

        this.animatedSprite.anchor.set(0.5, 0.5);
        this.animatedSprite.x = config.SCREEN_WIDTH / 2;
        this.animatedSprite.y = config.SCREEN_HEIGHT / 2;
        this.rotationSide = 1;
    }

    stop() {
        this.animatedSprite.gotoAndStop(Math.random() > 0.5 ? 0 : 24);
        this.animatedSprite.rotation = random(-Math.PI, Math.PI);
        this.state = State.STOP;
        this.animatedSprite.scale = 1;
    }

    play() {
        this.rotationSide = Math.random() > 0.5 ? 1 : -1;
        this.animatedSprite.animationSpeed = random(1.5, 2.5);
        this.animatedSprite.scale = 1;
        this.state = State.PLAY;
        this.animatedSprite.play();
    }

    update(time: Ticker) {
        if (this.state === State.STOP) return;

        this.animatedSprite.rotation +=
            time.deltaTime * random(0.05, 0.2) * this.rotationSide;
    }

    flip(time: number) {
        if (this.state === State.PLAY) return;

        this.play();

        const tl = gsap.timeline({});

        const randomScale = random(1.8, 2.2);

        tl.to(this.animatedSprite.scale, {
            x: randomScale,
            y: randomScale,
            duration: time / 2 / 1000,
            ease: "power1.inOut",
        });

        tl.to(this.animatedSprite.scale, {
            x: 1,
            y: 1,
            duration: time / 2 / 1000,
            ease: "power1.inOut",
        });

        window.setTimeout(() => {
            this.stop();
        }, time);
    }
}
