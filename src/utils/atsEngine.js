// ATS Compliance & Formatting Auditor for Project TAILOR

export function auditAtsCompliance(cvText) {
  if (!cvText) return null;

  const issues = [];
  let score = 100;

  // 1. Check for Contact Info completeness
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\d{10}/;

  const hasEmail = emailRegex.test(cvText);
  const hasPhone = phoneRegex.test(cvText);

  if (!hasEmail) {
    issues.push({ severity: "High", rule: "Missing Contact Email", detail: "Valid email address was not detected in standard header." });
    score -= 15;
  }
  if (!hasPhone) {
    issues.push({ severity: "Medium", rule: "Missing Phone Number", detail: "10-digit mobile contact number missing." });
    score -= 10;
  }

  // 2. Check Action Verbs and Metric Quantification
  const metricMatches = cvText.match(/(\d+%\b|\$\d+|\b\d+\s*(?:M|K|lakh|crore|users|transactions|months|years|hrs|x)\b)/gi) || [];
  const metricDensity = metricMatches.length;

  if (metricDensity < 3) {
    issues.push({
      severity: "High",
      rule: "Low Metric Quantification Ratio",
      detail: `Only ${metricDensity} quantified metrics detected. Recruiters and ATS parser prioritize bullet points with specific numerical results (% uplift, $ savings, user volume).`
    });
    score -= 20;
  }

  // 3. Prohibited Formatting Elements (Tables / Graphics / Multi-column indicators)
  if (cvText.includes("│") || cvText.includes("┌") || cvText.includes("\t\t\t")) {
    issues.push({
      severity: "High",
      rule: "Complex Column or Table Layout Detected",
      detail: "Tables or multi-column text structures can cause ATS parsing errors and misplaced section text."
    });
    score -= 15;
  }

  // 4. Section Heading Standards
  const standardHeadings = ["summary", "education", "experience", "projects", "certifications", "skills"];
  const textLower = cvText.toLowerCase();
  const foundHeadings = standardHeadings.filter(h => textLower.includes(h));

  if (foundHeadings.length < 4) {
    issues.push({
      severity: "Medium",
      rule: "Non-Standard Section Headings",
      detail: "Use clear standard headings (e.g. 'EDUCATION', 'PROFESSIONAL EXPERIENCE', 'SKILLS & CERTIFICATIONS') for high ATS accuracy."
    });
    score -= 10;
  }

  // 5. Weak Action Verb Scanner
  const weakVerbs = ["handled", "responsible for", "worked on", "assisted in", "helped with"];
  const foundWeakVerbs = weakVerbs.filter(w => textLower.includes(w));

  if (foundWeakVerbs.length > 0) {
    issues.push({
      severity: "Low",
      rule: "Passive / Weak Action Verbs Detected",
      detail: `Replace passive phrases (${foundWeakVerbs.join(", ")}) with strong action verbs (e.g., 'Engineered', 'Spearheaded', 'Architected', 'Formulated').`
    });
    score -= 5;
  }

  score = Math.max(40, score);

  return {
    atsScore: score,
    status: score >= 85 ? "ATS Compliant" : score >= 70 ? "Needs Minor Formatting Fixes" : "High Parsing Risk",
    metricCount: metricDensity,
    issues,
    scannedLength: cvText.length,
    timestamp: new Date().toISOString()
  };
}
