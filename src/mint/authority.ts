import { Umi, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi';
import bs58 from "bs58";

export const authorize = (umi: Umi) => {
    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(bs58.decode(process.env.AUTHORITY_SK as any));
    const authoritySigner = createSignerFromKeypair(umi, authorityKeypair);

    umi.use(signerIdentity(authoritySigner));
};
