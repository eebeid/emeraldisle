
import prisma from '@/lib/prisma';
import { updatePerson } from '@/app/actions';
import styles from '@/app/settings/settings.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EditPersonPage({ params }: { params: { id: string } }) {
    const person = await prisma.person.findUnique({
        where: { id: params.id },
        include: { address: true }
    });

    const addresses = await prisma.address.findMany({ orderBy: { name: 'asc' } });

    if (!person) {
        redirect('/settings');
    }

    return (
        <div className={styles.container}>
            <h1>Edit Person</h1>
            <div className="card">
                <form action={updatePerson.bind(null, person.id)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input name="name" required defaultValue={person.name} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input name="phoneNumber" defaultValue={person.phoneNumber || ''} placeholder="e.g. 555-123-4567" />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Start Date</label>
                            <input type="date" name="startDate" defaultValue={person.startDate ? new Date(person.startDate).toISOString().split('T')[0] : ''} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>End Date</label>
                            <input type="date" name="endDate" defaultValue={person.endDate ? new Date(person.endDate).toISOString().split('T')[0] : ''} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <select name="addressId" defaultValue={person.addressId || ''}>
                            <option value="">-- No Address --</option>
                            {addresses.map((addr: any) => (
                                <option key={addr.id} value={addr.id}>
                                    {addr.name} ({addr.fullAddress})
                                </option>
                            ))}
                        </select>
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
