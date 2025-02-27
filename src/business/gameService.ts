import { useGameStore } from "./gameStore";
import { BettingOption } from "./enums";

class GameService {
  // private BOOST_MULTIPLIER = 2;
  private BOOST_ROUND_INTERVAL = 30000;
  private BOOST_ROUND_DURATION = 10000;

  constructor(private store: typeof useGameStore) {
    this.boostRoundWorker();
  }

  private getRandomSide(): BettingOption {
    return Math.random() < 0.5 ? BettingOption.HEADS : BettingOption.TAILS;
  }

  private calculateMultiplier(): void {
    const store = this.store.getState();
    const multiplier = store.multiplier * (1 + store.multiplier * 0.1);
    store.setMultiplier(Number(multiplier.toFixed(2)));
  }

  private boostRoundWorker(): void {
    setInterval(() => {
      const store = this.store.getState();
      if (!store.isBoostRound) {
        if (Math.random() < 0.5) {
          store.setIsBoostRound(true);
          setTimeout(() => {
            store.setIsBoostRound(false);
          }, this.BOOST_ROUND_DURATION);
        }
      }
    }, this.BOOST_ROUND_INTERVAL);
  }

  private updateRoundResult(isRoundWon: boolean, changeAmount: number): void {
    const store = this.store.getState();
    if (isRoundWon) {
      store.setWonInARowAmount(changeAmount);
      store.setWinRate(true);
      this.calculateMultiplier();
    } else {
      store.setWonInARowAmount(-changeAmount);
      store.setWinRate(false);
      this.resetAndCashout();
    }
    store.setIsLastRoundWon(isRoundWon);
  }

  // should be used on start game or continue
  public run(): { isRoundWon: boolean; result: BettingOption } {
    const result = this.getRandomSide();
    const store = this.store.getState();
    const changeAmount =
      (store.wonInARowAmount || store.stake) * store.multiplier;
    const isRoundWon = result === store.selectedBetOption;

    setTimeout(() => {
      this.updateRoundResult(isRoundWon, changeAmount);
    }, 1100);

    return {
      isRoundWon,
      result,
    };
  }

  // should be used on cashout and reset (lost game)
  public resetAndCashout(): void {
    this.store.getState().resetRound();
  }
}

export const gameService = new GameService(useGameStore);
