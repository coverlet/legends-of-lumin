import { ReactNode } from 'react';
import styles from './layout.module.scss';
import { Header } from '../components/header/header';

type LayoutProps = {
    children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={styles.layout}>
            <div className={styles.content}>
                <Header />
                <div className={styles.main}>{children}</div>
                <footer className={styles.footer}>
                    asdasd
                    <br />
                    asdasd
                    <br />
                    asdasd
                </footer>
            </div>
        </div>
    );
};
