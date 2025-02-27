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
  isLastRoundWon: boolean;
  winRate: {
    wins: number;
    total: number;
  };
  setMultiplier: (multiplier: number) => void;
  resetMultiplier: () => void;
  increaseWonInARowCount: () => void;
  resetWonInARowCount: () => void;
  setWonInARowAmount: (amount: number) => void;
  setStake: (stake: number) => void;
  setBettingOption: (option: BettingOption) => void;
  setIsBoostRound: (isBoostRound: boolean) => void;
  setIsLastRoundWon: (isLastRoundWon: boolean) => void;
  setWinRate: (isWon: boolean) => void;
  resetRound: () => void;
}

const DEFAULT_MULTIPLIER = 1.5;

export const useGameStore = create<GameState>((set) => {
  return {
    balance: 5000,
    stake: 50,
    wonInARowCount: 0,
    wonInARowAmount: 0,
    multiplier: DEFAULT_MULTIPLIER,
    selectedBetOption: BettingOption.HEADS,
    isBoostRound: false,
    isLastRoundWon: false,
    winRate: {
      wins: 0,
      total: 0,
    },
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
        wonInARowAmount: Number(amount.toFixed(2)),
        wonInARowCount: state.wonInARowCount + 1,
      })),
    resetWonInARowCount: () => set({ wonInARowCount: 0 }),
    setIsBoostRound: (isBoostRound: boolean) => set({ isBoostRound }),
    setStake: (stake: number) => set({ stake }),
    setBettingOption: (option: BettingOption) =>
      set({ selectedBetOption: option }),
    resetRound: () =>
      set((state) => ({
        balance: Number((state.balance + state.wonInARowAmount).toFixed(2)),
        wonInARowAmount: 0,
        wonInARowCount: 0,
        multiplier: DEFAULT_MULTIPLIER,
      })),
    setWinRate: (isWon: boolean) =>
      set((state) => ({
        winRate: {
          wins: isWon ? state.winRate.wins + 1 : state.winRate.wins,
          total: state.winRate.total + 1,
        },
      })),
    setIsLastRoundWon: (isLastRoundWon: boolean) => set({ isLastRoundWon }),
  };
});
