import { TPack, TPackType } from '../../store/types';
import Image from 'next/image';

import styles from './pack.module.scss';
import { signOpenPack } from '../../core/metaplex';
import { publicKey } from '@metaplex-foundation/umi';
import { useUmi } from '../../context/metaplex-context';
import { useWallet } from '@solana/wallet-adapter-react';
import * as bs58 from 'bs58';
type CardProps = {
    card: TPack;
    width?: number;
};

const imageAR = 1;

const legend: any = {
    LUMINPACK5: '5 Cards Pack',
};

export const Card = ({ card, width = 200 }: CardProps) => {
    const wallet = useWallet();
    const umi = useUmi();
    const containerWidth = width * 0.8;

    return (
        <div className={styles.card} style={{ width: containerWidth }}>

        </div>
    );
};
