'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Directory', path: '/directory' },
    { name: 'Settings', path: '/settings' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav + ' glass'}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">Emerald Isle '25</Link>
                </div>
                <ul className={styles.links}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
