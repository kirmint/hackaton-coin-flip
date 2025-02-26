import { gameStore } from "./gameStore";
import { BettingOption } from "./enums";

class GameService {
  private BOOST_MULTIPLIER = 2;
  private BOOST_ROUND_INTERVAL = 30000;
  private BOOST_ROUND_DURATION = 10000;

  constructor(private store: typeof gameStore) {
    this.boostRoundWorker();
  }

  private getRandomSide(): BettingOption {
    return Math.random() < 0.5 ? BettingOption.HEADS : BettingOption.TAILS;
  }

  private calculateMultiplier(): void {
    const store = this.store.getState();
    const multiplier =
      store.multiplier *
      ((1 + store.multiplier * 0.1) *
        (store.isBoostRound ? this.BOOST_MULTIPLIER : 1));
    store.setMultiplier(multiplier);
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

  public setStake(stake: number): void {
    this.store.getState().setStake(stake);
  }

  public setBettingOption(option: BettingOption): void {
    this.store.getState().setBettingOption(option);
  }

  // should be used on start game or continue
  public run(): boolean {
    const result = this.getRandomSide();
    const store = this.store.getState();
    const changeAmount = store.stake * store.multiplier;
    if (result === store.selectedBetOption) {
      store.setWonInARowAmount(changeAmount);
      this.calculateMultiplier();
      return true;
    } else {
      store.setWonInARowAmount(-changeAmount);
      return false;
    }
  }

  // should be used on cashout and reset (lost game)
  public resetAndCashout(): void {
    this.store.getState().resetRound();
  }
}

export const gameService = new GameService(gameStore);
