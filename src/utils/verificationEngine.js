// Autonomous Verification & Discrepancy Flagging Engine for Project TAILOR
// Compares student-submitted CV data against locked GLIM Master Student Records.

import { MOCK_STUDENT_MASTER_RECORDS } from "../data/mockStudentMaster";

export function runVerificationCrossCheck(cvData, studentId) {
  if (!studentId) return null;

  const masterRecord = MOCK_STUDENT_MASTER_RECORDS.find(r => r.student_id === studentId);
  
  if (!masterRecord) {
    return {
      status: "FLAGGED_HIGH_RISK",
      riskLevel: "HIGH",
      discrepancyCount: 1,
      discrepancies: [
        {
          type: "UNREGISTERED_STUDENT_ID",
          field: "student_id",
          claimed: studentId,
          groundTruth: "Record Not Found in GLIM Master Database",
          risk: "High Discrepancy",
          detail: "Submitted Student ID does not correspond to an enrolled PGDM student record."
        }
      ]
    };
  }

  const discrepancies = [];

  // 1. CGPA Cross-Check (Tolerance: +/- 0.01)
  const claimedCgpa = parseFloat(cvData.cgpa_claimed || cvData.cgpa);
  const masterCgpa = parseFloat(masterRecord.cgpa);

  if (claimedCgpa && Math.abs(claimedCgpa - masterCgpa) > 0.05) {
    discrepancies.push({
      type: "CGPA_MISMATCH",
      field: "cgpa",
      claimed: claimedCgpa.toFixed(2),
      groundTruth: masterCgpa.toFixed(2),
      risk: "High Discrepancy",
      detail: `Student claimed CGPA of ${claimedCgpa.toFixed(2)} on CV, but GLIM Master Record lists ${masterCgpa.toFixed(2)}.`
    });
  }

  // 2. Certifications Cross-Check
  const claimedCerts = cvData.claimed_certifications || [];
  const masterCertNames = (masterRecord.verified_certifications || []).map(c => c.name.toLowerCase());

  claimedCerts.forEach(certName => {
    const isVerified = masterCertNames.some(mName => 
      mName.includes(certName.toLowerCase()) || certName.toLowerCase().includes(mName)
    );

    if (!isVerified) {
      discrepancies.push({
        type: "UNVERIFIED_CERTIFICATION",
        field: "certification",
        claimed: certName,
        groundTruth: "Not Found in GLIM Verified Credentials Registry",
        risk: certName.toLowerCase().includes("pmp") || certName.toLowerCase().includes("cfa") ? "High Discrepancy" : "Medium Discrepancy",
        detail: `Certification '${certName}' claimed on CV has not been verified by CCS Office.`
      });
    }
  });

  // 3. Prior Work Experience Cross-Check
  const claimedRoles = cvData.claimed_experience || [];
  const masterRoles = masterRecord.prior_roles || [];

  claimedRoles.forEach(cRole => {
    const matchingMasterRole = masterRoles.find(m => 
      m.company.toLowerCase().includes(cRole.company.toLowerCase()) ||
      cRole.company.toLowerCase().includes(m.company.toLowerCase())
    );

    if (!matchingMasterRole) {
      discrepancies.push({
        type: "UNVERIFIED_EMPLOYMENT",
        field: "prior_roles",
        claimed: `${cRole.designation} at ${cRole.company}`,
        groundTruth: "No Verified Prior Role Record",
        risk: "Medium Discrepancy",
        detail: `Prior employment claim '${cRole.company}' lacks verified proof in master record.`
      });
    } else if (cRole.designation && !matchingMasterRole.designation.toLowerCase().includes(cRole.designation.toLowerCase())) {
      discrepancies.push({
        type: "TITLE_EXAGGERATION",
        field: "designation",
        claimed: cRole.designation,
        groundTruth: matchingMasterRole.designation,
        risk: "Medium Discrepancy",
        detail: `Claimed designation '${cRole.designation}' differs from verified record '${matchingMasterRole.designation}'.`
      });
    }
  });

  // Determine Ticket Risk Classification
  let riskLevel = "CLEAN";
  let status = "CLEAN_AUTO_PASS";

  if (discrepancies.some(d => d.risk === "High Discrepancy")) {
    riskLevel = "HIGH";
    status = "FLAGGED_HIGH_RISK";
  } else if (discrepancies.length > 0) {
    riskLevel = "MEDIUM";
    status = "FLAGGED_MEDIUM_RISK";
  }

  return {
    student_id: studentId,
    studentName: masterRecord.name,
    studentEmail: masterRecord.email,
    program: masterRecord.program,
    cgpa_master: masterRecord.cgpa,
    masterRecord,
    riskLevel,
    status,
    discrepancyCount: discrepancies.length,
    discrepancies,
    timestamp: new Date().toISOString()
  };
}

export function createAuditLogEntry(actor, action, detail, targetStudentId) {
  return {
    log_id: `LOG-${Math.floor(100000 + Math.random() * 900000)}`,
    actor: actor || "SYSTEM_AUTONOMOUS_ROUTER",
    action,
    detail,
    targetStudentId: targetStudentId || "N/A",
    timestamp: new Date().toISOString()
  };
}
