import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendSMS } from '@/lib/twilio';
import { addMinutes, differenceInMinutes, isBefore } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export const dynamic = 'force-dynamic'; // Prevent caching

const NY_TIMEZONE = 'America/New_York';

export async function GET(request: Request) {
    // 1. Authenticate the Cron Job (Optional but recommended for Prod)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse('Unauthorized', { status: 401 });
    // }

    console.log("🔔 Cron: Checking for reminders...");

    try {
        const now = new Date();
        const checkWindowEnd = addMinutes(now, 70); // Look ahead ~1 hour + buffer

        // 2. Find upcoming activities
        const upcomingActivities = await prisma.activity.findMany({
            where: {
                date: {
                    gte: now,
                    lte: checkWindowEnd
                }
            },
            include: {
                signups: {
                    where: { status: 'CONFIRMED' },
                    include: { person: true }
                }
            }
        });

        const logs: string[] = [];

        for (const activity of upcomingActivities) {
            const minutesUntilStart = differenceInMinutes(activity.date, now);
            let reminderType: string | null = null;

            // 3. Determine if we should send a reminder
            // Logic: Check if we are within a 5-minute window of the target time
            // and haven't sent it yet.

            if (minutesUntilStart >= 55 && minutesUntilStart <= 65) {
                reminderType = '60m';
            } else if (minutesUntilStart >= 25 && minutesUntilStart <= 35) {
                reminderType = '30m';
            } else if (minutesUntilStart >= 10 && minutesUntilStart <= 20) {
                reminderType = '15m';
            }

            if (reminderType && !activity.remindersSent.includes(reminderType)) {
                console.log(`🚀 Sending ${reminderType} reminder for: ${activity.title}`);

                // 4. Send Messages
                const message = `⏰ Reminder: ${activity.title} starts in ~${minutesUntilStart} mins! Location: ${activity.location || 'See App'}.`;

                let sentCount = 0;
                for (const signup of activity.signups) {
                    const prefs = signup.person.reminderPreferences;
                    // Check if person has opted into this reminder type
                    if (signup.person.phoneNumber && prefs && prefs.includes(reminderType)) {
                        await sendSMS(signup.person.phoneNumber, message);
                        sentCount++;
                    }
                }

                // 5. Update Database
                await prisma.activity.update({
                    where: { id: activity.id },
                    data: {
                        remindersSent: {
                            push: reminderType
                        }
                    }
                });

                logs.push(`Sent ${reminderType} reminder for "${activity.title}" to ${sentCount} people.`);
            }
        }

        if (logs.length === 0) {
            console.log("No reminders to send right now.");
            return NextResponse.json({ message: 'No reminders needed.', now: now.toISOString() });
        }

        return NextResponse.json({ success: true, logs });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
