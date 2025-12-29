'use client';

import { useState } from 'react';
import { deletePhoto } from '../app/actions';
import styles from '../app/gallery/gallery.module.css';

export default function PhotoCard({ url, onClick }: { url: string; onClick?: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger lightbox
        if (!confirm("Are you sure you want to delete this photo?")) return;

        setIsDeleting(true);
        try {
            await deletePhoto(url);
        } catch (error) {
            console.error(error);
            alert("Failed to delete photo.");
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.photoCard} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <img
                src={url}
                alt="Gallery photo"
                className={styles.image}
                loading="lazy"
            />
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={styles.deleteBtn}
                title="Delete Photo"
            >
                {isDeleting ? '⏳' : '🗑️'}
            </button>
        </div>
    );
}
