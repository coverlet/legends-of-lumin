import { mintV2 } from '@metaplex-foundation/mpl-candy-machine';
import {
    TokenStandard,
    burnNft,
    burnV1,
    fetchAllDigitalAssetByOwner,
    fetchDigitalAsset,
    fetchJsonMetadata,
    findMasterEditionPda,
    findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata';
import { findAssociatedTokenPda, setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import {
    PublicKey,
    Umi,
    generateSigner,
    isSome,
    publicKey,
    some,
    transactionBuilder,
    unwrapOption,
} from '@metaplex-foundation/umi';
import { Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import { PACKS_CANDY_MACHINE, PACKS_COLLECTION, UPDATE_AUTHORITY } from '../constants';
import { TPack, TPackType } from '../store/types';

export type TMintResult = {
    mint: string;
    signature: string;
};

export const getOwnerCollectionNfts = async (umi: Umi, owner: PublicKey, collectionMint: PublicKey) => {
    const assets = await fetchAllDigitalAssetByOwner(umi, owner);
    const userNfts: TPack[] = [];
    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (isSome(asset.metadata.collection)) {
            const collection = unwrapOption(asset.metadata.collection);
            if (collection?.verified && collection.key === collectionMint.toString()) {
                console.log(asset);
                // TODO optimize here, dont fetch same json multiple times
                const json = await fetchJsonMetadata(umi, asset.metadata.uri);
                userNfts.push({
                    type: asset.metadata.symbol as unknown as TPackType,
                    publicKey: asset.publicKey,
                    name: asset.metadata.name,
                    description: json.description || '',
                    image: json.image || '',
                });
            }
        }
    }

    return userNfts;
};

export const signOpenPack = (umi: Umi, owner: PublicKey, mint: PublicKey) => {
    const masterEditionPda = findMasterEditionPda(umi, { mint });
    const collectionMetadata = findMetadataPda(umi, { mint: publicKey(PACKS_COLLECTION) });
    const tokenAccount = findAssociatedTokenPda(umi, { mint, owner: umi.identity.publicKey });

    console.log(tokenAccount);
    // return burnV1(umi, {
    //     mint: mint,
    //     authority: umi.identity,
    //     tokenOwner: publicKey('97a85fPo3Z6SEDuY5ao4gpNUQuBMddzw9qeG4FUTnqBD'),
    //     // collectionMetadata: publicKey('G2mDdaL5EM4HXhEfJ4cSvEpVRfPztT9WgnEzAJ9Axiv3'),
    //     collectionMetadata: publicKey(PACKS_COLLECTION),
    //     tokenStandard: TokenStandard.NonFungible
    // })
    // .sendAndConfirm(umi);

    // return burnNft(umi, {
    //     mint,
    //     metadata: metadataPda,
    //     masterEditionAccount: masterEditionPda,
    //     tokenAccount: tokenAccount,
    //     owner: umi.identity,
    //     collectionMetadata: publicKey(PACKS_COLLECTION),
    // })

    return burnV1(umi, {
        mint: mint,
        tokenOwner: umi.identity.publicKey,
        collectionMetadata: collectionMetadata,
        tokenStandard: TokenStandard.NonFungible,
    }).buildAndSign(umi);
};

export const mintPack = async (umi: Umi): Promise<TMintResult> => {
    const nftMint = generateSigner(umi);
    // umi.use(walletAdapterIdentity(wallet));
    return transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
            mintV2(umi, {
                candyMachine: publicKey(PACKS_CANDY_MACHINE),
                nftMint,
                collectionMint: publicKey(PACKS_COLLECTION),
                collectionUpdateAuthority: publicKey(UPDATE_AUTHORITY),
                tokenStandard: TokenStandard.NonFungible,
                mintArgs: {
                    solPayment: some({ destination: publicKey(UPDATE_AUTHORITY) }),
                },
            })
        )
        .buildAndSign(umi)
        .then(async (signedTransaction) => {
            const signature = await umi.rpc.sendTransaction(signedTransaction);
            return {
                mint: nftMint.publicKey,
                signature: bs58.encode(signature),
            };
        });
    //.then(async (res) => {
    // connection.onSignature(
    //     bs58.encode(res.signature),
    //     (signatureResult, context) => {
    //         // setLoading(false);
    //         fetchDigitalAsset(umi, nftMint.publicKey)
    //             .then((data) => {
    //                 console.log(data);
    //             })
    //             .catch((e) => {
    //                 console.log(e);
    //             });
    //     },
    //     'finalized'
    // );

    // console.log(res);

    // const latestBlockHash = await web3Connection.getLatestBlockhash();
    // console.log(latestBlockHash);

    // const result = web3Connection.confirmTransaction(
    //     {
    //         blockhash: latestBlockHash.blockhash,
    //         lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    //         signature: bs58.encode(res.signature),
    //     },
    //     'finalized'
    // );

    // console.log('CONFIRMEEEED');

    // console.log(result);

    // let found = false;
    // do {
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     await fetchDigitalAsset(umi, nftMint.publicKey)
    //         .then((data) => {
    //             found = true;
    //             console.log(data);
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         });
    // } while (!found);

    // console.log(res);
    // const transaction = await umi.rpc.getTransaction(res.signature);
    // console.log(transaction?.meta?.logs);

    // umi.rpc.confirmTransaction()
    // signatureSubscribe
    // fetchAllNfts(publicKey(wallet.publicKey || '')).then((data: any) => {
    //     setNfts(data);
    //     setFetching(false);
    // });
    //});
};
