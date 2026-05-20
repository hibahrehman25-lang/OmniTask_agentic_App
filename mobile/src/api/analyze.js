export async function analyzeContent({ text, file, fileType }) {
  // Hardcoded production backend URL (omnitask-api)
  const API_BASE_URL = 'https://omnitask-api-238789075812.us-central1.run.app';
  
  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
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
