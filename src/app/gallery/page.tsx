import { list } from '@vercel/blob';
import Link from 'next/link';
import styles from './gallery.module.css';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
    let blobs = [];

    try {
        const response = await list();
        blobs = response.blobs;
    } catch (error) {
        console.error("Error fetching blobs (likely missing env var):", error);
        // Fail gracefully if not configured yet
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Photo Gallery</h1>
                <Link href="/gallery/upload" className={styles.uploadBtn}>
                    📸 Upload Photo
                </Link>
            </div>

            {blobs.length === 0 ? (
                <div className={styles.empty}>
                    <p>No photos yet.</p>
                    <p>Be the first to upload!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {blobs.map((blob) => (
                        <div key={blob.url} className={styles.photoCard}>
                            <img
                                src={blob.url}
                                alt="Gallery photo"
                                className={styles.image}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
