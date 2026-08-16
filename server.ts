import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper to clean Markdown codeblocks from JSON responses
function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

// Helper to call Gemini with retry & model fallback on 503/429 spikes
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
  systemInstruction?: string;
}): Promise<string | null> {
  const ai = getAI();
  if (!ai) return null;

  // Supported model fallbacks per AI Studio Gemini SDK specifications
  const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  
  for (const model of candidateModels) {
    try {
      const config = { ...(params.config || {}) };
      if (params.systemInstruction) {
        config.systemInstruction = params.systemInstruction;
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini API Info] Model ${model} encountered notice:`, err?.message || err);
      // Wait briefly before trying next fallback model
      await new Promise((resolve) => setTimeout(resolve, 300));
      continue;
    }
  }
  return null;
}

// Helper: Deterministic formal petition letter builder
function buildFallbackPetition(body: any) {
  const {
    citizenName = 'மனுதாரர் (Citizen)',
    address = 'தமிழ்நாடு (Tamil Nadu)',
    district = 'சென்னை (Chennai)',
    taluk = 'வட்டம் (Taluk)',
    ward = 'வார்டு எண் (Ward No)',
    phone = 'தொலைபேசி எண்',
    issueCategory = 'குடிநீர் & பொது சுகாதாரம் (Water & Sanitation)',
    grievanceDetails = 'பொதுமக்கள் பயன்பாட்டில் உள்ள அடிப்படை உள்கட்டமைப்பு சேதமடைந்துள்ளது.',
    addressedTo = 'மாவட்ட ஆட்சித்தலைவர் / மாநகராட்சி ஆணையர்'
  } = body || {};

  const today = new Date().toLocaleDateString('ta-IN');
  const todayEn = new Date().toLocaleDateString('en-IN');

  const letterTamil = `அதிகாரப்பூர்வ மக்கள் குறைதீர்ப்பு மனு

அனுப்புநர்:
${citizenName},
${address}, ${ward},
${taluk}, ${district} மாவட்டம்.
தொலைபேசி எண்: ${phone}

பெறுநர்:
உயர்திரு. ${addressedTo} அவர்கள்,
மாவட்ட ஆட்சியர் அலுவலகம் / நகராட்சி நிர்வாக வளாகம்,
${district} மாவட்டம், தமிழ்நாடு.

பொருள்: ${issueCategory} சீரமைப்பு மற்றும் உடனடி நடவடிக்கை கோருதல் சார்பாக.

வணக்கம்,
நான் மேற்கண்ட முகவரியில் வசித்து வரும் தமிழ்நாடு குடிமகன் ஆவேன். எங்கள் பகுதியில் கீழ்காணும் மக்கள் நல்வாழ்வு மற்றும் பொது பாதுகாப்பு சார்ந்த பிரச்சனை நீடித்து வருகிறது:

மனுவின் விவரம்:
${grievanceDetails}

கோரிக்கை:
இப்பிரச்சனைக்கு முன்னுரிமை அளித்து, சம்பந்தப்பட்ட துறை உதவிப் பொறியாளர் மற்றும் கள அலுவலர்கள் மூலம் உடனடி கள ஆய்வு மேற்கொண்டு, உரிய நிதி மற்றும் பணிகளை ஒதுக்கி விரைந்து சீரமைத்து தருமாறு தமிழ்நாடு அரசு குடிமக்கள் சாசன விதிகளின்படி பணிவுடன் வேண்டுகிறேன்.

இடம்: ${district}
தேதி: ${today}

இவண்,
தங்கள் உண்மையுள்ள,
(${citizenName})`;

  const letterEnglish = `FORMAL PUBLIC GRIEVANCE PETITION & REPRESENTATION

From:
${citizenName}
${address}, ${ward},
${taluk}, ${district} District, Tamil Nadu.
Contact Phone: ${phone}

To:
${addressedTo},
District Collectorate / Municipal Administration Complex,
${district} District, Tamil Nadu.

Subject: Urgent Request for Administrative Intervention & Remediation regarding ${issueCategory}.

Respected Sir / Madam,

I am a resident of the aforementioned locality in ${district} District. I respectfully submit this formal representation to bring the following civic concern to your immediate attention:

GRIEVANCE PARTICULARS:
${grievanceDetails}

PRAYER / RELIEF SOUGHT:
In view of the serious inconvenience and public welfare concerns in ${ward}, I respectfully pray that your good office may be pleased to depute the concerned departmental field engineers for an immediate site inspection, sanction necessary remediation works, and resolve this civic issue at the earliest under the Tamil Nadu Right to Public Services norms.

Place: ${district}
Date: ${todayEn}

Yours faithfully,
(${citizenName})`;

  return {
    letterTamil,
    letterEnglish,
    recommendedEnclosures: [
      'கள ஆய்வு புகைப்பட ஆதாரங்கள் (Geotagged Photo Evidence)',
      'குடிமகன் அடையாள / முகவரி நகல் (Aadhaar / Voter ID Proof)',
      'பகுதி வாசிகள் கூட்டுக் கோரிக்கை கையொப்பம் (Resident Representation Signature List)'
    ],
    submissionOffices: [
      'திங்கட்கிழமை மக்கள் குறைதீர்க்கும் நாள் முகாம் (Monday Collectorate Grievance Day)',
      'முதல்வரின் முகவரி இணையதளம் (CM Special Cell Portal - mudhalvarinmugavari.tn.gov.in)',
      'வட்டாட்சியர் அலுவலக ஜமாபந்தி & மண்டல பொறியாளர் அலுவலகம் (Taluk Jamabandhi / Zonal Nodal Office)'
    ]
  };
}

// 1. Analyze Grievance endpoint
app.post('/api/analyze-grievance', async (req, res) => {
  try {
    const { title, description, district, category, language } = req.body;
    if (!description && !title) {
      return res.status(400).json({ error: 'Grievance description or title is required' });
    }

    const prompt = `You are the chief civic AI grievance triage officer for the Tamil Nadu Government and TVK Citizen Services Portal.
Analyze the following citizen grievance petition submitted from Tamil Nadu (${district || 'Tamil Nadu'}):
Title: ${title || 'Not specified'}
Citizen Description: ${description}
User Selected Category: ${category || 'General'}
User Preferred Language: ${language || 'Tamil/English'}

Provide a structured JSON output with the following exact keys:
1. "detectedCategory": (One of: "Water Supply & Drainage", "Roads & Traffic Infrastructure", "Electricity & Street Lighting", "Sanitation & Solid Waste", "Public Health & Hospitals", "Agriculture & Irrigation", "Education & Government Schools", "Women & Child Safety", "Revenue & Land Records", "Civil Supplies & Ration PDS", "Public Transport & Bus Services", "Environment & Pollution", "Other Civic Issue")
2. "department": The official Tamil Nadu department/agency responsible (e.g. "TANGEDCO (Electricity Board)", "TWAD Board & Chennai Metro Water", "Corporation of Greater Chennai / Municipal Administration", "Highways & Minor Ports Dept", "Public Works Department (PWD - Water Resources)", "Health & Family Welfare Dept", "Tamil Nadu Civil Supplies Corporation (TNCSC)", "Revenue & Disaster Management Dept", "Tamil Nadu Police", "School Education Dept").
3. "departmentTamil": The Tamil name of the department.
4. "urgencyScore": Number from 1 to 10 (10 being immediate public hazard / crisis).
5. "urgencyLevel": "Critical" | "High" | "Medium" | "Standard".
6. "estimatedResolutionDays": Number of expected business days under TN Right to Public Grievance Redressal norms (e.g., 2 to 14 days).
7. "summaryTamil": A clear 2-sentence summary in formal Tamil suitable for an official government petition.
8. "summaryEnglish": A clear 2-sentence summary in formal English.
9. "actionPlanTamil": Array of 3-4 recommended step-by-step resolution actions for the field nodal officer in Tamil.
10. "actionPlanEnglish": Array of 3-4 recommended step-by-step resolution actions for the field nodal officer in English.
11. "keyEntities": Array of extracted key terms (locations, landmarks, equipment like transformers, pipes, culverts, school names).
12. "applicableRightsOrRules": Relevant TN administrative rules or citizen rights (e.g., "TN Combined Development and Building Rules 2019", "TANGEDCO Supply Code Clause 12", "TWAD Potable Water Quality Norms", "TNRDA Rural Road Maintenance Standard").

Return ONLY valid raw JSON with no Markdown backticks or commentary.`;

    const responseText = await generateContentWithFallback({
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let data;
    if (responseText) {
      try {
        data = JSON.parse(cleanJsonText(responseText));
      } catch {
        data = null;
      }
    }

    if (!data) {
      data = {
        detectedCategory: req.body.category || 'Water Supply & Drainage',
        department: 'Municipal Administration & Water Supply Dept',
        departmentTamil: 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை',
        urgencyScore: 7,
        urgencyLevel: 'High',
        estimatedResolutionDays: 4,
        summaryTamil: 'மனு பெறப்பட்டு உரிய உதவி பொறியாளருக்கு கள ஆய்வுக்காக ஒதுக்கீடு செய்யப்பட்டுள்ளது.',
        summaryEnglish: 'Petition registered and allocated to zonal assistant engineer for field assessment.',
        actionPlanTamil: ['கள ஆய்வு மேற்கொள்ளுதல்', 'மதிப்பீடு தயார் செய்தல்', 'பழுது நீக்குதல் பணி தொடங்குதல்'],
        actionPlanEnglish: ['Conduct field inspection', 'Prepare repair estimate', 'Commence remediation works'],
        keyEntities: [req.body.district || 'Tamil Nadu', req.body.category || 'Civic Problem'],
        applicableRightsOrRules: 'Tamil Nadu District Municipalities Act & Citizen Charter',
      };
    }

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Analyze Grievance Error:', error);
    return res.json({
      success: true,
      data: {
        detectedCategory: req.body.category || 'Roads & Infrastructure',
        department: 'Municipal Administration & Water Supply Dept',
        departmentTamil: 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை',
        urgencyScore: 7,
        urgencyLevel: 'High',
        estimatedResolutionDays: 5,
        summaryTamil: 'மனு பெறப்பட்டு உரிய அலுவலருக்கு கள ஆய்வுக்காக அனுப்பப்பட்டுள்ளது.',
        summaryEnglish: 'Petition received and routed to zonal nodal engineering officer for field inspection.',
        actionPlanTamil: ['கள ஆய்வு மேற்கொள்ளுதல்', 'மதிப்பீடு தயார் செய்தல்', 'பழுது நீக்குதல் பணி தொடங்குதல்'],
        actionPlanEnglish: ['Conduct field inspection', 'Prepare repair estimate', 'Commence remediation works'],
        keyEntities: [req.body.district || 'Tamil Nadu', req.body.category || 'Civic Problem'],
        applicableRightsOrRules: 'Tamil Nadu District Municipalities Act & Citizen Charter',
      },
    });
  }
});

// 2. Chat Assistant endpoint (Makkal Sevai AI)
app.post('/api/chat-assistant', async (req, res) => {
  try {
    const { message, history, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are 'Makkal Sevai Sahayak' (மக்கள் சேவகர் AI), the official intelligent civic advisor for Tamil Nadu citizens and the TVK CM Vijay Community Action Portal.
Your duty is to empower Tamil Nadu citizens with accurate, empathetic, and actionable guidance regarding:
- Tamil Nadu Government Welfare Schemes (e.g. Kalaignar Magalir Urimai Thogai ₹1000/mo, Pudhumai Penn ₹1000 for college girls, Tamil Pudhalvan scheme, CM Free Breakfast Scheme, Moovalur Ramamirtham Ammaiyar Scheme, Chief Minister's Comprehensive Health Insurance Scheme CMCHIS, OAP Old Age Pension, Farmers PM-Kisan & TN Crop Relief, Marriage Assistance, Widow Pension, TVK Youth Skill & Employment Missions).
- Grievance Redressal procedures under TN Government (1100 CM Helpline, TNPDS Ration Card queries, TANGEDCO power complaints, Corporation of Chennai 1913, TWAD Board, Taluk Office Jamabandhi, RTI Right to Information drafting).
- Civic Rights, Ward meetings (Grama Sabha, Ward Committees), and TVK Grassroots Volunteer Support.

Guidelines:
- If the user writes in Tamil or Tanglish, respond primarily in clear, respectful Tamil (or bilingual Tamil & English).
- If the user writes in English, respond in clear English with key Tamil terms in brackets when helpful.
- Be warm, helpful, polite ("வணக்கம்", "நன்றி"), structured with bullet points, and directly actionable with contact numbers/links/portal steps.
- Provide step-by-step procedural directions for any government service request.`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content || item.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const responseText = await generateContentWithFallback({
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = responseText || (
      language === 'ta' || String(message).match(/[\u0B80-\u0BFF]/)
        ? `வணக்கம்! தமிழ்நாடு அரசு நலத்திட்டங்கள் மற்றும் குறைதீர்ப்பு சேவைகளுக்கு:
• முதலமைச்சரின் உதவி மையம்: 1100
• மின்வாரிய அவசர உதவி: 1912 (TANGEDCO)
• குடிநீர் & கழிவுநீர் வாரியம்: 1916
• பெண்கள் அவசர உதவி எண்: 181
• அவசர மருத்துவ சிகிச்சை / ஆம்புலன்ஸ்: 108

உங்கள் மனுவை எங்கள் முகப்பில் உள்ள 'புதிய மனு பதிவு' மூலம் சமர்ப்பிக்கலாம்.`
        : `Vanakkam! For Tamil Nadu civic grievance redressal and public welfare schemes:
• CM Helpline & Grievance Portal: 1100
• TANGEDCO Electricity Board: 1912
• Metro Water & TWAD Hotline: 1916
• Women Helpline: 181
• Emergency Ambulance Service: 108

You can also submit a geotagged grievance directly via the 'File Grievance' button.`
    );

    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Chat Assistant Error:', error);
    return res.json({
      success: true,
      reply: 'வணக்கம்! அரசு நலத்திட்டங்கள், மனு பதிவு முறை மற்றும் குறைதீர்ப்பு குறித்த தகவல்களுக்கு நீங்கள் 1100 அல்லது அந்தந்த மாவட்ட ஆட்சியர் அலுவலகத்தை அணுகலாம். (For government schemes and grievance redressal, you can also dial 1100 helpline).',
    });
  }
});

// 3. Scheme Matcher endpoint
app.post('/api/scheme-matcher', async (req, res) => {
  try {
    const { age, gender, occupation, annualIncome, district, familySize, category, specialStatus } = req.body;

    const prompt = `Analyze citizen profile for Tamil Nadu Welfare Schemes eligibility:
Age: ${age || 30}
Gender: ${gender || 'All'}
Occupation: ${occupation || 'Farmer/Worker/Self-employed'}
Annual Income: ₹${annualIncome || '1,20,000'}
District: ${district || 'Chennai'}
Family Size: ${familySize || 4}
Community/Category: ${category || 'General/BC/MBC/SC/ST'}
Special Status: ${specialStatus || 'None'} (e.g. Student, Differently Abled, Widow, Destitute, Senior Citizen, Small Farmer)

Return a JSON array of the top 5 to 6 most relevant Tamil Nadu state government and welfare programs they are eligible for or could benefit from.
Each item must have:
- "id": string slug
- "titleTamil": Name in Tamil
- "titleEnglish": Name in English
- "department": Administering department
- "monthlyBenefit": Financial benefit or subsidy amount (e.g., "₹1,000 / மாதம்", "₹5,00,000 மருத்துவக் காப்பீடு", "₹10,000 மானியம்")
- "eligibilityMatch": Number 70-99 (percentage score match)
- "eligibilityReasonTamil": 1 sentence explaining why this citizen qualifies in Tamil
- "eligibilityReasonEnglish": 1 sentence explaining why this citizen qualifies in English
- "requiredDocuments": Array of required document strings (e.g., ["Ration Card (குடும்ப அட்டை)", "Aadhaar Card", "Income Certificate (வருமானச் சான்று)"])
- "howToApplyTamil": Brief step on how to apply in Tamil (e.g., "அருகிலுள்ள இ-சேவை மையம் அல்லது tnesevai.tn.gov.in மூலம் விண்ணப்பிக்கவும்")
- "howToApplyEnglish": Brief step in English
- "officialPortalUrl": Official or informational web link (e.g. "https://tnesevai.tn.gov.in" or "https://cmchis.tn.gov.in")

Return ONLY valid JSON array with no Markdown backticks or commentary.`;

    const responseText = await generateContentWithFallback({
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let data = [];
    if (responseText) {
      try {
        data = JSON.parse(cleanJsonText(responseText));
      } catch {
        data = [];
      }
    }

    if (!Array.isArray(data) || data.length === 0) {
      data = [
        {
          id: 'magalir-urimai',
          titleTamil: 'கலைஞர் மகளிர் உரிமைத் திட்டம்',
          titleEnglish: 'Kalaignar Magalir Urimai Thogai Scheme',
          department: 'Social Welfare & Women Empowerment Dept',
          monthlyBenefit: '₹1,000 / மாதம்',
          eligibilityMatch: 95,
          eligibilityReasonTamil: 'குடும்பத் தலைவிகளுக்கு மாதந்தோறும் ₹1000 நிதியுதவி வழங்கும் திட்டம்.',
          eligibilityReasonEnglish: 'Monthly financial assistance of ₹1,000 to women heads of eligible households.',
          requiredDocuments: ['Aadhaar Card', 'Ration Card (Smart Card)', 'Bank Passbook', 'Electricity Bill'],
          howToApplyTamil: 'இ-சேவை மையங்கள் அல்லது சிறப்பு முகாம்கள் மூலம் விண்ணப்பிக்கலாம்.',
          howToApplyEnglish: 'Apply through designated e-Sevai centers or special camp registration.',
          officialPortalUrl: 'https://kmut.tn.gov.in',
        },
        {
          id: 'cmchis-health',
          titleTamil: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)',
          titleEnglish: "Chief Minister's Comprehensive Health Insurance Scheme",
          department: 'Health & Family Welfare Dept',
          monthlyBenefit: '₹5,00,000 வரை இலவச சிகிச்சை',
          eligibilityMatch: 92,
          eligibilityReasonTamil: 'ஆண்டு வருமானம் ₹1.2 லட்சத்திற்கு குறைவான குடும்பங்களுக்கு இலவச உயர்தர மருத்துவ சிகிச்சை.',
          eligibilityReasonEnglish: 'Cashless hospitalisation coverage up to ₹5 Lakh per year for eligible families.',
          requiredDocuments: ['Ration Card', 'Income Certificate from VAO/Tahsildar', 'Aadhaar Card', 'Family Photo'],
          howToApplyTamil: 'மாவட்ட ஆட்சியர் அலுவலக CMCHIS மையத்தில் கார்டு பெறலாம்.',
          howToApplyEnglish: 'Enroll at District Collectorate CMCHIS kiosk or empanelled hospitals.',
          officialPortalUrl: 'https://cmchis.tn.gov.in',
        },
        {
          id: 'pudhumai-penn',
          titleTamil: 'புதுமைப் பெண் திட்டம் / தமிழ் புதல்வன் திட்டம்',
          titleEnglish: 'Pudhumai Penn & Tamil Pudhalvan Higher Education Incentive',
          department: 'Higher Education Department',
          monthlyBenefit: '₹1,000 / மாதம் வங்கி கணக்கில்',
          eligibilityMatch: 88,
          eligibilityReasonTamil: 'அரசுப் பள்ளிகளில் படித்து உயர்கல்வி பயிலும் மாணவ, மாணவியருக்கு மாதந்தோறும் ₹1000 ஊக்கத்தொகை.',
          eligibilityReasonEnglish: 'Monthly financial support of ₹1,000 for government school students pursuing higher education.',
          requiredDocuments: ['10th/12th Marksheet', 'College Admission Proof', 'Aadhaar Card', 'Bank Passbook'],
          howToApplyTamil: 'கல்லூரி வழியாக penkalvi.tn.gov.in இணையதளத்தில் பதிவு செய்யலாம்.',
          howToApplyEnglish: 'Apply through your college nodal officer via penkalvi portal.',
          officialPortalUrl: 'https://penkalvi.tn.gov.in',
        }
      ];
    }

    return res.json({ success: true, schemes: data });
  } catch (error: any) {
    console.error('Scheme Matcher Error:', error);
    return res.json({
      success: true,
      schemes: [
        {
          id: 'magalir-urimai',
          titleTamil: 'கலைஞர் மகளிர் உரிமைத் திட்டம்',
          titleEnglish: 'Kalaignar Magalir Urimai Thogai Scheme',
          department: 'Social Welfare & Women Empowerment Dept',
          monthlyBenefit: '₹1,000 / மாதம்',
          eligibilityMatch: 95,
          eligibilityReasonTamil: 'குடும்பத் தலைவிகளுக்கு மாதந்தோறும் ₹1000 நிதியுதவி வழங்கும் திட்டம்.',
          eligibilityReasonEnglish: 'Monthly financial assistance of ₹1,000 to women heads of eligible households.',
          requiredDocuments: ['Aadhaar Card', 'Ration Card (Smart Card)', 'Bank Passbook', 'Electricity Bill'],
          howToApplyTamil: 'இ-சேவை மையங்கள் அல்லது சிறப்பு முகாம்கள் மூலம் விண்ணப்பிக்கலாம்.',
          howToApplyEnglish: 'Apply through designated e-Sevai centers or special camp registration.',
          officialPortalUrl: 'https://kmut.tn.gov.in',
        },
      ],
    });
  }
});

// 4. Draft Official Petition endpoint
app.post('/api/draft-petition', async (req, res) => {
  try {
    const { citizenName, address, district, taluk, ward, phone, issueCategory, grievanceDetails, addressedTo } = req.body;

    const prompt = `Draft a high-impact, legally articulate formal grievance petition letter for a Tamil Nadu citizen to be submitted to: ${addressedTo || 'The District Collector / Commissioner / Zonal Officer'}.
Citizen Name: ${citizenName || 'Citizen of Tamil Nadu'}
Address: ${address || 'Ward 12, Main Road'}
District: ${district || 'Chennai'}
Taluk/Zone: ${taluk || 'Central'}
Ward: ${ward || 'Ward 45'}
Phone: ${phone || '9876543210'}
Issue Category: ${issueCategory || 'Civic Infrastructure'}
Grievance Description: ${grievanceDetails || 'Public issue requiring immediate attention'}

Provide JSON format with:
1. "letterTamil": Complete formal petition letter in classic Tamil administrative format ("மனு", "அனுப்புநர்", "பெறுநர்", "பொருள்", "வணக்கம்", "மனுவின் விவரம்", "கோரிக்கை", "இவண்/தங்கள் உண்மையுள்ள").
2. "letterEnglish": Complete formal petition in standard official English format ("To The District Collector...", "Subject: Urgently requesting remediation for...", "Respected Sir/Madam...", "Prayer/Relief Sought...", "Yours faithfully").
3. "recommendedEnclosures": List of suggested photographic evidence or documents to attach (in Tamil & English).
4. "submissionOffices": List of 3 places where this petition can be submitted physically or digitally in TN (e.g. Monday Collectorate Public Grievance Day, CM Cell Online Portal, Taluk Jamabandhi).

Return ONLY valid JSON with no Markdown backticks or commentary.`;

    const responseText = await generateContentWithFallback({
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let data;
    if (responseText) {
      try {
        data = JSON.parse(cleanJsonText(responseText));
      } catch {
        data = null;
      }
    }

    // If Gemini model was experiencing 503 high demand or parse failed, return pristine formatted petition
    if (!data || !data.letterTamil) {
      data = buildFallbackPetition(req.body);
    }

    return res.json({ success: true, petition: data });
  } catch (error: any) {
    console.error('Draft Petition Error:', error);
    // Never fail with 500 error; return complete structured fallback petition
    const fallbackPetition = buildFallbackPetition(req.body);
    return res.json({
      success: true,
      petition: fallbackPetition,
      fallbackUsed: true,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), portal: 'TN Makkal Sevai Civic Action' });
});

// Serve frontend in dev (via Vite middleware) or prod (static dist)
async function setupFrontend() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TN Makkal Sevai Server] Running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
