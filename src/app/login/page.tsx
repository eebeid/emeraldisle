import styles from './login.module.css';
import { login } from '../actions';

export const dynamic = 'force-dynamic';

export default function LoginPage({
    searchParams
}: {
    searchParams: { error?: string }
}) {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>🔐 Trip Access</h1>
                <p>Please enter the trip password to view the schedule and directory.</p>

                {searchParams?.error && (
                    <div className={styles.error}>
                        ❌ {searchParams.error}
                    </div>
                )}

                <form action={login} className={styles.form}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        Unlock App
                    </button>
                </form>
            </div>
        </div>
    );
}
