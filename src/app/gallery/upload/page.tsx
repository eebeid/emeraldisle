import styles from './upload.module.css';
import { uploadImage } from '../../actions';
import QRCode from 'react-qr-code';

export const dynamic = 'force-dynamic';

export default function UploadPage() {
    // Use environment variable or fallback to custom domain
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ei.blueechostudios.com";
    const uploadUrl = `${baseUrl}/gallery/upload`;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>📸 Upload Photo</h1>
                <p>Share your favorite moments from the trip.</p>

                <div className={styles.qrContainer}>
                    <QRCode value={uploadUrl} size={150} />
                    <p className={styles.qrLabel}>Scan to upload from phone</p>
                </div>

                <form action={uploadImage} className={styles.form}>
                    <div className={styles.uploadBox}>
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            required
                            className={styles.fileInput}
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        Upload Photo
                    </button>
                </form>
            </div>
        </div>
    );
}
