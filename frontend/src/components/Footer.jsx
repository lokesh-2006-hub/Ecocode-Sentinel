import React from 'react';
import { Github, Leaf, Shield, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            marginTop: '5rem',
            padding: '3rem 2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '3rem'
            }}>
                {/* Brand Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                        <Shield className="accent-green" size={24} style={{ filter: 'drop-shadow(0 0 5px var(--accent-green))' }} />
                        <h3 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px' }}>ECOCODE <span style={{ color: 'var(--accent-green)' }}>SENTINEL</span></h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Fighting digital carbon footprints with AI-powered performance analysis.
                        Join us in building a more sustainable and efficient web for our planet.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 'bold' }}>PROJECT</h4>
                    <ul style={{ list_style: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Leaf size={14} /> Open Source Sustainability
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={14} /> Global Green Check
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={14} /> Privacy First Analysis
                        </li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h4 style={{ marginBottom: '1.2rem', fontSize: '1rem', fontWeight: 'bold' }}>CONNECT</h4>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="https://github.com/lokesh-2006-hub/Ecocode-Sentinel" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', transition: 'color 0.3s' }}>
                            <Github size={24} />
                        </a>
                        <div style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            border: '1px solid var(--accent-green)',
                            color: 'var(--accent-green)',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            height: 'fit-content'
                        }}>
                            v1.0.0 STABLE
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                opacity: 0.6
            }}>
                &copy; {new Date().getFullYear()} EcoCode Sentinel Project. Built with &hearts; for the Environment.
            </div>
        </footer>
    );
};

export default Footer;
