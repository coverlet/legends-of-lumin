import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { Umi } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { createContext, useContext, useMemo } from 'react';

export type MetaplexContextState = {
    context: Umi;
};

export const MetaplexContext = createContext({} as MetaplexContextState);

// TODO add props type
export const MetaplexContextProvider = ({ children }: any) => {
    const wallet = useWallet();

    const context = useMemo(() => {
        // TODO extract endpoint
        return createUmi('https://api.devnet.solana.com').use(mplCandyMachine()).use(walletAdapterIdentity(wallet));
    }, [wallet]);

    return <MetaplexContext.Provider value={{ context }}>{children}</MetaplexContext.Provider>;
};

export const useUmi = (): Umi => {
    return useContext(MetaplexContext).context;
}
