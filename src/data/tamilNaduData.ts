import { DistrictStat, Grievance, WelfareScheme, VolunteerTask, CommunityPoll } from '../types';

export const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar'
] as const;

export const DISTRICT_TAMIL_NAMES: Record<string, string> = {
  'Ariyalur': 'அரியலூர்',
  'Chengalpattu': 'செங்கல்பட்டு',
  'Chennai': 'சென்னை',
  'Coimbatore': 'கோயம்புத்தூர்',
  'Cuddalore': 'கடலூர்',
  'Dharmapuri': 'தருமபுரி',
  'Dindigul': 'திண்டுக்கல்',
  'Erode': 'ஈரோடு',
  'Kallakurichi': 'கள்ளக்குறிச்சி',
  'Kanchipuram': 'காஞ்சிபுரம்',
  'Kanyakumari': 'கன்னியாகுமரி',
  'Karur': 'கரூர்',
  'Krishnagiri': 'கிருஷ்ணகிரி',
  'Madurai': 'மதுரை',
  'Mayiladuthurai': 'மயிலாடுதுறை',
  'Nagapattinam': 'நாகப்பட்டினம்',
  'Namakkal': 'நாமக்கல்',
  'Nilgiris': 'நீலகிரி',
  'Perambalur': 'பெரம்பலூர்',
  'Pudukkottai': 'புதுக்கோட்டை',
  'Ramanathapuram': 'ராமநாதபுரம்',
  'Ranipet': 'ராணிப்பேட்டை',
  'Salem': 'சேலம்',
  'Sivaganga': 'சிவகங்கை',
  'Tenkasi': 'தென்காசி',
  'Thanjavur': 'தஞ்சாவூர்',
  'Theni': 'தேனி',
  'Thoothukudi': 'தூத்துக்குடி',
  'Tiruchirappalli': 'திருச்சிராப்பள்ளி',
  'Tirunelveli': 'திருநெல்வேலி',
  'Tirupattur': 'திருப்பத்தூர்',
  'Tiruppur': 'திருப்பூர்',
  'Tiruvallur': 'திருவள்ளூர்',
  'Tiruvannamalai': 'திருவண்ணாமலை',
  'Tiruvarur': 'திருவாரூர்',
  'Vellore': 'வேலூர்',
  'Viluppuram': 'விழுப்புரம்',
  'Virudhunagar': 'விருதுநகர்'
};

export const CATEGORY_TAMIL_MAP: Record<string, string> = {
  'Water Supply & Drainage': 'குடிநீர் & கழிவுநீர் வடிகால்',
  'Roads & Traffic Infrastructure': 'சாலைகள் & போக்குவரத்து உட்கட்டமைப்பு',
  'Electricity & Street Lighting': 'மின்சாரம் & தெருவிளக்குகள்',
  'Sanitation & Solid Waste': 'சுகாதாரம் & திடக்கழிவு மேலாண்மை',
  'Public Health & Hospitals': 'மக்கள் நல்வாழ்வு & அரசு மருத்துவமனைகள்',
  'Agriculture & Irrigation': 'விவசாயம் & பாசனக் கால்வாய்கள்',
  'Education & Government Schools': 'கல்வி & அரசுப் பள்ளிகள்',
  'Women & Child Safety': 'மகளிர் & குழந்தைகள் பாதுகாப்பு',
  'Revenue & Land Records': 'வருவாய்த்துறை & பட்டா / நில ஆவணங்கள்',
  'Civil Supplies & Ration PDS': 'ரேஷன் கடைகள் & உணவுப்பொருள் வழங்கல்',
  'Public Transport & Bus Services': 'அரசுப் பேருந்து & பொதுப் போக்குவரத்து',
  'Environment & Pollution': 'சுற்றுச்சூழல் & மாசு கட்டுப்பாடு',
  'Other Civic Issue': 'இதர மக்கள் பொதுப் பிரச்சனைகள்'
};

export const DISTRICT_TALUKS_MAP: Record<string, string[]> = {
  'Ariyalur': ['Ariyalur', 'Sendurai', 'Udayarpalayam', 'Andimadam'],
  'Chengalpattu': ['Chengalpattu', 'Tambaram', 'Pallavaram', 'Vandalur', 'Maduranthakam', 'Cheyyur', 'Thiruporur'],
  'Chennai': ['Velachery', 'Mylapore', 'T. Nagar', 'Anna Nagar', 'Royapuram', 'Tondiarpet', 'Guindy', 'Alandur', 'Ambattur', 'Sholinganallur', 'Perambur'],
  'Coimbatore': ['Coimbatore South', 'Coimbatore North', 'Pollachi', 'Mettupalayam', 'Sulur', 'Annur', 'Valparai'],
  'Cuddalore': ['Cuddalore', 'Chidambaram', 'Panruti', 'Virudhachalam', 'Tittakudi', 'Kattumannarkoil', 'Kurinjipadi'],
  'Dharmapuri': ['Dharmapuri', 'Harur', 'Palacode', 'Pennagaram', 'Pappireddipatti', 'Karimangalam', 'Nallampalli'],
  'Dindigul': ['Dindigul East', 'Dindigul West', 'Palani', 'Kodaikanal', 'Natham', 'Nilakottai', 'Oddanchatram', 'Vedasandur'],
  'Erode': ['Erode', 'Gobichettipalayam', 'Bhavani', 'Perundurai', 'Sathyamangalam', 'Anthiyur', 'Kodumudi'],
  'Kallakurichi': ['Kallakurichi', 'Chinnasalem', 'Sankarapuram', 'Ulundurpet', 'Tirukkoyilur', 'Kalvarayan Hills'],
  'Kanchipuram': ['Kanchipuram', 'Sriperumbudur', 'Walajabad', 'Kundrathur', 'Uthiramerur'],
  'Kanyakumari': ['Agasteeswaram (Nagercoil)', 'Thovalai', 'Kalkulam', 'Vilavancode', 'Killiyoor', 'Thiruvattar'],
  'Karur': ['Karur', 'Aravakurichi', 'Kulithalai', 'Krishnarayapuram', 'Manmangalam', 'Kadavur'],
  'Krishnagiri': ['Krishnagiri', 'Hosur', 'Pochampalli', 'Uthangarai', 'Denkanikottai', 'Bargur', 'Shoolagiri', 'Anchetty'],
  'Madurai': ['Madurai West', 'Madurai North', 'Madurai South', 'Melur', 'Thirumangalam', 'Usilampatti', 'Vadipatti', 'Peraiyur'],
  'Mayiladuthurai': ['Mayiladuthurai', 'Sirkazhi', 'Tharangambadi', 'Kuthalam'],
  'Nagapattinam': ['Nagapattinam', 'Kilvelur', 'Vedaranyam', 'Thirukkuvalai'],
  'Namakkal': ['Namakkal', 'Tiruchengode', 'Rasipuram', 'Paramathi Velur', 'Kolli Hills', 'Sendamangalam', 'Kumarapalayam'],
  'Nilgiris': ['Udhagamandalam (Ooty)', 'Coonoor', 'Kotagiri', 'Gudalur', 'Kundah', 'Pandalur'],
  'Perambalur': ['Perambalur', 'Kunnam', 'Alathur', 'Veppanthattai'],
  'Pudukkottai': ['Pudukkottai', 'Aranthangi', 'Gandarvakottai', 'Alangudi', 'Illuppur', 'Karambakudi', 'Avudayarkoil'],
  'Ramanathapuram': ['Ramanathapuram', 'Rameswaram', 'Paramakudi', 'Tiruvadanai', 'Mudukulathur', 'Kadaladi', 'Kamuthi'],
  'Ranipet': ['Ranipet', 'Walajah', 'Arcot', 'Arakkonam', 'Nemili', 'Sholinghur'],
  'Salem': ['Salem', 'Attur', 'Mettur', 'Omalur', 'Sankari', 'Yercaud', 'Gangavalli', 'Valapady', 'Edappadi'],
  'Sivaganga': ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Tiruppuvanam', 'Ilayangudi', 'Kalayarkovil'],
  'Tenkasi': ['Tenkasi', 'Sankarankovil', 'Ambasamudram', 'Kadayanallur', 'Shenkottai', 'Alangulam', 'Thiruvengadam'],
  'Thanjavur': ['Thanjavur', 'Kumbakonam', 'Pattukkottai', 'Orathanadu', 'Papanasam', 'Thiruvaiyaru', 'Peravurani', 'Budalur'],
  'Theni': ['Theni', 'Periyakulam', 'Bodinayakanur', 'Uthamapalayam', 'Andipatti'],
  'Thoothukudi': ['Thoothukudi', 'Tiruchendur', 'Kovilpatti', 'Ettayapuram', 'Ottapidaram', 'Srivaikuntam', 'Vilathikulam'],
  'Tiruchirappalli': ['Tiruchirappalli East', 'Tiruchirappalli West', 'Srirangam', 'Manapparai', 'Lalgudi', 'Thuraiyur', 'Musiri'],
  'Tirunelveli': ['Tirunelveli', 'Palayamkottai', 'Cheranmahadevi', 'Radhapuram', 'Nanguneri', 'Tisayanvilai'],
  'Tirupattur': ['Tirupattur', 'Vaniyambadi', 'Ambur', 'Natrampalli'],
  'Tiruppur': ['Tiruppur North', 'Tiruppur South', 'Avinashi', 'Dharapuram', 'Udumalaipettai', 'Kangeyam', 'Palladam'],
  'Tiruvallur': ['Tiruvallur', 'Avadi', 'Ponneri', 'Gummidipoondi', 'Poonamallee', 'Tiruttani', 'Uthukkottai'],
  'Tiruvannamalai': ['Tiruvannamalai', 'Arni', 'Polur', 'Chengam', 'Vandavasi', 'Cheyyar', 'Kalasapakkam', 'Kilpennathur'],
  'Tiruvarur': ['Tiruvarur', 'Mannargudi', 'Nannilam', 'Thiruthuraipoondi', 'Needamangalam', 'Kodavasal', 'Valangaiman'],
  'Vellore': ['Vellore', 'Katpadi', 'Gudiyatham', 'Anaicut', 'K.V. Kuppam', 'Pernambut'],
  'Viluppuram': ['Viluppuram', 'Tindivanam', 'Gingee', 'Vanur', 'Vikravandi', 'Kandachipuram', 'Marakkanam'],
  'Virudhunagar': ['Virudhunagar', 'Sivakasi', 'Srivilliputhur', 'Rajapalayam', 'Aruppukkottai', 'Sattur', 'Tiruchuli']
};

