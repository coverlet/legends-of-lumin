import { TState } from "./types";

export const selectPacks = (state: TState) => {
    return state.packs;
};
