'use client';

import { useState } from 'react';
import { deletePhoto } from '../app/actions';
import styles from '../app/gallery/gallery.module.css';

export default function PhotoCard({ url }: { url: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
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
        <div className={styles.photoCard}>
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