export const TALUK_VILLAGES_MAP: Record<string, string[]> = {
  'Ariyalur': ['Poyyur Gramam', 'Kallankurichi', 'Kairalabad', 'Manakkal', 'Govindapuram', 'Ward 1 Town', 'Ward 4 Bus Stand Area'],
  'Sendurai': ['Asaveerankudikadu', 'Manapathur', 'Nakkambadi', 'Ponparappi', 'Sannasinallur', 'Periyakurichi'],
  'Velachery': ['Ward 142 (Gandhi Nagar)', 'Ward 143 (Tansi Nagar)', 'Ward 177 (Dhandeeswaram)', 'Kaiveli Junction Area', 'Baby Nagar'],
  'Mylapore': ['Ward 121 (Luz Corner)', 'Ward 122 (Alwarpet)', 'Ward 123 (San Thome)', 'Mandaveli Post Office St', 'Kapaleeswarar South Mada St'],
  'Melur': ['Kottampatti Village', 'Vellalur', 'Navinipatti', 'Attukulam', 'Uranganpatti', 'Ward 5 Melur Town', 'Therkutheru'],
  'Madurai West': ['Kalavasal Junction', 'Arapalayam Ward 28', 'Kochadai', 'Samayanallur', 'Thenur', 'Ponmeni'],
  'Coimbatore South': ['Singanallur Ward 58', 'Ramanathapuram', 'Ukkadam Town', 'Kuniyamuthur', 'Kurichi Ward 82', 'Sundarapuram'],
  'Pollachi': ['Anamalai Village', 'Samathur', 'Kinathukadavu Border', 'Zamin Uthukuli', 'Achipatti', 'Kottur'],
  'Srirangam': ['Ward 1 Temple Car Street', 'Mambalasalai', 'Thiruvanaikoil Ward 3', 'Pethatturai', 'Gunaseelam Road'],
  'Kumbakonam': ['Darasuram Village', 'Swamimalai Town Ward', 'Thirunageswaram', 'Sakkottai', 'Ward 12 Mahamaham Tank Area'],
  'Hosur': ['Zuzuvadi Industrial Ward', 'Bagalur Village', 'Mathigiri Town', 'Mookandapalli', 'Avalapalli Road', 'Chennathur'],
  'Tirunelveli': ['Town West Car St', 'Vannarpettai', 'Thachanallur Ward 12', 'Suthamalli Village', 'Pettai'],
  'Palani': ['Adivaram Ward 4', 'Ayakudi Village', 'Neikarapatti', 'Balasamudram', 'Chathrapatti'],
  'Vellore': ['Sathuvachari Ward 21', 'Bagayam', 'Thorapadi', 'Otteri Village', 'Katpadi Station Road Ward 7']
};

export const getTaluksForDistrict = (district: string): string[] => {
  return DISTRICT_TALUKS_MAP[district] || [
    `${district} North`,
    `${district} South`,
    `${district} Central`,
    `${district} Rural`
  ];
};

export const getVillagesForTaluk = (taluk: string): string[] => {
  return TALUK_VILLAGES_MAP[taluk] || [
    `${taluk} Central Ward 1`,
    `${taluk} Main Village (Panchayat)`,
    `${taluk} North Hamlet`,
    `${taluk} Bazaar Road Area`,
    `${taluk} Gandhi Nagar Colony`
  ];
};


