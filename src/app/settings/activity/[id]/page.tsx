
import prisma from '@/lib/prisma';
import { updateActivity } from '@/app/actions';
import styles from '@/app/settings/settings.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EditActivityPage({ params }: { params: { id: string } }) {
    const activity = await prisma.activity.findUnique({
        where: { id: params.id }
    });

    if (!activity) {
        redirect('/settings');
    }

    const dateStr = activity.date.toISOString().split('T')[0];
    const timeStr = activity.date.toISOString().split('T')[1].substring(0, 5);

    return (
        <div className={styles.container}>
            <h1>Edit Activity</h1>
            <div className="card">
                <form action={updateActivity.bind(null, activity.id)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input name="title" required defaultValue={activity.title} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Icon (Emoji)</label>
                        <input name="icon" defaultValue={activity.icon || ''} placeholder="e.g. 🚤" style={{ fontSize: '1.2rem' }} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input type="date" name="date" required defaultValue={dateStr} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Time</label>
                            <input type="time" name="time" required defaultValue={timeStr} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea name="description" defaultValue={activity.description || ''} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Location</label>
                            <input name="location" defaultValue={activity.location || ''} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Cost ($)</label>
                            <input type="number" step="0.01" name="cost" defaultValue={activity.cost || 0} />
                        </div>
                        <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                            <label>Venmo Link/Username</label>
                            <input name="venmoLink" defaultValue={activity.venmoLink || ''} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                        <Link href="/settings" className="btn" style={{ border: '1px solid var(--border)', textDecoration: 'none' }}>Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

