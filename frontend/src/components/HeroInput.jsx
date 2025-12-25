import React, { useState } from 'react';
import { Search } from 'lucide-react';

const HeroInput = ({ onScan, loading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url) onScan(url);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div
                className="glass-panel"
                style={{
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '50px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                <Search style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }} />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL to scan..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.2rem',
                        padding: '1rem',
                        outline: 'none',
                        fontFamily: 'var(--font-family)'
                    }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ borderRadius: '40px', padding: '12px 32px' }}
                >
                    {loading ? 'SCANNING...' : 'ANALYZE'}
                </button>
            </div>
        </form>
    );
};

export default HeroInput;
