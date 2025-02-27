import { useState, useEffect, useRef } from "react";
import "./App.css";
import { PixiGame, PixiGameHandle } from "./pixStuff/PixiGame";
import { soundService } from "./pixStuff/SoundService";
import { gameService } from "./business/gameService";
import { useGameStore } from "./business/gameStore";
import { BettingOption } from "./business/enums";
import { CoinFlip } from "./CoinFlip/CoinFlip";
import {
  PixiAnimation,
  PixiWinHandle,
} from "./pixStuff/bigAnimation/PixiAnimation";

function App() {
  const pixiGameRef = useRef<PixiGameHandle>(null);
  const pixiWinAnimationRef = useRef<PixiWinHandle>(null);
  const store = useGameStore();
  const [music, setMusic] = useState(false);

  useGameStore.subscribe((state) => {
    if (state.isLastRoundWon) {
      pixiWinAnimationRef.current?.play();
    }
  });

  const [luckyHourTime, setLuckyHourTime] = useState("29:12");

  useEffect(() => {
    const timer = setInterval(() => {
      const [minutes, seconds] = luckyHourTime.split(":").map(Number);

      let newMinutes = minutes;
      let newSeconds = seconds - 1;

      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes -= 1;
      }

      if (newMinutes < 0) {
        newMinutes = 59;
        newSeconds = 59;
      }

      setLuckyHourTime(
        `${newMinutes}:${newSeconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [luckyHourTime]);

  const adjustStake = (amount: number) => {
    const newStake = Math.max(
      50,
      Math.min(store.balance, parseFloat((store.stake + amount).toFixed(2)))
    );
    store.setStake(newStake);
  };

  const handleFlipClick = () => {
    if (pixiGameRef.current) {
      soundService.play("click");
    }
  };

  const handleFlipFromParent = async (e: any) => {
    const lastRound = gameService.run();

    window.setTimeout(() => {
      if (pixiGameRef.current) {
        pixiGameRef.current.flip(lastRound.result);
      }
    }, 100);

    e.preventDefault();
  };

  const handleCashout = () => {
    gameService.resetAndCashout();
  };

  return (
    <div className="app-container">
      <PixiAnimation ref={pixiWinAnimationRef} />
      <button
        className="sound-button"
        onClick={() => {
          setMusic(!music);
          if (music) {
            soundService.playMusic("background");
          } else {
            soundService.stopMusic();
          }
        }}
      >
        Music
      </button>
      <div className="wrapper">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
        <div className="orb orb-6"></div>

        <header className="header">
          <div className="logo-container">
            <h1 className="logo">FLIPMASTER</h1>
            <p className="tagline">HIGH STAKES · MEGA REWARDS</p>
          </div>
          <div className="lucky-hour">
            <p className="lucky-hour-time">LUCKY HOUR: {luckyHourTime}</p>
            <p className="lucky-hour-rewards">2X ALL REWARDS</p>
          </div>
        </header>

        <main className="main-content">
          <section className="panel stats-panel">
            <h2>YOUR STATS</h2>
            <div className="stat-row">
              <span className="stat-label">BALANCE</span>
              <span className="stat-value">{store.balance}$</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">WIN RATE</span>
              <span className="stat-value win-rate">
                {(store.winRate.wins
                  ? (store.winRate.wins / store.winRate.total) * 100
                  : 0
                ).toFixed(2)}
                %
              </span>
            </div>

            <div className="stat-row">
              <span className="stat-label">MULTIPLIER</span>
              <span className="stat-value multiplier">x{store.multiplier}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">WON IN A ROW</span>
              <span className="stat-value multiplier">
                {store.wonInARowAmount}$
              </span>
            </div>
          </section>
          <section className="coin"></section>
          <PixiGame ref={pixiGameRef} />
        </main>

        <div className="control-panel-container">
          <div className="control-panel">
            <div className="controls-container">
              <div className="control-section stake-control">
                <h3>YOUR STAKE</h3>
                <div className="stake-adjuster">
                  <button
                    className="stake-btn minus"
                    onClick={() => adjustStake(-50)}
                  >
                    -
                  </button>
                  <div className="stake-value">{store.stake} USD</div>
                  <button
                    className="stake-btn plus"
                    onClick={() => adjustStake(50)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="control-section coin-control">
                <h3>COIN SELECTION</h3>
                <CoinFlip
                  disabled={store.isLastRoundWon}
                  onFlipComplete={(result) =>
                    store.setBettingOption(
                      result === "BTC"
                        ? BettingOption.HEADS
                        : BettingOption.TAILS
                    )
                  }
                />
              </div>

              <div className="control-section flip-control">
                <div className="buttons">
                  {store.isLastRoundWon && (
                    <button
                      className="flip-btn cashout"
                      onClick={handleCashout}
                    >
                      <a href="#">CASHOUT</a>
                    </button>
                  )}
                  <button
                    className="flip-btn"
                    onMouseDown={handleFlipClick}
                    onClick={handleFlipFromParent}
                  >
                    <a>FLIP IT NOW</a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
