import { Howl } from "howler";
import { random } from "./utils/utils";

class SoundService {
    private sounds: Map<string, Howl> = new Map();
    private music: Map<string, Howl> = new Map();
    private currentMusic: Howl | null = null;

    constructor() {
        this.load("drop", "./assets/drop.mp3");
        this.load("flip", "./assets/flip.mp3");
        this.load("click", "./assets/click.mp3");

        this.loadMusic("background", "./assets/background.mp3");
    }

    load(id: string, src: string | string[]): void {
        const sound = new Howl({
            src: Array.isArray(src) ? src : [src],
            preload: true,
            volume: 0.5,
        });

        this.sounds.set(id, sound);
    }

    loadMusic(id: string, src: string | string[]): void {
        const music = new Howl({
            src: Array.isArray(src) ? src : [src],
            preload: true,
            volume: 0.2,
            loop: true,
        });

        this.music.set(id, music);
    }

    play(id: string): number {
        const sound = this.sounds.get(id);
        if (sound) {
            sound.rate(random(0.9, 1.3));
            return sound.play();
        }
        console.warn(`Sound "${id}" not found`);
        return -1;
    }

    playMusic(id: string): void {
        // Stop current music if any is playing
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        const music = this.music.get(id);
        if (music) {
            music.play();
            this.currentMusic = music;
        } else {
            console.warn(`Music "${id}" not found`);
        }
    }

    stopMusic(): void {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    stop(id: string): void {
        const sound = this.sounds.get(id);
        if (sound) {
            sound.stop();
        }
    }

    setVolume(volume: number): void {
        // Global volume control
        Howler.volume(volume);
    }
}

export const soundService = new SoundService();
