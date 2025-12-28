import { Flag } from 'lucide-react';

export default function Logo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'inherit' }}>
            <div style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'hsl(var(--primary))',
                borderRadius: '10px',
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '-1px',
                boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)'
            }}>
                <span style={{ transform: 'translateX(-2px)' }}>E</span>
                <span style={{ position: 'relative' }}>
                    I
                    <Flag
                        size={12}
                        strokeWidth={3}
                        fill="currentColor"
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            transform: 'rotate(-10deg)',
                            color: '#fbbf24' // A subtle gold accent for the flag
                        }}
                    />
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px', color: 'hsl(var(--foreground))' }}>
                    Emerald Isle
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    2025
                </span>
            </div>
        </div>
    );
}
