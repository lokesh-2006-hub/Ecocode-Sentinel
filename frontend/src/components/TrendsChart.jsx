import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const TrendsChart = ({ url }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;

        const fetchTrends = async () => {
            try {
                const response = await axios.get(`${API_URL}/trends/${encodeURIComponent(url)}`);
                if (response.data.has_data && response.data.data_points) {
                    // Format data for the chart
                    const chartData = response.data.data_points.map(point => ({
                        date: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        carbon: parseFloat(point.carbon_g),
                        rating: point.green_rating
                    }));
                    setData(chartData);
                }
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
                <p style={{ opacity: 0.7 }}>Loading chart...</p>
            </div>
        );
    }

    if (data.length < 2) {
        return null; // Don't show chart if less than 2 data points
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'rgba(0, 0, 0, 0.9)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 255, 157, 0.3)'
                }}>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{payload[0].payload.date}</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 'bold', color: '#00ff9d' }}>
                        {payload[0].value}g CO₂
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                        Grade: {payload[0].payload.rating}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ padding: '1.5rem' }}
        >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                CARBON FOOTPRINT TRENDS
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '0.75rem' }}
                        label={{ value: 'CO₂ (g)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="carbon"
                        stroke="#00ff9d"
                        strokeWidth={2}
                        dot={{ fill: '#00ff9d', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '1rem', textAlign: 'center' }}>
                Showing {data.length} scans over time
            </div>
        </motion.div>
    );
};

export default TrendsChart;
