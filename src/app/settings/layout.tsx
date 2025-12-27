
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const isAdmin = cookieStore.get('isAdmin');

    if (!isAdmin || isAdmin.value !== 'true') {
        redirect('/login');
    }

    return <>{children}</>;
}
