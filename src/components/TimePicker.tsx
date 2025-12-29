'use client';

import { useState, useEffect } from 'react';

interface TimePickerProps {
    name: string;
    defaultValue?: string; // "HH:MM" 24h format
}

export default function TimePicker({ name, defaultValue }: TimePickerProps) {
    const [hour, setHour] = useState('12');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('AM');
    const [value, setValue] = useState(defaultValue || '00:00');

    useEffect(() => {
        if (defaultValue) {
            const [h, m] = defaultValue.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m)) {
                if (h === 0) {
                    setHour('12');
                    setPeriod('AM');
                } else if (h === 12) {
                    setHour('12');
                    setPeriod('PM');
                } else if (h > 12) {
                    setHour(String(h - 12));
                    setPeriod('PM');
                } else {
                    setHour(String(h));
                    setPeriod('AM');
                }
                setMinute(String(m).padStart(2, '0'));
            }
        }
    }, [defaultValue]);

    useEffect(() => {
        let h = parseInt(hour, 10);
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;

        const hStr = String(h).padStart(2, '0');
        setValue(`${hStr}:${minute}`);
    }, [hour, minute, period]);

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="hidden" name={name} value={value} />

            <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'white',
                    fontSize: '1rem'
                }}
            >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                    <option key={h} value={h}>{h}</option>
                ))}
            </select>

            <span style={{ fontWeight: 'bold' }}>:</span>

            <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'white',
                    fontSize: '1rem'
                }}
            >
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>

            <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'white',
                    fontSize: '1rem'
                }}
            >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    );
}
