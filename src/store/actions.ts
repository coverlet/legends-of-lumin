import { TPack } from "./types";


export enum Action {
    ADD,
    POPULATE_PACKS,
    ADD_PACK,
}

export const setPacks = (packs: TPack[]) => {
    return {
        type: Action.POPULATE_PACKS,
        packs,
    };
};

export const addPack = (pack: TPack) => {
    return {
        type: Action.ADD_PACK,
        pack,
    };
};
