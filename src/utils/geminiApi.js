// Gemini AI Analysis Service for Project TAILOR
// One comprehensive API call returns the complete structured audit report

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Master CV analysis via Gemini 1.5 Flash.
 * Returns a fully structured report with scores, gaps, strengths, action plan, and resources.
 */
export async function analyzeWithGemini(cvText, jdMode, jdText, daysRemaining, apiKey) {
  if (!apiKey) throw new Error('No Gemini API key provided.');

  const modeDescription = {
    no_jd: 'General Master CV Audit (no specific job description — evaluate overall quality, formatting, impact, and universally needed improvements)',
    preset_jd: 'Targeted JD Fit Analysis (evaluate the CV specifically against the provided job description)',
    custom_jd: 'Custom JD Fit Analysis (evaluate the CV specifically against the user-provided job description)'
  }[jdMode];

  const prompt = `You are an expert Executive CV Auditor and Career Services Director for a top business school. 
Analyze the CV below and return a comprehensive structured audit report.

=== MODE ===
${modeDescription}

=== STUDENT CV ===
"""
${cvText.slice(0, 8000)}
"""

=== TARGET JOB DESCRIPTION (if applicable) ===
"""
${jdText || 'N/A — General Master CV Audit Mode'}
"""

=== DAYS REMAINING UNTIL PLACEMENT DRIVE ===
${daysRemaining} days

=== YOUR TASK ===
Return ONLY a valid JSON object (no markdown, no backticks, no commentary). The JSON must match this exact schema:

{
  "overallFitScore": <number 0-100, integer>,
  "modeLabel": "<string: brief description of what was evaluated>",
  "keywordMatchRatio": <number 0-100, integer>,
  "matchedKeywords": ["<keyword>", ...],
  "missingKeywords": ["<keyword>", ...],
  "categories": [
    { "name": "<dimension name>", "score": <number 0-100> },
    { "name": "<dimension name>", "score": <number 0-100> },
    { "name": "<dimension name>", "score": <number 0-100> },
    { "name": "<dimension name>", "score": <number 0-100> }
  ],
  "strengths": [
    { "title": "<short title>", "detail": "<1-2 sentences with specific evidence from the CV>", "impact": "<High | Medium | Strong Baseline>" }
  ],
  "gaps": [
    { "id": "gap-1", "skill": "<gap title>", "priority": "<Critical Gap | Recommended>", "recommendation": "<specific, actionable recommendation referencing the CV content>" }
  ],
  "actionPlan": {
    "summary": "<1 sentence summary of the time-boxed strategy>",
    "items": [
      {
        "id": "ap-1",
        "title": "<action title>",
        "timeframe": "<e.g. Day 1-2>",
        "description": "<specific action>",
        "type": "<immediate | short_term | strategic>",
        "resources": [
          { "title": "<Resource Name>", "url": "<valid URL to a real resource>", "type": "<course | article | tool | certification>" }
        ]
      }
    ]
  },
  "atsScore": <number 0-100, integer>,
  "atsTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

IMPORTANT RULES:
1. Be SPECIFIC to the actual CV content — mention real skills, companies, projects you see in the CV
2. Categories must be contextually relevant to the JD mode (e.g., "JD Keyword Alignment", "Quantified Impact", "Leadership Evidence", "Technical Proficiency")
3. Action plan items must be REALISTIC for ${daysRemaining} days — if < 4 days, focus on quick wins (reformatting, adding metrics, revising bullets). If 7-14 days, include short courses. If 15+ days, include certifications.
4. Resource URLs must be REAL (Coursera, LinkedIn Learning, YouTube, Google, GitHub, etc.)
5. Return 2-4 strengths and 2-5 gaps minimum
6. JSON must be valid — no trailing commas, no undefined values`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error('Empty response from Gemini API');

    // Clean any accidental markdown wrappers
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    
    // Validate the response has minimum required fields
    if (typeof parsed.overallFitScore !== 'number' || !Array.isArray(parsed.categories)) {
      throw new Error('Gemini response structure is invalid');
    }

    // Normalize the action plan structure to be compatible with actionPlanEngine format
    if (parsed.actionPlan?.items) {
      parsed.actionItems = parsed.actionPlan.items;
    }

    return { ...parsed, source: 'gemini' };
  } catch (err) {
    console.error('Gemini API error:', err);
    throw err;
  }
}
