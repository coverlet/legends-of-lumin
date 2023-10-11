import { TPack, TPackType } from '../../store/types';
import Image from 'next/image';

import styles from './pack.module.scss';
import { signOpenPack } from '../../core/metaplex';
import { publicKey } from '@metaplex-foundation/umi';
import { useUmi } from '../../context/metaplex-context';
import { useWallet } from '@solana/wallet-adapter-react';
import * as bs58 from 'bs58';
type PackProps = {
    pack: TPack;
    width?: number;
};

const imageAR = 1;

const legend: any = {
    LUMINPACK5: '5 Cards Pack',
};

export const Pack = ({ pack, width = 200 }: PackProps) => {
    const wallet = useWallet();
    const umi = useUmi();
    const height = width / imageAR;
    const containerWidth = width * 0.8;

    return (
        <div className={styles.pack} style={{ width: containerWidth }}>
            <div className={styles.imageContainer} style={{ width: containerWidth, height }}>
                <Image src={pack.image} alt={pack.name} width={width} height={height} objectPosition="center" />
            </div>
            <button
                className={`button-primary ${styles.openButton}`}
                onClick={() => {
                    console.log(pack.publicKey);
                    fetch('/api/open-pack', {
                        method: 'POST',
                        cache: 'no-cache',
                        headers: {
                            // 'Content-Type': 'text/plain',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            s: "sss",
                            owner: wallet.publicKey,
                        }),
                    });

                    // signOpenPack(umi, publicKey(wallet.publicKey as any), publicKey(pack.publicKey)).then(
                    //     async (signedTransaction) => {
                    //         // TODO this transaction should be sent & verified by the server. durable nonce?
                    //         // const signature = await umi.rpc.sendTransaction(signedTransaction);
                    //         // const confirmResult = await umi.rpc.confirmTransaction(signature, {
                    //         //     strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
                    //         // });

                    //         fetch('/api/open-pack', {
                    //             method: 'POST',
                    //             cache: 'no-cache',
                    //             headers: {
                    //                 // 'Content-Type': 'text/plain',
                    //                 'Content-Type': 'application/json',
                    //             },
                    //             body: JSON.stringify({
                    //                 signedTransaction,
                    //                 owner: wallet.publicKey,
                    //             }),
                    //         });
                    //     }
                    // );
                }}
            >
                Open
            </button>
            <div className={styles.title}>{legend[pack.type]}</div>
        </div>
    );
};
