import { Container, ContainerChild } from "pixi.js";
import { randomInt } from "../utils/utils";

export class ScreenShake {
    private shaking = false;
    private shakingTime = 0;
    private shakingIntensity = 0;
    private shakingDuration = 0;

    constructor(private gameContainer: Container<ContainerChild>) {}

    start() {
        this.shaking = true;
        this.shakingTime = 0;
        this.shakingIntensity = randomInt(4, 6);
        this.shakingDuration = randomInt(80, 120);
    }

    update(elapsedMS: number) {
        if (this.shaking) {
            // Calculate shake progress (0 to 1)
            this.shakingTime += elapsedMS;
            const progress = Math.min(
                this.shakingTime / this.shakingDuration,
                1
            );

            // Apply decreasing intensity based on progress
            const currentIntensity = this.shakingIntensity * (1 - progress);

            // Random offset for shake effect
            this.gameContainer.x = (Math.random() * 2 - 1) * currentIntensity;
            this.gameContainer.y = (Math.random() * 2 - 1) * currentIntensity;

            if (progress >= 1) {
                this.shaking = false;
                this.gameContainer.x = 0;
                this.gameContainer.y = 0;
            }
        }
    }
}
