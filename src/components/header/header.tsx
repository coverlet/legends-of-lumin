import dynamic from 'next/dynamic';

import styles from './header.module.scss';

type HeaderProps = {};

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const Header = ({}: HeaderProps) => {
    return (
        <div className={styles.header}>
            <div className="left">Legends of Lumin</div>
            <div className={styles.walletContainer}>
                <WalletMultiButtonDynamic className={'xxxxxxxxxx'} style={{ backgroundColor: 'red' }} />
            </div>
        </div>
    );
};

