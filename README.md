# 🌿 EcoCode Sentinel: AI-Powered Web Sustainability

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Success-brightgreen.svg)]()
[![Green Web](https://img.shields.io/badge/Energy-Sustainable-00ff9d.svg)]()

**EcoCode Sentinel** is an advanced platform designed to analyze, visualize, and optimize the carbon footprint of websites. Using real-time scanning and AI-driven insights, it helps developers build a faster, greener, and more sustainable web.

![EcoCode Sentinel Banner](https://raw.githubusercontent.com/lokesh-2006-hub/Ecocode-Sentinel/main/frontend/src/assets/logo.png) *(Note: Placeholder for your logo)*

---

## 🚀 Key Features

### 🔍 Deep Carbon Analysis
Scans any URL and calculates precise CO₂ emissions based on data transfer, server intensity, and resource types.

### 🎭 Emotional Impact Visualizer
A living, breathing SVG environment that changes in real-time based on your score. Watch forests thrive or rivers dry up based on your code's efficiency.

### 🤖 EcoChat AI Assistant
Powered by **Google Gemini 1.5 Flash**, the built-in assistant provides contextual, technical advice on how to optimize specific resources found on your site.

### 📈 Historical Tracking & Trends
A built-in database tracks every scan, allowing you to visualize your optimization progress over time with interactive charts.

### 🏢 Green Hosting Checker
Integrated with the **Green Web Foundation API** to verify if your website is hosted on servers powered by renewable energy.

---

## 🛠 Technical Stack

- **Frontend**: React, Vite, Framer Motion, Recharts, Axios.
- **Backend**: Python, FastAPI, Beautiful Soup 4, Httpx.
- **Database**: SQLite (local persistence for scan history).
- **AI**: Google Gemini API.

---

## 🏁 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
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
   python -m uvicorn main:app --reload
   ```

   *Terminal 2 (Frontend):*
   ```bash
   npm run dev
   ```

---

## 📐 Calculation Methodology

We use the **Sustainable Web Design (SWD)** model:
- **Energy**: 0.81 kWh/GB (including datacenter, network, and device).
- **Emissions**: 442g CO₂e per kWh (global average).
- **Efficiency**: Optimized assets = Reduced data transfer = Lower Carbon.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with 💚 for a sustainable future.**