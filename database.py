import sqlite3
from datetime import datetime
from typing import List, Dict, Optional
import os

DB_PATH = "ecocode.db"

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            carbon_g REAL NOT NULL,
            total_bytes INTEGER NOT NULL,
            green_rating TEXT NOT NULL,
            performance_score REAL,
            resource_count INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create indexes for faster queries
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_url ON scans(url)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON scans(timestamp)')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

def save_scan(url: str, carbon_g: float, total_bytes: int, green_rating: str, 
              performance_score: Optional[float] = None, resource_count: int = 0):
    """Save a scan result to the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO scans (url, carbon_g, total_bytes, green_rating, performance_score, resource_count)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (url, carbon_g, total_bytes, green_rating, performance_score, resource_count))
    
    conn.commit()
    scan_id = cursor.lastrowid
    conn.close()
    
    return scan_id

def get_scan_history(url: str, limit: int = 30) -> List[Dict]:
    """Get scan history for a specific URL"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM scans 
        WHERE url = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
    ''', (url, limit))
    
    rows = cursor.fetchall()
    conn.close()
    
    # Convert to list of dictionaries
    return [dict(row) for row in rows]

def get_trends(url: str, days: int = 90) -> Dict:
    """Calculate trends for a URL over the specified number of days"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT carbon_g, total_bytes, green_rating, performance_score, timestamp
        FROM scans 
        WHERE url = ? 
        AND timestamp >= datetime('now', '-' || ? || ' days')
        ORDER BY timestamp ASC
    ''', (url, days))
    
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        return {
            "has_data": False,
            "message": "No historical data available"
        }
    
    scans = [dict(row) for row in rows]
    
    # Calculate statistics
    carbon_values = [s['carbon_g'] for s in scans]
    first_carbon = carbon_values[0]
    latest_carbon = carbon_values[-1]
    
    improvement_percentage = 0
    if first_carbon > 0:
        improvement_percentage = ((first_carbon - latest_carbon) / first_carbon) * 100
    
    return {
        "has_data": True,
        "scan_count": len(scans),
        "first_scan": scans[0]['timestamp'],
        "latest_scan": scans[-1]['timestamp'],
        "improvement_percentage": round(improvement_percentage, 1),
        "average_carbon": round(sum(carbon_values) / len(carbon_values), 4),
        "best_carbon": round(min(carbon_values), 4),
        "worst_carbon": round(max(carbon_values), 4),
        "current_carbon": round(latest_carbon, 4),
        "data_points": scans
    }

def get_all_scanned_urls(limit: int = 100) -> List[Dict]:
    """Get list of all scanned URLs with their latest scan info"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT url, MAX(timestamp) as last_scan, COUNT(*) as scan_count
        FROM scans
        GROUP BY url
        ORDER BY last_scan DESC
        LIMIT ?
    ''', (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

# Initialize database when module is imported
if not os.path.exists(DB_PATH):
    init_db()
