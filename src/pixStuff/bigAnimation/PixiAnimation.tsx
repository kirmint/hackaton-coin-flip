import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Application, Container } from "pixi.js";

export const PixiAnimation = () => {
    const pixiContainerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application>(null);

    useEffect(() => {
        const setupPixi = async () => {
            const app = new Application();

            await app.init({
                width: 1000,
                height: 1000,
                autoDensity: true,
                antialias: true,
                // backgroundAlpha: 0
            });

            appRef.current = app;

            // Append the canvas to our container div instead of directly to body
            if (pixiContainerRef.current) {
                pixiContainerRef.current.appendChild(app.canvas);
            }
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
};