export const SEED_DISTRICT_STATS: DistrictStat[] = [
  {
    district: 'Chennai',
    districtTamil: 'சென்னை',
    zone: 'North',
    totalGrievances: 1420,
    resolvedGrievances: 1248,
    inProgressGrievances: 172,
    resolutionRate: 87.8,
    avgResolutionDays: 4.2,
    topIssueCategory: 'Water Supply & Drainage',
    activeVolunteers: 450,
    nodalOfficer: 'Thiru. J. Radhakrishnan IAS / Zonal Engg',
    collectoratePhone: '044-25268320'
  },
  {
    district: 'Coimbatore',
    districtTamil: 'கோயம்புத்தூர்',
    zone: 'West',
    totalGrievances: 980,
    resolvedGrievances: 890,
    inProgressGrievances: 90,
    resolutionRate: 90.8,
    avgResolutionDays: 3.8,
    topIssueCategory: 'Roads & Traffic Infrastructure',
    activeVolunteers: 320,
    nodalOfficer: 'Thiru. Kranthi Kumar Pati IAS',
    collectoratePhone: '0422-2301114'
  },
  {
    district: 'Madurai',
    districtTamil: 'மதுரை',
    zone: 'South',
    totalGrievances: 1120,
    resolvedGrievances: 994,
    inProgressGrievances: 126,
    resolutionRate: 88.7,
    avgResolutionDays: 4.5,
    topIssueCategory: 'Sanitation & Solid Waste',
    activeVolunteers: 390,
    nodalOfficer: 'Thiru. M.S. Sangeetha IAS',
    collectoratePhone: '0452-2531110'
  },
  {
    district: 'Tiruchirappalli',
    districtTamil: 'திருச்சிராப்பள்ளி',
    zone: 'Central',
    totalGrievances: 760,
    resolvedGrievances: 692,
    inProgressGrievances: 68,
    resolutionRate: 91.0,
    avgResolutionDays: 3.9,
    topIssueCategory: 'Electricity & Street Lighting',
    activeVolunteers: 260,
    nodalOfficer: 'Thiru. M. Pradeep Kumar IAS',
    collectoratePhone: '0431-2410333'
  },
  {
    district: 'Salem',
    districtTamil: 'சேலம்',
    zone: 'West',
    totalGrievances: 840,
    resolvedGrievances: 755,
    inProgressGrievances: 85,
    resolutionRate: 89.8,
    avgResolutionDays: 4.1,
    topIssueCategory: 'Agriculture & Irrigation',
    activeVolunteers: 280,
    nodalOfficer: 'Dr. R. Brindha Devi IAS',
    collectoratePhone: '0427-2450111'
  },
  {
    district: 'Tirunelveli',
    districtTamil: 'திருநெல்வேலி',
    zone: 'South',
    totalGrievances: 640,
    resolvedGrievances: 588,
    inProgressGrievances: 52,
    resolutionRate: 91.8,
    avgResolutionDays: 3.6,
    topIssueCategory: 'Water Supply & Drainage',
    activeVolunteers: 210,
    nodalOfficer: 'Dr. K.P. Karthikeyan IAS',
    collectoratePhone: '0462-2500828'
  },
  {
    district: 'Thanjavur',
    districtTamil: 'தஞ்சாவூர்',
    zone: 'Central',
    totalGrievances: 590,
    resolvedGrievances: 535,
    inProgressGrievances: 55,
    resolutionRate: 90.6,
    avgResolutionDays: 4.0,
    topIssueCategory: 'Agriculture & Irrigation',
    activeVolunteers: 230,
    nodalOfficer: 'Thiru. Deepak Jacob IAS',
    collectoratePhone: '04362-230121'
  },
  {
    district: 'Erode',
    districtTamil: 'ஈரோடு',
    zone: 'West',
    totalGrievances: 520,
    resolvedGrievances: 478,
    inProgressGrievances: 42,
    resolutionRate: 91.9,
    avgResolutionDays: 3.5,
    topIssueCategory: 'Environment & Pollution',
    activeVolunteers: 190,
    nodalOfficer: 'Thiru. Raja Gopal Sunkara IAS',
    collectoratePhone: '0424-2260201'
  },
  {
    district: 'Kanyakumari',
    districtTamil: 'கன்னியாகுமரி',
    zone: 'South',
    totalGrievances: 460,
    resolvedGrievances: 425,
    inProgressGrievances: 35,
    resolutionRate: 92.3,
    avgResolutionDays: 3.4,
    topIssueCategory: 'Public Transport & Bus Services',
    activeVolunteers: 175,
    nodalOfficer: 'Thiru. P.N. Sridhar IAS',
    collectoratePhone: '04652-279555'
  },
  {
    district: 'Vellore',
    districtTamil: 'வேலூர்',
    zone: 'North',
    totalGrievances: 610,
    resolvedGrievances: 542,
    inProgressGrievances: 68,
    resolutionRate: 88.8,
    avgResolutionDays: 4.3,
    topIssueCategory: 'Roads & Traffic Infrastructure',
    activeVolunteers: 220,
    nodalOfficer: 'Thiru. V.R. Subbulaxmi IAS',
    collectoratePhone: '0416-2252501'
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'TN-GRV-2026-8492',
    title: 'Severe Drinking Water Pipeline Leakage & Contamination in Ward 142',
    description: 'The primary Metro Water underground pipeline on 4th Main Road, Velachery has ruptured near the community center, causing thousands of liters of potable water to waste while sewage water seeps into residential supply lines. Over 450 families without clean drinking water for 3 days.',
    category: 'Water Supply & Drainage',
    categoryTamil: 'குடிநீர் & கழிவுநீர் வடிகால்',
    district: 'Chennai',
    taluk: 'Velachery',
    village: 'Ward 142 (Gandhi Nagar)',
    ward: 'Ward 142 (Zone 13)',
    locationDetails: '4th Main Road, Near Gandhi Community Hall, Velachery West',
    landmark: 'Opposite State Bank ATM',
    citizenName: 'M. Senthilkumar',
    citizenPhone: '98401*****',
    submittedAt: '2026-08-14 09:30 AM',
    status: 'In Progress',
    urgency: 'Critical',
    urgencyScore: 9,
    upvotes: 78,
    hasUpvoted: false,
    assignedDepartment: 'Chennai Metro Water Supply and Sewerage Board (CMWSSB)',
    assignedDepartmentTamil: 'சென்னை பெருநகர குடிநீர் வழங்கல் மற்றும் கழிவுநீரகற்று வாரியம்',
    assignedOfficer: {
      name: 'Er. K. Murugesan',
      designation: 'Assistant Executive Engineer (Area 13)',
      contactPhone: '044-22431289'
    },
    estimatedResolutionDays: 2,
    slaDeadline: '2026-08-16 05:00 PM',
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80'
    ],
    timeline: [
      {
        status: 'Submitted',
        titleTamil: 'மனு பதிவு செய்யப்பட்டது',
        titleEnglish: 'Petition Registered & Assigned Token',
        descriptionTamil: 'மனு எண் TN-GRV-2026-8492 முறைப்படி பதிவு செய்யப்பட்டு மண்டல பொறியாளருக்கு அனுப்பப்பட்டது.',
        descriptionEnglish: 'Petition submitted online and auto-routed to CMWSSB Area 13 nodal officer.',
        timestamp: '2026-08-14 09:30 AM',
        completed: true
      },
      {
        status: 'Officer Assigned',
        titleTamil: 'அலுவலர் ஆய்வு குழு நியமனம்',
        titleEnglish: 'Officer Assigned for Field Inspection',
        descriptionTamil: 'உதவி செயற்பொறியாளர் திரு. கே. முருகேசன் அவர்கள் ஆய்வுக்கு நியமிக்கப்பட்டுள்ளார்.',
        descriptionEnglish: 'AEE Murugesan assigned along with emergency maintenance team.',
        timestamp: '2026-08-14 11:15 AM',
        officerName: 'Er. K. Murugesan',
        officerDesignation: 'AEE Zone 13',
        department: 'CMWSSB',
        completed: true
      },
      {
        status: 'Field Inspection',
        titleTamil: 'கள ஆய்வு நிறைவு & பழுது மதிப்பீடு',
        titleEnglish: 'Site Inspection & Repair Mobilization',
        descriptionTamil: 'களப்பணியாளர்கள் ஆய்வு செய்து 200 மிமீ குழாய் சேதமடைந்துள்ளதை உறுதி செய்தனர். ஜேசிபி மற்றும் உதிரி குழாய்கள் வரவழைக்கப்பட்டுள்ளன.',
        descriptionEnglish: '200mm main pipe fracture identified. Excavation team and replacement ductile iron pipes mobilized on site.',
        timestamp: '2026-08-14 03:45 PM',
        completed: true
      },
      {
        status: 'In Progress',
        titleTamil: 'குழாய் சீரமைப்பு பணி தீவிரமாக நடைபெறுகிறது',
        titleEnglish: 'Pipe Replacement Work In Progress',
        descriptionTamil: 'பழைய உடைந்த குழாய் அகற்றப்பட்டு புதிய குழாய் பொருத்தும் பணி நடைபெற்று வருகிறது. மாலைக்குள் குடிநீர் விநியோகம் சீராகும்.',
        descriptionEnglish: 'Excavation completed, new pipe joint welding underway. Potable water supply scheduled to be restored by evening.',
        timestamp: '2026-08-15 08:00 AM',
        completed: true
      },
      {
        status: 'Resolved',
        titleTamil: 'பணி நிறைவு & பொதுமக்கள் சரிபார்ப்பு',
        titleEnglish: 'Work Completion & Citizen Verification',
        descriptionTamil: 'பணி நிறைவு செய்யப்பட்டு குடிநீர் தரம் பரிசோதிக்கப்படும்.',
        descriptionEnglish: 'Work will be certified and water pressure testing conducted.',
        timestamp: 'Estimated: 2026-08-16 05:00 PM',
        completed: false
      }
    ],
    aiAnalysis: {
      summaryTamil: 'வேளச்சேரி 4வது மெயின் ரோட்டில் குடிநீர் குழாய் உடைப்பினால் 450 குடும்பங்கள் பாதிக்கப்பட்டுள்ளன. அவசர சீரமைப்பு தேவைப்படுகிறது.',
      summaryEnglish: 'Major metro water pipeline burst at Velachery 4th Main Road impacting 450 families. Immediate pipe section welding required.',
      actionPlanTamil: [
        'உடனடி குடிநீர் லாரி விநியோகத்தை மாற்று வழியாக ஏற்பாடு செய்தல்',
        '200 மிமீ மெயின் குழாயை புதிய டக்டைல் இரும்பு குழாயால் மாற்றுதல்',
        'கழிவுநீர் கசிவு உள்ளதா என குடிநீர் தரப் பரிசோதனை மேற்கொள்வது'
      ],
      actionPlanEnglish: [
        'Deploy emergency water tankers as temporary relief to Ward 142',
        'Replace damaged 200mm pipeline segment with heavy-duty DI pipe',
        'Conduct residual chlorine test before restoring direct mains'
      ],
      applicableRules: 'CMWSSB Citizen Charter 2024 & Water Quality Standard IS:10500'
    },
    comments: [
      {
        id: 'c1',
        author: 'R. Ananthi (Local Resident)',
        role: 'Citizen',
        text: 'Drinking water tankers arrived yesterday evening as temporary help. Grateful for quick TVK portal escalation!',
        time: 'Yesterday 6:30 PM'
      },
      {
        id: 'c2',
        author: 'TVK Ward Sevai Padai',
        role: 'Volunteer',
        text: 'Our 4 volunteers are assisting traffic diversion on 4th Main Road while the excavation machine works.',
        time: 'Today 9:15 AM'
      }
    ]
  },
  {
    id: 'TN-GRV-2026-7914',
    title: 'Dangerous Potholes and Open Culvert on Madurai Kalavasal - Bypass Junction',
    description: 'Due to recent heavy rains, large deep craters of 1.5 feet have formed across the crucial traffic intersection connecting Kalavasal to Arapalayam. Two motorcyclists suffered minor accidents yesterday. Open drain culvert slab is broken.',
    category: 'Roads & Traffic Infrastructure',
    categoryTamil: 'சாலைகள் & போக்குவரத்து உட்கட்டமைப்பு',
    district: 'Madurai',
    taluk: 'Madurai West',
    village: 'Arapalayam Ward 28',
    ward: 'Ward 28',
    locationDetails: 'Kalavasal Signal to Arapalayam Bus Stand stretch, near Government Poly Clinic',
    landmark: 'Near Kalavasal Bus Shelter',
    citizenName: 'K. Balaji',
    citizenPhone: '94432*****',
    submittedAt: '2026-08-13 11:20 AM',
    status: 'Field Inspection',
    urgency: 'High',
    urgencyScore: 8,
    upvotes: 114,
    hasUpvoted: true,
    assignedDepartment: 'Highways & State Roads Department / Madurai City Corporation',
    assignedDepartmentTamil: 'மாநில நெடுஞ்சாலைத்துறை மற்றும் மதுரை மாநகராட்சி',
    assignedOfficer: {
      name: 'Thiru. S. Ramanathan',
      designation: 'Assistant Divisional Engineer (Highways)',
      contactPhone: '0452-2621455'
    },
    estimatedResolutionDays: 3,
    slaDeadline: '2026-08-17 06:00 PM',
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    timeline: [
      {
        status: 'Submitted',
        titleTamil: 'மனு பதிவு செய்யப்பட்டது',
        titleEnglish: 'Petition Submitted',
        descriptionTamil: 'மதுரை மேற்கு தொகுதி மனு எண் TN-GRV-2026-7914 பதிவு செய்யப்பட்டது.',
        descriptionEnglish: 'Petition submitted and verified with geo-coordinates.',
        timestamp: '2026-08-13 11:20 AM',
        completed: true
      },
      {
        status: 'Officer Assigned',
        titleTamil: 'நெடுஞ்சாலைத்துறை பொறியாளர் நியமனம்',
        titleEnglish: 'Engineer Assigned',
        descriptionTamil: 'நெடுஞ்சாலைத்துறை உதவி கோட்டப் பொறியாளர் திரு. ராமநாதன் நியமிக்கப்பட்டார்.',
        descriptionEnglish: 'ADE Ramanathan notified for urgent road patchwork & culvert concrete slab replacement.',
        timestamp: '2026-08-13 02:00 PM',
        completed: true
      },
      {
        status: 'Field Inspection',
        titleTamil: 'கள ஆய்வு & எச்சரிக்கை பலகை பொருத்துதல்',
        titleEnglish: 'Inspection & Safety Barricading',
        descriptionTamil: 'கள ஆய்வு செய்யப்பட்டு விபத்து ஏற்படாமல் இருக்க எச்சரிக்கை கூம்புகள் மற்றும் பேரிகார்டுகள் வைக்கப்பட்டுள்ளன. தார் கலவை பணி நாளை தொடங்குகிறது.',
        descriptionEnglish: 'Safety barricades erected around open culvert slab. Bitumen cold-mix and ready-mix concrete slab ordered.',
        timestamp: '2026-08-14 10:30 AM',
        completed: true
      }
    ],
    aiAnalysis: {
      summaryTamil: 'மதுரை காளவாசல் சந்திப்பில் ஏற்பட்டுள்ள ஆபத்தான பள்ளங்கள் மற்றும் திறந்த சிறுபாலத்தை உடனடியாக தற்காலிக தார் கலவை மற்றும் புதிய கான்கிரீட் மூடி கொண்டு சீரமைக்க வேண்டும்.',
      summaryEnglish: 'Urgent bituminous patching and heavy-duty RCC culvert slab replacement required at Kalavasal junction to prevent fatal accidents.',
      actionPlanTamil: [
        'உடனடி பாதுகாப்பு தடுப்புகள் மற்றும் பிரதிபலிப்பான் எச்சரிக்கை பலகை அமைத்தல்',
        'உடைந்த சிறுபாலத்திற்கு புதிய ஆர்சிசி கான்கிரீட் மூடி பொருத்துதல்',
        'வெட் மிக்ஸ் மற்றும் பிட்டுமின் கலவை கொண்டு சாலையை சமன் செய்தல்'
      ],
      actionPlanEnglish: [
        'Deploy retro-reflective warning barriers at the open culvert',
        'Install pre-cast heavy duty RCC slab over the drain',
        'Execute bituminous pothole filling and rolling compaction'
      ],
      applicableRules: 'IRC:82 Maintenance Code for Urban Roads & Highways'
    }
  },
  {
    id: 'TN-GRV-2026-6520',
    title: 'Transformer Overload & 18 Streetlights Fault on Singanallur Trichy Road',
    description: 'Streetlights along 1.2 km of Trichy Road bypass have been non-functional for 8 nights due to a burnt distribution box and loose neutral wire at Transformer #4. Anti-social activities and pedestrian risks during late night shifts.',
    category: 'Electricity & Street Lighting',
    categoryTamil: 'மின்சாரம் & தெருவிளக்குகள்',
    district: 'Coimbatore',
    taluk: 'Coimbatore South',
    village: 'Singanallur Ward 58',
    ward: 'Ward 58',
    locationDetails: 'Singanallur Trichy Road Junction, Near Bus Depot',
    landmark: 'Opposite State Transport Workshop',
    citizenName: 'P. Kavitha',
    citizenPhone: '98422*****',
    submittedAt: '2026-08-10 07:45 PM',
    status: 'Resolved',
    urgency: 'Medium',
    urgencyScore: 6,
    upvotes: 42,
    hasUpvoted: false,
    assignedDepartment: 'Tamil Nadu Generation and Distribution Corporation (TANGEDCO)',
    assignedDepartmentTamil: 'தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம்',
    assignedOfficer: {
      name: 'Er. N. Shanmugam',
      designation: 'Assistant Engineer (O&M - Singanallur)',
      contactPhone: '0422-2591234'
    },
    estimatedResolutionDays: 2,
    slaDeadline: '2026-08-12 06:00 PM',
    images: [
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
    ],
    resolvedProofImage: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80',
    resolutionRemarks: 'Replacement of burnt 63A switchgear and 18 LED luminaires completed. Automatic timer relay installed for energy-efficient dawn/dusk switching.',
    citizenRating: 5,
    timeline: [
      {
        status: 'Submitted',
        titleTamil: 'மனு பதிவு',
        titleEnglish: 'Grievance Filed',
        descriptionTamil: 'சிங்காநல்லூர் மின்வாரிய உதவி பொறியாளருக்கு மின்னணு மனு மாற்றப்பட்டது.',
        descriptionEnglish: 'Transferred to TANGEDCO Singanallur O&M section.',
        timestamp: '2026-08-10 07:45 PM',
        completed: true
      },
      {
        status: 'Officer Assigned',
        titleTamil: 'பணியாளர்கள் களப்பணிக்கு உத்தரவு',
        titleEnglish: 'Field Line Staff Assigned',
        descriptionTamil: 'மின் கம்பியாளர் மற்றும் களப் பணியாளர்கள் பணிக்கு நியமிக்கப்பட்டனர்.',
        descriptionEnglish: 'Linemen and crane truck scheduled for luminaire wiring repair.',
        timestamp: '2026-08-11 09:00 AM',
        completed: true
      },
      {
        status: 'In Progress',
        titleTamil: 'சுவிட்ச்கியர் மற்றும் மின்விளக்குகள் மாற்றம்',
        titleEnglish: 'Switchgear & LED Replacement',
        descriptionTamil: 'புதிய 72W எல்இடி விளக்குகள் மற்றும் சுவிட்ச் பாக்ஸ் மாற்றப்பட்டது.',
        descriptionEnglish: 'New 72W smart LED fixtures and fuse box installed.',
        timestamp: '2026-08-11 04:30 PM',
        completed: true
      },
      {
        status: 'Resolved',
        titleTamil: 'பணி வெற்றிகரமாக நிறைவுபெற்றது',
        titleEnglish: 'Successfully Resolved',
        descriptionTamil: 'அனைத்து 18 தெருவிளக்குகளும் சீராக எரியத் தொடங்கியுள்ளன. பொதுமக்கள் உறுதி செய்தனர்.',
        descriptionEnglish: 'All 18 lights functional. Verified by Ward 58 resident welfare association.',
        timestamp: '2026-08-12 11:30 AM',
        completed: true
      }
    ]
  },
  {
    id: 'TN-GRV-2026-9104',
    title: 'Desilting Needed for Cauvery Irrigation Supply Channel at Thiruvaiyaru',
    description: 'The 4.5 km Grand Anicut canal sub-channel is choked with wild water hyacinth and silt, preventing irrigation water from reaching 1,200 acres of Kuruvai paddy fields in 3 panchayats. Sluice gate #3 handle is rusted.',
    category: 'Agriculture & Irrigation',
    categoryTamil: 'விவசாயம் & பாசனக் கால்வாய்கள்',
    district: 'Thanjavur',
    taluk: 'Thiruvaiyaru',
    village: 'Kandiyur Village',
    ward: 'Panchayat Union Ward 6',
    locationDetails: 'Thiruvaiyaru Branch Canal, Near Kandiyur Regulator',
    landmark: 'Near Kandiyur Shiva Temple Channel',
    citizenName: 'V. Sundaram (Farmer)',
    citizenPhone: '94421*****',
    submittedAt: '2026-08-14 02:15 PM',
    status: 'Officer Assigned',
    urgency: 'Critical',
    urgencyScore: 9,
    upvotes: 95,
    hasUpvoted: false,
    assignedDepartment: 'Public Works Department (Water Resources Department - WRD Cauvery Basin)',
    assignedDepartmentTamil: 'பொதுப்பணித்துறை (நீர்வள ஆதாரத் துறை - காவிரி வடிநிலக் கோட்டம்)',
    assignedOfficer: {
      name: 'Er. R. Vijay Anand',
      designation: 'Executive Engineer (WRD Thanjavur)',
      contactPhone: '04362-278912'
    },
    estimatedResolutionDays: 5,
    slaDeadline: '2026-08-19 05:00 PM',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ],
    timeline: [
      {
        status: 'Submitted',
        titleTamil: 'மனு பதிவு செய்யப்பட்டது',
        titleEnglish: 'Petition Received',
        descriptionTamil: 'திருவையாறு பாசன விவசாயிகள் சார்பில் பதிவு செய்யப்பட்ட மனு உடனடியாக நீர்வளத்துறைக்கு அனுப்பப்பட்டது.',
        descriptionEnglish: 'Petition escalated with high urgency priority for Kuruvai crop season water flow.',
        timestamp: '2026-08-14 02:15 PM',
        completed: true
      },
      {
        status: 'Officer Assigned',
        titleTamil: 'நீர்வளத்துறை செயற்பொறியாளர் பொறுப்பேற்பு',
        titleEnglish: 'WRD Executive Engineer Assigned',
        descriptionTamil: 'செயற்பொறியாளர் திரு. விஜய் ஆனந்த் அவர்களால் பொக்லைன் இயந்திரம் மற்றும் ஆகாயத்தாமரை அகற்றும் குழு தயார் செய்யப்பட்டுள்ளது.',
        descriptionEnglish: 'Amphibian weed harvester and Poclain excavator allocated under emergency canal maintenance fund.',
        timestamp: '2026-08-15 09:30 AM',
        completed: true
      }
    ],
    aiAnalysis: {
      summaryTamil: 'திருவையாறு கிளைக் கால்வாயில் ஆகாயத்தாமரை மற்றும் வண்டல் மண் படிந்துள்ளதால் 1,200 ஏக்கர் குறுவை நெற்பயிர்களுக்கு பாசன நீர் செல்வது தடைபட்டுள்ளது.',
      summaryEnglish: 'Siltation and water hyacinth blockage in Thiruvaiyaru branch channel threatening 1,200 acres of paddy cultivation.',
      actionPlanTamil: [
        'பொக்லைன் இயந்திரம் மூலம் 4.5 கி.மீ தூரத்திற்கு ஆகாயத்தாமரை அகற்றுதல்',
        'மதகு எண் 3-க்கு கிரீஸ் மற்றும் பழுது நீக்கி சீராக திறக்க நடவடிக்கை',
        'கடைமடை பகுதி வரை தண்ணீர் சீராக செல்வதை உறுதி செய்ய கள மேற்பார்வை'
      ],
      actionPlanEnglish: [
        'Deploy long-arm excavator to clear hyacinth across 4.5km canal',
        'Repair and lubricate sluice gate regulator mechanism',
        'Inspect tail-end water reaching efficiency with farmer committee'
      ],
      applicableRules: 'Tamil Nadu Irrigation Works (Repairs & Maintenance) Act'
    }
  }
];

