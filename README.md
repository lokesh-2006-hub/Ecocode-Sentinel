# 🌿 EcoCode Sentinel: AI-Powered Web Sustainability

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Success-brightgreen.svg)]()
[![Green Web](https://img.shields.io/badge/Energy-Sustainable-00ff9d.svg)]()

**EcoCode Sentinel** is an advanced platform designed to analyze, visualize, and optimize the carbon footprint of websites. Using real-time scanning and AI-driven insights, it helps developers build a faster, greener, and more sustainable web.

<p align="center">
  <img src="frontend/src/assets/logo.png" width="200" alt="EcoCode Sentinel Logo">
</p>

---

## 🚀 Key Features

### 🔍 Dual Carbon Analysis
Scans any URL and calculates precise CO₂ emissions by splitting the impact between **Frontend Data Transfer** and **Backend Server Compute**.

### 🎭 Emotional Impact Visualizer
A living, breathing SVG environment that changes in real-time based on your score. Watch forests thrive or rivers dry up based on your code's efficiency.

### 🤖 EcoChat AI Assistant
Powered by **Google Gemini 2.5 Flash Lite**, our built-in assistant provides technical advice on resource optimization and carbon reduction strategies.

### 📉 Historical Tracking & Trends
A built-in database tracks every scan, allowing you to visualize your optimization progress over time with interactive charts.

### 🏢 Green Hosting Checker
Integrated with the **Green Web Foundation API** to verify if your website is hosted on servers powered by renewable energy.

---

## 🛠 Technical Stack

- **Frontend**: React, Vite, Framer Motion, Recharts, Axios.
- **Backend**: Python, FastAPI, Beautiful Soup 4, Httpx.
- **Database**: SQLite (local persistence for scan history).
- **AI Engine**: Google Gemini 2.5 Flash Lite.

---

## 🏁 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lokesh-2006-hub/Ecocode-Sentinel.git
   cd Ecocode-Sentinel
   ```

2. **Setup Backend**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Launch Application**

   *Terminal 1 (Backend):*
   ```bash
   $env:GEMINI_API_KEY="YOUR_KEY_HERE"
   $env:PAGESPEED_API_KEY="YOUR_KEY_HERE" (Optional)
   python -m uvicorn main:app --reload
   ```

   *Terminal 2 (Frontend):*
   ```bash
   npm run dev
   ```

---

## 📐 Calculation Methodology

We use a comprehensive two-part model to estimate digital carbon footprints:

### 1. Frontend (Data Weight)
Based on the **OneByte** model:
- **Energy**: 0.81 kWh per GB of data transferred.
- **Emissions**: 442g CO₂e per kWh (Global average intensity).

### 2. Backend (Server Compute)
A time-based heuristic using **Time-to-First-Byte (TTFB)**:
- **Standard Host**: 0.020g CO₂ per second of processing.
- **Green Host**: 0.005g CO₂ per second (75% reduction bonus).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with 💚 for a sustainable future.**