import { Application, Container } from "pixi.js";
import { config } from "./constants";
import { ResouceManager } from "./ResourceManage";
import { ScreenShake } from "./objects/ScreenShake";
import { Coin } from "./objects/Coin";

const button = document.getElementById("button");

const app = new Application();

const FLIP_DURATION = 1000;

async function main() {
    await setup();
    await preload();

    const gameContainer = new Container();
    const screenShake = new ScreenShake(gameContainer);
    const coin = new Coin();
    app.stage.addChild(gameContainer);

    gameContainer.addChild(coin.animatedSprite);

    app.ticker.add((time) => {
        coin.update(time);
        screenShake.update(time.elapsedMS);
    });

    button!.onclick = () => {
        coin.flip(FLIP_DURATION);
        window.setTimeout(() => {
            screenShake.start();
        }, FLIP_DURATION + 20);
    };
}

async function setup() {
    await app.init({
        width: config.SCREEN_WIDTH,
        height: config.SCREEN_HEIGHT,
        autoDensity: true,
        antialias: true,
        backgroundAlpha: 0,
    });
    document.body.appendChild(app.canvas);
}

async function preload() {
    await ResouceManager.load();
}

main();
