import {
    TokenStandard,
    createV1,
    findMetadataPda,
    mintV1,
    verifyCollectionV1,
} from '@metaplex-foundation/mpl-token-metadata';
import { Umi, generateSigner, percentAmount, publicKey, transactionBuilder } from '@metaplex-foundation/umi';
import { cardsDictionary } from './cards';
import { CARDS_COLLECTION } from '../constants';
import { getRandomItems } from './utils';

export const mintPackToOwner = async (umi: Umi, packSize = 1, owner: string) => {
    const cards = getRandomItems(cardsDictionary, packSize);
    const promises = cards.map((card: any) => {
        return mintCardToOwner(umi, card, owner);
    });
    return Promise.all(promises)
};
export const mintCardToOwner = async (umi: Umi, cardName: keyof typeof cardsDictionary, owner: string) => {
    if (!cardsDictionary[cardName]) {
        console.log('card not found');

        // throw here later on
        return false;
    }
    const card = cardsDictionary[cardName];
    const mint = generateSigner(umi);
    const mintMetadata = findMetadataPda(umi, { mint: mint.publicKey });

    return transactionBuilder()
        .add(
            // create accounts
            createV1(umi, {
                mint,
                authority: umi.identity,
                name: card.name,
                symbol: 'LUMIN',
                uri: card.uri,
                collection: {
                    verified: false,
                    key: publicKey(CARDS_COLLECTION),
                },
                sellerFeeBasisPoints: percentAmount(0),
                tokenStandard: TokenStandard.NonFungible,
            })
        )
        .add(
            mintV1(umi, {
                mint: mint.publicKey,
                authority: umi.identity,
                amount: 1,
                tokenOwner: publicKey(owner),
                tokenStandard: TokenStandard.NonFungible,
            })
        )
        .add(
            verifyCollectionV1(umi, {
                metadata: mintMetadata,
                collectionMint: publicKey(CARDS_COLLECTION),
                authority: umi.identity,
            })
        )
        .sendAndConfirm(umi)
        .then((data) => {
            return {
                mint: mint.publicKey,
                cardName: cardName,
                data,
            };
        });
};
