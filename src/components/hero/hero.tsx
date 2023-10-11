import { useContext, useState } from 'react';
import styles from './hero.module.scss';
import { TMintResult, mintPack } from '../../core/metaplex';
import { useUmi } from '../../context/metaplex-context';
import { useConnection } from '@solana/wallet-adapter-react';
import { useDispatch, useStore } from '../../store/store';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { PACKS_COLLECTION } from '../../constants';
import { getVerifiedNft } from '../../core/utils';
import { addPack } from '../../store/actions';
type HeroProps = {};

const xxxx = 5;

export const Hero = ({}: HeroProps) => {
    // const level = useContext(ConnectionContext);
    const umi = useUmi();
    const dispatch = useDispatch();
    const connection = useConnection().connection;
    const state = useStore();
    const [buying, setBuying] = useState(false);
    // no-unused-vars
    const mint = () => {
        mintPack(umi, connection).then((data: TMintResult) => {
            setBuying(true);
            // TODO extract this?
            connection.onSignature(
                data.signature,
                (signatureResult) => {
                    if (!signatureResult.err) {
                        fetchDigitalAsset(umi, publicKey(data.mint))
                            .then((data) => {
                                getVerifiedNft(umi, data, PACKS_COLLECTION)
                                    .then((data) => {
                                        setBuying(false);
                                        dispatch(addPack(data));
                                    })
                                    .catch(() => {
                                        setBuying(false);
                                    });
                            })
                            .catch((e) => {});
                    } else {
                        // TODO Throw
                        setBuying(false);
                    }
                },
                'finalized'
            );
        });
    };

    return (
        <div className={styles.hero}>
            <button onClick={mint}>
                {!buying && 'Buy pack!'}
                {buying && 'Buying'}
            </button>
            <br />
        </div>
    );
};
