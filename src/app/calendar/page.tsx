import prisma from '@/lib/prisma';
import styles from './calendar.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

export default async function CalendarPage() {
    const activities = await prisma.activity.findMany({
        orderBy: { date: 'asc' }
    });

    const eventsByDate = activities.reduce((acc: any, act: any) => {
        const key = act.date.toDateString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(act);
        return acc;
    }, {});

    const tripDays = getTripDays();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Trip Calendar</h1>
                <p>Week of December 27th - January 2nd</p>
            </div>

            <div className={styles.calendarGrid}>
                {tripDays.map((date, idx) => {
                    const dateKey = date.toDateString();
                    const dayEvents = eventsByDate[dateKey] || [];
                    const dayName = weekDays[date.getDay()];
                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    // Highlight if it is New Year's Eve or Day
                    const isHoliday = date.getMonth() === 0 && date.getDate() === 1 || date.getMonth() === 11 && date.getDate() === 31;

                    return (
                        <div key={idx} className={`${styles.dayCell} ${isHoliday ? styles.currentMonth : ''}`} style={{ minHeight: '150px' }}>
                            <div className={styles.dayName} style={{ textAlign: 'left', paddingLeft: 0, color: 'var(--primary)' }}>
                                {dayName} <span style={{ color: 'var(--foreground)', opacity: 0.6 }}>{monthDay}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {dayEvents.map((evt: any) => (
                                    <Link key={evt.id} href="/schedule" className={styles.event}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{evt.icon} {evt.title}</span>
                                            <span style={{ opacity: 0.8, fontSize: '0.7rem' }}>
                                                {evt.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
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
