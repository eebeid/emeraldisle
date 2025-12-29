import prisma from '@/lib/prisma';
import styles from './calendar.module.css';
import Link from 'next/link';
import { toZonedTime } from 'date-fns-tz';

export const dynamic = 'force-dynamic';

const NY_TIMEZONE = 'America/New_York';

function getTripDays() {
    const days = [];
    const startDate = new Date(2025, 11, 27); // Dec 27, 2025

    // Trip is 7 days: Dec 27 - Jan 2
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        days.push(d);
    }
    return days;
}

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: { user?: string };
}) {
    const userId = searchParams.user;

    const activities = await prisma.activity.findMany({
        orderBy: { date: 'asc' }
    });

    const eventsByDate = activities.reduce((acc: any, act: any) => {
        // Robustly generating YYYY-MM-DD key using NY Timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: NY_TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const parts = formatter.formatToParts(act.date);
        const y = parts.find(p => p.type === 'year')?.value;
        const m = parts.find(p => p.type === 'month')?.value;
        const d = parts.find(p => p.type === 'day')?.value;

        const isoKey = `${y}-${m}-${d}`;

        if (!acc[isoKey]) acc[isoKey] = [];
        acc[isoKey].push(act);
        return acc;
    }, {});

    const tripDays = getTripDays();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Trip Calendar</h1>
                <p>Week of December 27th - January 2nd</p>
                {userId && (
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Viewing as <Link href={`/schedule?user=${userId}`} style={{ textDecoration: 'underline' }}>User {userId.split('-')[0]}...</Link>
                    </p>
                )}
            </div>

            <div className={styles.calendarGrid}>
                {tripDays.map((date, idx) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateKey = `${year}-${month}-${day}`;

                    const dayEvents = eventsByDate[dateKey] || [];
                    const dayName = weekDays[date.getDay()];
                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                        <div key={idx} className={styles.dayCell} style={{ minHeight: '150px' }}>
                            <div className={styles.dayName} style={{ textAlign: 'left', paddingLeft: 0, color: 'var(--primary)' }}>
                                {dayName} <span style={{ color: 'var(--foreground)', opacity: 0.6 }}>{monthDay}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {dayEvents.map((evt: any) => {
                                    const isPast = new Date(evt.date) < new Date();
                                    const linkHref = `/schedule?${userId ? `user=${userId}&` : ''}highlight=${evt.id}#${evt.id}`;

                                    return (
                                        <Link key={evt.id} href={linkHref} className={styles.event}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{evt.icon} {evt.title}</span>

                                                <span style={{ opacity: 0.8, fontSize: '0.7rem' }}>
                                                    {evt.date.toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        timeZone: NY_TIMEZONE
                                                    })}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {dayEvents.length === 0 && (
                                    <div style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic', padding: '0.5rem' }}>
                                        No planned activities
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
