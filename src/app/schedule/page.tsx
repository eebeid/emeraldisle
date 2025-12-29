import prisma from '@/lib/prisma';
import styles from './schedule.module.css';
import { signupForActivity, cancelSignup } from '../actions';
import { getTwoweekWeather, getWeatherIcon } from '@/lib/weather';
import Link from 'next/link';
import SignupWizard from '../../components/SignupWizard';

export const dynamic = 'force-dynamic';

import { toZonedTime } from 'date-fns-tz';

const NY_TIMEZONE = 'America/New_York';

function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: NY_TIMEZONE
    });
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: NY_TIMEZONE
    });
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
        where: {
            date: {
                gte: new Date()
            }
        },
        orderBy: { date: 'asc' },
        include: { signups: { include: { person: true } } }
    });

    const weatherData = await getTwoweekWeather();
    const weatherMap = new Map<string, { max: number; min: number; icon: string }>();

    if (weatherData && weatherData.daily) {
        weatherData.daily.time.forEach((t: string, i: number) => {
            const d = new Date(t + 'T12:00:00');
            const dateKey = formatDate(d);
            weatherMap.set(dateKey, {
                max: Math.round(weatherData.daily.temperature_2m_max[i]),
                min: Math.round(weatherData.daily.temperature_2m_min[i]),
                icon: getWeatherIcon(weatherData.daily.weathercode[i])
            });
        });
    }

    const people = await prisma.person.findMany({ orderBy: { name: 'asc' } });

    const myActivities = user?.signups.map((s: any) => s.activity) || [];
    const totalCost = myActivities.reduce((sum: number, act: any) => sum + (act.cost || 0), 0);
    const totalActivities = myActivities.length;

    const grouped = activities.reduce((acc: any, activity: any) => {
        const dateKey = formatDate(activity.date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(activity);
        return acc;
    }, {} as Record<string, typeof activities>);

    // Calculate unsigned future activities for the wizard
    const now = new Date();
    const futureActivities = activities.filter((a: any) => new Date(a.date) > now);
    const unsignedActivities = user
        ? futureActivities.filter((a: any) => !user.signups.some((s: any) => s.activityId === a.id))
        : [];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Trip Schedule</h1>

                {user && unsignedActivities.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <SignupWizard userId={user.id} activities={unsignedActivities} />
                    </div>
                )}

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
                    <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', color: '#92400e' }}>
                        <p style={{ fontWeight: 500 }}>⚠️ You are not signed within a valid session.</p>
                        <p style={{ marginTop: '0.5rem' }}>Please go to the <Link href="/" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Home page</Link> and select your name again to sign up for activities.</p>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <h2>{date}</h2>
                                    {weatherMap.get(date) && (
                                        <div className="weather-badge" style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.7)', padding: '0.3rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                            <span style={{ fontSize: '1.4rem' }}>{weatherMap.get(date)?.icon}</span>
                                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                                <span style={{ fontWeight: 'bold' }}>{weatherMap.get(date)?.max}°</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{weatherMap.get(date)?.min}°</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.events}>
                                {dayActivities.map((activity: any) => {
                                    const isSignedUp = user ? activity.signups.some((s: any) => s.personId === userId) : false;
                                    const isPast = new Date(activity.date) < new Date();

                                    return (
                                        <div id={activity.id} key={activity.id} className={`${styles.event} card ${isSignedUp ? styles.signedUp : ''} ${isPast ? styles.past : styles.future}`}>
                                            <div className={styles.timeSection}>
                                                <div className={styles.time}>{formatTime(activity.date)}</div>
                                                {activity.cost ? <div className={styles.costBadge}>${activity.cost}</div> : null}
                                            </div>

                                            <div className={styles.content}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <h3>{activity.icon} {activity.title}</h3>
                                                    {user ? (
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
                                                    ) : (
                                                        <Link
                                                            href="/"
                                                            style={{
                                                                padding: '0.4rem 0.8rem',
                                                                fontSize: '0.8rem',
                                                                borderRadius: '0.5rem',
                                                                background: 'rgba(255,255,255,0.1)',
                                                                border: '1px solid rgba(255,255,255,0.2)',
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                opacity: 0.8
                                                            }}
                                                        >
                                                            Log in to Join
                                                        </Link>
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
                            const totalPeopleCount = people.length || 1;

                            const chartData = [...activities]
                                .sort((a: any, b: any) => b.signups.length - a.signups.length || new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((a: any) => ({
                                    title: a.title,
                                    count: a.signups.length,
                                    percent: (a.signups.length / totalPeopleCount) * 100
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
                                    <div className={styles.chartValue} style={{ minWidth: '40px' }}>{item.count}/{totalPeopleCount}</div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            )}

            <div className={styles.chartContainer} style={{ marginTop: '4rem' }}>
                <h2 className={styles.chartTitle}>Who's In Town</h2>
                <div className={styles.chart}>
                    {(() => {
                        const startTrip = new Date("2025-12-26T00:00:00");
                        const endTrip = new Date("2026-01-02T23:59:59");
                        const totalDuration = endTrip.getTime() - startTrip.getTime();

                        const peopleData = people.map((p: any) => {
                            const start = p.startDate ? new Date(p.startDate) : startTrip;
                            const end = p.endDate ? new Date(p.endDate) : endTrip;

                            const sTime = !isNaN(start.getTime()) ? start.getTime() : startTrip.getTime();
                            const eTime = !isNaN(end.getTime()) ? end.getTime() : endTrip.getTime();

                            const startOffset = Math.max(0, sTime - startTrip.getTime());
                            const duration = Math.min(totalDuration - startOffset, eTime - sTime);

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
                                            backgroundColor: '#10b981',
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
