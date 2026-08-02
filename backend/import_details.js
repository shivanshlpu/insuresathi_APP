const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Customer = require('./models/Customer');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in backend/.env');
  process.exit(1);
}

// Ultra-robust parser: extracts all JSON objects containing "personal" key
function parseAllCustomerObjects(rawText) {
  const records = [];
  let text = rawText.replace(/^\uFEFF/, '').trim();

  let i = 0;
  while (i < text.length) {
    if (text[i] === '{') {
      const startIndex = i;
      let depth = 0;
      let inString = false;
      let escape = false;

      while (i < text.length) {
        const char = text[i];
        if (inString) {
          if (escape) {
            escape = false;
          } else if (char === '\\') {
            escape = true;
          } else if (char === '"') {
            inString = false;
          }
        } else {
          if (char === '"') {
            inString = true;
          } else if (char === '{') {
            depth++;
          } else if (char === '}') {
            depth--;
            if (depth === 0) {
              i++;
              const candidateStr = text.substring(startIndex, i);
              if (candidateStr.includes('"personal"')) {
                try {
                  const obj = JSON.parse(candidateStr);
                  if (obj && typeof obj === 'object' && obj.personal) {
                    records.push(obj);
                  }
                } catch (e) {
                  // Not a standalone valid JSON object
                }
              }
              break;
            }
          }
        }
        i++;
      }
    } else {
      i++;
    }
  }

  return records;
}

