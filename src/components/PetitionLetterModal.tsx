import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Grievance } from '../types';
import { 
  X, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Loader2, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

interface PetitionLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  grievance: Grievance | null;
}

export const PetitionLetterModal: React.FC<PetitionLetterModalProps> = ({
  isOpen,
  onClose,
  grievance,
}) => {
  const { language } = useLanguage();

  const [activeLang, setActiveLang] = useState<'ta' | 'en'>(language);
  const [isDrafting, setIsDrafting] = useState(false);
  const [petitionData, setPetitionData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && grievance) {
      generateDraft();
    }
  }, [isOpen, grievance]);

  const generateDraft = async () => {
    if (!grievance) return;
    setIsDrafting(true);
    try {
      const res = await fetch('/api/draft-petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: grievance.citizenName,
          address: `${grievance.locationDetails}, ${grievance.ward}`,
          district: grievance.district,
          taluk: grievance.taluk,
          ward: grievance.ward,
          phone: grievance.citizenPhone,
          issueCategory: grievance.category,
          grievanceDetails: grievance.description,
          addressedTo: `The District Collector, ${grievance.district} District / Commissioner of Municipal Administration`,
        }),
      });

      const json = await res.json();
      if (json.petition) {
        setPetitionData(json.petition);
      }
    } catch (err) {
      console.error('Draft petition error:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = activeLang === 'ta'
      ? petitionData?.letterTamil || defaultTamilLetter
      : petitionData?.letterEnglish || defaultEnglishLetter;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen || !grievance) return null;

  const defaultTamilLetter = `மனு

அனுப்புநர்:
${grievance.citizenName}
${grievance.locationDetails}, ${grievance.ward},
${grievance.taluk}, ${grievance.district} மாவட்டம்.
தொலைபேசி எண்: ${grievance.citizenPhone}

பெறுநர்:
உயர்திரு. மாவட்ட ஆட்சித்தலைவர் அவர்கள்,
மாவட்ட ஆட்சியர் வளாகம்,
${grievance.district} மாவட்டம், தமிழ்நாடு.

பொருள்: ${grievance.categoryTamil} - ${grievance.title} தொடர்பாக உரிய நடவடிக்கை கோருதல் சார்பாக.

வணக்கம்,
நான் மேற்கண்ட முகவரியில் வசித்து வரும் பொதுமக்கள் ஆவேன். எங்கள் பகுதியில் ${grievance.description} காரணமாக பொதுமக்கள் மற்றும் வாகன ஓட்டிகள் பெரும் சிரமத்திற்கு உள்ளாகியுள்ளனர்.

கோரிக்கை:
இப்பிரச்சனைக்கு முன்னுரிமை அளித்து, சம்பந்தப்பட்ட துறை அலுவலர்கள் மூலம் உடனடி கள ஆய்வு மேற்கொண்டு, உரிய சீரமைப்பு பணிகளை துரிதமாக நிறைவேற்றிட பணிவுடன் வேண்டுகிறேன்.

இடம்: ${grievance.district}
தேதி: ${new Date().toLocaleDateString('en-IN')}

இவண்,
தங்கள் உண்மையுள்ள,
(${grievance.citizenName})`;

  const defaultEnglishLetter = `FORMAL GRIEVANCE PETITION

From:
${grievance.citizenName}
${grievance.locationDetails}, ${grievance.ward},
${grievance.taluk}, ${grievance.district} District, Tamil Nadu.
Contact: ${grievance.citizenPhone}

To:
The District Collector / Nodal Authority,
District Collectorate,
${grievance.district} District, Tamil Nadu.

Subject: Urgent Request for Redressal Regarding: ${grievance.title} (${grievance.category})

Respected Authority,

I am a resident of the aforementioned address in ${grievance.district}. I am submitting this formal grievance petition to bring to your immediate attention the following public concern:

${grievance.description}

PRAYER / RELIEF SOUGHT:
Given the public safety hazard and severe inconvenience caused to the residents of ${grievance.ward}, I respectfully request your good office to issue urgent directions to the concerned departmental engineers to conduct a prompt site inspection and complete the necessary remediation works at the earliest.

Place: ${grievance.district}
Date: ${new Date().toLocaleDateString('en-IN')}

Yours faithfully,
(${grievance.citizenName})`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Modal Topbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {language === 'ta' ? 'அதிகாரப்பூர்வ அரசு மாதிரி மனு (Petition Draft)' : 'Official Government Petition Generator'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setActiveLang('ta')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  activeLang === 'ta' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                தமிழ் மனு
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2.5 py-1 rounded-md font-semibold ${
                  activeLang === 'en' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                }`}
              >
                English Letter
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Letter Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50 font-serif">
          {isDrafting ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="text-sm font-sans font-semibold text-slate-700">
                {language === 'ta' ? 'அரசு சட்ட விதிகளுக்கு ஏற்ப மாதிரி மனு தயாரிக்கப்படுகிறது...' : 'Drafting legally structured petition with AI...'}
              </p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 text-sm leading-relaxed whitespace-pre-wrap">
              {activeLang === 'ta'
                ? petitionData?.letterTamil || defaultTamilLetter
                : petitionData?.letterEnglish || defaultEnglishLetter}
            </div>
          )}

          {petitionData?.recommendedEnclosures && (
            <div className="mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 font-sans text-xs space-y-1.5">
              <span className="font-bold text-indigo-900 block">
                {language === 'ta' ? 'இணைக்க வேண்டிய சான்றுகள் (Enclosures):' : 'Recommended Enclosures:'}
              </span>
              <ul className="list-disc list-inside text-slate-700">
                {petitionData.recommendedEnclosures.map((enc: string, i: number) => (
                  <li key={i}>{enc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono font-medium">
            Token: {grievance.id}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'முழு மனுவை காப்பி செய்' : 'Copy Text')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{language === 'ta' ? 'அரசு மனு அச்சிடுக (Print)' : 'Print Petition'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
