import { GlowFilter } from "pixi-filters";
import { Container, Text, Graphics, Application } from "pixi.js";
import gsap from "gsap";

const color = "#fefefc";
const glow = "#9945ff";

export class WinMessage {
    messageContainer: Container;

    constructor(container: Container, app: Application) {
        const messageContainer = new Container();
        messageContainer.alpha = 0;

        const width = app.screen.width / 2;
        const height = app.screen.height / 2 - 300;

        messageContainer.pivot.set(0.5);
        messageContainer.position.set(width, height);

        const text = new Text({
            style: { fill: color, fontWeight: "bold", fontSize: "64px" },
        });
        text.anchor.set(0.5);
        text.text = "YOU WON";

        messageContainer.addChild(text);

        const lineTop = new Graphics();
        lineTop.setStrokeStyle({
            width: 4,
            color: color,
            cap: "round", // Optional: adds rounded ends to the line
        });
        const startX = -text.width / 2 - 50;
        const startY = -45 + 2; // Adding 2 to center the line vertically (half of height 4)
        const endX = startX + 420;
        const endY = startY;
        lineTop.moveTo(startX, startY);
        lineTop.lineTo(endX, endY);
        lineTop.stroke();

        messageContainer.addChild(lineTop);

        const lineBottom = new Graphics();
        lineBottom.setStrokeStyle({
            width: 4,
            color: color,
            cap: "round", // Optional: adds rounded ends to the line
        });
        const startX2 = -text.width / 2 - 50;
        const startY2 = 45 - 2; // Adding 2 to center the line vertically (half of height 4)
        const endX2 = startX2 + 420;
        const endY2 = startY2;
        lineBottom.moveTo(startX2, startY2);
        lineBottom.lineTo(endX2, endY2);
        lineBottom.stroke();
        messageContainer.addChild(lineBottom);

        messageContainer.filters = [
            new GlowFilter({
                distance: 60,
                outerStrength: 4,
                color: glow,
            }),
        ];

        this.messageContainer = messageContainer;

        container.addChild(messageContainer);
    }

    play() {
        // Reset initial state
        this.messageContainer.alpha = 0;
        this.messageContainer.scale.set(0.5);
        this.messageContainer.rotation = -0.05;

        const timeline = gsap.timeline();

        // More dynamic appear animation
        timeline.to(this.messageContainer, {
            alpha: 1,
            duration: 0.15,
            ease: "power3.out",
        });

        timeline.to(
            this.messageContainer.scale,
            {
                x: 1.05, // Slight overshoot
                y: 1.05,
                duration: 0.25,
                ease: "back.out(2)", // Increased elasticity
            },
            "-=0.1"
        );

        // Settle to normal size with a slight bounce
        timeline.to(this.messageContainer.scale, {
            x: 1,
            y: 1,
            duration: 0.2,
            ease: "elastic.out(1, 0.3)",
        });

        // Subtle rotation for more natural feel
        timeline.to(
            this.messageContainer,
            {
                rotation: 0,
                duration: 0.3,
                ease: "power2.out",
            },
            "-=0.4"
        );

        // Stay visible with a subtle pulse
        timeline.to(this.messageContainer.scale, {
            x: 1.02,
            y: 1.02,
            duration: 0.4,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Disappear with style
        timeline.to(this.messageContainer, {
            alpha: 0,
            duration: 0.25,
            ease: "power3.in",
        });

        timeline.to(
            this.messageContainer.scale,
            {
                x: 0.7,
                y: 0.7,
                duration: 0.2,
                ease: "back.in(1.7)",
            },
            "-=0.2"
        );

        // Add a slight rotation on exit
        timeline.to(
            this.messageContainer,
            {
                rotation: 0.03,
                duration: 0.15,
            },
            "-=0.25"
        );

        return timeline; // Return the timeline for potential chaining
    }

    play2() {
        this.messageContainer.alpha = 0;
        this.messageContainer.scale.set(0.5);

        const timeline = gsap.timeline();

        // Appear animation
        timeline.to(this.messageContainer, {
            alpha: 1,
            duration: 0.1,
            ease: "power2.out",
        });

        timeline.to(
            this.messageContainer.scale,
            {
                x: 1,
                y: 1,
                duration: 0.2,
                ease: "back.out(1.5)",
            },
            "-=0.1"
        );

        // Stay visible for a few seconds
        timeline.to(this.messageContainer, {
            alpha: 1,
            duration: 1,
            ease: "none",
        });

        // Disappear animation
        timeline.to(this.messageContainer, {
            alpha: 0,
            duration: 0.2,
            ease: "power2.in",
        });

        timeline.to(
            this.messageContainer.scale,
            {
                x: 0.8,
                y: 0.8,
                duration: 0.2,
                ease: "back.in(1.5)",
            },
            "-=0.2"
        );
    }
}
