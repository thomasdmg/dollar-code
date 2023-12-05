// Liste des pays zone EU
const countryListEU = [
    'United Kingdom of Great Britain and Northern Ireland',
    'Netherlands',
    'Germany',
    'France',
    'Spain',
    'Belgium',
    'Italy',
    'Portugal',
    'Switzerland',
    'Poland',
    'Ireland'
  ];

  // Liste des pays NA
  const countryListNA = ['United States of America', 'Canada'];

  // Liste des formations
  const formalEducationListKey = {
    "Primary/elementary school": "Primary/Elementary school",
    "Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)": "Secondary School",
    "Some college/university study without earning a degree": "College / University without degree",
    "Associate degree (A.A., A.S., etc.)": "Associate degree",
    "Bachelor’s degree (B.A., B.S., B.Eng., etc.)" : "Bachelor's degree",
    "Master’s degree (M.A., M.S., M.Eng., MBA, etc.)": "Master's degree",
    "Professional degree (JD, MD, Ph.D, Ed.D, etc.)": "Professional degree",
    "Something else": "Others"
  };


  // Liste des plateformes cloud
  const cloudPlatformListKey = {
    "Amazon Web Services (AWS)": "AWS",
    "Microsoft Azure": "Azure",
    "Cloudflare": "Cloudflare",
    "Google Cloud": "Google Cloud",
    "Colocation": "Colocation",
    "Digital Ocean": "Digital Ocean",
    "Firebase": "Firebase",
    "Fly.io": "Fly.io",
    "Heroku": "Heroku",
    "Hetzner": "Hetzner",
    "IBM Cloud or Watson": "IBM Cloud",
    "Linode, now Akamai": "Linode",
    "Managed Hosting": "Managed Hosting",
    "Netlify": "Netlify",
    "OVH": "OVH Cloud",
    "OpenShift": "OpenShift",
    "OpenStack": "OpenStack",
    "Oracle Cloud Infrastructure (OCI)": "Oracle Cloud",
    "Render": "Render",
    "Scaleway": "Scaleway",
    "VWare": "VMWare",
    "Vercel": "Vercel",
    "Vultr": "Vultr"  
  };


  var salaryYearsList = {
    '0-5': 0,
    '5-10': 0,
    '10-15': 0,
    '15-20': 0,
    '20-25': 0,
    '25-30': 0,
    '30-35': 0,
    '35-40': 0,
    '40-45': 0,
    '45-50': 0,
    '50+': 0
  };
  
  var counterList = {
    '0-5': 0,
    '5-10': 0,
    '10-15': 0,
    '15-20': 0,
    '20-25': 0,
    '25-30': 0,
    '30-35': 0,
    '35-40': 0,
    '40-45': 0,
    '45-50': 0,
    '50+': 0
  };


  const postList = {
    "Academic researcher": "Academic researcher",
    "Blockchain": "Blockchain",
    "Cloud infrastructure engineer": "Cloud engineer",
    "Data or business analyst": "Data analyst",
    "Data scientist or machine learning specialist": "Data scientist",
    "Database administrator": "Database admin",
    "Designer": "Designer",
    "Developer Advocate": "Developer Advocate",
    "Developer Experience": "Dev Experience",
    "Developer, QA or test": "Developer, QA",
    "Developer, back-end": "Back-end dev",
    "Developer, desktop or enterprise applications": "Desktop dev",
    "Developer, embedded applications or devices": "Embedded dev",
    "Developer, front-end": "Front-end dev",
    "Developer, full-stack": "Full-stack dev",
    "Developer, game or graphics": "Game & Graphics dev",
    "Developer, mobile": "Mobile dev",
    "DevOps specialist": "DevOps specialist",
    "Educator": "Educator",
    "Engineering manager": "Engineering manager",
    "Engineer, data": "Data engineer",
    "Engineer, site reliability": "Site reliability engineer",
    "Hardware Engineer": "Hardware Engineer",
    "Marketing or sales professional": "Marketing / Sales",
    "Other (please specify):": "Other",
    "Product manager": "Product manager",
    "Project manager": "Project manager",
    "Research & Development role": "R&D",
    "Scientist": "Scientist",
    "Security professional": "Security",
    "Senior Executive (C-Suite, VP, etc.)": "Senior Executive",
    "Student": "Student",
    "System administrator": "System admin"
  };