import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ResourceAnalysis = ({ resources = [] }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'size', direction: 'desc' });
    const [filter, setFilter] = useState('All');

    const resourceTypes = useMemo(() => {
        const types = new Set(resources.map(r => r.resource_type));
        return ['All', ...Array.from(types)];
    }, [resources]);

    const sortedAndFilteredResources = useMemo(() => {
        let items = [...resources];

        // Filter
        if (filter !== 'All') {
            items = items.filter(item => item.resource_type === filter);
        }

        // Sort
        items.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return items;
    }, [resources, sortConfig, filter]);

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const calculateCarbon = (bytes) => {
        // Simple carbon calculation for individual resources
        return (bytes * 0.000000000442).toFixed(6);
    };

    return (
        <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '2rem', overflow: 'hidden' }}
        >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Resource Detailed Analysis</h3>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Filter by:</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            outline: 'none'
                        }}
                    >
                        {resourceTypes.map(type => (
                            <option key={type} value={type} style={{ background: '#1a1a1a' }}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th
                                style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => requestSort('url')}
                            >
                                Filename {sortConfig.key === 'url' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => requestSort('resource_type')}
                            >
                                Type {sortConfig.key === 'resource_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none', textAlign: 'right' }}
                                onClick={() => requestSort('size')}
                            >
                                Size {sortConfig.key === 'size' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>
                                Carbon Est.
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {sortedAndFilteredResources.map((resource, index) => (
                                <motion.tr
                                    key={resource.url + index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                    whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                                >
                                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--accent-green)', textDecoration: 'none', opacity: 0.8 }}
                                            title={resource.url}
                                        >
                                            {resource.url.split('/').pop() || resource.url}
                                        </a>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.1)',
                                            fontSize: '0.75rem'
                                        }}>
                                            {resource.resource_type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                        {formatSize(resource.size)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                        {calculateCarbon(resource.size)}g
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                Showing {sortedAndFilteredResources.length} out of {resources.length} resources
            </div>
        </motion.div>
    );
};

export default ResourceAnalysis;
