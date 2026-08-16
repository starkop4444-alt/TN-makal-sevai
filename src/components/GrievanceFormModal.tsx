import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Grievance, GrievanceCategory, UrgencyLevel } from '../types';
import { TN_DISTRICTS, DISTRICT_TAMIL_NAMES, CATEGORY_TAMIL_MAP } from '../data/tamilNaduData';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Mic, 
  MicOff, 
  MapPin, 
  Camera, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Send,
  Loader2,
  FileText,
  Building2,
  HelpCircle
} from 'lucide-react';

interface GrievanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGrievance: (grievance: Grievance) => void;
}

export const GrievanceFormModal: React.FC<GrievanceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitGrievance,
}) => {
  const { language, t } = useLanguage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('Water Supply & Drainage');
  const [district, setDistrict] = useState('Chennai');
  const [taluk, setTaluk] = useState('');
  const [ward, setWard] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [landmark, setLandmark] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('High');
  const [images, setImages] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // AI Triage State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  // Voice to text handler
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (isVoiceRecording) {
        setIsVoiceRecording(false);
        setVoiceNotice('');
      } else {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onstart = () => {
            setIsVoiceRecording(true);
            setVoiceNotice(language === 'ta' ? 'குரல் பதிவு துவங்கப்பட்டது... பேசுங்கள்...' : 'Listening... Speak your grievance details...');
          };

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setDescription((prev) => (prev ? prev + ' ' + transcript : transcript));
            setIsVoiceRecording(false);
            setVoiceNotice('');
          };

          recognition.onerror = () => {
            setIsVoiceRecording(false);
            setVoiceNotice(language === 'ta' ? 'குரல் பதிவு பிழை. மீண்டும் முயற்சிக்கவும்.' : 'Voice recognition error. Please try again.');
          };

          recognition.onend = () => {
            setIsVoiceRecording(false);
          };

          recognition.start();
        } catch {
          simulateVoiceInput();
        }
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsVoiceRecording(true);
    setVoiceNotice(language === 'ta' ? 'குரல் பதிவு மாதிரி செயல்படுத்தப்படுகிறது...' : 'Simulating voice input...');
    setTimeout(() => {
      const sampleTamil = 'எங்கள் பகுதியில் கடந்த 4 நாட்களாக குடிநீர் விநியோகம் முற்றிலுமாக தடைபட்டுள்ளது. மெயின் குழாய் உடைந்ததால் கழிவுநீர் கலந்து வருகிறது. உடனடியாக சரிசெய்ய வேண்டுகிறோம்.';
      const sampleEnglish = 'Main underground water pipeline damaged near the bus stand for past 4 days. Foul smelling water leaking into residential premises. Urgent repair required.';
      setDescription((prev) => prev ? prev + ' ' + (language === 'ta' ? sampleTamil : sampleEnglish) : (language === 'ta' ? sampleTamil : sampleEnglish));
      setIsVoiceRecording(false);
      setVoiceNotice('');
    }, 2000);
  };

  // Geo Location autofill
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationDetails(`Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)} (GPS Verified)`);
        },
        () => {
          setLocationDetails('Ward 14, Main Bazaar Road, Near Panchayat Office');
        }
      );
    } else {
      setLocationDetails('Ward 14, Main Bazaar Road, Near Panchayat Office');
    }
  };

  // AI Triage with Server-Side Gemini API
  const handleAITriage = async () => {
    if (!description && !title) {
      alert(language === 'ta' ? 'தயவுசெய்து மனுவின் விவரங்களை அல்லது தலைப்பை உள்ளிடவும்' : 'Please enter grievance title or description first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          district,
          category,
          language: language === 'ta' ? 'Tamil' : 'English',
        }),
      });

      const json = await res.json();
      if (json.data) {
        setAiAnalysisResult(json.data);
        if (json.data.detectedCategory) {
          setCategory(json.data.detectedCategory as GrievanceCategory);
        }
        if (json.data.urgencyLevel) {
          setUrgency(json.data.urgencyLevel as UrgencyLevel);
        }
      }
    } catch (err) {
      console.error('AI Triage error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add Image
  const handleAddSampleImage = () => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
    ];
    const picked = defaultImages[images.length % defaultImages.length];
    setImages([...images, picked]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !citizenName || !citizenPhone) {
      alert(language === 'ta' ? 'தயவுசெய்து தேவையான அனைத்து விவரங்களையும் நிரப்பவும்' : 'Please fill all required fields');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `TN-GRV-2026-${randomNum}`;

    const newGrievance: Grievance = {
      id: generatedId,
      title,
      description,
      category,
      categoryTamil: CATEGORY_TAMIL_MAP[category] || category,
      district,
      taluk: taluk || `${district} Central Taluk`,
      village: ward || 'Ward 12',
      ward: ward || 'Ward 12',
      locationDetails: locationDetails || `${district} Town Main Area`,
      landmark: landmark || 'Near Community Hall',
      citizenName,
      citizenPhone,
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'Submitted',
      urgency,
      urgencyScore: urgency === 'Critical' ? 9 : urgency === 'High' ? 7 : urgency === 'Medium' ? 5 : 3,
      upvotes: 1,
      hasUpvoted: true,
      assignedDepartment: aiAnalysisResult?.department || 'Municipal Administration & Public Works Dept',
      assignedDepartmentTamil: aiAnalysisResult?.departmentTamil || 'நகராட்சி நிர்வாகம் மற்றும் பொதுப்பணித்துறை',
      assignedOfficer: {
        name: 'Er. R. Soundararajan',
        designation: 'Zonal Assistant Engineer',
        contactPhone: '044-24501234',
      },
      estimatedResolutionDays: aiAnalysisResult?.estimatedResolutionDays || (urgency === 'Critical' ? 2 : 4),
      slaDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'],
      timeline: [
        {
          status: 'Submitted',
          titleTamil: 'மனு பதிவு செய்யப்பட்டது',
          titleEnglish: 'Petition Registered & Assigned Token',
          descriptionTamil: `மனு எண் ${generatedId} முறைப்படி பதிவு செய்யப்பட்டு மண்டல பொறியாளருக்கு அனுப்பப்பட்டது.`,
          descriptionEnglish: `Petition generated with tracking token ${generatedId} and routed to zonal nodal engineering cell.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
        },
        {
          status: 'Officer Assigned',
          titleTamil: 'துறை அலுவலர் ஒதுக்கீடு',
          titleEnglish: 'Nodal Officer Allocation',
          descriptionTamil: 'கள ஆய்விற்காக மண்டல உதவி பொறியாளர் நியமிக்கப்பட்டுள்ளார்.',
          descriptionEnglish: 'Field Engineer allocated for site assessment and repair estimation.',
          timestamp: 'Pending Allocation',
          completed: false,
        },
      ],
      aiAnalysis: aiAnalysisResult ? {
        summaryTamil: aiAnalysisResult.summaryTamil || '',
        summaryEnglish: aiAnalysisResult.summaryEnglish || '',
        actionPlanTamil: aiAnalysisResult.actionPlanTamil || [],
        actionPlanEnglish: aiAnalysisResult.actionPlanEnglish || [],
        applicableRules: aiAnalysisResult.applicableRightsOrRules || 'Tamil Nadu Citizen Charter Standards',
      } : undefined,
    };

    onSubmitGrievance(newGrievance);
    setSubmittedToken(generatedId);

    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const categories: GrievanceCategory[] = [
    'Water Supply & Drainage',
    'Roads & Traffic Infrastructure',
    'Electricity & Street Lighting',
    'Sanitation & Solid Waste',
    'Public Health & Hospitals',
    'Agriculture & Irrigation',
    'Education & Government Schools',
    'Women & Child Safety',
    'Revenue & Land Records',
    'Civil Supplies & Ration PDS',
    'Public Transport & Bus Services',
    'Environment & Pollution',
    'Other Civic Issue'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'ta' ? 'புதிய மக்கள் மனு & குறைதீர்ப்பு பதிவு' : 'File Citizen Grievance Petition'}
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                {language === 'ta' ? 'நேரடி கண்காணிப்பு & அரசு துறை உடனடி நடவடிக்கை' : 'Direct Escalation to Department Nodal Officers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Submitted Success Screen */}
        {submittedToken ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {language === 'ta' ? 'மனு வெற்றிகரமாக பதிவு செய்யப்பட்டது' : 'Petition Registered Successfully'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {submittedToken}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {language === 'ta' 
                  ? 'உங்கள் மனு எண் ஒதுக்கப்பட்டு துறை பொறியாளருக்கு அனுப்பப்பட்டுள்ளது. எஸ்.எம்.எஸ் மூலம் தொடர் நிலவரம் அனுப்பப்படும்.'
                  : 'Your petition has been auto-routed to the zonal nodal engineering officer. SLA target tracking initiated.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-lg mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{language === 'ta' ? 'மனுதாரர்' : 'Citizen'}:</span>
                <span className="font-bold text-slate-900">{citizenName} ({citizenPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{language === 'ta' ? 'மாவட்டம் & பகுதி' : 'District & Ward'}:</span>
                <span className="font-bold text-slate-900">{district} - {ward || 'Ward 12'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">{language === 'ta' ? 'எதிர்பார்க்கப்படும் தீர்வு காலம்' : 'Target Resolution SLA'}:</span>
                <span className="font-bold text-emerald-600">{aiAnalysisResult?.estimatedResolutionDays || 3} {language === 'ta' ? 'நாட்கள்' : 'Days'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {language === 'ta' ? 'முகப்புக்குச் செல்' : 'Go to Feed & Track'}
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Title & AI Triage banner */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'மனுவின் தலைப்பு / பிரச்சனை சுருக்கம் *' : 'Grievance Title / Problem Summary *'}
                </label>
                <button
                  type="button"
                  onClick={handleAITriage}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>{language === 'ta' ? 'AI தானியங்கி பகுப்பாய்வு' : 'AI Triage & Categorize'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'ta' ? 'எ.கா: வேளச்சேரி 4வது மெயின் ரோட்டில் உடைந்த குடிநீர் குழாய்' : 'e.g. Broken Water Pipeline and Flooding on Main Road'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
              />
            </div>

            {/* Description with Voice Recording Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'முழு விவரம் & பாதிப்பு விபரம் *' : 'Detailed Grievance Description *'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isVoiceRecording
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isVoiceRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-600" />}
                    <span>{isVoiceRecording ? (language === 'ta' ? 'பதிவாகிறது...' : 'Recording...') : (language === 'ta' ? 'குரல் பதிவு' : 'Voice Input')}</span>
                  </button>
                </div>
              </div>
              
              {voiceNotice && (
                <p className="text-xs text-red-600 font-medium animate-pulse">{voiceNotice}</p>
              )}

              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'ta' 
                  ? 'பிரச்சனை எத்தனை நாட்களாக நீடிக்கிறது? எத்தனை குடும்பங்கள் பாதிக்கப்பட்டுள்ளன? நிலவரத்தை தெளிவாக குறிப்பிடவும்...'
                  : 'Describe the problem, severity, duration, how many residents are affected, and exact location markers...'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* AI Analysis Preview Card if available */}
            {aiAnalysisResult && (
              <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-200 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-indigo-900 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>{language === 'ta' ? 'AI அரசுத் துறை பரிந்துரை & பகுப்பாய்வு' : 'AI Civic Department Routing & Triage'}</span>
                  </div>
                  <span className="bg-indigo-200/80 text-indigo-800 font-bold px-2 py-0.5 rounded-md">
                    Urgency: {aiAnalysisResult.urgencyLevel} ({aiAnalysisResult.urgencyScore}/10)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="bg-white/90 p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-semibold text-indigo-900 block mb-0.5">
                      {language === 'ta' ? 'பொறுப்பான துறை:' : 'Nodal Department:'}
                    </span>
                    <span className="font-medium text-slate-800">
                      {language === 'ta' ? aiAnalysisResult.departmentTamil || aiAnalysisResult.department : aiAnalysisResult.department}
                    </span>
                  </div>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-indigo-100">
                    <span className="font-semibold text-indigo-900 block mb-0.5">
                      {language === 'ta' ? 'தீர்வு கால வரம்பு (SLA):' : 'Estimated SLA Days:'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {aiAnalysisResult.estimatedResolutionDays || 3} {language === 'ta' ? 'வேலை நாட்கள்' : 'Business Days'}
                    </span>
                  </div>
                </div>

                {aiAnalysisResult.summaryTamil && (
                  <p className="text-slate-600 italic bg-white/60 p-2 rounded-lg border border-indigo-50">
                    "{language === 'ta' ? aiAnalysisResult.summaryTamil : aiAnalysisResult.summaryEnglish}"
                  </p>
                )}
              </div>
            )}

            {/* Category & District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'துறை / வகைப்பாடு *' : 'Department Category *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {language === 'ta' ? CATEGORY_TAMIL_MAP[cat] || cat : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'மாவட்டம் (38 மாவட்டங்கள்) *' : 'Tamil Nadu District *'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {TN_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} ({DISTRICT_TAMIL_NAMES[dist] || dist})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Taluk, Ward & Geo Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  {language === 'ta' ? 'வட்டம் / தாலுகா' : 'Taluk / Zone'}
                </label>
                <input
                  type="text"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா: வேளச்சேரி' : 'e.g. Velachery'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  {language === 'ta' ? 'வார்டு எண் / கிராமம்' : 'Ward No / Village'}
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா: வார்டு 142' : 'e.g. Ward 142'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-600">
                    {language === 'ta' ? 'இடம் / லொகேஷன்' : 'Location Marker'}
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    GPS
                  </button>
                </div>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder={language === 'ta' ? 'தெரு பெயர் & அடையாளம்' : 'Street & Landmark'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>
            </div>

            {/* Photos & Evidence */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'ta' ? 'புகைப்பட சான்று / ஆவணம்' : 'Photo Evidence & Attachments'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddSampleImage}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span>{language === 'ta' ? '+ புகைப்படம் இணைக்க (சான்று)' : '+ Attach Photo Evidence'}</span>
                </button>
                <span className="text-xs text-slate-400">
                  {images.length} {language === 'ta' ? 'புகைப்படங்கள் இணைக்கப்பட்டுள்ளன' : 'images attached'}
                </span>
              </div>
              {images.length > 0 && (
                <div className="flex gap-2 pt-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'மனுதாரர் பெயர் *' : 'Citizen Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={language === 'ta' ? 'எ.கா: மு. செந்தில்குமார்' : 'e.g. M. Senthilkumar'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'தொடர்பு தொலைபேசி எண் (SMS பெற) *' : 'Mobile Number (for SMS & OTP updates) *'}
                </label>
                <input
                  type="tel"
                  required
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder="9840123456"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
              >
                {t('close')}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-red-600/20 hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4 text-amber-200" />
                <span>{language === 'ta' ? 'மனுவை உடனே சமர்ப்பி' : 'Submit Petition Now'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
