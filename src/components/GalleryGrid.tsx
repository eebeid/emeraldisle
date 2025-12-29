'use client';

import { useState } from 'react';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import styles from '../app/gallery/gallery.module.css';

interface GalleryGridProps {
    blobs: { url: string }[];
}

export default function GalleryGrid({ blobs }: GalleryGridProps) {
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    return (
        <>
            <div className={styles.grid}>
                {blobs.map((blob) => (
                    <PhotoCard
                        key={blob.url}
                        url={blob.url}
                        onClick={() => setSelectedUrl(blob.url)}
                    />
                ))}
            </div>

            {selectedUrl && (
                <Lightbox
                    url={selectedUrl}
                    onClose={() => setSelectedUrl(null)}
                />
            )}
        </>
    );
}
