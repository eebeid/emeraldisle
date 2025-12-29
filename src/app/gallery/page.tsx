import { list } from '@vercel/blob';
import Link from 'next/link';
import styles from './gallery.module.css';
import GalleryGrid from '../../components/GalleryGrid';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
    let blobs: any[] = [];

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
                <GalleryGrid blobs={blobs} />
            )}
        </div>
    );
}
