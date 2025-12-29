'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';
import QRCode from 'react-qr-code';

export default function UploadPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Use environment variable or fallback to custom domain
    // Note: process.env.NEXT_PUBLIC_APP_URL works in Client Components
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ei.blueechostudios.com";
    const uploadUrl = `${baseUrl}/gallery/upload`;

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
        }

        const file = inputFileRef.current.files[0];
        if (!file) return;

        setIsLoading(true);

        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            // Redirect to gallery to see the new image
            router.push('/gallery');
            router.refresh(); // Refresh Client Router cache
        } catch (error) {
            console.error(error);
            alert('Upload failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>📸 Upload Photo</h1>
                <p>Share your favorite moments from the trip.</p>

                <div className={styles.qrContainer}>
                    <QRCode value={uploadUrl} size={150} />
                    <p className={styles.qrLabel}>Scan to upload from phone</p>
                </div>

                <form onSubmit={handleUpload} className={styles.form}>
                    <div className={styles.uploadBox}>
                        <input
                            ref={inputFileRef}
                            type="file"
                            name="file"
                            accept="image/*"
                            required
                            className={styles.fileInput}
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    {isLoading && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7, textAlign: 'center' }}>
                            Please wait, this may take a moment...
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
