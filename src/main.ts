import { Application } from "pixi.js";
import { config } from "./constants";

const app = new Application();

async function main() {
    await setup();
    await preload();
}

async function setup() {
    await app.init({
        background: "#1099bb",
        width: config.SCREEN_WIDTH,
        height: config.SCREEN_HEIGHT,
        autoDensity: true,
        antialias: true,
    });
    document.body.appendChild(app.canvas);
}

async function preload() {
    // load assets here
}

main();
