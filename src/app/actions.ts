'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { put, del } from '@vercel/blob';

export async function uploadImage(data: FormData) {
    const file = data.get('file') as File;
    if (!file) {
        throw new Error('No file selected');
    }

    const blob = await put(file.name, file, { access: 'public' });

    revalidatePath('/gallery');
    redirect('/gallery');
}

export async function deletePhoto(url: string) {
    if (!url) return;
    await del(url);
    revalidatePath('/gallery');
}

export async function login(data: FormData) {
    const password = data.get('password') as string;

    // Global Trip Password
    if (password === 'EmeraldIsle25!') {
        // Set a global access cookie
        cookies().set('trip_access', 'granted', {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        redirect('/');
    } else {
        redirect('/login?error=Invalid+Password');
    }
}

export async function signupForActivity(activityId: string, personId: string) {
    if (!personId) throw new Error("User not identified");

    await prisma.signup.upsert({
        where: {
            personId_activityId: {
                personId,
                activityId
            }
        },
        update: { status: 'CONFIRMED' },
        create: {
            personId,
            activityId,
            status: 'CONFIRMED'
        }
    });

    revalidatePath('/activities');
    revalidatePath('/schedule');
}

export async function cancelSignup(activityId: string, personId: string) {
    // Delete or set to CANCELLED
    await prisma.signup.delete({
        where: {
            personId_activityId: {
                personId,
                activityId
            }
        }
    });

    revalidatePath('/activities');
    revalidatePath('/schedule');
}

import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const NY_TIMEZONE = 'America/New_York';

export async function createActivity(data: FormData) {
    const title = data.get('title') as string;
    const dateStr = data.get('date') as string;
    const timeStr = data.get('time') as string;
    const description = data.get('description') as string;
    const location = data.get('location') as string;
    const venmoLink = data.get('venmoLink') as string;
    const cost = parseFloat(data.get('cost') as string) || 0;

    if (!title || !dateStr || !timeStr) return;

    // Combine date and time and interpret as NY time
    // dateStr is YYYY-MM-DD, timeStr is HH:MM
    const isoString = `${dateStr}T${timeStr}`;
    const date = fromZonedTime(isoString, NY_TIMEZONE);

    await prisma.activity.create({
        data: {
            title,
            description,
            date,
            location,
            venmoLink,
            cost,
            icon: (data.get('icon') as string) || null
        }
    });

    revalidatePath('/activities');
    revalidatePath('/schedule');
    revalidatePath('/settings');
    redirect('/settings?success=Activity+Created');
}

export async function updateActivity(id: string, data: FormData) {
    const title = data.get('title') as string;
    const dateStr = data.get('date') as string;
    const timeStr = data.get('time') as string;
    const description = data.get('description') as string;
    const location = data.get('location') as string;
    const venmoLink = data.get('venmoLink') as string;
    const cost = parseFloat(data.get('cost') as string) || 0;

    if (!title || !dateStr || !timeStr) return;

    const isoString = `${dateStr}T${timeStr}`;
    const date = fromZonedTime(isoString, NY_TIMEZONE);

    await prisma.activity.update({
        where: { id },
        data: {
            title,
            description,
            date,
            location,
            venmoLink,
            cost,
            icon: (data.get('icon') as string) || null
        }
    });

    revalidatePath('/schedule');
    revalidatePath('/settings');
    redirect('/settings?success=Activity+Updated');
}


export async function deleteActivity(id: string) {
    await prisma.activity.delete({ where: { id } });
    revalidatePath('/activities');
    revalidatePath('/schedule');
    revalidatePath('/settings');
}

export async function createPerson(data: FormData) {
    const name = data.get('name') as string;
    const phoneNumber = data.get('phoneNumber') as string;
    const startDateStr = data.get('startDate') as string;
    const endDateStr = data.get('endDate') as string;
    const addressId = data.get('addressId') as string;

    if (!name) return;

    await prisma.person.create({
        data: {
            name,
            phoneNumber,
            startDate: startDateStr ? new Date(startDateStr) : null,
            endDate: endDateStr ? new Date(endDateStr) : null,
            address: addressId ? { connect: { id: addressId } } : undefined,
            reminderPreferences: data.getAll('reminderPreferences') as string[]
        }
    });
    revalidatePath('/');
    revalidatePath('/directory');
    revalidatePath('/settings');
    redirect('/settings?success=Person+Added');
}

export async function updatePerson(id: string, data: FormData) {
    const name = data.get('name') as string;
    const startDateStr = data.get('startDate') as string;
    const endDateStr = data.get('endDate') as string;
    const phoneNumber = data.get('phoneNumber') as string;
    const addressId = data.get('addressId') as string;
    const reminderPreferences = data.getAll('reminderPreferences') as string[]; // Get all checkboxes

    if (!name) return;

    await prisma.person.update({
        where: { id },
        data: {
            name,
            startDate: startDateStr ? new Date(startDateStr) : null,
            endDate: endDateStr ? new Date(endDateStr) : null,
            phoneNumber,
            address: addressId ? { connect: { id: addressId } } : { disconnect: true },
            reminderPreferences
        }
    });

    revalidatePath('/');
    revalidatePath('/directory');
    revalidatePath('/settings');
    redirect('/settings?success=Person+Updated');
}

export async function deletePerson(id: string) {
    await prisma.person.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/directory');
    revalidatePath('/settings');
    redirect('/settings?success=Person+Deleted');
}

export async function restoreData(csvContent: string) {
    if (!csvContent) return { error: "Empty file content" };

    try {
        const lines = csvContent.split('\n');
        // Expected Header: Name,Phone,Address,Start Date,End Date,Signed Up Activities

        let successCount = 0;
        let logs: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Handle quoted CSV parsing simply (assuming no commas inside fields except quoted ones)
            // A more robust parser would be better, but for this specific CSV format:
            // "Name",Phone,Address,Start,End,"Activity; Activity"

            // Regex to split by comma, respecting quotes
            const parts = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
            if (!parts || parts.length < 6) continue;

            // Clean up regex results (remove leading comma and quotes)
            const cleanParts = parts.map(p => {
                let s = p.replace(/^,/, '');
                if (s.startsWith('"') && s.endsWith('"')) {
                    s = s.slice(1, -1);
                }
                return s.replace(/""/g, '"').trim();
            });

            const [name, phone, addressStr, startDateStr, endDateStr, activitiesStr] = cleanParts;

            if (!name) continue;

            // 1. Upsert Address
            let addressId = null;
            if (addressStr) {
                // Since upsert requires unique where, use manual logic:
                let existingAddr = await prisma.address.findFirst({ where: { fullAddress: addressStr } });
                if (!existingAddr) {
                    existingAddr = await prisma.address.create({ data: { name: addressStr, fullAddress: addressStr } });
                }
                addressId = existingAddr.id;
            }

            // 2. Upsert Person
            const person = await prisma.person.upsert({
                where: { name },
                create: {
                    name,
                    phoneNumber: phone || null,
                    startDate: startDateStr ? new Date(startDateStr) : null,
                    endDate: endDateStr ? new Date(endDateStr) : null,
                    addressId
                },
                update: {
                    phoneNumber: phone || null,
                    startDate: startDateStr ? new Date(startDateStr) : null,
                    endDate: endDateStr ? new Date(endDateStr) : null,
                    addressId
                }
            });

            // 3. Restore Signups
            if (activitiesStr) {
                const activityEntries = activitiesStr.split(';').map(s => s.trim()).filter(Boolean);

                for (const entry of activityEntries) {
                    // entry format: "Activity Title (M/D/YYYY, H:MM:SS PM)"
                    // We only need the Title to match.
                    // Extract title before the last " ("
                    const lastParenIndex = entry.lastIndexOf(' (');
                    let title = entry;
                    if (lastParenIndex !== -1) {
                        title = entry.substring(0, lastParenIndex).trim();
                    }

                    // Find activity by title
                    const activity = await prisma.activity.findFirst({
                        where: { title: { equals: title, mode: 'insensitive' } }
                    });

                    if (activity) {
                        await prisma.signup.upsert({
                            where: {
                                personId_activityId: {
                                    personId: person.id,
                                    activityId: activity.id
                                }
                            },
                            create: { personId: person.id, activityId: activity.id, status: 'CONFIRMED' },
                            update: { status: 'CONFIRMED' }
                        });
                    } else {
                        logs.push(`⚠️ Skipped activity "${title}" for ${name} (not found in schedule)`);
                    }
                }
            }
            successCount++;
        }

        revalidatePath('/'); // Revalidate everything just in case
        return { success: true, message: `Restored ${successCount} people.\n${logs.join('\n')}` };

    } catch (error: any) {
        console.error("Restore Error:", error);
        return { success: false, error: error.message };
    }
}
