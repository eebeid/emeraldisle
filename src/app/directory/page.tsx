import prisma from '@/lib/prisma';
import styles from './directory.module.css';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage() {
    const people = await prisma.person.findMany({
        orderBy: { name: 'asc' },
        include: { address: true }
    });
    const addresses = await prisma.address.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className={styles.container}>
            <h1>Directory</h1>

            <section>
                <h2 className={styles.sectionTitle}>People</h2>
                <div className={styles.grid}>
                    {people.map((person: any) => (
                        <div key={person.id} className="card">
                            <h3>{person.name}</h3>
                            <p className={styles.dates}>
                                🗓 {person.startDate && person.endDate
                                    ? `${new Date(person.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(person.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                    : 'Dates not set'}
                            </p>
                            {person.address && (
                                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                                    📍 <a href={`https://maps.google.com/?q=${encodeURIComponent(person.address.fullAddress)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                                        {person.address.name}
                                    </a>
                                </p>
                            )}
                            {person.phoneNumber && <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>📞 <a href={`tel:${person.phoneNumber}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{person.phoneNumber}</a></p>}
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className={styles.sectionTitle}>Houses</h2>
                <div className={styles.grid}>
                    {addresses.map((addr: any) => (
                        <div key={addr.id} className="card">
                            <h3>{addr.name}</h3>
                            <p className={styles.address}>📍 <a href={`https://maps.google.com/?q=${encodeURIComponent(addr.fullAddress)}`} target="_blank" rel="noopener noreferrer">{addr.fullAddress}</a></p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
