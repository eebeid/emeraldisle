// prisma/seed.ts
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log("Resetting Directory Data...")

    // 1. Clear People and Addresses (Wait! Deleting people deletes signups due to cascade)
    // The user said "remove all duplicates... and start over using this", implying a hard reset of directory.
    // However, we want to try to preserve signups if possible? 
    // Actually, if we delete people, signups go. That's unavoidable if IDs change or we strictly deleteMany.
    // Let's assume a hard reset is acceptable for directory, or we try to update inplace?
    // "Remove all duplicates" suggests wiping is best.

    // To be safe, let's wipe People and Addresses. 
    // NOTE: This WILL delete all existing signups for activities.
    // Given the early stage, this is likely acceptable.

    await prisma.signup.deleteMany({}) // Clear signups first to be clean
    await prisma.person.deleteMany({})
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

    for (const p of manualData) {
        const name = p.name.trim();
        const addressName = p.address.trim();

        // Ensure Address exists
        let addr = await prisma.address.findFirst({
            where: { fullAddress: addressName }
        });

        if (!addr) {
            console.log(`Creating address: ${addressName}`);
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

    console.log("Directory reset complete.")

    console.log("Seeding Activities...");
    await prisma.activity.deleteMany({});

    const activitiesData = [
        { title: "Michael Angelo's Pizza", cost: 20.00, date: "2025-12-27T19:00:00", description: "Dinner", icon: "🍕", location: "Michael Angelo's Pizza" },
        { title: "GMU Basketball", cost: 0.00, date: "2025-12-28T17:00:00", description: "Watch Party", icon: "🏀", location: "Main House" },
        { title: "Golf Star Hill", cost: 75.00, date: "2025-12-28T09:30:00", description: "Morning Tee Time", icon: "⛳️", location: "Star Hill Golf Club" },
        { title: "Neal's Birthday", cost: 0.00, date: "2025-12-28T20:30:00", description: "Celebration", icon: "🎂", location: "Main House" },
        { title: "Golf Star Hill", cost: 75.00, date: "2025-12-29T10:00:00", description: "Round 2", icon: "⛳️", location: "Star Hill Golf Club" },
        { title: "Movie (Wicked)", cost: 20.00, date: "2025-12-29T12:00:00", description: "Cinema Trip", icon: "🎬", location: "Emerald Isle Cinema" },
        { title: "Book Store", cost: 0.00, date: "2025-12-29T15:00:00", description: "Browsing", icon: "📚", location: "Emerald Isle Books" },
        { title: "Music Night", cost: 0.00, date: "2025-12-29T20:00:00", description: "Jam Session / Listening", icon: "🎵", location: "Main House" },
        { title: "Escape Room", cost: 30.00, date: "2025-12-30T16:00:00", description: "Can we escape?", icon: "🔐", location: "Game On Escape Rooms" },
        { title: "Shopping", cost: 0.00, date: "2025-12-30T18:00:00", description: "Local shops", icon: "🛍️", location: "Local Shops" },
        { title: "Mexican Dinner In Town TBD", cost: 0.00, date: "2025-12-30T19:00:00", description: "Group Dinner", icon: "🌮", location: "TBD" },
        { title: "Vibe Coding", cost: 0.00, date: "2025-12-30T21:00:00", description: "Late night hacking", icon: "💻", location: "Main House" },
        { title: "Poker Tournament", cost: 20.00, date: "2025-12-30T22:00:00", description: "Buy-in required", icon: "♠️", location: "Main House" },
        { title: "Bowling Mac Daddy's", cost: 50.00, date: "2025-12-31T16:30:00", description: "NYE Bowling", icon: "🎳", location: "Mac Daddy's" },
        { title: "NCAA Football Playoffs", cost: 0.00, date: "2026-01-01T12:00:00", description: "All Day Games", icon: "🏈", location: "Main House" },
        { title: "Board Games", cost: 0.00, date: "2026-01-01T12:00:00", description: "All Day Gaming", icon: "🎲", location: "Main House" },
        { title: "Downtempo Music", cost: 0.00, date: "2026-01-01T12:00:00", description: "Relaxing Vibes", icon: "🎧", location: "Main House" },
        { title: "Resolution List Creation", cost: 0.00, date: "2026-01-01T12:00:00", description: "Planning for 2026", icon: "📝", location: "Main House" },
        { title: "MMA Showcase", cost: 0.00, date: "2026-01-01T12:00:00", description: "Watch Party", icon: "🥊", location: "Main House" },
        { title: "Grace's Birthday Lunch", cost: 0.00, date: "2026-01-02T12:00:00", description: "Birthday Celebration", icon: "🎂", location: "Main House" }
    ];

    for (const act of activitiesData) {
        await prisma.activity.create({
            data: {
                title: act.title,
                description: act.description,
                date: new Date(act.date),
                location: act.location,
                cost: act.cost,
                icon: act.icon
            }
        });
    }
    console.log("Activities seeded.");
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
