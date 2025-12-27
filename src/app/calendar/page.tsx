import prisma from '@/lib/prisma';
import styles from './calendar.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getDaysInMonth(year: number, month: number) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

function generateCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const d = new Date(year, month, 1 - (firstDay.getDay() - i));
        days.push({ date: d, isCurrentMonth: false });
    }

    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    return days;
}

export default async function CalendarPage() {
    const activities = await prisma.activity.findMany({
        orderBy: { date: 'asc' }
    });

    const eventsByDate = activities.reduce((acc: any, act: any) => {
        const key = act.date.toDateString(); // "Fri Dec 26 2025"
        if (!acc[key]) acc[key] = [];
        acc[key].push(act);
        return acc;
    }, {});

    // Generate December 2025 and January 2026
    const decDays = generateCalendarDays(2025, 11); // Month is 0-indexed
    const janDays = generateCalendarDays(2026, 0);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderMonth = (title: string, days: any[]) => (
        <>
            <h2 className={styles.monthTitle}>{title}</h2>
            {weekDays.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
            {days.map((d, idx) => {
                const dateKey = d.date.toDateString();
                const dayEvents = eventsByDate[dateKey] || [];

                return (
                    <div key={idx} className={`${styles.dayCell} ${d.isCurrentMonth ? styles.currentMonth : styles.otherMonth}`}>
                        <div className={styles.dateNumber}>{d.date.getDate()}</div>
                        {dayEvents.map((evt: any) => (
                            <Link key={evt.id} href="/schedule" className={styles.event}>
                                {evt.icon} {evt.title} ({evt.date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })})
                            </Link>
                        ))}
                    </div>
                );
            })}
        </>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Activity Calendar</h1>
                <p>Overview of all planned events.</p>
            </div>

            <div className={styles.calendarGrid}>
                {renderMonth("December 2025", decDays)}
            </div>

            <div className={styles.calendarGrid}>
                {renderMonth("January 2026", janDays)}
            </div>
        </div>
    );
}
