import { create } from "zustand";
import { BettingOption } from "./enums";

interface GameState {
  balance: number;
  stake: number;
  wonInARowCount: number;
  wonInARowAmount: number;
  multiplier: number;
  selectedBetOption: BettingOption;
  isBoostRound: boolean;
  setMultiplier: (multiplier: number) => void;
  resetMultiplier: () => void;
  increaseWonInARowCount: () => void;
  resetWonInARowCount: () => void;
  setWonInARowAmount: (amount: number) => void;
  setStake: (stake: number) => void;
  setBettingOption: (option: BettingOption) => void;
  setIsBoostRound: (isBoostRound: boolean) => void;
  resetRound: () => void;
}

const DEFAULT_MULTIPLIER = 1.5;

export const gameStore = create<GameState>((set) => {
  return {
    balance: 1000,
    stake: 1,
    wonInARowCount: 0,
    wonInARowAmount: 0,
    multiplier: DEFAULT_MULTIPLIER,
    selectedBetOption: BettingOption.HEADS,
    isBoostRound: false,
    setMultiplier: (multiplier: number) => set({ multiplier }),
    resetMultiplier: () => set({ multiplier: DEFAULT_MULTIPLIER }),
    increaseWonInARowCount: () =>
      set((state) => {
        return {
          wonInARowCount: state.wonInARowCount + 1,
        };
      }),
    setWonInARowAmount: (amount: number) =>
      set((state) => ({
        wonInARowAmount: amount,
        wonInARowCount: state.wonInARowCount + 1,
      })),
    resetWonInARowCount: () => set({ wonInARowCount: 0 }),
    setIsBoostRound: (isBoostRound: boolean) => set({ isBoostRound }),
    setStake: (stake: number) => set({ stake }),
    setBettingOption: (option: BettingOption) =>
      set({ selectedBetOption: option }),
    resetRound: () =>
      set((state) => ({
        balance: state.balance + state.wonInARowAmount,
        wonInARowAmount: 0,
        wonInARowCount: 0,
        multiplier: DEFAULT_MULTIPLIER,
      })),
  };
});