export const WELFARE_SCHEMES_DATA: WelfareScheme[] = [
  {
    id: 'kmut-scheme',
    titleTamil: 'கலைஞர் மகளிர் உரிமைத் திட்டம்',
    titleEnglish: 'Kalaignar Magalir Urimai Thogai Scheme',
    category: 'Women Welfare',
    departmentTamil: 'சமூக நலன் மற்றும் மகளிர் உரிமைத் துறை',
    departmentEnglish: 'Department of Social Welfare & Women Empowerment',
    benefitAmount: '₹1,000 / மாதம் (மாதந்தோறும் வங்கி கணக்கில் நேரடி வரவு)',
    descriptionTamil: 'குடும்பத் தலைவிகளின் உழைப்பை அங்கீகரிக்கும் வகையில் மாதம் ₹1,000 உரிமைத்தொகை வழங்கும் முன்னோடித் திட்டம்.',
    descriptionEnglish: 'A pioneering social security scheme providing ₹1,000 monthly basic income directly to eligible women heads of families.',
    eligibilityCriteriaTamil: [
      'குடும்பத்தின் ஆண்டு வருமானம் ₹2.5 லட்சத்திற்குள் இருக்க வேண்டும்',
      'குடும்பத்திற்கு 5 ஏக்கருக்கு குறைவான நன்செய் அல்லது 10 ஏக்கருக்கு குறைவான புன்செய் நிலம் இருக்க வேண்டும்',
      'ஆண்டுக்கு 3600 யூனிட்டிற்கு குறைவாக மின்சாரம் பயன்படுத்துபவராக இருக்க வேண்டும்',
      'குடும்ப அட்டை மற்றும் ஆதார் அட்டை கட்டாயம்'
    ],
    eligibilityCriteriaEnglish: [
      'Annual family income must be under ₹2.5 Lakhs',
      'Family must own less than 5 acres wetland or 10 acres dryland',
      'Annual domestic electricity consumption under 3,600 units',
      'Must possess valid Tamil Nadu Smart Ration Card & Aadhaar'
    ],
    requiredDocuments: [
      'Aadhaar Card (ஆதார் அட்டை)',
      'Smart Ration Card (ஸ்மார்ட் குடும்ப அட்டை)',
      'Bank Passbook linked with Aadhaar (வங்கி கணக்கு புத்தகம்)',
      'Electricity Consumer Number Bill (மின் கட்டண ரசீது)'
    ],
    applicationMode: 'Online e-Sevai',
    portalUrl: 'https://kmut.tn.gov.in',
    popularScore: 99,
    highlightTag: 'Flagship Scheme'
  },
  {
    id: 'pudhumai-penn',
    titleTamil: 'புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் உயர்கல்வி உறுதி)',
    titleEnglish: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Higher Education)',
    category: 'Students & Youth',
    departmentTamil: 'சமூக நலம் & உயர்கல்வித் துறை',
    departmentEnglish: 'Social Welfare & Higher Education Department',
    benefitAmount: '₹1,000 / மாதம் (பட்டப்படிப்பு முடியும் வரை)',
    descriptionTamil: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து கல்லூரி சேரும் மாணவிகளுக்கு மாதம் ₹1,000 நிதியுதவி.',
    descriptionEnglish: 'Monthly stipend of ₹1,000 deposited directly into girl students’ bank accounts throughout their undergraduate/diploma courses.',
    eligibilityCriteriaTamil: [
      'தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை பயின்றிருக்க வேண்டும்',
      'அங்கீகரிக்கப்பட்ட கலை, அறிவியல், பொறியியல், பாலிடெக்னிக் அல்லது மருத்துவ கல்லூரியில் பயில வேண்டும்'
    ],
    eligibilityCriteriaEnglish: [
      'Must have studied from 6th to 12th standard in Tamil Nadu Government Schools',
      'Enrolled in recognized UG Degree, Diploma, ITI, Engineering, or Medical courses'
    ],
    requiredDocuments: [
      '10th & 12th Transfer Certificate (TC) from Govt School',
      'College Admission ID & Fee Receipt',
      'Aadhaar Card',
      'Student Savings Bank Account'
    ],
    applicationMode: 'Online e-Sevai',
    portalUrl: 'https://pudhumaipenn.tn.gov.in',
    popularScore: 96,
    highlightTag: 'Education Empower'
  },
  {
    id: 'tamil-pudhalvan',
    titleTamil: 'தமிழ்ப் புதல்வன் திட்டம்',
    titleEnglish: 'Tamil Pudhalvan Higher Education Scheme for Boys',
    category: 'Students & Youth',
    departmentTamil: 'பள்ளிக் கல்வி மற்றும் உயர்கல்வித் துறை',
    departmentEnglish: 'School Education & Higher Education Department',
    benefitAmount: '₹1,000 / மாதம் (கல்லூரி படிப்பு உதவித்தொகை)',
    descriptionTamil: 'அரசுப் பள்ளிகளில் படித்து உயர்கல்வி சேரும் மாணவர்களுக்கு மாதந்தோறும் ₹1,000 வழங்கும் திட்டம்.',
    descriptionEnglish: 'Financial assistance of ₹1,000 per month for male students from government schools pursuing higher collegiate education.',
    eligibilityCriteriaTamil: [
      'அரசுப் பள்ளிகளில் 6 முதல் 12 வரை படித்த மாணவர்கள்',
      'கல்லூரி / பாலிடெக்னிக் / ஐடிஐ பயிலும் மாணவர்கள்'
    ],
    eligibilityCriteriaEnglish: [
      'Male students studied in TN Govt schools from grades 6 to 12',
      'Enrolled in UG Degree, Polytechnic, or ITI programs'
    ],
    requiredDocuments: ['School TC', 'College ID', 'Aadhaar Card', 'Bank Passbook'],
    applicationMode: 'Online e-Sevai',
    portalUrl: 'https://umiss.tn.gov.in',
    popularScore: 94
  },
  {
    id: 'cmchis-health',
    titleTamil: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம்',
    titleEnglish: "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)",
    category: 'Healthcare',
    departmentTamil: 'மக்கள் நல்வாழ்வு மற்றும் குடும்ப நலத்துறை',
    departmentEnglish: 'Health & Family Welfare Department',
    benefitAmount: 'ஆண்டுக்கு ₹5,00,000 வரை இலவச நவீன மருத்துவ சிகிச்சை',
    descriptionTamil: 'அரசு மற்றும் தனியார் அங்கீகரிக்கப்பட்ட மருத்துவமனைகளில் 1,090 க்கும் மேற்பட்ட சிகிச்சைகள் மற்றும் அறுவை சிகிச்சைகளுக்கு இலவச சிகிச்சை.',
    descriptionEnglish: 'Cashless hospitalisation and surgical coverage up to ₹5 Lakhs per family per year in 1,600+ network hospitals.',
    eligibilityCriteriaTamil: [
      'குடும்ப ஆண்டு வருமானம் ₹1,20,000-க்குள் இருக்க வேண்டும்',
      'கிராம நிர்வாக அலுவலர் (VAO) வருமானச் சான்றிதழ்',
      'தமிழ்நாடு குடும்ப அட்டைதாரர்'
    ],
    eligibilityCriteriaEnglish: [
      'Annual family income less than ₹1,20,000 per annum',
      'Income Certificate signed by VAO / Tahsildar',
      'Tamil Nadu Resident Ration Card'
    ],
    requiredDocuments: ['Ration Card', 'Income Certificate', 'Aadhaar of all Family Members', 'Family Group Photo'],
    applicationMode: 'Taluk Office',
    portalUrl: 'https://cmchis.tn.gov.in',
    popularScore: 97,
    highlightTag: 'Life Saving'
  },
  {
    id: 'tvk-skill-mission',
    titleTamil: 'TVK இளைஞர் திறன் & வேலைவாய்ப்பு வழிகாட்டி திட்டம்',
    titleEnglish: 'TVK Youth Skills & Grassroots Employment Catalyst',
    category: 'Employment & Skills',
    departmentTamil: 'தளபதி மக்கள் பணி & இளைஞரணி வழிகாட்டு மையம்',
    departmentEnglish: 'TVK Citizen Action & Youth Career Guidance Center',
    benefitAmount: 'இலவச திறன் பயிற்சி, சான்றிதழ் & TNPSC / போட்டித் தேர்வு பயிற்சி',
    descriptionTamil: 'தமிழ்நாடு கிராமப்புற & நகர்ப்புற இளைஞர்களுக்கு இலவச மென்பொருள், தொழிற்கல்வி மற்றும் அரசுப் பணி போட்டித் தேர்வு பயிற்சிகள்.',
    descriptionEnglish: 'Free state-of-the-art tech skill bootcamps, ITI job placements, and TNPSC Group 1/2/4 coaching support for Tamil Nadu youth.',
    eligibilityCriteriaTamil: [
      'தமிழ்நாடு வசிப்பவர் (வயது 18-35)',
      'பத்தாம் வகுப்பு, பன்னிரண்டாம் வகுப்பு அல்லது பட்டப்படிப்பு முடித்தவர்கள்'
    ],
    eligibilityCriteriaEnglish: [
      'Age 18-35 years resident of Tamil Nadu',
      '10th / 12th / ITI / Diploma / Any Graduate'
    ],
    requiredDocuments: ['Aadhaar Card', 'Educational Certificates', 'Resume / Bio-data'],
    applicationMode: 'Online e-Sevai',
    portalUrl: 'https://tvk.org.in/skills',
    popularScore: 92,
    highlightTag: 'Youth Mission'
  },
  {
    id: 'farmers-crop-shield',
    titleTamil: 'முதலமைச்சரின் உழவர் பாதுகாப்பு & பயிர்க் காப்பீட்டுத் திட்டம்',
    titleEnglish: 'Chief Minister Farmers Security & PMFBY Crop Insurance',
    category: 'Agriculture & Farmers',
    departmentTamil: 'வேளாண்மை மற்றும் உழவர் நலத்துறை',
    departmentEnglish: 'Department of Agriculture & Farmers Welfare',
    benefitAmount: '100% மானியத்தில் நுண்ணீர்ப்பாசனம் + பயிர் இழப்பீடு இழப்பீட்டுத் தொகை',
    descriptionTamil: 'வறட்சி, வெள்ளம் மற்றும் பூச்சித் தாக்குதலால் ஏற்படும் பயிர் சேதங்களுக்கு முழுமையான இழப்பீடு மற்றும் விவசாய உபகரண மானியம்.',
    descriptionEnglish: 'Comprehensive financial relief against natural calamities for paddy, sugarcane, millets, and horticulture crops plus drip irrigation subsidies.',
    eligibilityCriteriaTamil: [
      'பட்டா / சிட்டா கொண்ட அனைத்து விவசாயிகள் மற்றும் குத்தகை விவசாயிகள்',
      'அடங்கல் சான்றிதழ் கொண்ட விவசாயிகள்'
    ],
    eligibilityCriteriaEnglish: [
      'Landholding farmers with Patta/Chitta or registered tenant farmers',
      'Village Adangal document from VAO'
    ],
    requiredDocuments: ['Patta/Chitta', 'Adangal', 'Bank Passbook', 'Aadhaar Card'],
    applicationMode: 'Bank / Portal',
    portalUrl: 'https://agrisnet.tn.gov.in',
    popularScore: 91
  },
  {
    id: 'oap-senior-pension',
    titleTamil: 'முதியோர் மற்றும் ஆதரவற்றோர் ஓய்வூதியத் திட்டம் (OAP)',
    titleEnglish: 'Old Age & Destitute Pension Scheme (OAP)',
    category: 'Senior Citizens & Pension',
    departmentTamil: 'வருவாய்த்துறை & சமூக பாதுகாப்பு திட்டங்கள்',
    departmentEnglish: 'Revenue & Social Security Pension Directorate',
    benefitAmount: '₹1,200 / மாதம் + இலவச ரேஷன் அரிசி மற்றும் இலவச வேட்டி/சேலை',
    descriptionTamil: '60 வயதுக்கு மேற்பட்ட ஆதரவற்ற முதியவர்கள் மற்றும் மாற்றுத்திறனாளிகளுக்கு மாதந்தோறும் வழங்கப்படும் முதியோர் உதவித்தொகை.',
    descriptionEnglish: 'Monthly financial dignity pension of ₹1,200 with free rice and Pongal clothing for vulnerable senior citizens.',
    eligibilityCriteriaTamil: [
      'வயது 60 அல்லது அதற்கு மேல் இருக்க வேண்டும்',
      'சொத்து மதிப்பு ₹1 லட்சத்திற்கு மிகாமல் இருக்க வேண்டும்'
    ],
    eligibilityCriteriaEnglish: [
      'Age 60 years or above (Destitute / BPL)',
      'Total asset valuation less than ₹1,00,000'
    ],
    requiredDocuments: ['Age Proof / Aadhaar', 'Income & Destitute Certificate from VAO', 'Bank Account'],
    applicationMode: 'Taluk Office',
    portalUrl: 'https://tnesevai.tn.gov.in',
    popularScore: 95
  }
];

