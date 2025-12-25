import React, { useState } from 'react';
import './styles/index.css';
import HeroInput from './components/HeroInput';
import ScoreReveal from './components/ScoreReveal';
import ImpactVisualizer from './components/ImpactVisualizer';
import EcoChatAssistant from './components/EcoChatAssistant';
import HistoryPanel from './components/HistoryPanel';
import TrendsChart from './components/TrendsChart';
import ResourceAnalysis from './components/ResourceAnalysis';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (url) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/calculate', { url });
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glow-text" style={{ fontSize: '3rem', margin: 0 }}>ECOCODE SENTINEL</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-Powered Sustainable Web Optimization</p>
      </header>

      <HeroInput onScan={handleScan} loading={loading} />

      {error && <div className="glass-panel" style={{ color: 'var(--danger-red)', marginTop: '2rem', textAlign: 'center' }}>{error}</div>}

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ScoreReveal data={result} />
            <HistoryPanel url={result.url} />
            <TrendsChart url={result.url} />
            <EcoChatAssistant resources={result.resources} carbonRating={result.green_rating} />
          </div>

          <div style={{ position: 'sticky', top: '2rem' }}>
            <ImpactVisualizer score={result.green_rating} />
          </div>

        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <ResourceAnalysis resources={result.resources} />
        </div>
      )}
    </div>
  );
}

export default App;
