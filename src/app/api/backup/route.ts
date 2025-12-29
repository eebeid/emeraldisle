import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const people = await prisma.person.findMany({
            orderBy: { name: 'asc' },
            include: {
                address: true,
                signups: {
                    include: {
                        activity: true
                    }
                }
            }
        });

        // CSV Header
        let csv = 'Name,Phone,Address,Start Date,End Date,Signed Up Activities\n';

        // CSV Rows
        for (const person of people) {
            const startDate = person.startDate ? new Date(person.startDate).toLocaleDateString() : '';
            const endDate = person.endDate ? new Date(person.endDate).toLocaleDateString() : '';
            const address = person.address ? person.address.fullAddress.replace(/,/g, ' ') : '';
            const phone = person.phoneNumber || '';

            // Format activities as a semicolon-separated list to avoid breaking CSV format
            const activities = person.signups
                .map(s => `${s.activity.title} (${new Date(s.activity.date).toLocaleString('en-US', { timeZone: 'America/New_York' })})`)
                .join('; ');

            // Escape quotes in name/activities just in case
            const safeName = `"${person.name.replace(/"/g, '""')}"`;
            const safeActivities = `"${activities.replace(/"/g, '""')}"`;

            csv += `${safeName},${phone},${address},${startDate},${endDate},${safeActivities}\n`;
        }

        // Return CSV file
        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="emerald_isle_backup_${new Date().toISOString().split('T')[0]}.csv"`
            }
        });

    } catch (error) {
        console.error("Backup Error:", error);
        return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
    }
}