export const VOLUNTEER_TASKS_DATA: VolunteerTask[] = [
  {
    id: 'vol-1',
    titleTamil: 'வேளச்சேரி வெள்ள வடிகால் தூர்வாரும் மக்கள் பணி',
    titleEnglish: 'Velachery Flood Channel Desilting & Plastic Clean-up Drive',
    district: 'Chennai',
    ward: 'Ward 142 & 143',
    category: 'Sanitation & Desilting',
    date: 'Sunday, Aug 23, 2026 - 06:30 AM',
    location: 'Velachery Lake Surplus Canal, Near MRTS Station',
    targetVolunteers: 60,
    joinedVolunteers: 48,
    descriptionTamil: 'மழைக்கால வெள்ளப் பாதிப்பைத் தடுக்க வேளச்சேரி உபரி நீர் கால்வாயில் உள்ள பிளாஸ்டிக் கழிவுகளை அகற்றி, நீர் சீராக வடிய தன்னார்வலர் குழு களமிறங்குகிறது.',
    descriptionEnglish: 'Community volunteer drive to clear blockages and plastic waste from the surplus stormwater canal before northeast monsoon.',
    coordinatorName: 'K. Vignesh (TVK Youth Wing)',
    coordinatorPhone: '9840912345',
    status: 'In Progress',
    impactMetric: 'Clears 1.8km stormwater flow protecting 3,000 homes',
    isJoined: false,
    isActivatedTask: true,
    activationDate: '2026-08-14 09:00 AM',
    volunteerWindowDeadline: '72 Hours Mobilization (Ends in 28 Hours)',
    hoursRemaining: 28,
    timelineWindowDays: 3,
    targetFinancialINR: 50000,
    collectedFinancialINR: 54000,
    financialContributorsCount: 31,
    targetLabourVolunteers: 60,
    registeredLabourVolunteers: 48,
    allowFinancialSupport: true,
    allowPhysicalLabour: true,
    allowFoodRefreshmentSupport: true,
    foodContributionsCount: 14,
    totalMealsPledged: 85,
    totalWaterBottlesPledged: 220,
    totalRefreshmentPacksPledged: 60,
    surplusAmountINR: 4000,
    isSurplusTransferred: true,
    supervisorControl: {
      supervisorName: 'Er. R. Murugesan',
      supervisorDesignation: 'Taluk Field Engineer & Supervisor (Chennai South)',
      supervisorPhone: '9444012345',
      estimatedTotalCostINR: 50000,
      costBreakdown: {
        materialsCost: 18000,
        machineryEquipmentCost: 20000,
        labourAndSafetyCost: 8000,
        contingencyLogisticsCost: 4000
      },
      workStartDate: '2026-08-23',
      workDurationDays: 3,
      timelineWindowDays: 3,
      shiftTiming: 'Morning Shift (06:30 AM - 01:30 PM)',
      requiredStaffCount: 6,
      requiredSpecialists: ['1 Civil Supervisor', '2 JCB Operators', '3 Safety Marshals'],
      surplusFundAction: 'transfer_to_district_development_pool',
      surplusTransferredINR: 4000,
      lastUpdatedTimestamp: '2026-08-15 08:30 AM'
    },
    contributions: [
      {
        id: 'c-1',
        contributorName: 'Senthil Kumar (Velachery Resident)',
        contributorPhone: '98401*****',
        type: 'financial',
        amountINR: 5000,
        paymentMethod: 'UPI',
        timestamp: '2026-08-14 11:20 AM'
      },
      {
        id: 'c-2',
        contributorName: 'Karthik Raja',
        contributorPhone: '97908*****',
        type: 'physical_labour',
        labourHours: 6,
        labourSkill: 'Desilting & Canal Debris Clearing',
        timestamp: '2026-08-14 02:45 PM'
      },
      {
        id: 'c-food-1',
        contributorName: 'Meenakshi Caterers & Residents Association',
        contributorPhone: '98412*****',
        type: 'food_refreshment',
        foodCategory: 'cooked_meals',
        foodItemName: 'Hot Sambar Rice & Curd Rice Meal Packets',
        foodQuantity: 50,
        foodUnit: 'Meal Packs',
        foodDeliverySlot: 'Lunch Shift (12:30 PM)',
        foodDeliveryMethod: 'self_delivery_to_camp',
        timestamp: '2026-08-14 04:15 PM'
      },
      {
        id: 'c-food-2',
        contributorName: 'Velachery Youth Friends',
        contributorPhone: '94443*****',
        type: 'food_refreshment',
        foodCategory: 'tender_coconut_buttermilk',
        foodItemName: 'Fresh Spiced Buttermilk & Electrolyte Pouches',
        foodQuantity: 120,
        foodUnit: 'Drink Pouches',
        foodDeliverySlot: 'Morning Shift (10:30 AM)',
        foodDeliveryMethod: 'self_delivery_to_camp',
        timestamp: '2026-08-15 07:00 AM'
      }
    ]
  },
  {
    id: 'vol-2',
    titleTamil: 'மதுரை பசுமை இயக்கம்: 1,000 மரக்கன்றுகள் நடும் விழா',
    titleEnglish: 'Madurai Green Corridor: 1,000 Native Tree Saplings Drive',
    district: 'Madurai',
    ward: 'Ward 45 (Thirunagar)',
    category: 'Tree Plantation',
    date: 'Saturday, Aug 22, 2026 - 07:00 AM',
    location: 'Vaigai River North Bank Promenade',
    targetVolunteers: 80,
    joinedVolunteers: 72,
    descriptionTamil: 'வைகை நதிக்கரையை பசுமையாக்கும் நோக்கில் வேம்பு, புங்கை, பூவரசு உள்ளிட்ட பாரம்பர்ய மரக்கன்றுகளை நட்டு பாதுகாக்கும் தன்னார்வ முன்னெடுப்பு.',
    descriptionEnglish: 'Planting native shade-giving trees with tree guards along the Vaigai riverfront to enhance city green cover.',
    coordinatorName: 'Dr. S. Meenakshi Sundaram',
    coordinatorPhone: '9443198765',
    status: 'In Progress',
    impactMetric: '1,000 trees offset 20 tons CO2 and creates urban green belt',
    isJoined: true,
    isActivatedTask: true,
    activationDate: '2026-08-13 10:00 AM',
    volunteerWindowDeadline: '72 Hours Mobilization (Ends in 14 Hours)',
    hoursRemaining: 14,
    timelineWindowDays: 3,
    targetFinancialINR: 75000,
    collectedFinancialINR: 78500,
    financialContributorsCount: 54,
    targetLabourVolunteers: 80,
    registeredLabourVolunteers: 72,
    allowFinancialSupport: true,
    allowPhysicalLabour: true,
    allowFoodRefreshmentSupport: true,
    foodContributionsCount: 19,
    totalMealsPledged: 110,
    totalWaterBottlesPledged: 300,
    totalRefreshmentPacksPledged: 90,
    surplusAmountINR: 3500,
    isSurplusTransferred: true,
    supervisorControl: {
      supervisorName: 'Thiru. K. Balachandran',
      supervisorDesignation: 'Horticulture Field Supervisor (Madurai)',
      supervisorPhone: '9443567890',
      estimatedTotalCostINR: 75000,
      costBreakdown: {
        materialsCost: 45000,
        machineryEquipmentCost: 15000,
        labourAndSafetyCost: 10000,
        contingencyLogisticsCost: 5000
      },
      workStartDate: '2026-08-22',
      workDurationDays: 2,
      timelineWindowDays: 3,
      shiftTiming: 'Morning Cool Shift (06:00 AM - 11:30 AM)',
      requiredStaffCount: 5,
      requiredSpecialists: ['1 Horticulturist', '2 Soil Auger Operators', '2 Irrigation Handlers'],
      surplusFundAction: 'transfer_to_district_development_pool',
      surplusTransferredINR: 3500,
      lastUpdatedTimestamp: '2026-08-15 06:15 AM'
    },
    contributions: [
      {
        id: 'c-3',
        contributorName: 'Dr. Anitha Mohan',
        contributorPhone: '94432*****',
        type: 'financial',
        amountINR: 10000,
        paymentMethod: 'UPI',
        timestamp: '2026-08-13 01:10 PM'
      },
      {
        id: 'c-food-3',
        contributorName: 'Achi Annapoorani Trust',
        contributorPhone: '98421*****',
        type: 'food_refreshment',
        foodCategory: 'cooked_meals',
        foodItemName: 'Healthy Millet Variety Rice Meals & Water Bottles',
        foodQuantity: 80,
        foodUnit: 'Meal Packs',
        foodDeliverySlot: 'Lunch Shift (12:00 PM)',
        foodDeliveryMethod: 'self_delivery_to_camp',
        timestamp: '2026-08-14 09:30 AM'
      }
    ]
  },
  {
    id: 'vol-3',
    titleTamil: 'கோவை இலவச மாலை நேரக் கல்வி & STEM பயிலரங்கம்',
    titleEnglish: 'Coimbatore Free Evening STEM & Coding Tuition for Govt School Kids',
    district: 'Coimbatore',
    ward: 'Ward 72 (Ramanathapuram)',
    category: 'Education & Tuition',
    date: 'Daily Monday - Friday 05:30 PM',
    location: 'TVK Community Knowledge Hub, Trichy Road',
    targetVolunteers: 25,
    joinedVolunteers: 21,
    descriptionTamil: 'அரசுப் பள்ளி மாணவர்களுக்கு 10 மற்றும் 12-ஆம் வகுப்பு கணிதம், அறிவியல் மற்றும் அடிப்படை கணினி நிரலாக்கத்தை இலவசமாக கற்பிக்கும் தன்னார்வ ஆசிரியர்கள் இயக்கம்.',
    descriptionEnglish: 'Volunteer college students and tech professionals coaching 120+ underprivileged government school students.',
    coordinatorName: 'R. Deepika B.Tech',
    coordinatorPhone: '9789054321',
    status: 'In Progress',
    impactMetric: '140 students mentored with 94% board exam pass rate',
    isJoined: false,
    isActivatedTask: true,
    activationDate: '2026-08-15 08:00 AM',
    volunteerWindowDeadline: '72 Hours Mobilization (Ends in 68 Hours)',
    hoursRemaining: 68,
    timelineWindowDays: 3,
    targetFinancialINR: 40000,
    collectedFinancialINR: 22000,
    financialContributorsCount: 18,
    targetLabourVolunteers: 25,
    registeredLabourVolunteers: 21,
    allowFinancialSupport: true,
    allowPhysicalLabour: true,
    allowFoodRefreshmentSupport: true,
    foodContributionsCount: 8,
    totalMealsPledged: 40,
    totalWaterBottlesPledged: 80,
    totalRefreshmentPacksPledged: 120,
    surplusAmountINR: 0,
    isSurplusTransferred: false,
    supervisorControl: {
      supervisorName: 'Prof. T. Selvaraj',
      supervisorDesignation: 'Educational Mission Coordinator & Field Supervisor',
      supervisorPhone: '9843210987',
      estimatedTotalCostINR: 40000,
      costBreakdown: {
        materialsCost: 22000,
        machineryEquipmentCost: 8000,
        labourAndSafetyCost: 6000,
        contingencyLogisticsCost: 4000
      },
      workStartDate: '2026-08-18',
      workDurationDays: 30,
      timelineWindowDays: 3,
      shiftTiming: 'Evening Batch (05:00 PM - 08:00 PM)',
      requiredStaffCount: 4,
      requiredSpecialists: ['2 STEM Educators', '1 Computer Lab Assistant', '1 Counseling Mentor'],
      surplusFundAction: 'transfer_to_district_development_pool',
      surplusTransferredINR: 0,
      lastUpdatedTimestamp: '2026-08-15 08:00 AM'
    }
  },
  {
    id: 'vol-4',
    titleTamil: 'சேலம் ஏரி புனரமைப்பு & கரைகள் பலப்படுத்துதல்',
    titleEnglish: 'Salem Mookaneri Lake Ecosystem Restoration & Bund Reinforcement',
    district: 'Salem',
    ward: 'Ward 12 (Kannankurichi)',
    category: 'Sanitation & Desilting',
    date: 'Sunday, Aug 30, 2026 - 06:00 AM',
    location: 'Mookaneri Lake North Inlet',
    targetVolunteers: 50,
    joinedVolunteers: 35,
    descriptionTamil: 'நிலத்தடி நீர்மட்டத்தை உயர்த்தவும் பறவைகள் சரணாலய சூழலை பாதுகாக்கவும் ஏரி கரைகளில் புற்கள் நடுதல் மற்றும் தூர்வாருதல் பணி.',
    descriptionEnglish: 'Civic desilting, vetiver grass plantation along bunds, and bird nesting island maintenance.',
    coordinatorName: 'M. Prabhakaran',
    coordinatorPhone: '9443211223',
    status: 'Upcoming',
    impactMetric: 'Recharges ground water table for 15,000 households',
    isJoined: false,
    isActivatedTask: false,
    hoursRemaining: 72,
    targetFinancialINR: 60000,
    collectedFinancialINR: 15000,
    financialContributorsCount: 11,
    targetLabourVolunteers: 50,
    registeredLabourVolunteers: 35,
    allowFinancialSupport: true,
    allowPhysicalLabour: true
  }
];

