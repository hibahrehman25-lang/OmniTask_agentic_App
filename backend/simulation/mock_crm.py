"""
Mock CRM System
Simulates a real Customer Relationship Management system with
customers, campaigns, tasks, and resource management.
"""
import time
import copy
import random


class MockCRM:
    """Simulated CRM database with realistic business data."""

    def __init__(self):
        self._reset_state()

    def _reset_state(self):
        """Initialize with realistic fake business data."""
        self.customers = [
            {"id": f"CUST-{i:04d}", "name": f"Customer {i}", "region": random.choice(["Lahore", "Karachi", "Islamabad", "Peshawar", "Multan"]),
             "segment": random.choice(["Enterprise", "SMB", "Retail"]), "lifetime_value": random.randint(5000, 500000),
             "satisfaction_score": round(random.uniform(2.5, 5.0), 1), "status": "active"}
            for i in range(1, 51)
        ]
        self.campaigns = [
            {"id": "CAMP-001", "name": "Q1 Retention Drive", "status": "active", "budget": 25000, "reach": 12000, "conversion_rate": 3.2},
            {"id": "CAMP-002", "name": "Regional Growth - Karachi", "status": "active", "budget": 18000, "reach": 8500, "conversion_rate": 4.1},
        ]
        self.tasks = []
        self.resources = {
            "Sales": {"staff": 12, "budget_remaining": 150000},
            "Marketing": {"staff": 8, "budget_remaining": 95000},
            "Operations": {"staff": 15, "budget_remaining": 200000},
            "Support": {"staff": 10, "budget_remaining": 75000},
        }

    def get_state(self):
        """Return current CRM state snapshot."""
        return {
            "total_customers": len(self.customers),
            "active_campaigns": len([c for c in self.campaigns if c["status"] == "active"]),
            "total_campaigns": len(self.campaigns),
            "open_tasks": len([t for t in self.tasks if t["status"] == "open"]),
            "avg_satisfaction": round(sum(c["satisfaction_score"] for c in self.customers) / len(self.customers), 2),
            "total_revenue_pipeline": sum(c["lifetime_value"] for c in self.customers),
            "regions": list(set(c["region"] for c in self.customers)),
            "resource_summary": {k: v["staff"] for k, v in self.resources.items()}
        }

    def create_campaign(self, name, target_segment, budget, duration_days):
        """Create a new marketing campaign."""
        campaign_id = f"CAMP-{len(self.campaigns) + 1:03d}"
        campaign = {
            "id": campaign_id,
            "name": name,
            "status": "active",
            "target_segment": target_segment,
            "budget": budget,
            "duration_days": duration_days,
            "reach": random.randint(3000, 15000),
            "projected_conversion_rate": round(random.uniform(2.0, 6.0), 1),
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.campaigns.append(campaign)
        return campaign

    def create_task(self, title, assigned_to, priority, due_days):
        """Create a new task in the CRM."""
        task_id = f"TASK-{len(self.tasks) + 1:03d}"
        task = {
            "id": task_id,
            "title": title,
            "assigned_to": assigned_to,
            "priority": priority,
            "status": "open",
            "due_date": time.strftime("%Y-%m-%d", time.localtime(time.time() + due_days * 86400)),
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.tasks.append(task)
        return task

    def get_customer_segment(self, segment="all"):
        """Get customers matching a segment."""
        if segment == "all" or segment not in ["Enterprise", "SMB", "Retail", "Sales", "Marketing", "Operations"]:
            selected = random.sample(self.customers, min(20, len(self.customers)))
        else:
            selected = [c for c in self.customers if c["segment"] == segment or c["region"] == segment]
            if not selected:
                selected = random.sample(self.customers, min(10, len(self.customers)))
        return [{"id": c["id"], "name": c["name"], "email": f"{c['name'].lower().replace(' ', '.')}@example.com"} for c in selected]

    def reallocate_resources(self, department, additional_staff, budget_increase):
        """Reallocate resources to a department."""
        if department in self.resources:
            self.resources[department]["staff"] += additional_staff
            self.resources[department]["budget_remaining"] += budget_increase
        else:
            self.resources[department] = {"staff": additional_staff, "budget_remaining": budget_increase}
        return {
            "department": department,
            "new_staff_count": self.resources[department]["staff"],
            "new_budget": self.resources[department]["budget_remaining"],
            "action": f"Added {additional_staff} staff and ${budget_increase:,} budget to {department}"
        }

    def reset(self):
        """Reset CRM to initial state."""
        self._reset_state()
