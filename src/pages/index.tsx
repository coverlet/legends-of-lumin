import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from './styles/index.module.scss';
import {
    publicKey,
} from '@metaplex-foundation/umi';
import { useWallet } from '@solana/wallet-adapter-react';
import { Hero } from '../components/hero/hero';
import { useUmi } from '../context/metaplex-context';
import { getOwnerCollectionNfts } from '../core/metaplex';
import { useDispatch, useSelector } from '../store/store';
import { setPacks } from '../store/actions';
import { selectPacks } from '../store/selectors';
import { TPack } from '../store/types';
import { Pack } from '../components/pack/pack';
import { PACKS_COLLECTION } from '../constants';

const isSsr = typeof window === 'undefined';

const Home: NextPage = () => {
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const wallet = useWallet();
    const umi = useUmi();
    const packs = useSelector(selectPacks);

    useEffect(() => {
        if (wallet.publicKey && !fetching && !isSsr) {
            console.log('fetching');
            setFetching(true);
            getOwnerCollectionNfts(umi, publicKey(wallet.publicKey), publicKey(PACKS_COLLECTION)).then((data: any) => {
                dispatch(setPacks(data));
                setFetching(false);
            });
        }
    }, [wallet.publicKey]);

    // const assets = await fetchAllDigitalAssetByOwner(umi, owner)

    return (
        <div className={styles.home}>
            <Head>
                <title>Legends of Lumin</title>
                <meta name="description" content="Legends of Lumin" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <main>
                <Hero />
                <div className={styles.packs}>
                    {packs.map((pack: TPack) => (
                        <Pack key={pack.publicKey} pack={pack} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
