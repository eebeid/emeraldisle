import prisma from '@/lib/prisma';
import styles from './schedule.module.css';
import { signupForActivity, cancelSignup } from '../actions';
import Link from 'next/link';

function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default async function SchedulePage({
    searchParams,
}: {
    searchParams: { user?: string };
}) {
    const userId = searchParams.user;
    const user = userId ? await prisma.person.findUnique({
        where: { id: userId },
        include: {
            signups: { include: { activity: true } }
        }
    }) : null;

    const activities = await prisma.activity.findMany({
        orderBy: { date: 'asc' },
        include: { signups: { include: { person: true } } }
    });

    const people = await prisma.person.findMany({ orderBy: { name: 'asc' } });

    // Calculate totals if user is logged in
    const myActivities = user?.signups.map((s: any) => s.activity) || [];
    const totalCost = myActivities.reduce((sum: number, act: any) => sum + (act.cost || 0), 0);
    const totalActivities = myActivities.length;

    // Group by date
    const grouped = activities.reduce((acc: any, activity: any) => {
        const dateKey = formatDate(activity.date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(activity);
        return acc;
    }, {} as Record<string, typeof activities>);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Trip Schedule</h1>
                {user ? (
                    <div className="card glass" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <strong>Welcome, {user.name}</strong>
                            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>You are attending {totalActivities} activities.</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>${totalCost.toFixed(2)}</div>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Total Estimated Cost</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                        <p>Select your name on the <Link href="/" style={{ textDecoration: 'underline' }}>Home page</Link> to sign up for activities.</p>
                    </div>
                )}
            </header>

            {Object.entries(grouped).length === 0 ? (
                <p className={styles.empty}>No scheduled activities.</p>
            ) : (
                <div className={styles.timeline}>
                    {Object.entries(grouped).map(([date, dayActivities]: [string, any]) => (
                        <div key={date} className={styles.dayBlock}>
                            <div className={styles.dateHeader}>
                                <h2>{date}</h2>
                            </div>
                            <div className={styles.events}>
                                {dayActivities.map((activity: any) => {
                                    const isSignedUp = user ? activity.signups.some((s: any) => s.personId === userId) : false;

                                    return (
                                        <div key={activity.id} className={`${styles.event} card ${isSignedUp ? styles.signedUp : ''}`}>
                                            <div className={styles.timeSection}>
                                                <div className={styles.time}>{formatTime(activity.date)}</div>
                                                {activity.cost ? <div className={styles.costBadge}>${activity.cost}</div> : null}
                                            </div>

                                            <div className={styles.content}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <h3>{activity.icon} {activity.title}</h3>
                                                    {user && (
                                                        <form action={async () => {
                                                            'use server';
                                                            if (!userId) return;
                                                            if (isSignedUp) {
                                                                await cancelSignup(activity.id, userId);
                                                            } else {
                                                                await signupForActivity(activity.id, userId);
                                                            }
                                                        }}>
                                                            <button
                                                                className={`btn ${isSignedUp ? styles.secondaryBtn : 'btn-primary'}`}
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                            >
                                                                {isSignedUp ? '✅ Attending' : 'Join'}
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>

                                                {activity.location && <p className={styles.location}>📍 {activity.location}</p>}
                                                {activity.description && <p className={styles.desc}>{activity.description}</p>}

                                                <div className={styles.footerInfo}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        <span>👥 {activity.signups.length} going</span>
                                                        {activity.venmoLink && (
                                                            <a href={activity.venmoLink} target="_blank" rel="noopener noreferrer" className={styles.venmoLink}>
                                                                💸 Pay via Venmo
                                                            </a>
                                                        )}
                                                    </div>
                                                    {activity.signups.length > 0 && (
                                                        <div className={styles.attendees}>
                                                            {activity.signups.map((s: any) => s.person.name).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activities.length > 0 && (
                <div className={styles.chartContainer}>
                    <h2 className={styles.chartTitle}>Attendance Overview</h2>
                    <div className={styles.chart}>
                        {(() => {
                            const maxAttendees = Math.max(...activities.map((a: any) => a.signups.length), 1);

                            // Sort by most attended, then chronologically
                            const chartData = [...activities]
                                .sort((a: any, b: any) => b.signups.length - a.signups.length || new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((a: any) => ({
                                    title: a.title,
                                    count: a.signups.length,
                                    percent: (a.signups.length / maxAttendees) * 100
                                }));

                            return chartData.map((item: any, idx: number) => (
                                <div key={idx} className={styles.chartRow}>
                                    <div className={styles.chartLabel} title={item.title}>{item.title}</div>
                                    <div className={styles.chartBarContainer}>
                                        <div
                                            className={styles.chartBar}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                    <div className={styles.chartValue}>{item.count}</div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}

            {/* Person Presence Timeline */}
            <div className={styles.chartContainer} style={{ marginTop: '4rem' }}>
                <h2 className={styles.chartTitle}>Who's In Town</h2>
                <div className={styles.chart}>
                    {(() => {
                        // 1. Calculate trip boundaries (Dec 26 - Jan 2 default, or derive)
                        const startTrip = new Date("2025-12-26T00:00:00");
                        const endTrip = new Date("2026-01-02T23:59:59");
                        const totalDuration = endTrip.getTime() - startTrip.getTime();

                        function parseDates(dateStr: string | null) {
                            if (!dateStr) return { start: startTrip, end: endTrip };
                            try {
                                const parts = dateStr.split('-').map((s: string) => s.trim());
                                if (parts.length !== 2) return { start: startTrip, end: endTrip };

                                const startStr = parts[0] + ", 2025";
                                let endYear = "2026";
                                // If end month is December, assume same year? Unlikely for this specific trip
                                const endStr = parts[1] + ", " + endYear;

                                const s = new Date(startStr);
                                const e = new Date(endStr);
                                // Set times to boundary
                                s.setHours(12, 0, 0, 0);
                                e.setHours(12, 0, 0, 0);
                                return { start: s, end: e };
                            } catch (e) {
                                return { start: startTrip, end: endTrip };
                            }
                        }

                        // 2. Map people to start/end percentages relative to trip duration
                        const peopleData = people.map((p: any) => {
                            const { start, end } = parseDates(p.dates);
                            const startOffset = Math.max(0, start.getTime() - startTrip.getTime());
                            const duration = Math.min(totalDuration - startOffset, end.getTime() - start.getTime());

                            const left = (startOffset / totalDuration) * 100;
                            const width = (duration / totalDuration) * 100;

                            return { name: p.name, left, width };
                        }).sort((a: any, b: any) => a.name.localeCompare(b.name));

                        return peopleData.map((p: any, idx: number) => (
                            <div key={idx} className={styles.chartRow}>
                                <div className={styles.chartLabel} title={p.name}>{p.name}</div>
                                <div className={styles.chartBarContainer} style={{ position: 'relative', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                    <div
                                        className={styles.chartBar}
                                        style={{
                                            position: 'absolute',
                                            left: `${p.left}%`,
                                            width: `${p.width}%`,
                                            backgroundColor: '#10b981', // Emerald green
                                            background: '#10b981',
                                            opacity: 0.8
                                        }}
                                        title={`${p.name}`}
                                    />
                                </div>
                                <div className={styles.chartValue} style={{ opacity: 0 }}>.</div>
                            </div>
                        ));
                    })()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.5, paddingLeft: '200px', paddingRight: '40px' }}>
                    <span>Dec 26</span>
                    <span>Jan 2</span>
                </div>
            </div>
        </div>
    );
}