export const COMMUNITY_POLLS_DATA: CommunityPoll[] = [
  {
    id: 'poll-1',
    questionTamil: 'உங்கள் ஊரில் எந்த பொது உள்கட்டமைப்புக்கு முதலிடம் அளிக்க வேண்டும்?',
    questionEnglish: 'Which civic infrastructure upgrade requires top priority in your constituency?',
    category: 'Civic Priority',
    district: 'All Tamil Nadu',
    totalVotes: 3840,
    options: [
      {
        id: 'opt-1',
        textTamil: '24 மணி நேர சுத்தமான குடிநீர் & கழிவுநீர் வடிகால் சீரமைப்பு',
        textEnglish: '24x7 Clean Potable Piped Water & Modern Sewerage Lines',
        votes: 1640
      },
      {
        id: 'opt-2',
        textTamil: 'குண்டும் குழியுமற்ற தரமான தார் சாலைகள் & விபத்தில்லா சந்திப்புகள்',
        textEnglish: 'Pothole-free Resilient Asphalt Roads & Safe Signal Junctions',
        votes: 1120
      },
      {
        id: 'opt-3',
        textTamil: 'அரசுப் பள்ளிகளில் நவீன ஆய்வகம், கழிப்பறை & ஸ்மார்ட் வகுப்பறைகள்',
        textEnglish: 'Govt School Infrastructure, Clean Restrooms & Smart Labs',
        votes: 780
      },
      {
        id: 'opt-4',
        textTamil: 'அரசு மருத்துவமனைகளில் 24x7 நவீன அவசர சிகிச்சைப் பிரிவு & மருந்துகள்',
        textEnglish: 'PHC & Govt Hospital Emergency Trauma Care & Free Medicines',
        votes: 300
      }
    ],
    endDate: '2026-09-01',
    contextTamil: 'மக்களின் நேரடி கருத்துக்கள் தொகுக்கப்பட்டு TVK கொள்கை வரைவு மற்றும் சட்டமன்றக் குழுவில் முன்வைக்கப்படும்.',
    contextEnglish: 'Direct citizen consensus will be tabled in the legislative development advisory roadmap.'
  },
  {
    id: 'poll-2',
    questionTamil: 'நகரப் பேருந்துகளில் பெண்கள் மற்றும் முதியவர்கள் பயண அனுபவத்தை மேம்படுத்த என்ன செய்ய வேண்டும்?',
    questionEnglish: 'How can the public bus transit experience be made safer and more convenient?',
    category: 'Public Transport',
    district: 'All Tamil Nadu',
    totalVotes: 2190,
    options: [
      {
        id: 'opt-a',
        textTamil: 'பீக் ஹவர்ஸில் பேருந்துகளின் எண்ணிக்கையை 30% அதிகரிப்பது',
        textEnglish: 'Increase frequency of low-floor buses by 30% during peak hours',
        votes: 1080
      },
      {
        id: 'opt-b',
        textTamil: 'அனைத்து பேருந்துகளிலும் சிசிடிவி கேமரா & ஜிபிஎஸ் லைவ் டிராக்கிங்',
        textEnglish: 'Install CCTV cameras & Real-time Live Bus Tracking in TNSTC App',
        votes: 680
      },
      {
        id: 'opt-c',
        textTamil: 'பேருந்து நிறுத்தங்களில் டிஜிட்டல் வருகைப் பலகை & மின்விளக்குகள்',
        textEnglish: 'Digital arrival display boards and bright lighting at bus shelters',
        votes: 430
      }
    ],
    endDate: '2026-08-28',
    contextTamil: 'தமிழ்நாடு அரசுப் போக்குவரத்துக் கழக சேவைகளை நவீனமயமாக்க பொதுமக்கள் கருத்து.',
    contextEnglish: 'Public feedback to modernize Tamil Nadu State Transport Corporation (TNSTC).'
  }
];

