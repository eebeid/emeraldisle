'use client';

import { useState } from 'react';
import styles from '../app/schedule/wizard.module.css';
import { signupForActivity } from '../app/actions';

interface Activity {
    id: string;
    title: string;
    date: Date;
    description: string | null;
    location: string | null;
    cost: number | null;
    icon: string | null;
}

interface SignupWizardProps {
    userId: string;
    activities: Activity[];
}

export default function SignupWizard({ userId, activities }: SignupWizardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isJoining, setIsJoining] = useState(false);

    if (activities.length === 0) return null;

    const currentActivity = activities[currentIndex];

    const handleStart = () => {
        setIsOpen(true);
        setCurrentIndex(0);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSkip = () => {
        if (currentIndex < activities.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleClose();
        }
    };

    const handleJoin = async () => {
        if (!currentActivity) return;
        setIsJoining(true);
        try {
            await signupForActivity(currentActivity.id, userId);
            // Do not manually skip; the list update from parent will shift the next item into this index.
        } catch (error) {
            console.error(error);
            alert("Failed to join. Please try again.");
        } finally {
            setIsJoining(false);
        }
    };

    // Formatting helper (simplified for client)
    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'America/New_York'
        });
    };

    return (
        <>
            <button
                onClick={handleStart}
                className="btn btn-primary"
                style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                }}
            >
                ✨ Quick Signup Wizard ({activities.length})
            </button>

            {isOpen && currentActivity && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeBtn} onClick={handleClose}>
                            ✕
                        </button>

                        <div className={styles.header}>
                            <h2 className={styles.title}>Signup Wizard</h2>
                            <span className={styles.progress}>
                                {currentIndex + 1} of {activities.length}
                            </span>
                        </div>

                        <div className={styles.activityCard}>
                            <div className={styles.activityHeader}>
                                <div className={styles.icon}>{currentActivity.icon || '📅'}</div>
                                <div className={styles.details}>
                                    <div className={styles.activityTitle}>{currentActivity.title}</div>
                                    <div className={styles.activityMeta}>
                                        {formatTime(currentActivity.date)}
                                        {currentActivity.location && ` • ${currentActivity.location}`}
                                    </div>
                                    {(currentActivity.cost || 0) > 0 && (
                                        <div style={{ color: '#fbbf24', fontWeight: 'bold', marginTop: '0.2rem' }}>
                                            ${currentActivity.cost}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {currentActivity.description && (
                                <p style={{ opacity: 0.8, lineHeight: 1.4 }}>{currentActivity.description}</p>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.btnSkip} onClick={handleSkip}>
                                Skip
                            </button>
                            <button className={styles.btnJoin} onClick={handleJoin} disabled={isJoining}>
                                {isJoining ? 'Joining...' : 'Yes, count me in!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
