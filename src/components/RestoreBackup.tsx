'use client';

import { useState } from 'react';
import { restoreData } from '../app/actions';

export default function RestoreBackup() {
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("⚠️ This will attempt to restore people and activity signups from the file. \n\nExisting data matching names/locations will be updated. Continue?")) {
            e.target.value = ''; // clear input
            return;
        }

        setIsLoading(true);
        try {
            const text = await file.text();
            const result = await restoreData(text);

            if (result.success) {
                alert(`✅ Restore Complete!\n\nDetails:\n${result.message}`);
                window.location.reload(); // Refresh to show new data
            } else {
                alert(`❌ Restoration Failed:\n${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("❌ An unexpected error occurred reading the file.");
        } finally {
            setIsLoading(false);
            e.target.value = ''; // clear input to allow re-selecting same file
        }
    };

    return (
        <label className="btn" style={{
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            backgroundColor: '#475569',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            {isLoading ? '⏳ Restoring...' : '📤 Restore from Backup'}
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isLoading}
            />
        </label>
    );
}