export const EMERGENCY_HELPLINES = [
  { nameTamil: 'காவல்துறை அவசர உதவி', nameEnglish: 'Police Emergency', number: '100', icon: 'ShieldAlert', color: 'text-red-600 bg-red-50' },
  { nameTamil: 'ஆம்புலன்ஸ் & மருத்துவ அவசரம்', nameEnglish: 'Ambulance Emergency', number: '108', icon: 'Ambulance', color: 'text-emerald-600 bg-emerald-50' },
  { nameTamil: 'பெண்கள் அவசர உதவி மையம்', nameEnglish: 'Women Helpline', number: '1091 / 181', icon: 'HeartHandshake', color: 'text-pink-600 bg-pink-50' },
  { nameTamil: 'முதலமைச்சர் உதவி மையம் (CM Helpline)', nameEnglish: 'CM Grievance Helpline', number: '1100', icon: 'PhoneCall', color: 'text-blue-600 bg-blue-50' },
  { nameTamil: 'மின்வாரிய புகார் (TANGEDCO)', nameEnglish: 'Electricity Helpline', number: '1912', icon: 'Zap', color: 'text-amber-600 bg-amber-50' },
  { nameTamil: 'சென்னை மாநகராட்சி புகார்', nameEnglish: 'Greater Chennai Corp', number: '1913', icon: 'Building2', color: 'text-indigo-600 bg-indigo-50' },
  { nameTamil: 'குழந்தைகள் உதவி எண் (Childline)', nameEnglish: 'Child Protection Helpline', number: '1098', icon: 'Users', color: 'text-purple-600 bg-purple-50' },
  { nameTamil: 'பேரிடர் மேலாண்மை உதவி', nameEnglish: 'State Disaster Control', number: '1070 / 1077', icon: 'AlertTriangle', color: 'text-orange-600 bg-orange-50' }
];

