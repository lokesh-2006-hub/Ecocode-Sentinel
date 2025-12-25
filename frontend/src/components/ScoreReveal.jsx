import React from 'react';
import { motion } from 'framer-motion';

const ScoreReveal = ({ data }) => {
    const { green_rating, carbon_g, total_bytes, details } = data;

    // Debug: Check if performance data exists
    console.log("ScoreReveal data:", data);
    console.log("Performance data:", data.performance);

    const getColor = (grade) => {
        if (['A+', 'A', 'B'].includes(grade)) return 'var(--accent-green)';
        if (['C', 'D'].includes(grade)) return '#fbbf24'; // Amber
        return 'var(--danger-red)';
    };

    const color = getColor(green_rating);

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>CARBON SCORE</h2>
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{total_bytes} bytes</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 1.5 }}
                    style={{
                        fontSize: '6rem',
                        fontWeight: '800',
                        color: color,
                        textShadow: `0 0 30px ${color}80` // Glow effect
                    }}
                >
                    {green_rating}
                </motion.div>

                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{carbon_g.toFixed(3)}g</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CO2 per view</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            {details.resource_count} Resources
                        </span>
                        <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                            {details.resource_count} Requests
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Section */}
            {data.performance && (
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        PERFORMANCE METRICS
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                        {/* Performance Score */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                color: data.performance.performance_score >= 90 ? '#00ff9d' :
                                    data.performance.performance_score >= 50 ? '#fbbf24' : '#ff4d4d',
                                textShadow: `0 0 20px ${data.performance.performance_score >= 90 ? '#00ff9d' :
                                    data.performance.performance_score >= 50 ? '#fbbf24' : '#ff4d4d'}80`
                            }}
                        >
                            {Math.round(data.performance.performance_score)}
                        </motion.div>

                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Performance Score</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                {data.performance.performance_score >= 90 ? 'Good' :
                                    data.performance.performance_score >= 50 ? 'Needs Improvement' : 'Poor'}
                            </div>
                        </div>
                    </div>

                    {/* Core Web Vitals */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>FCP</div>
                            <div style={{ fontWeight: 'bold' }}>{data.performance.fcp}</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>LCP</div>
                            <div style={{ fontWeight: 'bold' }}>{data.performance.lcp}</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>CLS</div>
                            <div style={{ fontWeight: 'bold' }}>{data.performance.cls?.toFixed(3) || 'N/A'}</div>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>TBT</div>
                            <div style={{ fontWeight: 'bold' }}>{data.performance.tbt}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hosting Info Section */}
            {data.hosting && (
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        HOSTING SUSTAINABILITY
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: data.hosting.is_green ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: data.hosting.is_green ? '1px solid rgba(0, 255, 157, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '2rem' }}>
                            {data.hosting.is_green ? '🌱' : '⚠️'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', color: data.hosting.is_green ? '#00ff9d' : 'inherit' }}>
                                {data.hosting.is_green ? 'Green Hosting Detected' : 'Unknown Energy Source'}
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>
                                {data.hosting.message}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreReveal;
