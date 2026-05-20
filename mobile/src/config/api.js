/**
 * API Configuration & Helper Functions
 * Handles communication with the Flask backend.
 */
import { Platform } from 'react-native';

// Backend URL — Live Cloud Run Service
const getBaseUrl = () => {
  return 'https://omnitask-api-238789075812.us-central1.run.app';
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
