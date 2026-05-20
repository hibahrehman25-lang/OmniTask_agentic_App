import sqlite3
import json
from datetime import datetime


class Database:
    """SQLite database for storing analysis history and results."""

    def __init__(self, db_path="agent_data.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                input_text TEXT NOT NULL,
                domain TEXT DEFAULT 'business',
                results TEXT,
                agent_trace TEXT,
                status TEXT DEFAULT 'completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def save_analysis(self, input_text, results, agent_trace, domain="business"):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO analyses (input_text, domain, results, agent_trace) VALUES (?, ?, ?, ?)',
            (input_text, domain, json.dumps(results), json.dumps(agent_trace))
        )
        conn.commit()
        analysis_id = cursor.lastrowid
        conn.close()
        return analysis_id

    def get_analysis(self, analysis_id):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM analyses WHERE id = ?', (analysis_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {
                'id': row[0],
                'input_text': row[1],
                'domain': row[2],
                'results': json.loads(row[3]) if row[3] else None,
                'agent_trace': json.loads(row[4]) if row[4] else None,
                'status': row[5],
                'created_at': row[6]
            }
        return None

    def get_history(self, limit=20):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, input_text, domain, status, created_at FROM analyses ORDER BY created_at DESC LIMIT ?',
            (limit,)
        )
        rows = cursor.fetchall()
        conn.close()
        return [{
            'id': r[0],
            'input_text': r[1][:120] + ('...' if len(r[1]) > 120 else ''),
            'domain': r[2],
            'status': r[3],
            'created_at': r[4]
        } for r in rows]
