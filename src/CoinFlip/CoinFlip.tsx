import { useState } from "react";
import "./CoinFlip.css";
import btcCoin from "../images/coin-btc.png";
import ethCoin from "../images/coin-eth.png";

export const CoinFlip = ({
  onFlipComplete,
  disabled,
}: {
  onFlipComplete?: (result: string) => void;
  disabled?: boolean;
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentSide, setCurrentSide] = useState("BTC");

  const handleCoinClick = () => {
    if (isFlipping || disabled) return;

    const newSide = currentSide === "BTC" ? "ETH" : "BTC";
    setIsFlipping(true);

    setTimeout(() => {
      setCurrentSide(newSide);
      setIsFlipping(false);

      if (onFlipComplete) {
        onFlipComplete(newSide);
      }
    }, 1000);
  };

  return (
    <div className="coin-container">
      <div
        className={`coin ${
          isFlipping
            ? currentSide === "BTC"
              ? "flipping-to-eth"
              : "flipping-to-btc"
            : ""
        } ${currentSide === "ETH" ? "show-eth" : "show-btc"}`}
        onClick={handleCoinClick}
      >
        <div className="coin-side coin-front">
          <img src={btcCoin} alt="Bitcoin" />
        </div>
        <div className="coin-side coin-back">
          <img src={ethCoin} alt="Ethereum" />
        </div>
      </div>
    </div>
  );
};
