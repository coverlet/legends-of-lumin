import { DigitalAsset, fetchJsonMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { Umi, isSome, unwrapOption } from '@metaplex-foundation/umi';
import { TPack, TPackType } from '../store/types';

// TODO type up generic NFT
export const getVerifiedNft = (umi: Umi, asset: DigitalAsset, collectionMint: String): Promise<TPack> => {
    return new Promise(async (resolve, reject) => {
        if (isSome(asset.metadata.collection)) {
            const collection = unwrapOption(asset.metadata.collection);
            if (collection?.verified && collection.key === collectionMint) {
                const json = await fetchJsonMetadata(umi, asset.metadata.uri);
                console.log(json);
                resolve({
                    type: asset.metadata.symbol as unknown as TPackType,
                    publicKey: asset.publicKey,
                    name: asset.metadata.name,
                    description: json.description || '',
                    image: json.image || '',
                });
            } else {
                reject();
            }
        } else {
            reject();
        }
    });
};
