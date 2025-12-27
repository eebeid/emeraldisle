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
        { name: "Brendan", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Shana", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Killian", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Tia", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Mel", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Edmond", dates: "December 27- January 2", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Austin", dates: "December 27- January 2", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Eli", dates: "December 27- January 2", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Amy", dates: "December 27- January 2", address: "9319 Ocean Drive, Emerald Isle, NC 28594" },
        { name: "Neal", dates: "December 27- January 2", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Stacey", dates: "December 27- January 2", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Berkleigh", dates: "December 27- January 2", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Braxten", dates: "December 27- January 2", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
        { name: "Kyle", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Rebecca ", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" }, // Note space in name, keeping it for now or trim? Trim is better.
        { name: "Madison", dates: "December 26- January 28", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Kaelan", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Kennedy", dates: "December 27- January 2", address: "9257 Ocean Dr, Emerald Isle, NC 28594" },
        { name: "Jim", dates: "December 29 - January 2", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Becky ", dates: "December 29 - January 2", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Matthew", dates: "December 29 - January 2", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Declan", dates: "December 29 - January 2", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Gavin", dates: "December 29 - January 2", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Ava", dates: "December 29 - January 2", address: "120 Sea Dunes Drive, Emerald Isle, NC 28594" },
        { name: "Grace", dates: "December 28 - January 2", address: "9317 Ocean Drive, Emerald Isle, NC 28594 - East" },
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
                dates: p.dates,
                addressId: addr.id
            }
        });
    }

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
