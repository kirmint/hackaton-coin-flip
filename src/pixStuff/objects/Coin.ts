import { AnimatedSprite, Ticker } from "pixi.js";
import gsap from "gsap";
import { random } from "../utils/utils";
import { ResouceManager } from "../ResourceManage";
import { config } from "../constants";
import { soundService } from "../SoundService";

enum State {
    PLAY,
    STOP,
}

enum Side {
    HEAD = "HEADS",
    TAILS = "TAILS",
}

export class Coin {
    public state: State;
    public animatedSprite: AnimatedSprite;
    private rotationRandomizer: 1 | -1;
    private side: Side;

    constructor() {
        this.state = State.STOP;
        this.animatedSprite = new AnimatedSprite(
            ResouceManager.getAnimation("coin_flip")
        );

        this.animatedSprite.anchor.set(0.5, 0.5);
        this.animatedSprite.x = config.SCREEN_WIDTH / 2;
        this.animatedSprite.y = config.SCREEN_HEIGHT / 2;
        this.rotationRandomizer = 1;
        this.side = Side.HEAD;
    }

    stop(result: Side) {
        this.side = result;
        this.animatedSprite.gotoAndStop(
            this.side === Side.HEAD
                ? 0
                : this.animatedSprite.textures.length - 1
        );
        this.animatedSprite.rotation = random(-Math.PI, Math.PI);
        this.state = State.STOP;
        this.animatedSprite.scale = 1;
        soundService.play("drop");
    }

    play() {
        const startingSide = this.side === Side.HEAD ? 1 : -1;
        this.rotationRandomizer = Math.random() > 0.5 ? 1 : -1;
        this.animatedSprite.animationSpeed = random(1.5, 2.5) * startingSide;
        this.animatedSprite.scale = 1;
        this.state = State.PLAY;
        this.animatedSprite.play();
        soundService.play("flip");
    }

    update(time: Ticker) {
        if (this.state === State.STOP) return;

        this.animatedSprite.rotation +=
            time.deltaTime * random(0.05, 0.2) * this.rotationRandomizer;
    }

    flip(time: number, result: Side) {
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
            this.stop(result);
        }, time);
    }
}