function calculateFinancialYear(dateStr) {
  let targetDate = new Date();
  if (dateStr && !isNaN(new Date(dateStr).getTime())) {
    targetDate = new Date(dateStr);
  }
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();
  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

function normalizeRecord(raw) {
  const personal = raw.personal || {};
  const kyc = raw.kyc || {};
  const occupation = raw.occupation || {};
  const bank = raw.bank || {};
  const policy = raw.policy || {};
  const medical = raw.medical || {};

  // Normalize nominees
  let nominees = [];
  if (Array.isArray(raw.nominees)) {
    nominees = raw.nominees;
  } else if (Array.isArray(policy.nominees)) {
    nominees = policy.nominees;
  } else if (raw.nominee) {
    nominees = [raw.nominee];
  } else if (policy.nominee) {
    nominees = [policy.nominee];
  }

  // Normalize family members
  let familyMembers = [];
  if (Array.isArray(policy.familyMembers) && policy.familyMembers.length > 0) {
    familyMembers = policy.familyMembers;
  } else if (Array.isArray(raw.familyMembers) && raw.familyMembers.length > 0) {
    familyMembers = raw.familyMembers;
  } else if (raw.family && typeof raw.family === 'object') {
    for (const [key, val] of Object.entries(raw.family)) {
      if (val && typeof val === 'object' && (val.status || val.age)) {
        const rel = key.charAt(0).toUpperCase() + key.slice(1);
        familyMembers.push({
          relation: rel,
          status: val.status || 'Living',
          age: val.age || undefined
        });
      }
    }
  }

  // Normalize docDate
  const docDate = policy.docDate || personal.docDate || raw.docDate || '';

  // Construct standard formData
  const formData = {
    personal: {
      name: personal.name || '',
      email: personal.email || '',
      mobile: personal.mobile || '',
      maritalStatus: personal.maritalStatus || '',
      address: personal.address || '',
      spouseName: personal.spouseName || '',
      fatherName: personal.fatherName || '',
      motherName: personal.motherName || '',
      gender: personal.gender || '',
      qualification: personal.qualification || '',
      qualificationClass: personal.qualificationClass || '',
      age: personal.age || undefined,
      placeOfBirth: personal.placeOfBirth || '',
      knowCustomerDuration: personal.knowCustomerDuration || '',
      photo: personal.photo || undefined,
      dob: personal.dob || undefined,
      docDate: docDate || undefined,
      backDatingDate: personal.backDatingDate || undefined,
      topPolicyNumber: personal.topPolicyNumber || policy.policyNumber || '',
    },
    kyc: {
      panNumber: kyc.panNumber || '',
      aadhaarNumber: kyc.aadhaarNumber || '',
      kycNumber: kyc.kycNumber || '',
      accessId: kyc.accessId || '',
      bocNumber: kyc.bocNumber || '',
      bocAmount: kyc.bocAmount || undefined,
      bocDate: kyc.bocDate || undefined,
    },
    occupation: {
      occupationType: occupation.occupationType || '',
      designation: occupation.designation || '',
      department: occupation.department || '',
      serviceYears: occupation.serviceYears || undefined,
      serviceMonths: occupation.serviceMonths || undefined,
      businessName: occupation.businessName || '',
      typeOfBusiness: occupation.typeOfBusiness || '',
      gstNumber: occupation.gstNumber || '',
      businessYear: occupation.businessYear || undefined,
      businessMonths: occupation.businessMonths || undefined,
      annualIncome: occupation.annualIncome || undefined,
    },
    bank: {
      bankName: bank.bankName || '',
      accountNumber: bank.accountNumber || '',
      accountType: bank.accountType || '',
      ifscCode: bank.ifscCode || '',
      bankAddress: bank.bankAddress || '',
    },
    policy: {
      planNumber: policy.planNumber || '',
      planName: policy.planName || '',
      term: policy.term ? String(policy.term) : '',
      sumAssured: policy.sumAssured || undefined,
      premiumMode: policy.premiumMode || '',
      premiumAmount: policy.premiumAmount || undefined,
      gst: policy.gst || undefined,
      totalRequiredAmount: policy.totalRequiredAmount || undefined,
      policyNumber: policy.policyNumber || policy.docNumber || personal.topPolicyNumber || '',
      docNumber: policy.docNumber || policy.policyNumber || '',
      docDate: docDate || undefined,
      adbRider: policy.adbRider || '',
      abRider: policy.abRider || '',
      termRider: policy.termRider || '',
      cirRider: policy.cirRider || '',
      nominees: nominees,
      familyMembers: familyMembers,
      previousPolicies: policy.previousPolicies || [],
      references: policy.references || [],
    },
    medical: {
      height: medical.height || '',
      weight: medical.weight || undefined,
      birthMark: medical.birthMark || '',
      treatmentDetailsGeneral: medical.treatmentDetailsGeneral || '',
      isPregnant: medical.isPregnant || '',
      deliveryMode: medical.deliveryMode || '',
      lastDeliveryDate: medical.lastDeliveryDate || undefined,
      treatmentDetails: medical.treatmentDetails || '',
      husbandName_mw: medical.husbandName_mw || '',
      husbandOccupation_mw: medical.husbandOccupation_mw || '',
      husbandIncome_mw: medical.husbandIncome_mw || undefined,
    },
    remarks: raw.remarks || '',
  };

  const name = formData.personal.name || 'Unknown';
  const policyNumber = formData.policy.policyNumber || '';
  const mobile = formData.personal.mobile || '';
  const financialYear = calculateFinancialYear(docDate);

  const targetDate = (docDate && !isNaN(new Date(docDate).getTime())) 
    ? new Date(docDate) 
    : new Date();

  return {
    financialYear,
    docDate: targetDate,
    searchable: { name, policyNumber, mobile },
    formData,
    source: 'agent',
    status: 'reviewed'
  };
}

async function importDetails() {
  const jsonPathCandidates = [
    path.join(__dirname, '..', 'details.json'),
    path.join(__dirname, 'details.json')
  ];

  let jsonPath = '';
  for (const p of jsonPathCandidates) {
    if (fs.existsSync(p)) {
      jsonPath = p;
      break;
    }
  }

  if (!jsonPath) {
    console.error('ERROR: details.json file not found in parent directory or backend directory.');
    process.exit(1);
  }

  console.log(`Reading customer details from: ${jsonPath}`);
  const fileContent = fs.readFileSync(jsonPath, 'utf-8');

  if (!fileContent || fileContent.trim().length === 0) {
    console.error('ERROR: details.json is empty.');
    process.exit(1);
  }

  const rawRecords = parseAllCustomerObjects(fileContent);
  console.log(`Extracted ${rawRecords.length} customer records from details.json.`);

  if (rawRecords.length === 0) {
    console.error('ERROR: No valid JSON customer records found in details.json.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const raw of rawRecords) {
      const normalized = normalizeRecord(raw);
      const name = normalized.searchable.name;
      const policyNumber = normalized.searchable.policyNumber;
      const mobile = normalized.searchable.mobile;

      if (!name || name === 'Unknown') {
        console.log('Skipping record without name');
        continue;
      }

      // Upsert query matching by policyNumber if available, or name + mobile
      let query = {};
      if (policyNumber && policyNumber !== 'N/A' && policyNumber !== '') {
        query = { 'searchable.policyNumber': policyNumber };
      } else if (mobile) {
        query = { 'searchable.name': name, 'searchable.mobile': mobile };
      } else {
        query = { 'searchable.name': name };
      }

      const existing = await Customer.findOne(query);
      if (existing) {
        await Customer.updateOne(query, { $set: normalized });
        updatedCount++;
        console.log(`Updated record: ${name} (${policyNumber || mobile || 'No Policy #'})`);
      } else {
        await Customer.create(normalized);
        insertedCount++;
        console.log(`Inserted new record: ${name} (${policyNumber || mobile || 'No Policy #'})`);
      }
    }

    console.log(`\n===================================`);
    console.log(`IMPORT COMPLETED SUCCESSFULLY!`);
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Updated:  ${updatedCount}`);
    console.log(`Total:    ${insertedCount + updatedCount}`);
    console.log(`===================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB import:', error);
    process.exit(1);
  }
}

importDetails();
