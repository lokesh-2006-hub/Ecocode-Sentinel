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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 1.5 }}
                    style={{
                        fontSize: '6.5rem',
                        fontWeight: '800',
                        color: color,
                        textShadow: `0 0 30px ${color}80` // Glow effect
                    }}
                >
                    {green_rating}
                </motion.div>

                <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{carbon_g.toFixed(3)}g</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CO2 per view</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                            {details.resource_count} Resources
                        </span>
                        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                            {details.resource_count} Requests
                        </span>
                    </div>
                </div>
            </div>

            {/* Emission Breakdown Section */}
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>EMISSION BREAKDOWN</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Frontend */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
                                Frontend (Data Transfer)
                            </span>
                            <span style={{ fontWeight: 'bold' }}>{data.frontend_carbon_g?.toFixed(3) || carbon_g.toFixed(3)}g</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((data.frontend_carbon_g || carbon_g) / carbon_g) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{ height: '100%', background: 'var(--accent-green)' }}
                            />
                        </div>
                    </div>

                    {/* Backend */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00b8ff' }} />
                                Backend (Server Compute)
                            </span>
                            <span style={{ fontWeight: 'bold' }}>{data.backend_carbon_g?.toFixed(3) || '0.000'}g</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((data.backend_carbon_g || 0) / carbon_g) * 100}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                                style={{ height: '100%', background: '#00b8ff' }}
                            />
                        </div>
                    </div>

                    {details?.processing_time && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'right', marginTop: '0.2rem' }}>
                            Server compute time: {details.processing_time}s
                        </div>
                    )}
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
