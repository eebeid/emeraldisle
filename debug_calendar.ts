const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NY_TIMEZONE = 'America/New_York';

async function main() {
    console.log("Fetching activities...");
    const activities = await prisma.activity.findMany({
        orderBy: { date: 'asc' }
    });
    console.log(`Found ${activities.length} activities.`);

    if (activities.length > 0) {
        console.log("First activity date (UTC):", activities[0].date);
        console.log("First activity date (ISO):", activities[0].date.toISOString());
    }

    const eventsByDate = activities.reduce((acc, act) => {
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

    console.log("\nEvents By Date Keys:", Object.keys(eventsByDate));

    // Replica of getTripDays
    const tripDays = [];
    const startDate = new Date(2025, 11, 27); // Dec 27 2025
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        tripDays.push(d);
    }

    console.log("\nTrip Days Keys:");
    tripDays.forEach(date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        const matchCount = (eventsByDate[dateKey] || []).length;
        console.log(`Key: ${dateKey} - Matches: ${matchCount}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
