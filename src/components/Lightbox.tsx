'use client';

import { useEffect } from 'react';
import styles from './Lightbox.module.css';

interface LightboxProps {
    url: string;
    onClose: () => void;
}

export default function Lightbox({ url, onClose }: LightboxProps) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Prevent scrolling when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    ✕
                </button>
                <img src={url} alt="Full screen" className={styles.image} />
            </div>
        </div>
    );
}
