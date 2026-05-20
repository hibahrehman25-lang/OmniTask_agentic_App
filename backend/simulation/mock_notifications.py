"""
Mock Notification System
Simulates email, SMS, and alert notifications with delivery tracking.
"""
import time
import random


class MockNotificationSystem:
    """Simulated notification system with multi-channel support."""

    def __init__(self):
        self.sent_notifications = []
        self.alerts = []
        self.escalations = []

    def send_bulk(self, channel, recipients, subject, message):
        """Send bulk notifications to a list of recipients."""
        notification = {
            "id": f"NOTIF-{len(self.sent_notifications) + 1:04d}",
            "channel": channel,
            "subject": subject,
            "message": message[:200],
            "recipients_count": len(recipients),
            "delivered": len(recipients) - random.randint(0, max(1, len(recipients) // 20)),
            "failed": random.randint(0, max(1, len(recipients) // 20)),
            "open_rate": round(random.uniform(15.0, 45.0), 1),
            "status": "delivered",
            "sent_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.sent_notifications.append(notification)
        return notification

    def send_alert(self, severity, title, message, recipients):
        """Send an alert to specific stakeholders."""
        alert = {
            "id": f"ALERT-{len(self.alerts) + 1:03d}",
            "severity": severity,
            "title": title,
            "message": message[:300],
            "recipients": recipients,
            "acknowledged_by": [],
            "status": "sent",
            "channels_used": ["email", "sms", "in_app"],
            "sent_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.alerts.append(alert)
        return alert

    def escalate(self, issue, severity, escalation_path):
        """Escalate an issue through management chain."""
        escalation = {
            "id": f"ESC-{len(self.escalations) + 1:03d}",
            "issue": issue[:200],
            "severity": severity,
            "escalation_path": escalation_path,
            "current_level": escalation_path[0] if escalation_path else "unknown",
            "status": "escalated",
            "escalated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "response_deadline": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() + 7200))
        }
        self.escalations.append(escalation)
        return escalation

    def get_state(self):
        """Return notification system state."""
        return {
            "total_notifications_sent": len(self.sent_notifications),
            "active_alerts": len([a for a in self.alerts if a["status"] == "sent"]),
            "open_escalations": len([e for e in self.escalations if e["status"] == "escalated"]),
            "total_recipients_reached": sum(n["delivered"] for n in self.sent_notifications)
        }

    def reset(self):
        """Reset notification system."""
        self.sent_notifications = []
        self.alerts = []
        self.escalations = []
