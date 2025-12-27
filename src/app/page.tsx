import prisma from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const people = await prisma.person.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Welcome to Emerald Isle '25 🌊</h1>
        <p className={styles.subtitle}>
          Your guide to the best week of the year.
        </p>
      </header>

      <section className={styles.section + ' glass'}>
        <h2>Who are you?</h2>
        <p>Select your name to get started.</p>
        <div className={styles.grid}>
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/schedule?user=${person.id}`}
              className={styles.card}
            >
              <span className={styles.name}>{person.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.info}>
        <div className="card">
          <h3>📅 Trip Dates</h3>
          <p>Dec 27 - Jan 2</p>
        </div>
        <div className="card">
          <h3>📍 Location</h3>
          <p>Emerald Isle, NC</p>
        </div>
      </section>
    </div>
  );
}
