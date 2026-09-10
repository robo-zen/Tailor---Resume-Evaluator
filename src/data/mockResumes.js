// Sample Student Resumes for Quick Testing and Simulation

export const MOCK_STUDENT_RESUMES = [
  {
    id: "CV-SHLOK-01",
    student_id: "PGDM26-042",
    student_name: "Shlok Sanyal",
    title: "Product Manager & Software Engineer",
    cgpa_claimed: 3.82,
    claimed_certifications: [
      "Google Project Management Professional",
      "AWS Certified Cloud Practitioner",
      "Professional Scrum Master (PSM I)"
    ],
    claimed_experience: [
      { company: "Infosys Technologies", designation: "Software Engineer", duration: "24 months" }
    ],
    skills: ["Product Strategy", "PRD Writing", "Agile / Scrum", "AWS Cloud", "SQL", "A/B Testing", "JIRA", "System Architecture"],
    raw_text: `SHLOK SANYAL
Email: shlok.sanyal@greatlakes.edu.in | Phone: +91 98765 43210
Education: PGDM (2026-28), Great Lakes Institute of Management | CGPA: 3.82 / 4.00

SUMMARY:
Results-driven Product Manager & former Software Engineer with 2 years of full-stack engineering experience. Certified Scrum Master (PSM I) and AWS Cloud Practitioner adept at bridging technical engineering teams with business user empathy to build high-scale digital products.

PROFESSIONAL EXPERIENCE:
Infosys Technologies — Software Engineer (2022 – 2024)
- Engineered high-throughput microservices processing over 1.2M daily API transactions, reducing backend latency by 35%.
- Partnered with product managers to draft technical user stories and drive sprint planning for a global fintech client.
- Conducted A/B testing on checkout payment flows, increasing user conversion by 14.2% across mobile web platforms.
- Automated deployment pipelines using AWS Cloud Services, improving build release cadence by 3x.

KEY PROJECTS & CERTIFICATIONS:
- Google Project Management Professional (Coursera)
- AWS Certified Cloud Practitioner
- Professional Scrum Master (PSM I) - Scrum.org
- Campus E-Commerce Recommendation Engine: Built a machine learning model optimizing product bundling, driving 22% higher average cart value.`
  },

  {
    id: "CV-ANANYA-02",
    student_id: "PGDM26-015",
    student_name: "Ananya Verma (Discrepancy Test Case)",
    title: "Fintech & Product Specialist",
    cgpa_claimed: 3.90, // DISCREPANCY: Master Record has 3.45!
    claimed_certifications: [
      "FinTech Essentials Certificate",
      "PMP - Project Management Professional" // DISCREPANCY: Master Record has no PMP!
    ],
    claimed_experience: [
      { company: "HDFC Bank", designation: "Senior Product Analyst", duration: "12 months" } // DISCREPANCY: Master has 6 mos Intern
    ],
    skills: ["FinTech", "Financial Modeling", "Product Strategy", "PMP", "Valuation", "SQL"],
    raw_text: `ANANYA VERMA
Email: ananya.v@greatlakes.edu.in | Phone: +91 98123 45678
Education: PGDM (2026-28), Great Lakes Institute of Management | CGPA: 3.90 / 4.00

SUMMARY:
Ambitious Finance & Fintech specialist with extensive experience in digital banking products and project execution. PMI-certified Project Management Professional (PMP) holding Wharton FinTech certification.

PROFESSIONAL EXPERIENCE:
HDFC Bank — Senior Product Analyst (2023 – 2024)
- Led retail payment integration projects across 4 regional branches.
- Built financial forecasting models evaluating product revenue streams.

CERTIFICATIONS:
- Wharton Online FinTech Essentials
- PMP (Project Management Professional) - PMI Institute`
  },

  {
    id: "CV-ROHAN-03",
    student_id: "PGDM26-088",
    student_name: "Rohan Kapoor",
    title: "Strategy & Tech Consultant",
    cgpa_claimed: 3.65,
    claimed_certifications: [
      "Product Management Executive Program",
      "SQL & Relational Databases for Business"
    ],
    claimed_experience: [
      { company: "Deloitte India", designation: "Associate Analyst", duration: "18 months" }
    ],
    skills: ["Management Consulting", "MECE Framework", "Strategic Problem Solving", "SQL", "Market Entry Strategy", "Financial Modeling"],
    raw_text: `ROHAN KAPOOR
Email: rohan.k@greatlakes.edu.in | Phone: +91 97111 22334
Education: PGDM (2026-28), Great Lakes Institute of Management | CGPA: 3.65 / 4.00

SUMMARY:
Former Deloitte Associate Analyst with 18 months of technology consulting experience. Specializes in structured problem-solving using MECE frameworks, market entry benchmarking, and SQL data modeling for enterprise clients.

EXPERIENCE:
Deloitte India — Associate Analyst (2022 – 2024)
- Formulated cost optimization frameworks for a logistics client, identifying ₹45M in annual operational savings.
- Conducted competitor benchmarking across 12 Asian markets using hypothesis-driven strategic analysis.
- Designed SQL dashboards analyzing customer retention patterns for C-suite executive presentations.

CERTIFICATIONS:
- Product Management Executive Program (ISB)
- SQL & Relational Databases (IBM)`
  }
];
