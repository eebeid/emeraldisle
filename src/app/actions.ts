'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

export async function uploadImage(data: FormData) {
    const file = data.get('file') as File;
    if (!file) {
        throw new Error('No file selected');
    }

    const blob = await put(file.name, file, { access: 'public' });

    revalidatePath('/gallery');
    redirect('/gallery');
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

export async function createActivity(data: FormData) {
    const title = data.get('title') as string;
    const dateStr = data.get('date') as string;
    const timeStr = data.get('time') as string;
    const description = data.get('description') as string;
    const location = data.get('location') as string;
    const venmoLink = data.get('venmoLink') as string;
    const cost = parseFloat(data.get('cost') as string) || 0;

    if (!title || !dateStr || !timeStr) return;

    // Combine date and time
    const date = new Date(`${dateStr}T${timeStr}`);

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

    const date = new Date(`${dateStr}T${timeStr}`);

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

    if (!name) return;

    await prisma.person.create({
        data: {
            name,
            phoneNumber,
            startDate: startDateStr ? new Date(startDateStr) : null,
            endDate: endDateStr ? new Date(endDateStr) : null,
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

    if (!name) return;

    await prisma.person.update({
        where: { id },
        data: {
            name,
            startDate: startDateStr ? new Date(startDateStr) : null,
            endDate: endDateStr ? new Date(endDateStr) : null,
            phoneNumber,
            addressId: addressId || null
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
