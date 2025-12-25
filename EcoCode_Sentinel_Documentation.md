# 🌿 EcoCode Sentinel: Project Documentation

**EcoCode Sentinel** is an advanced, AI-powered web sustainability platform designed to analyze, visualize, and optimize the carbon footprint of websites. It combines real-time data analysis with emotional visual storytelling to drive the "Green Coding" movement.

---

## 🚀 Core Functionalities

### 1. Carbon Footprint Calculator
The heart of the application. It performs a deep scan of any URL to measure its environmental impact.
- **Deep Scanning**: Fetches the HTML of a page and identifies all sub-resources (Images, Scripts, Stylesheets).
- **Resource Classification**: Automatically categorizes files to identify which assets are contributing most to the page weight.
- **Emission Math**: Uses the standard 0.81 kWh/GB for data transfer and global grid carbon intensity (approx. 442g CO₂e per kWh) to calculate grams of CO₂ per page view.

### 2. The Impact Visualizer (Emotional UI)
Instead of just showing numbers, we use a **Procedural SVG Environment** to represent a website's health.
- **Tier A+ & A (Thrive)**: Lush deep green forests, bears, foxes, and a clear blue sky.
- **Tier B & C (Stress)**: Lighter greens, fewer animals, and slightly hazier skies.
- **Tier D & E (Critical)**: Trees begin to disappear, animals flee, and the sky turns a polluted orange/gray.
- **Tier F (Collapse)**: A scorched earth, no vegetation, a thick black sky, and a dry river.
- **Animations**: Wind speeds and river flow rates adapt based on the score.

### 3. EcoChat AI Assistant
An interactive chatbot powered by **Google Gemini (gemini-2.5-flash-lite)**.
- **Context Awareness**: The AI "knows" exactly what resources your website is using.
- **Technical Advice**: Ask questions like "How can I reduce my JS size?" or "Why is my carbon score high?"
- **Eco-Mission**: The bot is programmed to speak as a protector of the planet, providing concise, technical, and encouraging green-coding tips.

### 4. PageSpeed Insights Integration
Integrates directly with the **Google PageSpeed API** to show that "Green is Fast."
- **Performance Score**: Displays a 0-100 speed rating.
- **Core Web Vitals**: Shows FCP (First Contentful Paint), LCP (Largest Contentful Paint), and more.
- **Correlation**: Helps developers see how reducing carbon footprint directly improves user experience.

### 5. Green Hosting Checker
Queries the **Green Web Foundation** to see if the website's servers run on renewable energy.
- **Verification**: Checks the hosting provider against a global database of sustainable datacenters.
- **Provider Info**: Displays the name of the datacenter (e.g., Google Cloud, AWS, Hetzner) and its green status.

### 6. Detailed Resource Analysis
A powerful forensic tool for developers to hunt for "carbon leaks."
- **Sort & Filter**: A table of all assets (images, scripts, styles) that can be sorted by size.
- **Individual Impact**: Calculates the carbon cost of *every single file* individually.
- **Direct Links**: Quickly identify and open heavy files for optimization.

### 7. Historical Tracking & Trends
A database-backed system (SQLite) that tracks improvements over time.
- **Progress Charts**: Interactive line graphs (using Recharts) showing how a site's carbon score changes over multiple scans.
- **Stats Dashboard**: Tracks "Best Score," "Average Carbon," and "Total Improvement Percentage."

---

## 🛠 Technical Stack

### **Backend (Python)**
- **FastAPI**: High-performance API framework.
- **Httpx**: Modern, async HTTP client for fast resource scanning.
- **BeautifulSoup4**: For parsing HTML and extracting assets.
- **SQLite**: Lightweight database for historical data persistence.
- **Pydantic**: For strict data validation and type safety.

### **Frontend (React)**
- **Vite**: Ultra-fast build tool and dev server.
- **Framer Motion**: Powering smooth, high-end UI animations.
- **Recharts**: For clean, interactive data visualization.
- **Axois**: For reliable backend communication.
- **Glassmorphism CSS**: A premium, modern design language using blurs and semi-transparency.

---

## 📐 Calculation Methodology

EcoCode Sentinel uses the **Sustainable Web Design (SWD) model**:

1.  **Data Transfer**: We measure the total bytes (Compressed + Uncompressed estimate) transferred during a page load.
2.  **Energy Consumption**: We apply the factor of **0.81 kWh per GB** (this covers the datacenter, the network, and the user's device).
3.  **Carbon Intensity**: We use the global average carbon intensity of electricity, which is **442g per kWh**.
4.  **Equation**:
    `Energy (kWh) = Data (GB) × 0.81`
    `Carbon (g) = Energy (kWh) × 442`

---

## 🎨 Design Philosophy
The UI is designed to feel "Premium" and "Futuristic." We use a palette of **Deep Forest Greens**, **Neon Accents**, and **Translucent Panels** to create an interface that feels alive and urgent.

---

## 🔮 Future Roadmap (Innovation)
- **Comparison Mode**: Compare two URLs side-by-side to see who is greener.
- **Browser Extension**: A Chrome extension to check carbon scores while browsing.
- **Code Optimization Engine**: AI-generated code snippets to replace inefficient logic.
- **Exportable PDF Reports**: For developers to share with clients or stakeholders.

---

**EcoCode Sentinel — Because every kilobyte costs the planet.** 🌍
