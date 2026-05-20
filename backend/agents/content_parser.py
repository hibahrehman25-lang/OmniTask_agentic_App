"""
Agent 1: Content Parser
Takes raw text input and extracts structured facts, entities, and metrics.
"""
import json
import time
from . import BaseAgent


class ContentParserAgent(BaseAgent):
    """Parses raw unstructured text into structured business data."""

    def __init__(self, client):
        super().__init__(client)
        self.name = "ContentParser"

    def run(self, raw_input):
        """
        Parse raw text or file inputs into structured facts.
        Returns: (parsed_data, trace)
        """
        start = time.time()
        
        raw_text = ""
        file_bytes = None
        mime_type = None
        file_info = ""

        # Handle dictionary payload from the app.py backend route
        if isinstance(raw_input, dict):
            raw_text = raw_input.get("text", "").strip()
            file_b64 = raw_input.get("file")
            file_type = raw_input.get("file_type")
            
            if file_b64:
                import base64
                import io
                try:
                    # Fix padding if missing
                    file_b64 += "=" * ((4 - len(file_b64) % 4) % 4)
                    file_bytes = base64.b64decode(file_b64)
                    
                    # 1. Multimodal Binary Formats (Passed directly to Gemini)
                    if file_type == "pdf":
                        mime_type = "application/pdf"
                        file_info = "\n[File attached: PDF document]"
                    elif file_type == "image":
                        mime_type = "image/jpeg"
                        file_info = "\n[File attached: Image]"
                    
                    # 2. Tabular/Spreadsheet Format (Parsed in Python)
                    elif file_type == "csv":
                        import csv
                        csv_text = file_bytes.decode('utf-8', errors='ignore')
                        reader = csv.reader(io.StringIO(csv_text))
                        rows = list(reader)
                        formatted_csv = "\n".join([" | ".join(row) for row in rows[:100]]) # Max 100 rows
                        raw_text = f"{raw_text}\n\nCSV SPREADSHEET DATA ATTACHED:\n{formatted_csv}".strip()
                        file_bytes = None # Converted to text
                    
                    # 3. Plain Text Ingestion
                    elif file_type == "txt":
                        txt_content = file_bytes.decode('utf-8', errors='ignore')
                        raw_text = f"{raw_text}\n\nPLAIN TEXT FILE ATTACHED:\n{txt_content}".strip()
                        file_bytes = None
                    
                    # 4. Zip Archives
                    elif file_type == "zip":
                        import zipfile
                        zip_buffer = io.BytesIO(file_bytes)
                        zip_contents = []
                        with zipfile.ZipFile(zip_buffer) as z:
                            file_list = z.namelist()
                            zip_contents.append(f"Zip Archive contents ({len(file_list)} files):")
                            for name in file_list[:15]: # First 15 files
                                zip_contents.append(f"- {name}")
                                ext = name.split('.')[-1].lower()
                                if ext in ['txt', 'csv', 'json', 'xml', 'md']:
                                    try:
                                        with z.open(name) as f:
                                            content = f.read().decode('utf-8', errors='ignore')[:500]
                                            zip_contents.append(f"  [Preview content:\n{content}...\n  ]")
                                    except Exception:
                                        pass
                        raw_text = f"{raw_text}\n\nZIP ARCHIVE ATTACHED:\n" + "\n".join(zip_contents)
                        raw_text = raw_text.strip()
                        file_bytes = None
                    
                    # 5. Microsoft Word Ingestion (Zero-dependency paragraph XML parser)
                    elif file_type == "docx":
                        import zipfile
                        import xml.etree.ElementTree as ET
                        docx_buffer = io.BytesIO(file_bytes)
                        try:
                            with zipfile.ZipFile(docx_buffer) as docx:
                                xml_content = docx.read('word/document.xml')
                                root = ET.fromstring(xml_content)
                                paragraphs = []
                                for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                                    texts = [node.text for node in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                                    if texts:
                                        paragraphs.append("".join(texts))
                                docx_text = "\n".join(paragraphs)
                                raw_text = f"{raw_text}\n\nWORD DOCUMENT (.docx) TEXT ATTACHED:\n{docx_text}".strip()
                        except Exception as docx_err:
                            raw_text = f"{raw_text}\n\n[Failed to extract Word XML: {str(docx_err)}]"
                        file_bytes = None
                    
                    # 6. Microsoft Excel Ingestion (Zero-dependency XML grid parser)
                    elif file_type == "xlsx":
                        import zipfile
                        import xml.etree.ElementTree as ET
                        xlsx_buffer = io.BytesIO(file_bytes)
                        try:
                            with zipfile.ZipFile(xlsx_buffer) as xlsx:
                                # Parse shared strings dictionary
                                shared_strings = []
                                try:
                                    ss_content = xlsx.read('xl/sharedStrings.xml')
                                    ss_root = ET.fromstring(ss_content)
                                    for t_tag in ss_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                                        shared_strings.append(t_tag.text or "")
                                except Exception:
                                    pass
                                
                                # Read sheet1 grid rows
                                sheet_content = xlsx.read('xl/worksheets/sheet1.xml')
                                sheet_root = ET.fromstring(sheet_content)
                                sheet_rows = []
                                for row in sheet_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
                                    row_vals = []
                                    for c in row.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                                        t_attr = c.get('t')
                                        v_tag = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                                        val = ""
                                        if v_tag is not None:
                                            val = v_tag.text or ""
                                            if t_attr == 's' and shared_strings:
                                                try:
                                                    val = shared_strings[int(val)]
                                                except (ValueError, IndexError):
                                                    pass
                                        row_vals.append(val)
                                    sheet_rows.append(" | ".join(row_vals))
                                excel_text = "\n".join(sheet_rows[:100]) # Max 100 cells/rows
                                raw_text = f"{raw_text}\n\nEXCEL (.xlsx) SHEET 1 SPREADSHEET ATTACHED:\n{excel_text}".strip()
                        except Exception as xlsx_err:
                            raw_text = f"{raw_text}\n\n[Failed to extract Excel XML: {str(xlsx_err)}]"
                        file_bytes = None

                except Exception as b64_err:
                    raw_text = f"{raw_text}\n\n[Failed to decode base64 file payload: {str(b64_err)}]"
        else:
            raw_text = str(raw_input).strip()

        prompt = f"""You are Agent 01 — Input Ingestion Agent in an Antigravity-orchestrated multi-agent system.
Your ONLY job: receive raw input → clean it → structure it → pass to Agent 02.

## Extended domain detection:
- "business" → sales reports, revenue data, company performance
- "logistics" → supply chain, delivery, inventory, shipping
- "finance" → banking, investments, market data, budgets
- "policy" → government decisions, regulations, laws, tariffs
- "news" → current events, press releases, media articles
- "urban" → city infrastructure, traffic, utilities, municipal
- "healthcare" → hospital data, patient reports, medical supply
- "agriculture" → crop reports, weather impact on farming
- "education" → enrollment, exam results, institution reports
- "energy" → fuel prices, power grid, oil & gas
- "mixed" → when 2+ domains are clearly present
- "unknown" → only if truly unclassifiable

## Input validation rules:
- Under 30 words → set ingestion_status: "partial", set quality_flags.short_input: true
- Non-English detected → translate to English, set quality_flags.non_english: true, keep original in "original_text"
- Completely unreadable → ingestion_status: "failed"
- Contains only numbers/tables with no context → set quality_flags.ambiguous_domain: true

Return ONLY a valid JSON object (no markdown) with this structure:
{{
  "input_type": "article | report | dashboard | policy | other",
  "title": "string or null",
  "source": "string or null",
  "date": "YYYY-MM-DD or null",
  "domain": "one of the domains listed above",
  "language_detected": "en | ur | ar | other",
  "original_text": "only if non-English, else null",
  "cleaned_text": "full cleaned body text",
  "word_count": 0,
  "key_entities": ["list"],
  "key_numbers": ["list"],
  "ingestion_status": "success | partial | failed",
  "quality_flags": {{
    "short_input": false,
    "non_english": false,
    "ambiguous_domain": false
  }},
  "reasoning": "Brief internal logic for domain/validation",
  "options_considered": ["Domain A vs B", "..."]
}}

TEXT TO ANALYZE:{file_info}
\"\"\"
{raw_text}
\"\"\"
"""
        try:
            # Construct multimodel content array if PDF/Image bytes are attached
            if file_bytes and mime_type:
                from google.genai import types
                contents = [
                    prompt,
                    types.Part.from_bytes(
                        data=file_bytes,
                        mime_type=mime_type
                    )
                ]
            else:
                contents = prompt

            response = self.client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=contents
            )
            response_text = response.text
            parsed = self._parse_json_response(response_text)
            duration = int((time.time() - start) * 1000)

            # Standardized Agent Trace
            trace = self._create_trace(
                reasoning_steps=[
                    f"Detected language: {parsed.get('language_detected', 'unknown')}",
                    f"Identified input type based on content structure",
                    f"Domain assigned: {parsed.get('domain')}",
                    f"Word count: {parsed.get('word_count', 0)}"
                ],
                options_considered=parsed.get("options_considered", ["Considered business vs news"]),
                decision_made=f"Assigned domain {parsed.get('domain')} and status {parsed.get('ingestion_status')}",
                duration_ms=duration
            )
            
            return parsed, trace

        except Exception as e:
            import traceback
            traceback.print_exc()
            duration = int((time.time() - start) * 1000)
            fallback = {
                "domain": "unknown",
                "ingestion_status": "failed",
                "quality_flags": {"short_input": False, "non_english": False, "ambiguous_domain": True}
            }
            trace = self._create_trace(
                reasoning_steps=[f"Error during ingestion: {str(e)}"],
                options_considered=["Attempted full parse"],
                decision_made="Failing ingestion due to error",
                duration_ms=duration,
                status="error"
            )
            return fallback, trace
