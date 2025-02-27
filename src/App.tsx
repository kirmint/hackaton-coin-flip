import { useState, useEffect, useRef } from "react";
import "./App.css";
import { PixiGame, PixiGameHandle } from "./pixStuff/PixiGame";
import { soundService } from "./pixStuff/SoundService";
import { gameService } from "./business/gameService";
import { useGameStore } from "./business/gameStore";

function App() {
  const pixiGameRef = useRef<PixiGameHandle>(null);
  const store = useGameStore();
  const [isLastWon, setIsLastWon] = useState(false);
  const [music, setMusic] = useState(false);
  // const [balance, setBalance] = useState(10000);
  const [stake, setStake] = useState(50);
  const [winRate, setWinRate] = useState(68);
  const [multiplier, setMultiplier] = useState(1.5);
  const [selectedCoin, setSelectedCoin] = useState("BTC");
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
      0.01,
      Math.min(store.balance, parseFloat((stake + amount).toFixed(2)))
    );
    setStake(newStake);
  };

  const handleFlipFromParent = () => {
    if (pixiGameRef.current) {
      soundService.play("click");
      pixiGameRef.current.flip();
      const lastRound = gameService.run();
      console.log(lastRound);
    }
  };

  return (
    <div className="app-container">
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
              <span className="stat-value">{store.balance} USD</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">WIN RATE</span>
              <span className="stat-value win-rate">{winRate}%</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">MULTIPLIER</span>
              <span className="stat-value multiplier">x{multiplier}</span>
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
                  <div className="stake-value">{stake} USD</div>
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
                <div className="coin-buttons">
                  <button
                    className={`coin-btn btc ${
                      selectedCoin === "BTC" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedCoin("BTC")}
                  >
                    BTC
                  </button>
                  <button
                    className={`coin-btn eth ${
                      selectedCoin === "ETH" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedCoin("ETH")}
                  >
                    ETH
                  </button>
                </div>
              </div>

              <div className="control-section flip-control">
                {isLastWon ? (
                  <>
                    <button className="flip-btn" onClick={handleFlipFromParent}>
                      <a href="#">CONTINUE</a>
                    </button>
                    <button className="flip-btn" onClick={handleFlipFromParent}>
                      <a href="#">CASHOUT</a>
                    </button>
                  </>
                ) : (
                  <>
                    <h3>FLIP THE COIN</h3>
                    <button className="flip-btn" onClick={handleFlipFromParent}>
                      <a href="#">FLIP IT NOW</a>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
