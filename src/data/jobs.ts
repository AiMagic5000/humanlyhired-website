export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Temporary";
  salary: string;
  industry: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  featured: boolean;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150,000 - $180,000",
    industry: "Technology",
    description: "We are seeking a Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable software solutions.",
    requirements: [
      "5+ years of software development experience",
      "Proficiency in Python, Java, or Go",
      "Experience with cloud platforms (AWS, GCP, Azure)",
      "Strong problem-solving skills",
      "Bachelor's degree in Computer Science or related field"
    ],
    benefits: ["Health insurance", "401(k) matching", "Remote work options", "Stock options", "Unlimited PTO"],
    postedDate: "2025-01-10",
    featured: true
  },
  {
    id: "2",
    title: "Registered Nurse - ICU",
    company: "Mountain View Hospital",
    location: "Denver, CO",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    industry: "Healthcare",
    description: "Join our dedicated ICU team providing exceptional patient care. Looking for compassionate nurses with critical care experience.",
    requirements: [
      "Active RN license",
      "BLS and ACLS certification",
      "2+ years ICU experience",
      "Strong communication skills",
      "Ability to work 12-hour shifts"
    ],
    benefits: ["Sign-on bonus", "Tuition reimbursement", "Health benefits", "Pension plan", "Night shift differential"],
    postedDate: "2025-01-09",
    featured: true
  },
  {
    id: "3",
    title: "Financial Analyst",
    company: "Global Finance Partners",
    location: "New York, NY",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    industry: "Finance",
    description: "Seeking a detail-oriented Financial Analyst to support strategic decision-making through data analysis and financial modeling.",
    requirements: [
      "Bachelor's degree in Finance or Accounting",
      "3+ years financial analysis experience",
      "Advanced Excel and SQL skills",
      "CFA certification preferred",
      "Experience with financial modeling"
    ],
    benefits: ["Competitive salary", "Annual bonus", "Health benefits", "Professional development", "Hybrid work"],
    postedDate: "2025-01-08",
    featured: true
  },
  {
    id: "4",
    title: "Production Manager",
    company: "Advanced Manufacturing Inc.",
    location: "Detroit, MI",
    type: "Full-time",
    salary: "$90,000 - $115,000",
    industry: "Manufacturing",
    description: "Lead our production team to achieve operational excellence. Oversee daily manufacturing operations and drive continuous improvement.",
    requirements: [
      "7+ years manufacturing experience",
      "3+ years supervisory experience",
      "Lean Six Sigma certification",
      "Strong leadership skills",
      "Knowledge of ERP systems"
    ],
    benefits: ["Relocation assistance", "Health insurance", "Profit sharing", "Career advancement", "Company vehicle"],
    postedDate: "2025-01-07",
    featured: false
  },
  {
    id: "5",
    title: "Store Manager",
    company: "Premium Retail Group",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    industry: "Retail",
    description: "Dynamic Store Manager needed to lead our flagship location. Drive sales, manage staff, and ensure exceptional customer experiences.",
    requirements: [
      "5+ years retail experience",
      "2+ years management experience",
      "Strong customer service skills",
      "P&L management experience",
      "Flexible schedule availability"
    ],
    benefits: ["Employee discount", "Health benefits", "Performance bonus", "Paid time off", "Career growth"],
    postedDate: "2025-01-06",
    featured: false
  },
  {
    id: "6",
    title: "Warehouse Operations Supervisor",
    company: "Swift Logistics",
    location: "Atlanta, GA",
    type: "Full-time",
    salary: "$60,000 - $75,000",
    industry: "Logistics",
    description: "Supervise warehouse operations ensuring efficiency, safety, and accuracy. Lead a team of 20+ associates.",
    requirements: [
      "3+ years warehouse experience",
      "1+ year supervisory experience",
      "Forklift certification",
      "WMS experience",
      "Strong organizational skills"
    ],
    benefits: ["Health insurance", "401(k)", "Overtime opportunities", "Safety bonuses", "Advancement opportunities"],
    postedDate: "2025-01-05",
    featured: false
  },
  {
    id: "7",
    title: "DevOps Engineer",
    company: "CloudScale Technologies",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    industry: "Technology",
    description: "Build and maintain our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability.",
    requirements: [
      "4+ years DevOps experience",
      "Kubernetes and Docker expertise",
      "Terraform/CloudFormation experience",
      "Scripting skills (Python, Bash)",
      "AWS or GCP certification"
    ],
    benefits: ["Remote-first", "Stock options", "Learning budget", "Health benefits", "Flexible hours"],
    postedDate: "2025-01-10",
    featured: true
  },
  {
    id: "8",
    title: "Physical Therapist",
    company: "Wellness Recovery Center",
    location: "Phoenix, AZ",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    industry: "Healthcare",
    description: "Help patients recover and improve mobility. Work in a state-of-the-art rehabilitation facility.",
    requirements: [
      "Doctor of Physical Therapy degree",
      "Active PT license",
      "Experience with orthopedic patients",
      "Strong interpersonal skills",
      "Manual therapy skills"
    ],
    benefits: ["Continuing education", "Health benefits", "Retirement plan", "Flexible schedule", "Loan repayment"],
    postedDate: "2025-01-04",
    featured: false
  },
  {
    id: "9",
    title: "Senior Accountant",
    company: "Summit Financial Services",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    industry: "Finance",
    description: "Manage financial reporting and ensure compliance. Work with a team of accounting professionals.",
    requirements: [
      "CPA certification required",
      "5+ years accounting experience",
      "Public accounting background",
      "Advanced Excel skills",
      "GAAP expertise"
    ],
    benefits: ["CPA exam support", "Health benefits", "Bonus program", "Remote options", "Professional development"],
    postedDate: "2025-01-03",
    featured: false
  },
  {
    id: "10",
    title: "Quality Control Inspector",
    company: "Precision Parts Manufacturing",
    location: "Cleveland, OH",
    type: "Full-time",
    salary: "$50,000 - $65,000",
    industry: "Manufacturing",
    description: "Ensure product quality through inspection and testing. Document findings and recommend improvements.",
    requirements: [
      "2+ years QC experience",
      "Blueprint reading skills",
      "CMM experience preferred",
      "ISO 9001 knowledge",
      "Attention to detail"
    ],
    benefits: ["Health insurance", "Retirement plan", "Overtime available", "Training provided", "Stable hours"],
    postedDate: "2025-01-02",
    featured: false
  },
  {
    id: "11",
    title: "Data Scientist",
    company: "Analytics Pro Inc.",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140,000 - $175,000",
    industry: "Technology",
    description: "Drive insights from complex datasets. Build machine learning models and present findings to stakeholders.",
    requirements: [
      "Master's or PhD in quantitative field",
      "Python and R proficiency",
      "Machine learning experience",
      "SQL expertise",
      "Strong communication skills"
    ],
    benefits: ["Remote work", "Stock options", "Conference budget", "Health benefits", "Sabbatical program"],
    postedDate: "2025-01-10",
    featured: true
  },
  {
    id: "12",
    title: "Medical Assistant",
    company: "Family Care Clinic",
    location: "Orlando, FL",
    type: "Full-time",
    salary: "$38,000 - $48,000",
    industry: "Healthcare",
    description: "Support physicians with patient care. Handle administrative and clinical duties in a busy clinic.",
    requirements: [
      "Medical Assistant certification",
      "1+ year clinical experience",
      "EMR proficiency",
      "Phlebotomy skills",
      "Excellent patient care"
    ],
    benefits: ["Health benefits", "Paid time off", "Continuing education", "Scrub allowance", "Retirement plan"],
    postedDate: "2025-01-01",
    featured: false
  },
  {
    id: "13",
    title: "Investment Banking Analyst",
    company: "Capital Markets Group",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    industry: "Finance",
    description: "Support M&A transactions and capital raising activities. Build financial models and prepare presentations.",
    requirements: [
      "Bachelor's in Finance or Economics",
      "Strong financial modeling skills",
      "Excel and PowerPoint expertise",
      "Attention to detail",
      "Ability to work long hours"
    ],
    benefits: ["Competitive bonus", "Health benefits", "Meal allowance", "Car service", "Fast track promotion"],
    postedDate: "2025-01-09",
    featured: true
  },
  {
    id: "14",
    title: "CNC Machinist",
    company: "Precision Tooling Co.",
    location: "Milwaukee, WI",
    type: "Full-time",
    salary: "$55,000 - $72,000",
    industry: "Manufacturing",
    description: "Operate CNC machines to produce precision parts. Program and set up equipment for production runs.",
    requirements: [
      "5+ years CNC experience",
      "G-code programming",
      "Blueprint reading",
      "GD&T knowledge",
      "Mastercam experience preferred"
    ],
    benefits: ["Overtime opportunities", "Tool allowance", "Health benefits", "Retirement plan", "Stable employment"],
    postedDate: "2024-12-28",
    featured: false
  },
  {
    id: "15",
    title: "Restaurant General Manager",
    company: "Coastal Dining Group",
    location: "Miami, FL",
    type: "Full-time",
    salary: "$65,000 - $85,000",
    industry: "Retail",
    description: "Lead all aspects of restaurant operations. Drive revenue, manage staff, and ensure guest satisfaction.",
    requirements: [
      "5+ years restaurant management",
      "P&L responsibility experience",
      "Food safety certification",
      "Team leadership skills",
      "Flexible availability"
    ],
    benefits: ["Performance bonus", "Health benefits", "Meal allowance", "Career advancement", "Paid vacation"],
    postedDate: "2024-12-27",
    featured: false
  },
  {
    id: "16",
    title: "Supply Chain Analyst",
    company: "Global Distribution Network",
    location: "Dallas, TX",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    industry: "Logistics",
    description: "Optimize supply chain operations through data analysis. Identify cost savings and efficiency improvements.",
    requirements: [
      "Bachelor's in Supply Chain or related",
      "3+ years supply chain experience",
      "Advanced Excel and SQL",
      "ERP system experience",
      "Analytical mindset"
    ],
    benefits: ["Health benefits", "401(k) match", "Remote flexibility", "Professional development", "Annual bonus"],
    postedDate: "2024-12-26",
    featured: false
  },
  {
    id: "17",
    title: "Frontend Developer",
    company: "Digital Innovations Lab",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    industry: "Technology",
    description: "Build beautiful, responsive web applications. Work with React and modern frontend technologies.",
    requirements: [
      "4+ years frontend development",
      "React/Vue/Angular expertise",
      "TypeScript proficiency",
      "CSS/Tailwind skills",
      "Performance optimization experience"
    ],
    benefits: ["Remote work", "Health benefits", "Stock options", "Learning budget", "Flexible hours"],
    postedDate: "2025-01-10",
    featured: true
  },
  {
    id: "18",
    title: "Pharmacy Technician",
    company: "Community Health Pharmacy",
    location: "Portland, OR",
    type: "Full-time",
    salary: "$42,000 - $52,000",
    industry: "Healthcare",
    description: "Assist pharmacists in dispensing medications. Provide excellent customer service to patients.",
    requirements: [
      "Pharmacy Technician certification",
      "1+ year pharmacy experience",
      "Attention to detail",
      "Customer service skills",
      "Typing proficiency"
    ],
    benefits: ["Health benefits", "Retail discount", "Retirement plan", "Paid training", "Career advancement"],
    postedDate: "2024-12-25",
    featured: false
  },
  {
    id: "19",
    title: "Tax Manager",
    company: "Regional Accounting Firm",
    location: "Philadelphia, PA",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    industry: "Finance",
    description: "Lead tax compliance and planning for corporate clients. Manage a team of tax professionals.",
    requirements: [
      "CPA required",
      "8+ years tax experience",
      "Public accounting background",
      "Management experience",
      "Tax software proficiency"
    ],
    benefits: ["Partner track", "Health benefits", "Retirement plan", "Busy season bonus", "Flexible summer hours"],
    postedDate: "2024-12-24",
    featured: false
  },
  {
    id: "20",
    title: "Maintenance Technician",
    company: "Industrial Solutions Corp",
    location: "Houston, TX",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    industry: "Manufacturing",
    description: "Maintain and repair manufacturing equipment. Perform preventive maintenance and troubleshoot issues.",
    requirements: [
      "5+ years industrial maintenance",
      "Electrical and mechanical skills",
      "PLC troubleshooting",
      "Welding capabilities",
      "Available for on-call rotation"
    ],
    benefits: ["Overtime pay", "Tool allowance", "Health benefits", "Retirement plan", "On-site training"],
    postedDate: "2024-12-23",
    featured: false
  },
  {
    id: "21",
    title: "Hotel Front Desk Manager",
    company: "Luxury Resorts International",
    location: "Las Vegas, NV",
    type: "Full-time",
    salary: "$52,000 - $65,000",
    industry: "Retail",
    description: "Manage front desk operations and ensure exceptional guest experiences. Lead and develop front desk team.",
    requirements: [
      "3+ years hotel experience",
      "1+ year supervisory experience",
      "Opera PMS knowledge",
      "Excellent communication",
      "Flexible schedule"
    ],
    benefits: ["Hotel discounts", "Health benefits", "Bonus program", "Meal discount", "Career growth"],
    postedDate: "2024-12-22",
    featured: false
  },
  {
    id: "22",
    title: "Freight Coordinator",
    company: "National Freight Services",
    location: "Memphis, TN",
    type: "Full-time",
    salary: "$48,000 - $60,000",
    industry: "Logistics",
    description: "Coordinate freight shipments and manage carrier relationships. Ensure timely and cost-effective deliveries.",
    requirements: [
      "2+ years logistics experience",
      "TMS experience",
      "Strong communication skills",
      "Problem-solving ability",
      "Multi-tasking skills"
    ],
    benefits: ["Health benefits", "401(k)", "Performance bonus", "Paid time off", "Growth opportunities"],
    postedDate: "2024-12-21",
    featured: false
  },
  {
    id: "23",
    title: "Product Manager",
    company: "SaaS Innovators",
    location: "San Jose, CA",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    industry: "Technology",
    description: "Define product strategy and roadmap. Work with engineering and design to deliver outstanding products.",
    requirements: [
      "5+ years product management",
      "Technical background preferred",
      "Agile methodology experience",
      "Strong analytical skills",
      "Excellent communication"
    ],
    benefits: ["Stock options", "Remote flexibility", "Health benefits", "401(k) match", "Unlimited PTO"],
    postedDate: "2025-01-08",
    featured: true
  },
  {
    id: "24",
    title: "Emergency Room Nurse",
    company: "Metro General Hospital",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$72,000 - $92,000",
    industry: "Healthcare",
    description: "Provide emergency care in a fast-paced Level 1 trauma center. Handle critical and acute patient situations.",
    requirements: [
      "Active RN license",
      "BLS, ACLS, PALS certifications",
      "2+ years ER experience",
      "Trauma experience preferred",
      "Strong assessment skills"
    ],
    benefits: ["Sign-on bonus", "Shift differentials", "Health benefits", "Tuition assistance", "Pension plan"],
    postedDate: "2025-01-07",
    featured: false
  },
  {
    id: "25",
    title: "Credit Analyst",
    company: "First National Bank",
    location: "Charlotte, NC",
    type: "Full-time",
    salary: "$65,000 - $85,000",
    industry: "Finance",
    description: "Analyze creditworthiness of commercial loan applicants. Prepare detailed credit reports and recommendations.",
    requirements: [
      "Bachelor's in Finance or Accounting",
      "2+ years credit analysis",
      "Financial statement analysis",
      "Excel proficiency",
      "Strong writing skills"
    ],
    benefits: ["Health benefits", "401(k) match", "Banking perks", "Professional development", "Hybrid work"],
    postedDate: "2024-12-20",
    featured: false
  },
  {
    id: "26",
    title: "Assembly Line Lead",
    company: "Auto Parts Manufacturing",
    location: "Louisville, KY",
    type: "Full-time",
    salary: "$52,000 - $65,000",
    industry: "Manufacturing",
    description: "Lead assembly line team to meet production targets. Ensure quality standards and safety compliance.",
    requirements: [
      "5+ years manufacturing experience",
      "2+ years lead experience",
      "Lean manufacturing knowledge",
      "Quality control experience",
      "Team leadership skills"
    ],
    benefits: ["Health insurance", "Profit sharing", "Overtime opportunities", "Retirement plan", "Job stability"],
    postedDate: "2024-12-19",
    featured: false
  },
  {
    id: "27",
    title: "District Sales Manager",
    company: "Consumer Goods Corp",
    location: "Minneapolis, MN",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    industry: "Retail",
    description: "Manage sales team across multiple retail locations. Drive revenue growth and develop sales strategies.",
    requirements: [
      "7+ years retail sales experience",
      "3+ years management experience",
      "Territory management skills",
      "Strong analytical abilities",
      "Travel 50% required"
    ],
    benefits: ["Base + commission", "Company car", "Health benefits", "401(k)", "Performance bonus"],
    postedDate: "2024-12-18",
    featured: false
  },
  {
    id: "28",
    title: "Fleet Manager",
    company: "Regional Transport Inc",
    location: "Indianapolis, IN",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    industry: "Logistics",
    description: "Manage company fleet of 100+ vehicles. Oversee maintenance, compliance, and driver management.",
    requirements: [
      "5+ years fleet management",
      "DOT compliance knowledge",
      "Fleet management software",
      "Budget management",
      "CDL preferred"
    ],
    benefits: ["Health benefits", "Company vehicle", "Retirement plan", "Bonus program", "Paid time off"],
    postedDate: "2024-12-17",
    featured: false
  },
  {
    id: "29",
    title: "Backend Engineer",
    company: "FinTech Startup",
    location: "Remote",
    type: "Full-time",
    salary: "$135,000 - $165,000",
    industry: "Technology",
    description: "Build scalable backend services for financial applications. Work with microservices architecture.",
    requirements: [
      "5+ years backend development",
      "Node.js or Python expertise",
      "Database design skills",
      "API development experience",
      "Security-minded approach"
    ],
    benefits: ["Fully remote", "Equity package", "Health benefits", "Home office stipend", "Flexible hours"],
    postedDate: "2025-01-06",
    featured: true
  },
  {
    id: "30",
    title: "Nurse Practitioner",
    company: "Primary Care Associates",
    location: "Nashville, TN",
    type: "Full-time",
    salary: "$105,000 - $130,000",
    industry: "Healthcare",
    description: "Provide primary care services to patients of all ages. Work collaboratively with physicians and staff.",
    requirements: [
      "Master's in Nursing",
      "NP certification",
      "Active state license",
      "DEA registration",
      "EMR proficiency"
    ],
    benefits: ["Competitive salary", "Malpractice coverage", "CME allowance", "Health benefits", "Retirement plan"],
    postedDate: "2025-01-05",
    featured: false
  },
  {
    id: "31",
    title: "Compliance Officer",
    company: "Investment Management Firm",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    industry: "Finance",
    description: "Ensure regulatory compliance across all firm activities. Develop and implement compliance programs.",
    requirements: [
      "7+ years compliance experience",
      "Series 7 and 66 licenses",
      "Investment management background",
      "Strong regulatory knowledge",
      "JD or MBA preferred"
    ],
    benefits: ["Competitive salary", "Bonus program", "Health benefits", "401(k) match", "Professional development"],
    postedDate: "2024-12-16",
    featured: false
  },
  {
    id: "32",
    title: "Plant Engineer",
    company: "Chemical Processing Corp",
    location: "Baton Rouge, LA",
    type: "Full-time",
    salary: "$95,000 - $120,000",
    industry: "Manufacturing",
    description: "Optimize plant operations and lead engineering projects. Ensure safety and environmental compliance.",
    requirements: [
      "BS in Chemical or Mechanical Engineering",
      "5+ years plant experience",
      "Process improvement skills",
      "Project management experience",
      "PE license preferred"
    ],
    benefits: ["Relocation assistance", "Health benefits", "Retirement plan", "Annual bonus", "Continuing education"],
    postedDate: "2024-12-15",
    featured: false
  },
  {
    id: "33",
    title: "Visual Merchandiser",
    company: "Fashion Retail Chain",
    location: "New York, NY",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    industry: "Retail",
    description: "Create compelling visual displays that drive sales. Implement brand standards across multiple locations.",
    requirements: [
      "3+ years visual merchandising",
      "Retail fashion experience",
      "Creative portfolio",
      "Travel flexibility",
      "Physical capability for installations"
    ],
    benefits: ["Employee discount", "Health benefits", "Travel opportunities", "Creative freedom", "Career growth"],
    postedDate: "2024-12-14",
    featured: false
  },
  {
    id: "34",
    title: "Import/Export Coordinator",
    company: "International Trade Solutions",
    location: "Long Beach, CA",
    type: "Full-time",
    salary: "$58,000 - $72,000",
    industry: "Logistics",
    description: "Coordinate international shipments and customs clearance. Manage documentation and compliance.",
    requirements: [
      "3+ years import/export experience",
      "Customs broker license preferred",
      "Knowledge of trade regulations",
      "Strong organizational skills",
      "Bilingual (Spanish) a plus"
    ],
    benefits: ["Health benefits", "401(k)", "Paid time off", "Professional certification support", "Bonus program"],
    postedDate: "2024-12-13",
    featured: false
  },
  {
    id: "35",
    title: "UI/UX Designer",
    company: "Product Design Studio",
    location: "Denver, CO",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    industry: "Technology",
    description: "Design intuitive user experiences for web and mobile applications. Lead user research and testing.",
    requirements: [
      "4+ years UX design experience",
      "Figma expertise",
      "User research skills",
      "Design system experience",
      "Strong portfolio"
    ],
    benefits: ["Remote flexibility", "Health benefits", "Design tool subscriptions", "Conference budget", "Equity"],
    postedDate: "2025-01-04",
    featured: true
  },
  {
    id: "36",
    title: "Dental Hygienist",
    company: "Smile Dental Group",
    location: "San Diego, CA",
    type: "Full-time",
    salary: "$85,000 - $100,000",
    industry: "Healthcare",
    description: "Provide preventive dental care and patient education. Work in a modern, patient-focused practice.",
    requirements: [
      "Dental Hygiene license",
      "2+ years experience",
      "Local anesthesia certification",
      "Excellent patient skills",
      "Radiography certification"
    ],
    benefits: ["Competitive pay", "Health benefits", "CE allowance", "No weekends", "Modern equipment"],
    postedDate: "2024-12-12",
    featured: false
  },
  {
    id: "37",
    title: "Accounts Payable Manager",
    company: "Corporate Services Inc",
    location: "Atlanta, GA",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    industry: "Finance",
    description: "Manage accounts payable department and optimize payment processes. Lead team of AP specialists.",
    requirements: [
      "5+ years AP experience",
      "2+ years management experience",
      "ERP system expertise",
      "Process improvement skills",
      "Strong leadership abilities"
    ],
    benefits: ["Health benefits", "401(k) match", "Hybrid work", "Professional development", "Annual bonus"],
    postedDate: "2024-12-11",
    featured: false
  },
  {
    id: "38",
    title: "Electrical Engineer",
    company: "Industrial Automation Co",
    location: "Pittsburgh, PA",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    industry: "Manufacturing",
    description: "Design electrical systems for manufacturing automation. Program PLCs and develop control systems.",
    requirements: [
      "BS in Electrical Engineering",
      "5+ years industrial experience",
      "PLC programming (Allen-Bradley)",
      "AutoCAD Electrical",
      "Control panel design"
    ],
    benefits: ["Health benefits", "Retirement plan", "Continuing education", "Project variety", "Stable company"],
    postedDate: "2024-12-10",
    featured: false
  },
  {
    id: "39",
    title: "Buyer/Purchasing Agent",
    company: "Retail Distribution Center",
    location: "Kansas City, MO",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    industry: "Retail",
    description: "Manage vendor relationships and negotiate purchases. Optimize inventory levels and costs.",
    requirements: [
      "3+ years purchasing experience",
      "Negotiation skills",
      "Inventory management",
      "ERP system experience",
      "Analytical abilities"
    ],
    benefits: ["Health benefits", "401(k)", "Employee discount", "Professional development", "Work-life balance"],
    postedDate: "2024-12-09",
    featured: false
  },
  {
    id: "40",
    title: "Transportation Manager",
    company: "Midwest Trucking Co",
    location: "Columbus, OH",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    industry: "Logistics",
    description: "Oversee all transportation operations. Manage driver team and optimize routes for efficiency.",
    requirements: [
      "7+ years transportation experience",
      "3+ years management",
      "DOT regulations expertise",
      "TMS proficiency",
      "CDL Class A preferred"
    ],
    benefits: ["Health benefits", "Company vehicle", "Retirement plan", "Performance bonus", "Paid vacation"],
    postedDate: "2024-12-08",
    featured: false
  },
  {
    id: "41",
    title: "Cloud Solutions Architect",
    company: "Enterprise Tech Consulting",
    location: "Remote",
    type: "Full-time",
    salary: "$160,000 - $200,000",
    industry: "Technology",
    description: "Design and implement cloud solutions for enterprise clients. Lead digital transformation initiatives.",
    requirements: [
      "8+ years IT experience",
      "AWS/Azure/GCP certifications",
      "Architecture design skills",
      "Client-facing experience",
      "Excellent communication"
    ],
    benefits: ["Fully remote", "Competitive salary", "Certification support", "Health benefits", "401(k) match"],
    postedDate: "2025-01-03",
    featured: true
  },
  {
    id: "42",
    title: "Occupational Therapist",
    company: "Rehabilitation Services Inc",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$78,000 - $95,000",
    industry: "Healthcare",
    description: "Help patients develop, recover, and improve daily living skills. Work with diverse patient populations.",
    requirements: [
      "Master's in Occupational Therapy",
      "OT license",
      "2+ years experience",
      "Strong patient rapport",
      "Documentation skills"
    ],
    benefits: ["Health benefits", "CEU allowance", "Retirement plan", "Flexible schedule", "Signing bonus"],
    postedDate: "2024-12-07",
    featured: false
  },
  {
    id: "43",
    title: "Treasury Analyst",
    company: "Multinational Corporation",
    location: "Stamford, CT",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    industry: "Finance",
    description: "Manage cash operations and support treasury activities. Analyze financial data and prepare reports.",
    requirements: [
      "Bachelor's in Finance",
      "3+ years treasury experience",
      "Cash management expertise",
      "FX exposure a plus",
      "CTP certification preferred"
    ],
    benefits: ["Competitive salary", "Health benefits", "401(k) match", "Hybrid work", "Career advancement"],
    postedDate: "2024-12-06",
    featured: false
  },
  {
    id: "44",
    title: "Safety Manager",
    company: "Heavy Industry Corp",
    location: "Birmingham, AL",
    type: "Full-time",
    salary: "$75,000 - $95,000",
    industry: "Manufacturing",
    description: "Develop and implement safety programs. Ensure OSHA compliance and reduce workplace incidents.",
    requirements: [
      "5+ years safety experience",
      "OSHA certifications",
      "Industrial/manufacturing background",
      "Training development skills",
      "CSP certification preferred"
    ],
    benefits: ["Health benefits", "Retirement plan", "Company vehicle", "Professional development", "Stable employment"],
    postedDate: "2024-12-05",
    featured: false
  },
  {
    id: "45",
    title: "E-commerce Manager",
    company: "Online Retail Brand",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    industry: "Retail",
    description: "Drive online sales growth and optimize e-commerce operations. Manage digital marketing and merchandising.",
    requirements: [
      "5+ years e-commerce experience",
      "Shopify/Magento expertise",
      "Digital marketing knowledge",
      "Analytics proficiency",
      "Team management skills"
    ],
    benefits: ["Health benefits", "Performance bonus", "Remote flexibility", "Employee discount", "Stock options"],
    postedDate: "2024-12-04",
    featured: false
  },
  {
    id: "46",
    title: "Dispatch Supervisor",
    company: "Regional Delivery Services",
    location: "Phoenix, AZ",
    type: "Full-time",
    salary: "$55,000 - $68,000",
    industry: "Logistics",
    description: "Supervise dispatch operations and driver team. Ensure on-time deliveries and customer satisfaction.",
    requirements: [
      "3+ years dispatch experience",
      "1+ year supervisory role",
      "Route optimization skills",
      "Dispatch software proficiency",
      "Problem-solving abilities"
    ],
    benefits: ["Health benefits", "401(k)", "Overtime opportunities", "Career advancement", "Paid time off"],
    postedDate: "2024-12-03",
    featured: false
  },
  {
    id: "47",
    title: "Machine Learning Engineer",
    company: "AI Research Lab",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$150,000 - $190,000",
    industry: "Technology",
    description: "Develop and deploy machine learning models at scale. Work on cutting-edge AI research projects.",
    requirements: [
      "MS/PhD in CS or related field",
      "Python and TensorFlow/PyTorch",
      "MLOps experience",
      "Research publication history",
      "Strong mathematical foundation"
    ],
    benefits: ["Research environment", "Conference attendance", "Health benefits", "Stock options", "Flexible hours"],
    postedDate: "2025-01-02",
    featured: true
  },
  {
    id: "48",
    title: "Radiologic Technologist",
    company: "Imaging Centers of America",
    location: "Tampa, FL",
    type: "Full-time",
    salary: "$60,000 - $75,000",
    industry: "Healthcare",
    description: "Perform diagnostic imaging procedures. Ensure patient safety and image quality.",
    requirements: [
      "ARRT certification",
      "State licensure",
      "2+ years experience",
      "CT certification a plus",
      "Patient care skills"
    ],
    benefits: ["Health benefits", "Retirement plan", "CE reimbursement", "Flexible schedule", "Sign-on bonus"],
    postedDate: "2024-12-02",
    featured: false
  },
  {
    id: "49",
    title: "Contract Recruiter",
    company: "Brand Metrics LLC",
    location: "Cheyenne, WY",
    type: "Contract",
    salary: "$60,000 - $80,000",
    industry: "Technology",
    description: "Source and recruit top talent for our clients. Build candidate pipelines and manage relationships.",
    requirements: [
      "3+ years recruiting experience",
      "ATS proficiency",
      "Strong sourcing skills",
      "Excellent communication",
      "Self-motivated"
    ],
    benefits: ["Competitive pay", "Remote work", "Flexible schedule", "Commission potential", "Growth opportunity"],
    postedDate: "2025-01-10",
    featured: true
  },
  {
    id: "50",
    title: "Warehouse Associate",
    company: "Distribution Unlimited",
    location: "Multiple Locations",
    type: "Full-time",
    salary: "$35,000 - $45,000",
    industry: "Logistics",
    description: "Pick, pack, and ship orders in fast-paced warehouse. Operate material handling equipment.",
    requirements: [
      "Warehouse experience preferred",
      "Ability to lift 50 lbs",
      "Basic computer skills",
      "Reliable attendance",
      "Forklift experience a plus"
    ],
    benefits: ["Health benefits", "401(k)", "Weekly pay", "Overtime available", "Advancement opportunities"],
    postedDate: "2025-01-01",
    featured: false
  }
];

export const industries = [
  { name: "Technology", slug: "technology", count: 12, icon: "Monitor" },
  { name: "Healthcare", slug: "healthcare", count: 10, icon: "Heart" },
  { name: "Finance", slug: "finance", count: 8, icon: "DollarSign" },
  { name: "Manufacturing", slug: "manufacturing", count: 8, icon: "Factory" },
  { name: "Retail", slug: "retail", count: 6, icon: "ShoppingBag" },
  { name: "Logistics", slug: "logistics", count: 6, icon: "Truck" }
];

export const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary"];

export const locations = [
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Denver, CO",
  "Boston, MA",
  "Atlanta, GA",
  "Miami, FL",
  "Dallas, TX",
  "Phoenix, AZ",
  "Multiple Locations"
];
