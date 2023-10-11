// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { mintCardToOwner, mintPackToOwner } from '../../mint/mint';
import { authorize } from '../../mint/authority';

const umi = createUmi('https://api.devnet.solana.com').use(mplCandyMachine());
let connection = new Connection(clusterApiUrl('testnet'));

authorize(umi);

type Data = {
    succes: boolean;
    data?: any; // TODO format and type data
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const data = req.body;
    console.log(data.owner);


    // TODO !!! on the server side send and verify burn pack transaction in order to mint nfts
    // const signature = await umi.rpc.sendTransaction(signedTransaction);
    // const confirmResult = await umi.rpc.confirmTransaction(signature, {
    //     strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
    // });
    mintPackToOwner(umi, 2, data.owner).then((data) => {
        res.status(200).json({ succes: true, data });
    }).catch(e => {
        res.status(200).json({ succes: false });
    })
}
