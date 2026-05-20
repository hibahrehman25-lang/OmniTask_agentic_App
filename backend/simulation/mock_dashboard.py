"""
Mock Dashboard System
Simulates a real-time business KPI dashboard with before/after state tracking.
"""
import copy
import time
import sqlite3
import json


class MockDashboard:
    """Simulated business dashboard with persistent KPI metrics in SQLite."""

    def __init__(self, db_path="simulation_state.db"):
        self.db_path = db_path
        self.history = []
        self._init_db()
        self._load_state()

    def _init_db(self):
        """Initialize the simulation state database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS dashboard_metrics (
                metric_name TEXT PRIMARY KEY,
                value TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def _load_state(self):
        """Load state from DB or initialize if empty."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT metric_name, value FROM dashboard_metrics')
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            self._reset_to_defaults()
        else:
            self.metrics = {row[0]: json.loads(row[1]) for row in rows}

    def _reset_to_defaults(self):
        """Initialize with realistic business KPIs and save to DB."""
        self.metrics = {
            "revenue_monthly": 2850000,
            "revenue_trend": "declining",
            "orders_today": 142,
            "orders_trend": "stable",
            "active_campaigns": 2,
            "customer_satisfaction": 3.6,
            "customer_satisfaction_trend": "declining",
            "support_tickets_open": 87,
            "avg_resolution_time_hrs": 4.2,
            "employee_utilization": 72,
            "active_alerts": 1,
            "escalations": 0,
            "pending_actions": 3,
            "resource_utilization": 68,
            "conversion_rate": 3.4,
            "churn_rate": 5.2,
            "net_promoter_score": 32,
            "inventory_health": "warning",
            "supply_chain_status": "delayed"
        }
        self._save_all_to_db()

    def _save_all_to_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        for name, val in self.metrics.items():
            cursor.execute(
                'INSERT OR REPLACE INTO dashboard_metrics (metric_name, value, last_updated) VALUES (?, ?, ?)',
                (name, json.dumps(val), time.strftime("%Y-%m-%d %H:%M:%S"))
            )
        conn.commit()
        conn.close()

    def get_state(self):
        """Return current dashboard state snapshot."""
        self._load_state() # Ensure we have freshest data
        state = copy.deepcopy(self.metrics)
        state["last_updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
        return state

    def update_metric(self, metric_name, value, operation="set"):
        """Update a dashboard metric and persist to DB."""
        self._load_state()
        old_value = self.metrics.get(metric_name)

        if operation == "set":
            self.metrics[metric_name] = value
        elif operation == "increment":
            if isinstance(self.metrics.get(metric_name), (int, float)):
                self.metrics[metric_name] += value
            else:
                self.metrics[metric_name] = value
        elif operation == "multiply":
            if isinstance(self.metrics.get(metric_name), (int, float)):
                self.metrics[metric_name] = round(self.metrics[metric_name] * value, 2)

        # Persist change
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT OR REPLACE INTO dashboard_metrics (metric_name, value, last_updated) VALUES (?, ?, ?)',
            (metric_name, json.dumps(self.metrics[metric_name]), time.strftime("%Y-%m-%d %H:%M:%S"))
        )
        conn.commit()
        conn.close()

        self.history.append({
            "metric": metric_name,
            "old_value": old_value,
            "new_value": self.metrics[metric_name],
            "operation": operation,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })

    def get_changes(self):
        """Return all changes made during this session."""
        return copy.deepcopy(self.history)

    def reset(self):
        """Reset dashboard to initial state in DB."""
        self._reset_to_defaults()
        self.history = []
