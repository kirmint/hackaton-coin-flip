import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Application, Container } from "pixi.js";
import { config } from "./constants";
import { ResouceManager } from "./ResourceManage";
import { ScreenShake } from "./objects/ScreenShake";
import { Coin } from "./objects/Coin";

const FLIP_DURATION = 1000;

interface PixiGameProps {
	onCoinFlip?: (result: string) => void; // Optional callback for coin flip result
}

export interface PixiGameHandle {
	flip: () => void;
}

export const PixiGame = forwardRef<PixiGameHandle, PixiGameProps>(
	(props, ref) => {
		const { onCoinFlip } = props;
		const pixiContainerRef = useRef<HTMLDivElement>(null);
		const appRef = useRef<Application>(null);
		const coinRef = useRef<Coin>(null);
		const screenShakeRef = useRef<ScreenShake>(null);

		// Function to expose the flip method to parent component
		const handleFlip = () => {
			if (coinRef.current) {
				coinRef.current.flip(FLIP_DURATION);
				window.setTimeout(() => {
					if (appRef.current) {
						screenShakeRef.current!.start();
					}
				}, FLIP_DURATION + 20);
			}
		};

		// Expose methods to parent component
		useImperativeHandle(ref, () => ({
			flip: handleFlip,
		}));

		useEffect(() => {
			const setupPixi = async () => {
				const app = new Application();

				await app.init({
					width: config.SCREEN_WIDTH,
					height: config.SCREEN_HEIGHT,
					autoDensity: true,
					antialias: true,
					backgroundAlpha: 0,
				});

				appRef.current = app;

				// Append the canvas to our container div instead of directly to body
				if (pixiContainerRef.current) {
					pixiContainerRef.current.appendChild(app.canvas);
				}

				await ResouceManager.load();

				const gameContainer = new Container();
				const screenShake = new ScreenShake(gameContainer);
				const coin = new Coin();
				coinRef.current = coin;
				screenShakeRef.current = screenShake;

				app.stage.addChild(gameContainer);
				gameContainer.addChild(coin.animatedSprite);

				app.ticker.add((time) => {
					coin.update(time);
					screenShake.update(time.elapsedMS);
				});
			};

			setupPixi();

			return () => {
				if (appRef.current) {
					appRef.current.destroy(true);
				}
			};
		}, [onCoinFlip]);

		return <div ref={pixiContainerRef} className="pixi-container"></div>;
	}
);
