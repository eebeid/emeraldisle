
import styles from '@/app/page.module.css';
import { login } from '@/app/actions';

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div className={styles.main} style={{ justifyContent: 'center', minHeight: '80vh' }}>
            <div className="card glass" style={{ padding: '2rem', maxWidth: '400px', width: '100%' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Admin Access</h1>
                {searchParams.error && (
                    <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                        {searchParams.error}
                    </div>
                )}
                <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Enter password"
                            style={{
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white'
                            }}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit" style={{ marginTop: '0.5rem' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
