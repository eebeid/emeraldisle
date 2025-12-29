import prisma from '@/lib/prisma';
import styles from './settings.module.css';
import { createActivity, deleteActivity, createPerson, deletePerson } from '../actions';
import Link from 'next/link';
import TimePicker from '@/components/TimePicker';
import RestoreBackup from '@/components/RestoreBackup';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({
    searchParams
}: {
    searchParams: { success?: string }
}) {
    const activities = await prisma.activity.findMany({ orderBy: { date: 'asc' } });
    const people = await prisma.person.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className={styles.container}>
            <h1>Settings</h1>
            {searchParams?.success && (
                <div style={{
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    color: '#166534',
                    borderRadius: '8px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    ✅ {searchParams.success}
                </div>
            )}


            <section className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Data Management</h2>
                <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                    Download a full backup of all people, addresses, and activity signups locally.
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href="/api/backup" download className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        💾 Download Backup CSV
                    </a>
                    <RestoreBackup />
                </div>
            </section>

            <div className={styles.grid}>
                <section className="card">
                    <h2>Add Activity</h2>
                    <form action={createActivity} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input name="title" required placeholder="e.g. Boat Day" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Icon (Emoji)</label>
                            <input name="icon" placeholder="e.g. 🚤" style={{ fontSize: '1.2rem' }} />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Date</label>
                                <input type="date" name="date" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Time</label>
                                <TimePicker name="time" />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea name="description" placeholder="Optional details..." />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Location</label>
                                <input name="location" placeholder="e.g. Marina" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Cost ($)</label>
                                <input type="number" step="0.01" name="cost" placeholder="0.00" />
                            </div>
                            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                <label>Venmo Link/Username</label>
                                <input name="venmoLink" placeholder="e.g. https://venmo.com/..." />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Create Activity</button>
                    </form>
                </section>

                <section className="card">
                    <h2>Add Person</h2>
                    <form action={createPerson} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input name="name" required placeholder="Name" />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Start Date</label>
                                <input type="date" name="startDate" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>End Date</label>
                                <input type="date" name="endDate" />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone Number</label>
                            <input name="phoneNumber" placeholder="e.g. 555-123-4567" />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Person</button>
                    </form>

                    <div className={styles.list} style={{ marginTop: '1rem' }}>
                        <h3>Existing People</h3>
                        <ul>
                            {people.map((p: any) => (
                                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span>{p.name}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/settings/person/${p.id}`} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', border: '1px solid var(--border)', textDecoration: 'none' }}>Edit</Link>
                                        <form action={async () => {
                                            'use server';
                                            await deletePerson(p.id);
                                        }}>
                                            <button type="submit" className={styles.deleteBtn} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                                        </form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            <section className="card" style={{ marginTop: '2rem' }}>
                <h2>Manage Activities</h2>
                <div className={styles.activityList}>
                    {activities.map((a: any) => (
                        <div key={a.id} className={styles.activityItem}>
                            <div>
                                <strong style={{ fontSize: '1.1rem' }}>{a.icon} {a.title}</strong>
                                <span className={styles.date}>{new Date(a.date).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <a href={`/settings/activity/${a.id}`} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', border: '1px solid var(--border)', textDecoration: 'none' }}>Edit</a>
                                <form action={async () => {
                                    'use server';
                                    await deleteActivity(a.id);
                                }}>
                                    <button type="submit" className={styles.deleteBtn}>Delete</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
