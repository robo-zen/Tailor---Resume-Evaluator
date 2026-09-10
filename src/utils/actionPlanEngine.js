// Dynamic Time-Boxed Action Plan Generator for Project TAILOR
// Generates specific, time-boxed action items based on CV gaps with real resource links

const SKILL_RESOURCES = {
  'SQL': [
    { title: 'SQL for Data Analysis — Mode Analytics', url: 'https://mode.com/sql-tutorial/', type: 'course' },
    { title: 'SQL Crash Course — freeCodeCamp YouTube', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', type: 'course' },
  ],
  'Python': [
    { title: 'Python for Everybody — Coursera', url: 'https://www.coursera.org/specializations/python', type: 'course' },
    { title: 'Python Data Analysis with Pandas — YouTube', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', type: 'course' },
  ],
  'A/B Testing': [
    { title: 'A/B Testing — Udacity Free Course', url: 'https://www.udacity.com/course/ab-testing--ud257', type: 'course' },
    { title: 'A/B Testing Guide — Optimizely', url: 'https://www.optimizely.com/optimization-glossary/ab-testing/', type: 'article' },
  ],
  'Financial Modeling': [
    { title: 'Financial Modeling — CFI Free Intro', url: 'https://corporatefinanceinstitute.com/course/free-excel-crash-course/', type: 'course' },
    { title: 'Financial Modeling Fundamentals — YouTube', url: 'https://www.youtube.com/watch?v=P-ofrp0Gex4', type: 'course' },
  ],
  'Product Strategy': [
    { title: 'Product Strategy — Reforge', url: 'https://www.reforge.com/product-strategy', type: 'course' },
    { title: 'Stratechery — Product Strategy Essays', url: 'https://stratechery.com/', type: 'article' },
  ],
  'PRD Writing': [
    { title: 'How to Write a PRD — Product School', url: 'https://productschool.com/blog/product-management-2/write-prd/', type: 'article' },
    { title: 'PRD Template — Notion', url: 'https://www.notion.so/templates/product-requirements-document', type: 'tool' },
  ],
  'Agile': [
    { title: 'Agile Fundamentals — Coursera (Free Audit)', url: 'https://www.coursera.org/learn/agile-development', type: 'course' },
    { title: 'Scrum Guide 2020 — Official', url: 'https://scrumguides.org/', type: 'article' },
  ],
  'Tableau': [
    { title: 'Tableau Public Free Training', url: 'https://www.tableau.com/learn/training', type: 'course' },
    { title: 'Tableau for Beginners — YouTube', url: 'https://www.youtube.com/watch?v=TPMlZxRRaBQ', type: 'course' },
  ],
  'DCF Valuation': [
    { title: 'DCF Valuation Tutorial — CFI', url: 'https://corporatefinanceinstitute.com/resources/valuation/dcf-model-training-free-guide/', type: 'article' },
    { title: 'DCF Fundamentals — YouTube Aswath Damodaran', url: 'https://www.youtube.com/watch?v=TwEgolVBLEE', type: 'course' },
  ],
  'MECE Framework': [
    { title: 'MECE Principle Explained — McKinsey', url: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights', type: 'article' },
    { title: 'MECE & Consulting Frameworks — YouTube', url: 'https://www.youtube.com/watch?v=FMR5jFI3BQQ', type: 'course' },
  ],
  'default': [
    { title: 'LinkedIn Learning — Professional Skills', url: 'https://www.linkedin.com/learning/', type: 'course' },
    { title: 'Coursera Free Courses', url: 'https://www.coursera.org/courses?query=free', type: 'course' },
  ]
};

function getResources(skillName) {
  const key = Object.keys(SKILL_RESOURCES).find(k =>
    skillName.toLowerCase().includes(k.toLowerCase())
  );
  return SKILL_RESOURCES[key] || SKILL_RESOURCES.default;
}

export function generateActionPlan(daysRemaining, analysisReport) {
  const days = parseInt(daysRemaining) || 7;
  const missingSkills = analysisReport?.missingKeywords || [];
  const topSkill = missingSkills[0] || 'Target Domain Skills';
  const secondSkill = missingSkills[1] || 'Metric Quantification';

  if (days <= 4) {
    // ── Sprint Mode (2–4 days) ──────────────────────────────────
    return {
      daysRemaining: days,
      actionItems: [
        {
          id: 'sp-1',
          title: `Rewrite Bullets to Include ${topSkill}`,
          timeframe: 'Day 1 — 90 min',
          type: 'immediate',
          description: `Using the Context-Action-Result format, rewrite your top 4–5 experience bullets to naturally incorporate ${topSkill} with quantified metrics (%, $, volume).`,
          resources: getResources(topSkill),
        },
        {
          id: 'sp-2',
          title: `Address ${secondSkill} via PGDM Coursework`,
          timeframe: 'Day 1–2 — 1 hr',
          type: 'immediate',
          description: `Add a "Key Academic Deliverables" section highlighting PGDM projects where ${secondSkill} was applied. Even theoretical exposure counts if framed well.`,
          resources: getResources(secondSkill),
        },
        {
          id: 'sp-3',
          title: 'Craft STAR Interview Stories',
          timeframe: 'Day 2–3 — 1 hr',
          type: 'short_term',
          description: `Prepare 2 structured STAR (Situation, Task, Action, Result) stories for the top skill gaps. Recruiters may probe these in the first interview round.`,
          resources: [
            { title: 'STAR Method Guide — Indeed', url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique', type: 'article' },
          ],
        },
        {
          id: 'sp-4',
          title: 'CCS Verification Lock & Submit',
          timeframe: `Day ${days} — 30 min`,
          type: 'immediate',
          description: 'Cross-check CGPA and certifications against GLIM Master Records, then submit to CCS Admin placement queue.',
          resources: [],
        },
      ],
    };
  }

  if (days <= 14) {
    // ── Focused Mode (5–14 days) ──────────────────────────────────
    return {
      daysRemaining: days,
      actionItems: [
        {
          id: 'fm-1',
          title: `Fast-Track Mini-Course: ${topSkill}`,
          timeframe: 'Days 1–3 — 5 hrs',
          type: 'short_term',
          description: `Enroll in a focused online micro-course to build credibility in ${topSkill}. Complete at least one graded assignment or project to add to your CV.`,
          resources: getResources(topSkill),
        },
        {
          id: 'fm-2',
          title: `Portfolio Case Study for ${topSkill}`,
          timeframe: 'Days 4–6 — 4 hrs',
          type: 'short_term',
          description: `Build a 1-page case study or GitHub project applying ${topSkill} to a real business problem. Link it from your CV header or LinkedIn profile.`,
          resources: [
            { title: 'GitHub Portfolio Guide', url: 'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/about-your-profile', type: 'tool' },
          ],
        },
        {
          id: 'fm-3',
          title: `Quantify ${secondSkill} Bullets`,
          timeframe: 'Day 7 — 2 hrs',
          type: 'immediate',
          description: `Update 4–5 experience bullets with concrete numbers: %, $, volume, time saved, user count. Every metric increases your perceived value.`,
          resources: getResources(secondSkill),
        },
        {
          id: 'fm-4',
          title: 'Peer Review & Mock Interview',
          timeframe: `Days ${days - 2}–${days - 1} — 2 hrs`,
          type: 'short_term',
          description: 'Request a 45-min mock review from a classmate or PGDM alum. Practice walking through your CV narrative against the target JD.',
          resources: [
            { title: 'InterviewBit Mock Interviews', url: 'https://www.interviewbit.com/peer-mock-interview/', type: 'tool' },
          ],
        },
        {
          id: 'fm-5',
          title: 'CCS Submit & Lock',
          timeframe: `Day ${days} — 30 min`,
          type: 'immediate',
          description: 'Submit final CV to CCS verification queue after confirming CGPA and certifications match GLIM records.',
          resources: [],
        },
      ],
    };
  }

  // ── Build Mode (15–30 days) ──────────────────────────────────
  return {
    daysRemaining: days,
    actionItems: [
      {
        id: 'bm-1',
        title: `Certification: ${topSkill}`,
        timeframe: 'Days 1–7 — 10 hrs',
        type: 'strategic',
        description: `Complete a recognized certification in ${topSkill}. Many Coursera certifications can be finished in 1–2 weeks with 10 hrs/week. Add the credential to your LinkedIn and CV.`,
        resources: getResources(topSkill),
      },
      {
        id: 'bm-2',
        title: `Certification / Skill: ${secondSkill}`,
        timeframe: 'Days 8–14 — 8 hrs',
        type: 'strategic',
        description: `Build and demonstrate competency in ${secondSkill} through a structured course and apply it in an academic or personal project.`,
        resources: getResources(secondSkill),
      },
      {
        id: 'bm-3',
        title: 'End-to-End Portfolio Project',
        timeframe: 'Days 10–20 — 12 hrs',
        type: 'strategic',
        description: `Build a complete end-to-end project (e.g., SQL dashboard, financial model, product teardown) demonstrating all key skills. Host on GitHub or Notion and link from your CV.`,
        resources: [
          { title: 'Kaggle — Datasets & Notebooks', url: 'https://www.kaggle.com/', type: 'tool' },
          { title: 'Notion Portfolio Templates', url: 'https://www.notion.so/templates/portfolio', type: 'tool' },
        ],
      },
      {
        id: 'bm-4',
        title: 'Networking & JD Research',
        timeframe: `Days ${days - 7}–${days - 4} — 4 hrs`,
        type: 'strategic',
        description: 'Connect with 5 GLIM alumni working in your target domain. Use LinkedIn to research the exact skills and experiences they highlight. Refine your CV narrative accordingly.',
        resources: [
          { title: 'LinkedIn Alumni Tool', url: 'https://www.linkedin.com/alumni/', type: 'tool' },
        ],
      },
      {
        id: 'bm-5',
        title: 'Peer Review + Mock Interviews',
        timeframe: `Days ${days - 3}–${days - 1} — 3 hrs`,
        type: 'short_term',
        description: 'Run 2 structured mock interviews, one with a peer and one with a mentor. Time your walk-through and get feedback on brevity and impact.',
        resources: [
          { title: 'Exponent — PM Mock Interviews', url: 'https://www.tryexponent.com/', type: 'tool' },
          { title: 'Pramp — Free Peer Mock Interviews', url: 'https://www.pramp.com/', type: 'tool' },
        ],
      },
      {
        id: 'bm-6',
        title: 'CCS Submit & Lock',
        timeframe: `Day ${days} — 30 min`,
        type: 'immediate',
        description: 'Lock your final CV version with verified credentials and submit to the CCS placement queue.',
        resources: [],
      },
    ],
  };
}
