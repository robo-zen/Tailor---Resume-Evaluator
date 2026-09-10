// GLIM Placement Office (CCS) Locked Master Student Records
// Used as the institutional ground truth for autonomous verification cross-checking.

export const MOCK_STUDENT_MASTER_RECORDS = [
  {
    student_id: "PGDM26-042",
    name: "Shlok Sanyal",
    email: "shlok.sanyal@greatlakes.edu.in",
    program: "PGDM 2026-28",
    specialization: "Product & Operations Management",
    cgpa: 3.82,
    verified_certifications: [
      { code: "CERT-001", name: "Google Project Management Professional", issuer: "Coursera / Google", issue_date: "2024-08-15" },
      { code: "CERT-002", name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", issue_date: "2024-11-20" },
      { code: "CERT-003", name: "Professional Scrum Master (PSM I)", issuer: "Scrum.org", issue_date: "2025-02-10" }
    ],
    prior_roles: [
      { company: "Infosys Technologies", designation: "Software Engineer", duration_months: 24, verified: true }
    ],
    academic_status: "Good Standing",
    placement_eligibility: "Eligible"
  },
  {
    student_id: "PGDM26-015",
    name: "Ananya Verma",
    email: "ananya.v@greatlakes.edu.in",
    program: "PGDM 2026-28",
    specialization: "Finance & Fintech",
    cgpa: 3.45,
    verified_certifications: [
      { code: "CERT-010", name: "FinTech Essentials Certificate", issuer: "Wharton Online", issue_date: "2024-06-10" }
    ],
    prior_roles: [
      { company: "HDFC Bank", designation: "Financial Analyst Intern", duration_months: 6, verified: true }
    ],
    academic_status: "Good Standing",
    placement_eligibility: "Eligible"
  },
  {
    student_id: "PGDM26-088",
    name: "Rohan Kapoor",
    email: "rohan.k@greatlakes.edu.in",
    program: "PGDM 2026-28",
    specialization: "Consulting & Strategy",
    cgpa: 3.65,
    verified_certifications: [
      { code: "CERT-022", name: "Product Management Executive Program", issuer: "ISB Executive Education", issue_date: "2024-10-01" },
      { code: "CERT-023", name: "SQL & Relational Databases for Business", issuer: "IBM / DataCamp", issue_date: "2025-01-18" }
    ],
    prior_roles: [
      { company: "Deloitte India", designation: "Associate Analyst", duration_months: 18, verified: true }
    ],
    academic_status: "Good Standing",
    placement_eligibility: "Eligible"
  },
  {
    student_id: "PGDM26-104",
    name: "Priya Nair",
    email: "priya.nair@greatlakes.edu.in",
    program: "PGDM 2026-28",
    specialization: "Finance & Wealth Management",
    cgpa: 3.90,
    verified_certifications: [
      { code: "CERT-041", name: "CFA Level 1 Passed", issuer: "CFA Institute", issue_date: "2024-12-05" },
      { code: "CERT-042", name: "Advanced Financial Modeling & Valuation", issuer: "Wall Street Prep", issue_date: "2025-03-01" }
    ],
    prior_roles: [
      { company: "Ernst & Young (EY)", designation: "Audit Associate", duration_months: 20, verified: true }
    ],
    academic_status: "Good Standing",
    placement_eligibility: "Eligible"
  },
  {
    student_id: "PGDM26-056",
    name: "Karan Mehta",
    email: "karan.m@greatlakes.edu.in",
    program: "PGDM 2026-28",
    specialization: "Marketing & Tech Analytics",
    cgpa: 3.20,
    verified_certifications: [],
    prior_roles: [
      { company: "Zomato Media", designation: "Growth Operations Executive", duration_months: 12, verified: true }
    ],
    academic_status: "Good Standing",
    placement_eligibility: "Eligible"
  }
];
