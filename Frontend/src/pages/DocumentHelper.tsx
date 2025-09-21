import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, FileText, ExternalLink, Monitor, Users, ArrowRight, CheckCircle, Filter, Search } from 'lucide-react';

// NOTE: These components are assumed to exist in your project structure.
// If not, you might need to create simple placeholder components.

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const AnimatedCursor = () => {
  // A placeholder for your animated cursor component logic.
  // In a real scenario, this would handle the custom cursor effect.
  return null;
};


interface DocumentType {
  id: string;
  name: string;
  category: string;
  state?: string;
  requirements: string[];
  onlineProcess: {
    steps: string[];
    links: string[];
  };
  offlineProcess: {
    steps: string[];
    locations: string[];
  };
  estimatedTime: string;
  fees: string;
  complexity: 'easy' | 'medium' | 'hard';
}

const DocumentHelper: React.FC = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const states = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Andhra Pradesh'
  ];

  const categories = [
    'All Categories',
    'Identity Proof',
    'Tax Documents',
    'Travel Documents',
    'Vehicle & Transport',
    'Civil Registration',
    'Welfare',
    'Income Proof',
    'Legal & Welfare',
    'Educational Certificates',
    'Property & Land',
    'Employment & Social Security',
    'Education & Welfare',
    'Subsidies & Utilities',
    'Social Security',
    'Legal & Travel',
    'Health & Welfare',
    'Education & Identity',
    'Municipal & Construction',
    'Business & Licensing',
    'Legal & Police'
];

  const documents: DocumentType[] = [
    {
      "id": "D001",
      "name": "Aadhaar Card",
      "category": "Identity Proof",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Proof of Identity (Birth Certificate/School Certificate/Passport)",
        "Proof of Address (Electricity Bill/Bank Statement/Rental Agreement)",
        "Date of Birth Proof",
        "Recent Photograph",
        "Mobile number for OTP verification"
      ],
      "onlineProcess": {
        "steps": [
          "Visit UIDAI official website",
          "Book appointment (if required) or locate enrollment center",
          "Fill application / provide details",
          "Upload documents (where applicable)",
          "Visit enrollment center for biometric capture"
        ],
        "links": [
          "https://uidai.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit nearest Aadhaar enrollment center",
          "Fill enrollment form",
          "Submit documentary proof for verification",
          "Biometric capture (fingerprints, iris, photo)",
          "Receive acknowledgment slip"
        ],
        "locations": [
          "Post Offices",
          "Banks",
          "CSC Centers",
          "State UIDAI Centers"
        ]
      },
      "estimatedTime": "7-30 days (varies)",
      "fees": "Free for first enrollment; nominal fee for some services"
    },
    {
      "id": "D002",
      "name": "PAN Card (Permanent Account Number)",
      "category": "Tax Documents",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Form 49A (or 49AA for foreign applicants)",
        "Proof of Identity",
        "Proof of Address",
        "Proof of Date of Birth",
        "Passport-size photograph"
      ],
      "onlineProcess": {
        "steps": [
          "Visit NSDL/UTIITSL PAN portals",
          "Fill Form 49A online",
          "Upload scanned documents",
          "Pay processing fees",
          "Submit application and track status"
        ],
        "links": [
          "https://www.onlineservices.nsdl.com",
          "https://www.utiitsl.com"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Download/collect Form 49A",
          "Fill form manually",
          "Attach required documents",
          "Submit at PAN facilitation center or authorized center",
          "Pay fees and collect acknowledgment"
        ],
        "locations": [
          "PAN Service Centers",
          "Post Offices",
          "Banks"
        ]
      },
      "estimatedTime": "15-20 days",
      "fees": "₹110 (online approx.), ₹114 (offline approx.)"
    },
    {
      "id": "D003",
      "name": "Passport (Ordinary)",
      "category": "Travel Documents",
      "state": "All States",
      "complexity": "hard",
      "requirements": [
        "Online application on Passport Seva portal",
        "Proof of present and permanent address",
        "Date of birth proof",
        "Passport-size photographs",
        "Documents for police verification (if required)",
        "Fee payment receipt"
      ],
      "onlineProcess": {
        "steps": [
          "Register/login to Passport Seva website",
          "Fill online application form",
          "Pay fees online",
          "Book appointment at PSK/POPSK",
          "Visit Passport Seva Kendra with original documents"
        ],
        "links": [
          "https://passportindia.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Download and fill application form",
          "Visit Passport Seva Kendra or POPSK",
          "Submit documents and biometrics",
          "Attend police verification as required",
          "Receive passport via post"
        ],
        "locations": [
          "Passport Seva Kendras",
          "Post Office Passport Seva Kendras"
        ]
      },
      "estimatedTime": "15-60 days (depends on police verification)",
      "fees": "Varies by booklet size and service (e.g., ₹1,500 for 36 pages)"
    },
    {
      "id": "D004",
      "name": "Voter ID / Electoral Photo Identity Card (EPIC)",
      "category": "Identity Proof",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Proof of age (18+ years)",
        "Proof of residence",
        "Passport-size photograph",
        "Identity proof (any)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit National Voters Service Portal (NVSP)",
          "Fill Form 6 for new registration online",
          "Upload documents and photograph",
          "Submit and track application"
        ],
        "links": [
          "https://www.nvsp.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Obtain Form 6 from BLO or Electoral Office",
          "Fill form and attach required documents",
          "Submit to Booth Level Officer (BLO) or ERO",
          "Verification and inclusion in voter list"
        ],
        "locations": [
          "Electoral Registration Offices",
          "Tehsil Offices"
        ]
      },
      "estimatedTime": "30-90 days (varies by verification)",
      "fees": "Free"
    },
    {
      "id": "D005",
      "name": "Driving License (DL)",
      "category": "Vehicle & Transport",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Learner's License",
        "Form 4 (Application for Driving License)",
        "Age proof",
        "Address proof",
        "Medical certificate (Form 1A if required)",
        "Passport size photographs",
        "Driving test clearance"
      ],
      "onlineProcess": {
        "steps": [
          "Visit Parivahan Sewa / State RTO portal",
          "Fill DL application online",
          "Upload documents",
          "Book slot for driving test",
          "Pay fees online"
        ],
        "links": [
          "https://parivahan.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit regional RTO office",
          "Fill Form 4 manually",
          "Submit documents and learner's license",
          "Appear for driving test",
          "Collect license upon passing"
        ],
        "locations": [
          "RTO Offices",
          "Driving Test Centers"
        ]
      },
      "estimatedTime": "15-45 days",
      "fees": "₹200 – ₹500 (varies by state and service)"
    },
    {
      "id": "D006",
      "name": "Birth Certificate",
      "category": "Civil Registration",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Hospital-issued birth slip / notification",
        "Parents' identity proof",
        "Address proof of parents/guardian"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state municipal / CRS portal",
          "Apply for birth registration within prescribed period",
          "Upload hospital slip and parental documents",
          "Track and download certificate"
        ],
        "links": [
          "https://crsorgi.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit municipal corporation / Gram Panchayat office",
          "Submit hospital birth slip and application",
          "Verification and registration",
          "Collect birth certificate"
        ],
        "locations": [
          "Municipal Corporations",
          "Gram Panchayats"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "Usually nominal or free (state dependent)"
    },
    {
      "id": "D007",
      "name": "Death Certificate",
      "category": "Civil Registration",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Medical / Hospital death summary",
        "Identity proof of deceased (if available)",
        "Informant details and address proof"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state municipal / CRS portal",
          "Fill death registration form and upload medical certificate",
          "Submit and track application"
        ],
        "links": [
          "https://crsorgi.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit municipal corporation / Gram Panchayat office",
          "Submit medical certificate and informant details",
          "Verification and registration",
          "Collect death certificate"
        ],
        "locations": [
          "Municipal Corporations",
          "Gram Panchayats"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "Usually nominal or free"
    },
    {
      "id": "D008",
      "name": "Marriage Certificate",
      "category": "Civil Registration",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Marriage registration application (Form varies by act)",
        "Proof of marriage (wedding invitation / affidavit)",
        "Proof of age and identity of both parties",
        "Witnesses' identity proofs",
        "Residence proof (for bride/groom)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state marriage registration portal or municipal website",
          "Fill marriage registration form",
          "Upload documents and witness details",
          "Pay fees and schedule appointment (if needed)",
          "Collect marriage certificate post verification"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit municipal corporation / sub-registrar office",
          "Submit application with required documents and witnesses",
          "Verification and registration under relevant Marriage Act",
          "Collect certificate"
        ],
        "locations": [
          "Municipal/Sub-Registrar Offices"
        ]
      },
      "estimatedTime": "15-60 days (varies by state and verification)",
      "fees": "Varies by state (often nominal)"
    },
    {
      "id": "D009",
      "name": "Ration Card (Public Distribution System)",
      "category": "Welfare",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Proof of residence",
        "Identity proof of head of family",
        "Family details (Aadhaar recommended)",
        "Income proof (for BPL/APL categorization in some states)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state PDS / food & civil supplies portal (or NFSA portal)",
          "Fill online ration card application form",
          "Upload supporting documents and family Aadhaar (if required)",
          "Submit and track application"
        ],
        "links": [
          "https://nfsa.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Collect and fill ration card application form at local office / CSC",
          "Attach required documents and family photos",
          "Submit for verification",
          "Receive ration card"
        ],
        "locations": [
          "Ration Office",
          "Taluka Office",
          "CSC Centers"
        ]
      },
      "estimatedTime": "15-60 days (state dependent)",
      "fees": "Nominal (varies by state)"
    },
    {
      "id": "D010",
      "name": "Income Certificate",
      "category": "Income Proof",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Application form (state e-district or Tehsildar)",
        "Proof of income (salary slips / ITR / employer letter)",
        "Identity proof",
        "Residence proof"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state e-district portal or revenue department site",
          "Fill income certificate application",
          "Upload supporting documents and pay fee (if any)",
          "Submit and track"
        ],
        "links": [
          "https://edistrict.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Collect application form from Tehsildar / SDM office",
          "Fill and attach proofs",
          "Submit for verification",
          "Collect income certificate"
        ],
        "locations": [
          "Tehsildar Office",
          "SDM Office",
          "E-District Centres"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "₹20 – ₹100 (varies)"
    },
    {
      "id": "D011",
      "name": "Caste Certificate / Community Certificate",
      "category": "Legal & Welfare",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Proof of caste (ancillary documents like school records / parent certificates)",
        "Proof of residence",
        "Identity proof",
        "Affidavit (in some states)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state e-district / revenue portal",
          "Fill caste certificate application",
          "Upload supporting documents",
          "Submit and track status"
        ],
        "links": [
          "https://edistrict.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit Tehsildar / Deputy Collector office",
          "Submit application with supporting documents",
          "Verification by revenue officers",
          "Collect certificate"
        ],
        "locations": [
          "Tehsil Office",
          "District Collector Office"
        ]
      },
      "estimatedTime": "15-60 days",
      "fees": "₹20 – ₹200 (varies)"
    },
    {
      "id": "D012",
      "name": "Domicile Certificate",
      "category": "Legal & Welfare",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Proof of residence for specified period (rental agreement / utility bills)",
        "Identity proof",
        "Birth certificate (if applicable)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state e-district or revenue website",
          "Fill domicile certificate application",
          "Upload proofs and pay fee (if applicable)",
          "Submit and track"
        ],
        "links": [
          "https://edistrict.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Apply at Tehsildar / District Magistrate office",
          "Submit supporting documents",
          "Verification and issuance"
        ],
        "locations": [
          "Tehsildar Office",
          "District Collector Office"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "Nominal"
    },
    {
      "id": "D013",
      "name": "Educational Certificates (10th/12th/Degree Marksheet)",
      "category": "Educational Certificates",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Original mark sheet / provisional certificate",
        "Identity proof",
        "Application form for duplicate / verification"
      ],
      "onlineProcess": {
        "steps": [
          "Visit respective board / university portal",
          "Fill application for duplicate or verification",
          "Upload ID proof and required documents",
          "Pay fees and track status"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit school / college / university office",
          "Submit application with documents",
          "Pay fees and collect duplicate / verified certificate"
        ],
        "locations": [
          "School",
          "College",
          "University Offices"
        ]
      },
      "estimatedTime": "15-60 days",
      "fees": "₹200 – ₹1000 (varies)"
    },
    {
      "id": "D014",
      "name": "Property Registration (Sale Deed)",
      "category": "Property & Land",
      "state": "All States",
      "complexity": "hard",
      "requirements": [
        "Sale deed / agreement to sell",
        "Title documents of seller",
        "Identity & address proofs of buyer and seller",
        "Stamp duty payment receipts",
        "Encumbrance certificate (recent)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state sub-registrar / registration portal",
          "Fill property registration form",
          "Upload documents and e-stamp / pay stamp duty (where applicable online)",
          "Schedule appointment with sub-registrar",
          "Attend registration with witnesses and obtain registered deed"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit Sub-Registrar Office with all documents and witnesses",
          "Pay stamp duty & registration fees",
          "Register sale deed and collect registered document"
        ],
        "locations": [
          "Sub-Registrar Offices"
        ]
      },
      "estimatedTime": "7-45 days (varies)",
      "fees": "Stamp duty + registration fee (varies by state & property value)"
    },
    {
      "id": "D015",
      "name": "Encumbrance Certificate (EC)",
      "category": "Property & Land",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Property details (Survey No / Hissa No / Document details)",
        "Identity proof of applicant",
        "Application form"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state registration / e-registrations portal",
          "Search property and apply for EC",
          "Pay fees and download EC"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit Sub-Registrar office and request EC",
          "Provide property details and ID proof",
          "Pay required fees and collect EC"
        ],
        "locations": [
          "Sub-Registrar Offices"
        ]
      },
      "estimatedTime": "Immediate to 15 days",
      "fees": "Varies by state and period requested"
    },
    {
      "id": "D016",
      "name": "Land Records / Mutation Certificate",
      "category": "Property & Land",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Proof of title / earlier records",
        "Application for mutation",
        "Identity & address proof"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state land records / BhuNaksha / Dharani / e-Dhara portals",
          "Search survey/khata details and apply for mutation",
          "Upload documents and track"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Apply at local revenue office / Tehsildar",
          "Submit supporting documents",
          "Verification and mutation entry in records"
        ],
        "locations": [
          "Tehsildar Offices",
          "Revenue Department"
        ]
      },
      "estimatedTime": "15-60 days",
      "fees": "Varies"
    },
    {
      "id": "D017",
      "name": "Income Tax Return (ITR) Filing (Acknowledgement/Form)",
      "category": "Tax Documents",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "PAN",
        "Form 16 (if salaried) / Income proofs",
        "Bank account details",
        "Aadhaar linked (where applicable)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit incometax.gov.in portal",
          "Login with PAN and Aadhaar (where required)",
          "Fill ITR form and upload documents where necessary",
          "Verify return (Aadhaar OTP / Netbanking / EVC)"
        ],
        "links": [
          "https://www.incometax.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Chartered accountants or authorized representatives may file physically under limited scenarios",
          "Keep all documents for record and verification"
        ],
        "locations": [
          "Tax Consultant Offices"
        ]
      },
      "estimatedTime": "Immediate (e-filing) to 60 days (processing)",
      "fees": "Nil for filing on portal; CA fees vary"
    },
    {
      "id": "D018",
      "name": "GST Registration (for businesses)",
      "category": "Tax Documents",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "PAN of business/entity",
        "Proof of business address",
        "Identity proof of promoters/partners",
        "Bank account details"
      ],
      "onlineProcess": {
        "steps": [
          "Visit GST portal",
          "Fill application (Part A/B) for registration",
          "Upload documents and verification",
          "Receive provisional GSTIN and later final GSTIN after verification"
        ],
        "links": [
          "https://www.gst.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Assistance via GST Suvidha Providers or tax consultants",
          "Submission of physical documents in limited cases"
        ],
        "locations": [
          "GST Facilitation Centers",
          "Tax Consultant Offices"
        ]
      },
      "estimatedTime": "3-15 days",
      "fees": "Nil on portal; professional fees if using consultant"
    },
    {
      "id": "D019",
      "name": "EPFO UAN / PF Claim Documents",
      "category": "Employment & Social Security",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "UAN (Universal Account Number)",
        "KYC documents (Aadhaar, PAN, bank details)",
        "Employment details"
      ],
      "onlineProcess": {
        "steps": [
          "Visit EPFO member portal",
          "Link UAN and complete KYC",
          "File online claims (partial/full) with supporting documents",
          "Track claim status online"
        ],
        "links": [
          "https://www.epfindia.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Submit physical claim forms at EPF office (in specific cases)",
          "Provide attested KYC documents"
        ],
        "locations": [
          "EPF Regional Offices"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "Nil (statutory)"
    },
    {
      "id": "D020",
      "name": "ESIC / Employee State Insurance Card",
      "category": "Employment & Social Security",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Employment details of insured person",
        "Identity & address proof",
        "Employer registration details"
      ],
      "onlineProcess": {
        "steps": [
          "Visit ESIC portal",
          "Register employer and employees",
          "Generate ESIC card and contributions record"
        ],
        "links": [
          "https://www.esic.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit ESIC regional office for assistance",
          "Submit necessary forms and proofs"
        ],
        "locations": [
          "ESIC Regional Offices"
        ]
      },
      "estimatedTime": "Varies",
      "fees": "Nil (statutory contributions)"
    },
    {
      "id": "D021",
      "name": "Scholarship / Education Scheme Documents",
      "category": "Education & Welfare",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Marksheet and enrollment proof",
        "Identity proof (Aadhaar/PAN)",
        "Income certificate (for means-tested scholarships)",
        "Bank account details"
      ],
      "onlineProcess": {
        "steps": [
          "Visit scholarship portal (national/state specific)",
          "Register and fill application",
          "Upload documents and apply before deadline",
          "Track status and receive payment to bank account"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Submit application through institute (where applicable)",
          "Provide attested documents"
        ],
        "locations": [
          "Colleges",
          "University Offices"
        ]
      },
      "estimatedTime": "30-120 days (processing and disbursal)",
      "fees": "Nil"
    },
    {
      "id": "D022",
      "name": "Enrollment in State Employment Exchange",
      "category": "Employment & Welfare",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Educational certificates",
        "ID & address proof",
        "Passport-size photographs",
        "Domicile certificate (often)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state employment exchange portal",
          "Register and upload documents",
          "Obtain enrollment ID"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit local employment exchange office",
          "Submit documents and register"
        ],
        "locations": [
          "Employment Exchange Offices"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "Nil or nominal"
    },
    {
      "id": "D023",
      "name": "Gas Connection / LPG Subsidy Documents",
      "category": "Subsidies & Utilities",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Proof of identity and address",
        "Bank account details for DBT (if subsidy)",
        "LPG consumer details (existing connections)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit respective LPG distributor portal or NPCI/PAHAL linkage portals",
          "Register bank details and Aadhaar linkage for DBT",
          "Apply for new connection via distributor website/office"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit LPG distributor office to apply for new connection",
          "Submit KYC documents and pay security deposit"
        ],
        "locations": [
          "LPG Distributor Outlets"
        ]
      },
      "estimatedTime": "7-30 days",
      "fees": "Varies by provider and state policies"
    },
    {
      "id": "D024",
      "name": "Pension Scheme Enrollment Documents",
      "category": "Social Security",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Identity proof",
        "Bank details",
        "Pension scheme specific forms and KYC",
        "Proof of eligibility (age/residence/employment history)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit respective pension scheme portal (NPS / State Pension portals)",
          "Register, fill details and upload KYC",
          "Submit and track status"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit designated pension office or bank branch",
          "Submit physical forms and KYC"
        ],
        "locations": [
          "Pension Offices",
          "Bank Branches"
        ]
      },
      "estimatedTime": "30-90 days",
      "fees": "Nil or nominal service fees"
    },
    {
      "id": "D025",
      "name": "Police Clearance Certificate (PCC)",
      "category": "Legal & Travel",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Proof of identity and address",
        "Application form",
        "Fingerprints / police verification inputs (as required)",
        "Passport details (where required)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit local police portal or Passport Seva portal (for PCC for passport)",
          "Fill application and upload identity documents",
          "Provide references and attend police verification if required"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Apply at local police station / Superintendent of Police office",
          "Submit documents and provide verification details",
          "Collect PCC after verification"
        ],
        "locations": [
          "District Police Offices"
        ]
      },
      "estimatedTime": "7-60 days (depending on verification)",
      "fees": "Varies (often nominal)"
    },
    {
      "id": "D026",
      "name": "Health Scheme / Medical Insurance Card",
      "category": "Health & Welfare",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Aadhaar or identity proof",
        "Proof of residence",
        "Income proof (for certain schemes)",
        "Family details"
      ],
      "onlineProcess": {
        "steps": [
          "Visit Ayushman Bharat portal or respective state health scheme portal",
          "Search eligibility and register by uploading required documents",
          "Receive scheme ID / card details"
        ],
        "links": [
          "https://healthids.gov.in",
          "https://pmjay.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Visit nearest public health center / CSC",
          "Submit documents and apply for scheme enrollment",
          "Collect scheme card / ID"
        ],
        "locations": [
          "Public Health Centers",
          "CSC Centers",
          "District Hospitals"
        ]
      },
      "estimatedTime": "Immediate to 30 days",
      "fees": "Typically free (beneficiary schemes)"
    },
    {
      "id": "D027",
      "name": "School Leaving / Transfer Certificate",
      "category": "Education & Identity",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Student details and enrollment proof",
        "Parents' identity proof",
        "School/college records"
      ],
      "onlineProcess": {
        "steps": [
          "Apply through school's administrative portal (if available)",
          "Provide required proofs and pay nominal fees",
          "Download / collect certificate"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit school/college admin office",
          "Submit application for TC/bonafide/transfer certificate",
          "Collect issued certificate"
        ],
        "locations": [
          "Schools",
          "College Offices"
        ]
      },
      "estimatedTime": "1-30 days",
      "fees": "Nominal (if applicable)"
    },
    {
      "id": "D028",
      "name": "Marriage Registration (Special/Hindu Act)",
      "category": "Civil Registration",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Application under relevant act (Form varies)",
        "Proof of age and identity of both parties",
        "Residence proof",
        "Affidavit and witnesses (3) as required under Special Marriage Act"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state marriage registration portal or district portal",
          "Submit forms and supporting documents online (where supported)",
          "Pay fees and schedule verification"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit Marriage Registrar / Sub-Registrar office with documents and witnesses",
          "Submit application and affidavit as required",
          "After verification, collect marriage certificate"
        ],
        "locations": [
          "Sub-Registrar Offices",
          "Municipal Offices"
        ]
      },
      "estimatedTime": "30-90 days (varies)",
      "fees": "Varies by state"
    },
    {
      "id": "D029",
      "name": "GSTIN / GST Registration Certificate",
      "category": "Tax Documents",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "PAN of the entity",
        "Proof of business address",
        "Identity and address proof of promoters/partners",
        "Bank account details"
      ],
      "onlineProcess": {
        "steps": [
          "Visit GST portal",
          "Fill registration details and upload documents",
          "Verify and obtain GSTIN",
          "File periodic returns online"
        ],
        "links": [
          "https://www.gst.gov.in"
        ]
      },
      "offlineProcess": {
        "steps": [
          "Consult GST Suvidha Provider or tax consultant for assistance",
          "Physical submission in rare cases"
        ],
        "locations": [
          "Tax Consultant Offices",
          "GST Facilitation Centers"
        ]
      },
      "estimatedTime": "3-15 days",
      "fees": "Nil on portal; professional fees if applicable"
    },
    {
      "id": "D030",
      "name": "Fire NOC / Building Plan Approval",
      "category": "Municipal & Construction",
      "state": "All States",
      "complexity": "hard",
      "requirements": [
        "Building plan / architectural drawings",
        "Ownership / title documents",
        "Safety compliance certificates",
        "Structural stability certificate (where required)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit municipal corporation / local body e-portal",
          "Submit building plan documents and NOC applications",
          "Pay fees and track application",
          "Schedule inspections"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Submit plans at municipal office / Town Planning department",
          "Undergo inspections and compliance checks",
          "Collect approved plan / NOC"
        ],
        "locations": [
          "Municipal Corporation",
          "Town Planning Office"
        ]
      },
      "estimatedTime": "30-180 days (varies greatly)",
      "fees": "Varies by project size and municipality"
    },
    {
      "id": "D031",
      "name": "Professional Certificate / Trade License",
      "category": "Business & Licensing",
      "state": "All States",
      "complexity": "medium",
      "requirements": [
        "Application form for trade license / trade certificate",
        "Proof of business address",
        "Identity proof of proprietor/partners",
        "Tax / property receipts"
      ],
      "onlineProcess": {
        "steps": [
          "Visit municipal corporation trade license portal",
          "Fill application and upload documents",
          "Pay fees, schedule inspection if required",
          "Obtain license"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit local municipal office and submit license application",
          "Undergo inspection and pay fees",
          "Collect license"
        ],
        "locations": [
          "Municipal Corporation Offices"
        ]
      },
      "estimatedTime": "7-60 days",
      "fees": "Varies by local rules"
    },
    {
      "id": "D032",
      "name": "Police FIR Copy / Complaint Registration",
      "category": "Legal & Police",
      "state": "All States",
      "complexity": "easy",
      "requirements": [
        "Details of incident",
        "Identity proof of complainant",
        "Supporting evidence (if any)"
      ],
      "onlineProcess": {
        "steps": [
          "Visit state police e-FIR portal (where available)",
          "Fill complaint details and submit online",
          "Obtain e-FIR number and track status"
        ],
        "links": []
      },
      "offlineProcess": {
        "steps": [
          "Visit nearest police station and lodge complaint",
          "Police registers FIR and provides copy/acknowledgment",
          "Follow up with investigating officer"
        ],
        "locations": [
          "Local Police Stations"
        ]
      },
      "estimatedTime": "Immediate registration; investigation timelines vary",
      "fees": "Free"
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !selectedState || doc.state === 'All States' || doc.state === selectedState;
    const matchesCategory = !filterCategory || filterCategory === 'All Categories' || doc.category === filterCategory;
    return matchesSearch && matchesState && matchesCategory;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-700';
    }
  };

  return (
    <PageTransition>
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <AnimatedCursor />
        
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="mb-2 text-3xl font-bold text-slate-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Document Guide & Requirements
          </motion.h1>
          <motion.p 
            className="text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Step-by-step guidance and requirements for creating and submitting government documents
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="p-6 mb-8 shadow-lg bg-white/95 dark:bg-slate-800 rounded-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 transition-colors border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
              />
            </div>

            {/* State Filter */}
            <div className="relative">
              <MapPin className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full py-3 pl-10 pr-4 transition-colors border appearance-none bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full py-3 pl-10 pr-4 transition-colors border appearance-none bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Document Grid */}
        <motion.div 
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              onClick={() => setSelectedDocument(doc)}
              className="transition-all duration-300 shadow-md cursor-pointer bg-white/95 dark:bg-slate-800 rounded-xl hover:shadow-lg group hover:-translate-y-1 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex flex-col items-end space-y-1">
                    <div className="px-2 py-1 text-xs rounded-lg text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700">
                      {doc.state}
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getComplexityColor(doc.complexity)}`}>
                      {doc.complexity}
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white h-14">
                  {doc.name}
                </h3>
                
                <div className="mb-4 space-y-2">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Category: {doc.category}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <div>Time: {doc.estimatedTime}</div>
                    <div>Fees: {doc.fees}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div 
            className="py-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">No documents found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria</p>
          </motion.div>
        )}

        {/* Document Details Modal */}
        <AnimatePresence>
          {selectedDocument && (
            <motion.div 
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setSelectedDocument(null)}
              style={{ paddingTop: '6rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-8rem)] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="sticky top-0 z-10 p-6 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <motion.h2 
                      className="text-2xl font-bold text-slate-900 dark:text-white"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {selectedDocument.name} - Complete Guide
                    </motion.h2>
                    <motion.button
                      onClick={() => setSelectedDocument(null)}
                      className="p-2 text-2xl transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="sr-only">Close</span>
                      &times;
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Document Info */}
                  <motion.div 
                    className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Processing Time</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{selectedDocument.estimatedTime}</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Fees</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{selectedDocument.fees}</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div className="text-sm text-slate-600 dark:text-slate-400">Category</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{selectedDocument.category}</div>
                    </div>
                    <div className="flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Complexity</div>
                          <div className={`font-semibold capitalize text-center py-1 rounded text-xs ${getComplexityColor(selectedDocument.complexity)}`}>
                            {selectedDocument.complexity}
                          </div>
                        </div>
                  </motion.div>

                  {/* Requirements */}
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Required Documents</h3>
                    <div className="space-y-3">
                      {selectedDocument.requirements.map((req, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          </motion.div>
                          <span className="text-slate-700 dark:text-slate-300">{req}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Process Options */}
                  <motion.div 
                    className="grid gap-6 md:grid-cols-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {/* Online Process */}
                    <motion.div 
                      className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl"
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)" }}
                    >
                      <div className="flex items-center mb-4 space-x-3">
                        <Monitor className="w-6 h-6 text-blue-600" />
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Online Process</h4>
                      </div>
                      <div className="mb-4 space-y-3">
                        {selectedDocument.onlineProcess.steps.map((step, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            whileHover={{ x: 4 }}
                          >
                            <motion.div 
                              className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                            >
                              {index + 1}
                            </motion.div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                          {selectedDocument.onlineProcess.links.length > 0 &&
                      <div className="space-y-2">
                        {selectedDocument.onlineProcess.links.map((link, index) => (
                          <motion.a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                            whileHover={{ scale: 1.05, x: 4 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 + index * 0.1 }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Official Website</span>
                          </motion.a>
                        ))}
                      </div>
                          }
                    </motion.div>

                    {/* Offline Process */}
                    <motion.div 
                      className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl"
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.1)" }}
                    >
                      <div className="flex items-center mb-4 space-x-3">
                        <Users className="w-6 h-6 text-green-600" />
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Offline Process</h4>
                      </div>
                      <div className="mb-4 space-y-3">
                        {selectedDocument.offlineProcess.steps.map((step, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            whileHover={{ x: -4 }}
                          >
                            <motion.div 
                              className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-green-600 bg-green-100 rounded-full dark:bg-green-900/30"
                              initial={{ scale: 0 }}
                              transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                            >
                              {index + 1}
                            </motion.div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div>
                        <h5 className="mb-2 font-medium text-slate-900 dark:text-white">Visit These Locations:</h5>
                        <div className="space-y-1">
                          {selectedDocument.offlineProcess.locations.map((location, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2 + index * 0.05 }}
                              whileHover={{ x: -4 }}
                            >
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">{location}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default DocumentHelper;
