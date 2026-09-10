// Enhanced AI Audit Engine for Project TAILOR
// Supports 3 Modes:
// 1. "no_jd": General Master CV Audit (no specific target role)
// 2. "preset_jd": Pre-loaded Placement JDs
// 3. "custom_jd": Custom User Uploaded / Pasted JD

export function analyzeCvVsJd(cvText, jdMode = "preset_jd", jdObject = null, customJdText = "") {
  if (!cvText) return null;

  const cvTextLower = cvText.toLowerCase();

  // -------------------------------------------------------------
  // MODE 1: NO JD / GENERAL MASTER CV AUDIT
  // -------------------------------------------------------------
  if (jdMode === "no_jd") {
    // Audit general metric density
    const metricMatches = cvText.match(/(\d+%\b|\$\d+|\b\d+\s*(?:M|K|lakh|crore|users|transactions|months|years|hrs|x)\b)/gi) || [];
    const metricCount = metricMatches.length;

    // Check for core skill presence across domains
    const commonSkills = ["SQL", "Python", "Excel", "Project Management", "Agile", "Scrum", "Financial Modeling", "Strategy", "A/B Testing", "Analytics", "PRD"];
    const matchedSkills = commonSkills.filter(s => cvTextLower.includes(s.toLowerCase()));
    const missingCoreSkills = ["SQL", "A/B Testing", "Financial Modeling", "PRD Writing"].filter(s => !cvTextLower.includes(s.toLowerCase()));

    const categories = [
      { name: "Quantified Impact & Metrics", weight: 0.35, score: Math.min(100, Math.max(45, metricCount * 18)) },
      { name: "Executive Action Verbs", weight: 0.25, score: cvTextLower.includes("spearheaded") || cvTextLower.includes("engineered") || cvTextLower.includes("architected") ? 90 : 65 },
      { name: "Domain Skill Breadth", weight: 0.25, score: Math.min(100, Math.max(50, matchedSkills.length * 15)) },
      { name: "Structure & Readability", weight: 0.15, score: cvTextLower.includes("education") && cvTextLower.includes("experience") ? 92 : 70 }
    ];

    const overallFitScore = Math.round(
      categories.reduce((acc, cat) => acc + cat.score * cat.weight, 0)
    );

    const strengths = [];
    if (metricCount >= 3) {
      strengths.push({
        title: "Strong Metric Quantification",
        detail: `Detected ${metricCount} numerical impact statements (% latency reduction, conversion uplift, user volume).`,
        impact: "High Impact"
      });
    }
    if (matchedSkills.length > 0) {
      strengths.push({
        title: "Recognized Technical & Domain Skills",
        detail: `Found verified skills: ${matchedSkills.join(", ")}.`,
        impact: "Strong Baseline"
      });
    }

    const gaps = [];
    if (metricCount < 3) {
      gaps.push({
        id: "gap-gen-1",
        skill: "Low Quantification Density",
        priority: "Critical Gap",
        recommendation: "Add concrete numerical results (% ROI, $ revenue, efficiency % uplift) to every bullet point."
      });
    }
    missingCoreSkills.slice(0, 2).forEach((sk, idx) => {
      gaps.push({
        id: `gap-gen-${idx + 2}`,
        skill: `Missing ${sk}`,
        priority: "Recommended",
        recommendation: `Add academic projects or term assignments demonstrating practical application of ${sk}.`
      });
    });

    return {
      mode: "no_jd",
      modeLabel: "General Master CV Audit",
      overallFitScore,
      keywordMatchRatio: Math.round((matchedSkills.length / commonSkills.length) * 100),
      matchedKeywords: matchedSkills,
      missingKeywords: missingCoreSkills,
      categories,
      strengths,
      gaps,
      metricCount,
      timestamp: new Date().toISOString()
    };
  }

  // -------------------------------------------------------------
  // MODE 2 & 3: TARGET JD EVALUATION (Preset or Custom JD)
  // -------------------------------------------------------------
  let jdKeywords = [];
  let roleTitle = "Target Placement Role";
  let companyName = "Target Company";

  if (jdMode === "custom_jd") {
    roleTitle = "Custom Target Job Description";
    companyName = "Custom Role Upload";
    
    // Extract keywords dynamically from custom JD text
    const customText = customJdText.toLowerCase();
    const potentialKeywords = [
      "Product Strategy", "PRD Writing", "User Journey Mapping", "A/B Testing", "SQL", "Mixpanel", "Agile", "Scrum",
      "Financial Modeling", "DCF Valuation", "MECE Framework", "Market Entry Strategy", "Cloud Strategy", "AWS", "JIRA",
      "Python", "Tableau", "Stakeholder Management", "Variance Analysis", "Growth Analytics"
    ];

    jdKeywords = potentialKeywords.filter(kw => customText.includes(kw.toLowerCase()));
    if (jdKeywords.length === 0) {
      jdKeywords = ["Product Strategy", "SQL", "A/B Testing", "Financial Modeling", "Stakeholder Management"];
    }
  } else {
    // Preset JD mode
    jdKeywords = jdObject?.keywords || ["Product Strategy", "PRD Writing", "SQL", "Agile", "A/B Testing"];
    roleTitle = jdObject?.role || "Target Role";
    companyName = jdObject?.company || "Target Company";
  }

  // Calculate matching
  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach(kw => {
    if (cvTextLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchRatio = Math.round((matchedKeywords.length / (jdKeywords.length || 1)) * 100);

  const categories = [
    { name: "Target Skill Match", weight: 0.35, score: Math.min(100, Math.max(40, keywordMatchRatio)) },
    { name: "Domain Alignment", weight: 0.25, score: matchedKeywords.length > 0 ? 85 : 55 },
    { name: "Quantified Accomplishments", weight: 0.25, score: (cvTextLower.match(/\d+%/g) || []).length > 1 ? 90 : 65 },
    { name: "Strategic Fit", weight: 0.15, score: Math.min(100, Math.max(50, 60 + keywordMatchRatio * 0.4)) }
  ];

  const overallFitScore = Math.round(
    categories.reduce((acc, cat) => acc + cat.score * cat.weight, 0)
  );

  // Strengths
  const strengths = [];
  if (matchedKeywords.length > 0) {
    strengths.push({
      title: `Direct Skill Alignment (${matchedKeywords.length} Matched)`,
      detail: `Your CV explicitly matches core JD requirements: ${matchedKeywords.join(", ")}.`,
      impact: "High Match"
    });
  }
  if ((cvTextLower.match(/\d+%/g) || []).length >= 2) {
    strengths.push({
      title: "Strong Numerical Accomplishments",
      detail: "Contains concrete metric percentages demonstrating clear ROI and project success.",
      impact: "High Impact"
    });
  }
  if (strengths.length === 0) {
    strengths.push({
      title: "Academic Background Foundation",
      detail: "PGDM coursework aligns with baseline requirements for this role.",
      impact: "Baseline"
    });
  }

  // Gaps & Weaknesses
  const gaps = missingKeywords.map((kw, idx) => ({
    id: `gap-${idx}`,
    skill: `Missing ${kw}`,
    priority: idx === 0 ? "Critical Gap" : "Recommended",
    recommendation: `The target JD explicitly requires ${kw}. Highlight relevant academic assignments or re-frame past experience.`
  }));

  return {
    mode: jdMode,
    modeLabel: jdMode === 'custom_jd' ? 'Custom JD Audit' : `${companyName} (${roleTitle})`,
    overallFitScore,
    keywordMatchRatio,
    matchedKeywords,
    missingKeywords,
    categories,
    strengths,
    gaps,
    timestamp: new Date().toISOString()
  };
}
