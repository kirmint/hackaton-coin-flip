import { Assets } from "pixi.js";

const SPRITESHEET_PATH = "./assets/1.json";

export class ResouceManager {
    static getTexture(frameName: string) {
        return Assets.get(SPRITESHEET_PATH).textures[frameName];
    }

    static getAnimation(animationName: string) {
        return Assets.get(SPRITESHEET_PATH).animations[animationName];
    }

    static async load() {
        return Assets.load(SPRITESHEET_PATH);
    }
}
