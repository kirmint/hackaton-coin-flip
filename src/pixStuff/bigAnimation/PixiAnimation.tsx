import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Application, Container } from "pixi.js";
import { WinMessage } from "./WinMessage";

export interface PixiWinHandle {
    play: () => void;
}

export const PixiAnimation = forwardRef((_, ref) => {
    const pixiContainerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application>(null);
    const winMessageRef = useRef<WinMessage>(null);

    const handleWin = () => {
        if (winMessageRef.current) {
            winMessageRef.current.play();
        }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        play: handleWin,
    }));

    useEffect(() => {
        const setupPixi = async () => {
            const app = new Application();

            await app.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundAlpha: 0,
            });

            appRef.current = app;

            // Append the canvas to our container div instead of directly to body
            if (pixiContainerRef.current) {
                pixiContainerRef.current.appendChild(app.canvas);
            }
            const animContainer = new Container();
            const winMessage = new WinMessage(animContainer, app);
            winMessageRef.current = winMessage;
            app.stage.addChild(animContainer);
        };

        setupPixi();

        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    return (
        <div ref={pixiContainerRef} className="pixi-animation-container"></div>
    );
});
