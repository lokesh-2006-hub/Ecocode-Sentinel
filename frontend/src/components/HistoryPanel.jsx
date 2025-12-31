import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const HistoryPanel = ({ url }) => {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;

        const fetchTrends = async () => {
            try {
                const response = await axios.get(`${API_URL}/trends/${encodeURIComponent(url)}`);
                setTrends(response.data);
            } catch (err) {
                console.error('Error fetching trends:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, [url]);

    if (loading) {
        return (
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                <p style={{ opacity: 0.7 }}>Loading history...</p>
            </div>
        );
    }

    if (!trends || !trends.has_data) {
        return (
            <div className="glass-panel" style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    SCAN HISTORY
                </h3>
                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    This is the first scan for this URL. Scan again later to see trends!
                </p>
            </div>
        );
    }

    const improvementColor = trends.improvement_percentage > 0 ? '#00ff9d' :
        trends.improvement_percentage < 0 ? '#ff4d4d' : '#fbbf24';

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ padding: '1.5rem' }}
        >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                SCAN HISTORY
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Total Scans
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {trends.scan_count}
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Improvement
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: improvementColor }}>
                        {trends.improvement_percentage > 0 ? '+' : ''}{trends.improvement_percentage}%
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Average Carbon
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {trends.average_carbon}g
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Best Score
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00ff9d' }}>
                        {trends.best_carbon}g
                    </div>
                </div>
            </div>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div>First scan: {new Date(trends.first_scan).toLocaleDateString()}</div>
                <div>Latest scan: {new Date(trends.latest_scan).toLocaleDateString()}</div>
            </div>
        </motion.div>
    );
};

export default HistoryPanel;
