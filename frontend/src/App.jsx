import React, { useState } from 'react';
import './styles/index.css';
import HeroInput from './components/HeroInput';
import ScoreReveal from './components/ScoreReveal';
import ImpactVisualizer from './components/ImpactVisualizer';
import EcoChatAssistant from './components/EcoChatAssistant';
import HistoryPanel from './components/HistoryPanel';
import TrendsChart from './components/TrendsChart';
import ResourceAnalysis from './components/ResourceAnalysis';
import Footer from './components/Footer';
import axios from 'axios';
import logo from './assets/logo.png';

import { API_URL } from './config';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (url) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post(`${API_URL}/calculate`, { url });
      setResult({ ...response.data, url }); // Store the URL with the result
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Failed to scan. Please check the URL.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', width: '100%', boxSizing: 'border-box' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img src={logo} alt="EcoCode Logo" style={{ width: '120px', height: '120px', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px var(--accent-green))' }} />
        <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>ECOCODE SENTINEL</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-Powered Sustainable Web Optimization</p>
      </header>

      <HeroInput onScan={handleScan} loading={loading} />

      {error && <div className="glass-panel" style={{ color: 'var(--danger-red)', marginTop: '2rem', textAlign: 'center' }}>{error}</div>}

      {result && (
        <div className="results-grid" style={{ marginTop: '3rem', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <ScoreReveal data={result} />
            <HistoryPanel url={result.url} />
            <TrendsChart url={result.url} />
            <EcoChatAssistant resources={result.resources} carbonRating={result.green_rating} />
          </div>

          <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ImpactVisualizer score={result.green_rating} />
            {/* Historical Summary Box (Optional addition to fill space) */}
            <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minHeight: '150px' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>SUSTAINABILITY TREND</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Every optimization counts. Reducing data transfer by 10% on this page could save enough CO2 to charge a smartphone 500 times.</p>
            </div>
          </div>

        </div>
      )}

      {result && (
        <div style={{ marginTop: '2.5rem', width: '100%' }}>
          <ResourceAnalysis resources={result.resources} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
