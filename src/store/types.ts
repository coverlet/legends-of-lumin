export enum TPackType {
    LUMINPACK5,
}

export type TPack = {
    name: string;
    description: string;
    type: TPackType;
    publicKey: string;
    image: string;
};

export type TState = {
    packs: TPack[];
};
