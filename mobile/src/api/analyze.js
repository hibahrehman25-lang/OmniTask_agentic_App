import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export async function analyzeContent({ text, file, fileType }) {
  // Retrieve the user configured backend URL dynamically on each execution
  const storedUrl = await AsyncStorage.getItem('backendUrl');
  
  // Default to correct localhost routing based on Platform
  // Android emulator requires 10.0.2.2 to access host's localhost
  const defaultUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://127.0.0.1:5000';
  const API_BASE_URL = storedUrl || defaultUrl;
  
  // Strip trailing slashes to guarantee clean URL concatenation
  const cleanUrl = API_BASE_URL.trim().replace(/\/$/, "");

  const res = await fetch(`${cleanUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text || '',
      file: file || null,
      file_type: fileType || null,
    }),
    // 90 second timeout constraint specified in Part 11
    signal: AbortSignal.timeout(90000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  
  return res.json();
}
