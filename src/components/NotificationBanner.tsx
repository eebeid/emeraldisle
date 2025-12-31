import prisma from '@/lib/prisma';
import styles from './NotificationBanner.module.css';

export default async function NotificationBanner() {
    const bannerVisible = await prisma.setting.findUnique({
        where: { key: 'BANNER_VISIBLE' }
    });

    if (bannerVisible?.value !== 'true') return null;

    const bannerMessage = await prisma.setting.findUnique({
        where: { key: 'BANNER_MESSAGE' }
    });

    if (!bannerMessage?.value) return null;

    return (
        <div className={styles.banner}>
            <p className={styles.message}>{bannerMessage.value}</p>
        </div>
    );
}
