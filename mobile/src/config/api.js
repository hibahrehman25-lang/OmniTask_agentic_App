/**
 * API Configuration & Helper Functions
 * Handles communication with the Flask backend.
 */
import { Platform } from 'react-native';

// Backend URL — adjust based on platform
// Android emulator uses 10.0.2.2 for host localhost
// Physical device: replace with your computer's local IP (e.g., 192.168.1.x)
const getBaseUrl = () => {
  // REPLACE THIS WITH YOUR COMPUTER'S LOCAL IP (found via ipconfig / ifconfig)
  const LOCAL_IP = '192.168.100.12'; // Example IP

  if (Platform.OS === 'android') {
    return `http://${LOCAL_IP}:5000`; // Use 10.0.2.2 for emulator, LOCAL_IP for physical device
  }
  // iOS simulator & web use localhost, but physical iOS needs LOCAL_IP
  return `http://${LOCAL_IP}:5000`;
};

export const API_BASE_URL = getBaseUrl();

/**
 * Run the full analysis pipeline on input text
 */
export async function analyzeText(text) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch sample scenarios for demo
 */
export async function getSampleScenarios() {
  const response = await fetch(`${API_BASE_URL}/api/sample-scenarios`);
  if (!response.ok) throw new Error('Failed to load scenarios');
  return response.json();
}

/**
 * Fetch analysis history
 */
export async function getHistory() {
  const response = await fetch(`${API_BASE_URL}/api/history`);
  if (!response.ok) throw new Error('Failed to load history');
  return response.json();
}

/**
 * Health check
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