export const INITIAL_SYSTEM_NOTIFICATIONS: import('../types').SystemNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'supervisor',
    targetDistrict: 'Ariyalur',
    targetTaluk: 'Sendurai',
    targetVillage: 'Sendurai South',
    type: 'complaint_lodged',
    titleTamil: 'புதிய மனு பதிவு: செந்துறை மெயின் ரோடு குடிநீர் குழாய் உடைப்பு',
    titleEnglish: 'New Grievance Lodged: Main Road Pipeline Burst (Sendurai)',
    messageTamil: 'செந்துறை தெற்கு பகுதியில் குடிநீர் குழாய் உடைந்ததாக மனு TN-GRV-2026-8492 பதிவாகியுள்ளது. இடஅமைவு அடிப்படையில் நேரடி கள ஆய்வுக்கு அனுப்பப்பட்டுள்ளது.',
    messageEnglish: 'Citizen registered urgent pipeline burst grievance in Sendurai South. Dispatched to local supervisor for rapid inspection.',
    timestamp: '10 mins ago',
    read: false,
    grievanceId: 'TN-GRV-2026-8492'
  },
  {
    id: 'notif-2',
    recipientRole: 'contractor',
    targetDistrict: 'Ariyalur',
    targetTaluk: 'Sendurai',
    targetVillage: 'Sendurai South',
    type: 'supervisor_approved',
    titleTamil: 'புதிய திட்டப் பணி ஒதுக்கீடு: 6 மணி நேர ஒப்பந்த ஏற்பு (6h SLA)',
    titleEnglish: 'Sanctioned Project Available: 6-Hour SLA Contractor Window',
    messageTamil: 'மேற்பார்வையாளர் செந்துறை குடிநீர் திட்டத்திற்கு ₹4,50,000 அனுமதித்துள்ளார். 6 மணி நேரத்திற்குள் சொந்த ஆட்கள் அல்லது மக்கள் பணிப்படை மூலம் ஒப்பந்தத்தை ஏற்கவும்.',
    messageEnglish: 'Field supervisor approved ₹4,50,000 emergency pipeline works. Licensed contractors must accept within 6-hour SLA window with workforce choice.',
    timestamp: '25 mins ago',
    read: false,
    grievanceId: 'TN-GRV-2026-8492',
    slaDeadline: '5h 35m Remaining'
  },
  {
    id: 'notif-3',
    recipientRole: 'volunteer',
    targetDistrict: 'Ariyalur',
    targetTaluk: 'Sendurai',
    type: 'supervisor_approved',
    titleTamil: 'தளபதி மக்கள் பணிப்படை: செந்துறை குடிநீர் பணிக்கு தன்னார்வலர்கள் அழைப்பு',
    titleEnglish: 'Volunteer Padai Mobilization: Sendurai Pipeline & Ground Restoration',
    messageTamil: 'செந்துறை பகுதியில் 20 களப்பணியாளர்கள் மற்றும் தன்னார்வலர்கள் தேவைப்படுகின்றனர். உடனடி சமூக பங்களிப்பை பதிவு செய்யவும்.',
    messageEnglish: '20 Volunteer Padai cadre invited for localized assistance and community water restoration.',
    timestamp: '28 mins ago',
    read: false,
    grievanceId: 'TN-GRV-2026-8492'
  },
  {
    id: 'notif-4',
    recipientRole: 'supervisor',
    targetDistrict: 'Ariyalur',
    targetTaluk: 'Sendurai',
    type: 'contractor_accepted',
    titleTamil: 'ஒப்பந்ததாரர் பணி ஏற்பு: சொந்த ஆட்கள் + வெல்டர்கள் உறுதி செய்யப்பட்டது',
    titleEnglish: 'Contractor Accepted Work Order (Own Labour & Welders Deployed)',
    messageTamil: 'அரசு ஒப்பந்ததாரர் R. Periasamy (TN Infra Corp) பணியை ஏற்றுக்கொண்டார். மேற்பார்வையாளர் பணி துவங்குவதை உறுதிசெய்து களப்பணி நிலையை பதியலாம்.',
    messageEnglish: 'Licensed contractor confirmed work order with 15 regular skilled tradesmen. Supervisor can now monitor execution.',
    timestamp: '45 mins ago',
    read: true,
    grievanceId: 'TN-GRV-2026-8492',
    workforceChoice: 'own_labour',
    contractorFirm: 'TN Civil Infra Corp'
  },
  {
    id: 'notif-5',
    recipientRole: 'citizen',
    targetDistrict: 'Ariyalur',
    targetTaluk: 'Sendurai',
    type: 'work_started',
    titleTamil: 'உங்கள் மனு மீது களப்பணி துவங்கியது',
    titleEnglish: 'Work In Progress on Your Grievance (Sendurai South)',
    messageTamil: 'உங்கள் மனு TN-GRV-2026-8492 மீது ஒப்பந்ததாரர் மற்றும் மேற்பார்வையாளர் நேரடி களப்பணியை துவங்கிவிட்டனர். முன்னேற்றத்தை கண்காணிக்கலாம்.',
    messageEnglish: 'Heavy machinery and tradesmen are on site repairing the water pipeline.',
    timestamp: '1 hour ago',
    read: true,
    grievanceId: 'TN-GRV-2026-8492'
  }
];

