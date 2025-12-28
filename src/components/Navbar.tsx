'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import Logo from './Logo';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Directory', path: '/directory' },
    { name: 'Settings', path: '/settings' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={styles.nav + ' glass'}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>

                <div className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </div>

                <ul className={`${styles.links} ${isMenuOpen ? styles.open : ''}`}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`${styles.link} ${pathname === item.path ? styles.active : ''}`}
                                onClick={() => setIsMenuOpen(false)}
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
