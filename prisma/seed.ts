// prisma/seed.ts
// @ts-nocheck
const { PrismaClient } = require('@prisma/client')
const { fromZonedTime } = require('date-fns-tz');

const prisma = new PrismaClient()

async function main() {
    console.log("Resetting Directory Data...")

    // Clear everything
    await prisma.signup.deleteMany({})
    await prisma.person.deleteMany({})
    await prisma.activity.deleteMany({})
    await prisma.address.deleteMany({})

    const manualData = [
        { name: "Brendan", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Shana", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Killian", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Tia", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Mel", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Edmond", startDate: "2025-12-27", endDate: "2026-01-02", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Austin", startDate: "2025-12-27", endDate: "2026-01-02", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Eli", startDate: "2025-12-27", endDate: "2026-01-02", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Amy", startDate: "2025-12-27", endDate: "2026-01-02", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Neal", startDate: "2025-12-27", endDate: "2026-01-02", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Stacey", startDate: "2025-12-27", endDate: "2026-01-02", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Berkleigh", startDate: "2025-12-27", endDate: "2026-01-02", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Braxten", startDate: "2025-12-27", endDate: "2026-01-02", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Kyle", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Rebecca ", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Madison", startDate: "2025-12-26", endDate: "2026-01-28", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Kaelan", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Kennedy", startDate: "2025-12-27", endDate: "2026-01-02", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Jim", startDate: "2025-12-29", endDate: "2026-01-02", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Becky ", startDate: "2025-12-29", endDate: "2026-01-02", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Matthew", startDate: "2025-12-29", endDate: "2026-01-02", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Declan", startDate: "2025-12-29", endDate: "2026-01-02", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Gavin", startDate: "2025-12-29", endDate: "2026-01-02", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Ava", startDate: "2025-12-29", endDate: "2026-01-02", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Grace", startDate: "2025-12-28", endDate: "2026-01-02", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
    ];

    console.log("Seeding People...");
    for (const p of manualData) {
        const name = p.name.trim();
        const addressName = p.address.trim();

        // Ensure Address exists
        let addr = await prisma.address.findFirst({
            where: { fullAddress: addressName }
        });

        if (!addr) {
            addr = await prisma.address.create({
                data: {
                    name: addressName,
                    fullAddress: addressName
                }
            });
        }

        // Create Person
        await prisma.person.create({
            data: {
                name: name,
                startDate: new Date(p.startDate),
                endDate: new Date(p.endDate),
                addressId: addr.id
            }
        });
    }

    console.log("Seeding Activities...");

    // Data scraped from production site (Step 401)
    const productionActivities = [
        { dateHeader: "Saturday, December 27", time: "7:00 PM", title: "🍕 Michael Angelo's Pizza", cost: "$15", location: "Michael Angelo's Pizza", description: "Dinner" },
        { dateHeader: "Sunday, December 28", time: "2:30 PM", title: "⛳️ Golf Star Hill", cost: "$45", location: "Star Hill Golf Club", description: "Tee Time" },
        { dateHeader: "Sunday, December 28", time: "5:00 PM", title: "🏀 GMU Basketball Game", cost: null, location: "Dunescrest - East", description: "Watch Party @ 9257 Ocean Dr, Emerald Isle, NC 2859" },
        { dateHeader: "Sunday, December 28", time: "7:30 PM", title: "🎂 Neal's Birthday", cost: null, location: "Dunescrest - West", description: "Celebration @ 9257 Ocean Dr, Emerald Isle, NC 2859" },
        { dateHeader: "Monday, December 29", time: "12:30 PM", title: "⛳️ Golf Star Hill", cost: "$75", location: "Star Hill Golf Club", description: "Round 2" },
        { dateHeader: "Monday, December 29", time: "1:00 PM", title: "🎬 Movie (House Maid)", cost: "$11", location: "Emerald Plantation Cinema", description: "Cinema Trip" },
        { dateHeader: "Monday, December 29", time: "1:15 PM", title: "Movie (Anacanda)", cost: "$12", location: "Emerald Plantation", description: "" },
        { dateHeader: "Monday, December 29", time: "2:30 PM", title: "📚 Book Store", cost: null, location: "Emerald Isle Books", description: "Browsing" },
        { dateHeader: "Monday, December 29", time: "7:00 PM", title: "🥩 🦞 🍤 CaribSea", cost: null, location: "CaribSea", description: "https://caribsearestaurant.com/menu/" },
        { dateHeader: "Tuesday, December 30", time: "3:00 PM", title: "🔐 Escape Room", cost: "$30", location: "Cracked It!", description: "Can we escape?" },
        { dateHeader: "Tuesday, December 30", time: "5:30 PM", title: "🛍️ Jacksonville Shopping", cost: null, location: "Local Shops", description: "Local shops" },
        { dateHeader: "Tuesday, December 30", time: "6:30 PM", title: "🌮 Mexican Dinner In Town TBD", cost: null, location: "TBD", description: "Group Dinner" },
        { dateHeader: "Tuesday, December 30", time: "7:00 PM", title: "🎵 Music Night", cost: null, location: "Main House", description: "Jam Session / Listening" },
        { dateHeader: "Tuesday, December 30", time: "9:09 PM", title: "Sky Lanterns", cost: null, location: "", description: "" },
        { dateHeader: "Wednesday, December 31", time: "9:00 AM", title: "Biscuits n Gravy", cost: "$50", location: "Nana’s House", description: "Watch party!" },
        { dateHeader: "Wednesday, December 31", time: "2:00 PM", title: "🏀 GMU Basketball Game", cost: null, location: "Dunescrest East", description: "Watch party!" },
        { dateHeader: "Wednesday, December 31", time: "4:30 PM", title: "🎳 Bowling Mac Daddy's", cost: "$50", location: "Mac Daddy's", description: "NYE Bowling" },
        { dateHeader: "Wednesday, December 31", time: "6:00 PM", title: "🍾🎉🎊👏🥳🙌 Swanky Appletizers", cost: null, location: "Main house", description: "" },
        { dateHeader: "Wednesday, December 31", time: "8:00 PM", title: "🖤🫣🖤 Stranger things finale", cost: null, location: "TBD", description: "Series finale watch party!" },
        { dateHeader: "Wednesday, December 31", time: "10:00 PM", title: "♠️ Poker Tournament", cost: "$20", location: "Main House", description: "Buy-in required" },
        { dateHeader: "Thursday, January 1", time: "5:00 PM", title: "🎲 Board Games", cost: null, location: "Main House", description: "All Day Gaming" },
        { dateHeader: "Thursday, January 1", time: "5:00 PM", title: "🥊 MMA Showcase", cost: null, location: "Main House", description: "Watch Party" },
        { dateHeader: "Thursday, January 1", time: "5:00 PM", title: "🏈 NCAA Football Playoffs", cost: null, location: "Main House", description: "All Day Games" },
        { dateHeader: "Thursday, January 1", time: "5:00 PM", title: "🎧 Downtempo Music", cost: null, location: "Main House", description: "Relaxing Vibes" },
        { dateHeader: "Thursday, January 1", time: "5:00 PM", title: "📝 Resolution List Creation", cost: null, location: "Main House", description: "Planning for 2026" },
        { dateHeader: "Friday, January 2", time: "12:00 PM", title: "🎂 Grace's Birthday Lunch", cost: "$20", location: "Main House", description: "Birthday Celebration" },
        { dateHeader: "Friday, January 2", time: "6:00 PM", title: "Cup O’ Joy to 2026", cost: "$20", location: "Espresso Martini Bar in Swansboro", description: "" }
    ];

    // Helper to separate Icon from Title
    // Assumes icon is the first character(s) if it's an emoji
    function parseIconAndTitle(rawTitle) {
        // Regex to find leading emojis (simplified)
        // Or just check if first char is non-ascii or specific known icons
        // The scrape output format: "🍕 Michael Angelo's Pizza"
        // Let's split by first space if regex matches emoji-like

        const match = rawTitle.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+)\s+(.+)/u);
        if (match) {
            return { icon: match[1], title: match[2] };
        }
        // Special case: "Movie (Anacanda)" - no icon
        return { icon: '📅', title: rawTitle };
    }

    // Helper to parse date
    // "Saturday, December 27" + "7:00 PM"
    function parseScrapedDate(dateHeader, timeStr) {
        // dateHeader format: "DayOfWeek, Month Day"
        // Need to add Year. 
        // If Dec -> 2025. If Jan -> 2026.

        let cleanDate = dateHeader.split(',')[1].trim(); // "December 27"
        let year = 2025;
        if (cleanDate.toLowerCase().includes('jan')) year = 2026;

        // timeStr: "7:00 PM"
        // Convert to 24h for ISO
        let [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

        // Pad hours and minutes
        const hh = String(hours).padStart(2, '0');
        const mm = (minutes || '00').padStart(2, '0');

        const isoStr = `${year}-${cleanDateToMonth(cleanDate)}-${cleanDateToDay(cleanDate)} ${hh}:${mm}`;
        console.log(`Parsed Date for ${dateHeader} ${timeStr} -> ${isoStr}`);
        // Map Month name to number
        return fromZonedTime(isoStr, 'America/New_York');
    }

    function cleanDateToMonth(str) {
        if (str.includes('Dec')) return '12';
        if (str.includes('Jan')) return '01';
        return '12';
    }
    function cleanDateToDay(str) {
        // "December 27" -> "27"
        const m = str.match(/(\d+)/);
        return m ? m[0].padStart(2, '0') : '01';
    }

    for (const item of productionActivities) {
        // Parse Title/Icons
        const { icon, title } = parseIconAndTitle(item.title);

        // Parse Cost
        let cost = 0;
        if (item.cost) {
            cost = parseFloat(item.cost.replace('$', '')) || 0;
        }

        // Parse Date
        let dateObj = new Date();
        try {
            if (item.dateHeader && item.time) {
                dateObj = parseScrapedDate(item.dateHeader, item.time);
            }
        } catch (e) {
            console.error(`Failed to parse date for ${item.title}: ${e.message}`);
            dateObj = new Date(); // Fallback
        }

        console.log(`Creating Activity: ${title} at ${dateObj}`);

        await prisma.activity.create({
            data: {
                title: title,
                description: item.description || "",
                date: dateObj,
                location: item.location || "TBD",
                cost: cost,
                icon: icon
            }
        });
    }

    // --- No Auto Signups ---
    // User requested to NOT sign everyone up for everything.
    // Use the app to sign up manually.
    console.log("Skipping auto-signups as requested.");

    console.log("Directory reset complete.")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
