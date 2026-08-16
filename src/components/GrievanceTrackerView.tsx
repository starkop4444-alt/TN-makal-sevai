import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Grievance, GrievanceStatus, DailyProgressReport, FundUtilisationSummary, CitizenResolutionConfirmation } from '../types';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  MapPin, 
  Phone, 
  FileText, 
  Star, 
  Share2, 
  Download, 
  Building2, 
  ShieldAlert,
  ChevronRight,
  Sparkles,
  MessageSquare,
  TrendingUp,
  IndianRupee,
  HardHat,
  ShieldCheck,
  Check,
  Layers,
  ArrowRight,
  FileCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GrievanceTrackerViewProps {
  grievances: Grievance[];
  onOpenPetitionLetter: (grievance: Grievance) => void;
  onRateGrievance: (id: string, rating: number, comment: string) => void;
  onCitizenConfirmResolution?: (id: string, confirmation: CitizenResolutionConfirmation) => void;
}

export const GrievanceTrackerView: React.FC<GrievanceTrackerViewProps> = ({
  grievances,
  onOpenPetitionLetter,
  onRateGrievance,
  onCitizenConfirmResolution,
}) => {
  const { language, t } = useLanguage();
  const [searchToken, setSearchToken] = useState('TN-GRV-2026-8492');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(() => grievances[0] || null);
  
  // Rating & Feedback
  const [rating, setRating] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // Citizen Resolution Confirmation Form State
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<'satisfied' | 'unsatisfied'>('satisfied');
  const [confirmRating, setConfirmRating] = useState(5);
  const [confirmRemarks, setConfirmRemarks] = useState('களப்பணியாளர்கள் குறிப்பிட்ட காலத்திற்குள் வந்து குறையை முழுமையாக தீர்த்து வைத்தனர். மிக்க நன்றி!');
  const [confirmOtp, setConfirmOtp] = useState('7840');
  const [isConfirmedSaved, setIsConfirmedSaved] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchToken.trim().toLowerCase();
    const found = grievances.find(
      (g) => g.id.toLowerCase() === query || g.citizenPhone.includes(query) || g.title.toLowerCase().includes(query)
    );
    if (found) {
      setSelectedGrievance(found);
      setIsRatingSubmitted(false);
      setIsConfirmedSaved(false);
    } else {
      alert(language === 'ta' ? 'மனு எண் காணப்படவில்லை. தயவுசெய்து சரியான எண்ணை உள்ளிடவும்.' : 'Grievance token not found. Please verify the ID.');
    }
  };

  const handleQuickSelect = (g: Grievance) => {
    setSelectedGrievance(g);
    setSearchToken(g.id);
    setIsRatingSubmitted(false);
    setIsConfirmedSaved(false);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGrievance) {
      onRateGrievance(selectedGrievance.id, rating, ratingFeedback);
      setIsRatingSubmitted(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleSubmitResolutionConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const confirmationData: CitizenResolutionConfirmation = {
      isConfirmedByCitizen: confirmStatus === 'satisfied',
      confirmedAt: nowStr,
      rating: confirmRating,
      feedbackTamil: confirmRemarks,
      feedbackEnglish: confirmRemarks,
      confirmationOtpVerified: true,
      digitalSignatureToken: `SIG-TN-${Math.floor(100000 + Math.random() * 900000)}`
    };

    if (onCitizenConfirmResolution) {
      onCitizenConfirmResolution(selectedGrievance.id, confirmationData);
    }

    setIsConfirmedSaved(true);
    setIsConfirmationOpen(false);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const getStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">✓ {language === 'ta' ? 'தீர்வு காணப்பட்டது' : 'Resolved'}</span>;
      case 'CM Task Sanctioned':
        return <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-300">⚡ {language === 'ta' ? 'முதலமைச்சர் நேரடி பணி ஆணை' : 'CM Work Sanctioned'}</span>;
      case 'In Progress':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">⚡ {language === 'ta' ? 'பணி நடைபெறுகிறது' : 'In Progress'}</span>;
      case 'Supervisor Review':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-300">🔍 {language === 'ta' ? 'வட்டார மேற்பார்வை' : 'Supervisor Review'}</span>;
      case 'Field Inspection':
        return <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2.5 py-1 rounded-full border border-cyan-300">📋 {language === 'ta' ? 'கள ஆய்வு' : 'Field Inspection'}</span>;
      case 'Officer Assigned':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-300">👤 {language === 'ta' ? 'அலுவலர் நியமிப்பு' : 'Officer Assigned'}</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-300">⏳ {language === 'ta' ? 'மனு பெறப்பட்டது' : 'Submitted'}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            {language === 'ta' ? 'நேரடி கண்காணிப்பு, தினசரி முன்னேற்றம் & தீர்வு உறுதிப்படுத்தல்' : 'Live Status, Daily Progress & Citizen Confirmation'}
          </span>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {language === 'ta' ? 'மனுவின் தற்போதைய நிலை & களப்பணி முன்னேற்றம்' : 'Track Grievance Progress & Verify Resolution'}
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 font-normal">
            {language === 'ta'
              ? 'உங்கள் மனு எண் கொண்டு AI சரிபார்ப்பு, மேற்பார்வையாளர் பணி ஆணை, தினசரி முன்னேற்ற அறிக்கை மற்றும் நிதி பயன்பாட்டை நிகழ்நேரத்தில் கண்காணிக்கவும்.'
              : 'Enter your Petition Token or registered Mobile to inspect AI triage, supervisor work orders, daily site progress logs, and fund utilisation.'}
          </p>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 pt-2 max-w-2xl mx-auto">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-slate-800 transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              {language === 'ta' ? 'நிலை காண்க' : 'Track Now'}
            </button>
          </form>

          {/* Sample quick tokens */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>{language === 'ta' ? 'மாதிரி மனுக்கள்:' : 'Sample Tokens:'}</span>
            {grievances.slice(0, 3).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleQuickSelect(g)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer font-mono"
              >
                {g.id} ({g.district})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Grievance Details & Timeline */}
      {selectedGrievance ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2-Column: Status Details & SLA Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Grievance Overview Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {selectedGrievance.id}
                    </span>
                    {getStatusBadge(selectedGrievance.status)}
                    <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-red-200">
                      Urgency: {selectedGrievance.urgency} ({selectedGrievance.urgencyScore}/10)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedGrievance.title}
                  </h3>
                </div>

                <button
                  onClick={() => onOpenPetitionLetter(selectedGrievance)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'ta' ? 'அரசு மனு கடிதம் (PDF)' : 'Official Petition Letter'}</span>
                </button>
              </div>

              {/* Location & Citizen Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 font-medium">{language === 'ta' ? 'மாவட்டம் / தாலுகா' : 'District & Taluk'}</span>
                  <span className="font-bold text-slate-900">{selectedGrievance.district}, {selectedGrievance.taluk}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 font-medium">{language === 'ta' ? 'வார்டு / இடம்' : 'Ward & Location'}</span>
                  <span className="font-bold text-slate-900">{selectedGrievance.ward} ({selectedGrievance.locationDetails || selectedGrievance.village})</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 font-medium">{language === 'ta' ? 'மனுதாரர் & ஆதார்' : 'Citizen & Aadhaar'}</span>
                  <span className="font-bold text-slate-900">{selectedGrievance.citizenName} ({selectedGrievance.citizenAadhaar || 'XXXX XXXX 7840'})</span>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedGrievance.description}
              </p>

              {/* Uploaded Evidence Photos */}
              {selectedGrievance.images && selectedGrievance.images.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    {language === 'ta' ? 'இணைக்கப்பட்ட புகைப்பட சான்றுகள்' : 'Uploaded Evidence Photos'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedGrievance.images.map((img, idx) => (
                      <div key={idx} className="h-32 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                        <img src={img} alt="Evidence" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CITIZEN RESOLUTION CONFIRMATION PROMINENT CARD */}
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">
                      {language === 'ta' ? 'மனுதாரர் இறுதி தீர்வு உறுதிப்படுத்தல் (Citizen Confirmation)' : 'Citizen Resolution Verification & Confirmation'}
                    </h4>
                    <p className="text-xs text-emerald-200">
                      {language === 'ta' ? 'பணி முடிந்தபின் மனுதாரரிடம் நேரடியாக உறுதிமொழி பெறுவது கட்டாயமாகும்.' : 'Supervisor must obtain mandatory confirmation from citizen upon resolution.'}
                    </p>
                  </div>
                </div>

                {selectedGrievance.citizenConfirmation?.isConfirmedByCitizen || isConfirmedSaved ? (
                  <span className="bg-emerald-500 text-white font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {language === 'ta' ? 'மனுதாரரால் உறுதி செய்யப்பட்டது' : 'Verified by Citizen'}
                  </span>
                ) : (
                  <button
                    onClick={() => setIsConfirmationOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    {language === 'ta' ? 'தீர்வை உறுதி செய்க (Confirm)' : 'Confirm Resolution'}
                  </button>
                )}
              </div>

              {/* If already confirmed, display the confirmation verification certificate */}
              {(selectedGrievance.citizenConfirmation?.isConfirmedByCitizen || isConfirmedSaved) && (
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-300 font-mono text-[11px]">
                    <span>Token: {selectedGrievance.citizenConfirmation?.digitalSignatureToken || 'SIG-TN-784920'}</span>
                    <span>Verified: {selectedGrievance.citizenConfirmation?.confirmedAt || 'Today'}</span>
                  </div>
                  <p className="text-slate-200 text-xs italic">
                    "{selectedGrievance.citizenConfirmation?.feedbackTamil || confirmRemarks}"
                  </p>
                  <div className="flex items-center gap-1 text-amber-300 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    ))}
                    <span className="text-[11px] text-white ml-2 font-bold">5.0 Star Verified Citizen Satisfaction</span>
                  </div>
                </div>
              )}
            </div>

            {/* DAY-TO-DAY FIELD WORK PROGRESS & FUND UTILISATION */}
            {(selectedGrievance.dailyProgressReports && selectedGrievance.dailyProgressReports.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-base font-bold text-slate-900">
                      {language === 'ta' ? 'தினசரி களப்பணி முன்னேற்ற அறிக்கை (Daily Progress Reports)' : 'Day-to-Day Work Progress & Fund Utilization'}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-mono">
                    {selectedGrievance.dailyProgressReports.length} {language === 'ta' ? 'நாட்கள் பதிவு' : 'Days Logged'}
                  </span>
                </div>

                {/* Daily Reports Cards */}
                <div className="space-y-3">
                  {selectedGrievance.dailyProgressReports.map((report, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-md text-[11px]">
                            Day {report.dayNumber}
                          </span>
                          <span className="text-slate-500 font-medium">{report.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-700 font-bold">
                            ₹{report.fundsSpentTodayINR?.toLocaleString('en-IN')} spent
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {report.progressPercentage}% Completed
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed font-medium">
                        {language === 'ta' ? report.workSummaryTamil : report.workSummaryEnglish}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                        <span>Updated by: {report.updatedBy || 'Er. Field Supervisor'}</span>
                        <span>Timestamp: {report.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fund Utilisation Summary Bar */}
                {selectedGrievance.fundUtilisation && (
                  <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 space-y-3">
                    <h5 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-indigo-700" />
                      {language === 'ta' ? 'நிதி பயன்பாட்டு தணிக்கை விவரம் (Fund Breakdown):' : 'Official Fund Utilisation Breakdown:'}
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                        <span className="text-slate-400 block text-[10px]">{language === 'ta' ? 'ஒதுக்கப்பட்ட நிதி' : 'Sanctioned'}</span>
                        <span className="font-bold text-slate-900 text-xs">₹{selectedGrievance.fundUtilisation.totalBudgetINR?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                        <span className="text-slate-400 block text-[10px]">{language === 'ta' ? 'பொருட்கள் செலவு' : 'Materials'}</span>
                        <span className="font-bold text-slate-900 text-xs">₹{selectedGrievance.fundUtilisation.materialsSpentINR?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                        <span className="text-slate-400 block text-[10px]">{language === 'ta' ? 'கூலி ஊதியம் வழங்கியது' : 'Labour Wages'}</span>
                        <span className="font-bold text-emerald-700 text-xs">₹{selectedGrievance.fundUtilisation.labourWagesPaidINR?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100">
                        <span className="text-slate-400 block text-[10px]">{language === 'ta' ? 'மீதமுள்ள இருப்பு' : 'Remaining Balance'}</span>
                        <span className="font-bold text-indigo-700 text-xs">₹{selectedGrievance.fundUtilisation.balanceRemainingINR?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SLA Timeline Tracking */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    {language === 'ta' ? 'அரசுத் துறை நடவடிக்கை காலவரிசை (SLA Timeline)' : 'Official SLA Action Timeline'}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Target SLA: {selectedGrievance.estimatedResolutionDays} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                </span>
              </div>

              {/* Timeline list */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedGrievance.timeline.map((event, idx) => {
                  return (
                    <div key={idx} className="relative group">
                      {/* Status circle marker */}
                      <div className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        event.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}>
                        {event.completed ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-slate-300" />}
                      </div>

                      <div className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-xl border border-slate-200 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <h5 className="text-sm font-bold text-slate-900">
                            {language === 'ta' ? event.titleTamil : event.titleEnglish}
                          </h5>
                          <span className="text-xs font-mono text-slate-500 font-medium">
                            {event.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {language === 'ta' ? event.descriptionTamil : event.descriptionEnglish}
                        </p>

                        {event.officerName && (
                          <div className="mt-2 text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{event.officerName} ({event.officerDesignation})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Action Plan & Government Rules Card */}
            {selectedGrievance.aiAnalysis && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 space-y-4">
                <div className="flex items-center gap-2 text-indigo-950 font-bold">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h4>{language === 'ta' ? 'AI அதிகாரப்பூர்வ தீர்வு வரைவு & சட்ட விதிகள்' : 'AI Nodal Action Roadmap & Citizen Charter Standards'}</h4>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-indigo-900 block uppercase tracking-wider">
                    {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நேரடி நடவடிக்கைகள்:' : 'Recommended Field Remediation Steps:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(language === 'ta' ? selectedGrievance.aiAnalysis.actionPlanTamil : selectedGrievance.aiAnalysis.actionPlanEnglish).map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-indigo-100/80 text-xs text-indigo-900">
                  <span className="font-semibold">{language === 'ta' ? 'பொருந்தக்கூடிய சட்டம் / விதி:' : 'Applicable Legal Rule:'} </span>
                  <span className="font-mono">{selectedGrievance.aiAnalysis.applicableRules}</span>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar 1-Column: Officer Card, Rating & Comments */}
          <div className="space-y-6">
            
            {/* Nodal Officer Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'ta' ? 'பொறுப்பான துறை' : 'Assigned Department'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {language === 'ta' ? selectedGrievance.assignedDepartmentTamil : selectedGrievance.assignedDepartment}
                  </h4>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'நோடல் அலுவலர்:' : 'Nodal Officer:'}</span>
                  <span className="font-bold text-slate-900">{selectedGrievance.assignedOfficer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{language === 'ta' ? 'பதவி:' : 'Designation:'}</span>
                  <span className="font-semibold text-slate-800">{selectedGrievance.assignedOfficer.designation}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">{language === 'ta' ? 'அலுவலக எண்:' : 'Office Phone:'}</span>
                  <a href={`tel:${selectedGrievance.assignedOfficer.contactPhone}`} className="font-bold text-indigo-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {selectedGrievance.assignedOfficer.contactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Citizen Satisfaction Feedback & Rating */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'ta' ? 'பொதுமக்கள் திருப்தி மதிப்பீடு' : 'Citizen Verification & Rating'}
                </h4>
              </div>

              {isRatingSubmitted ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs font-semibold text-center border border-emerald-200 space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                  <p>{language === 'ta' ? 'உங்கள் மதிப்பீடு பதிவு செய்யப்பட்டது! நன்றி.' : 'Your rating has been recorded! Thank you.'}</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                    placeholder={language === 'ta' ? 'அதிகாரிகளின் களப்பணி திருப்திகரமாக இருந்ததா? உங்கள் கருத்து...' : 'How satisfied are you with the response speed and quality?'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {language === 'ta' ? 'மதிப்பீட்டை சமர்ப்பி' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </div>

            {/* Community Comments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'ta' ? 'சமூகக் கருத்துக்கள்' : 'Community Updates'}
                </h4>
              </div>

              <div className="space-y-3">
                {selectedGrievance.comments && selectedGrievance.comments.length > 0 ? (
                  selectedGrievance.comments.map((c) => (
                    <div key={c.id} className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 border border-slate-100">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{c.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{c.time}</span>
                      </div>
                      <p className="text-slate-600">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-2">
                    {language === 'ta' ? 'கருத்துக்கள் எதுவும் இல்லை' : 'No comments yet'}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 space-y-3 border border-slate-200">
          <Search className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">
            {language === 'ta' ? 'மனு எண் உள்ளிட்டு தேடுங்கள்' : 'Search for a Petition Token above'}
          </h3>
        </div>
      )}

      {/* CITIZEN CONFIRMATION MODAL */}
      {isConfirmationOpen && selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {language === 'ta' ? 'மனுதாரர் தீர்வு உறுதிப்படுத்தல்' : 'Citizen Resolution Verification'}
                  </h3>
                  <p className="text-xs text-emerald-200 font-mono">
                    Token: {selectedGrievance.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitResolutionConfirmation} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  {language === 'ta' ? 'களப்பணி தீர்வு அடைந்ததா? *' : 'Has the issue been fully resolved? *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmStatus('satisfied')}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs cursor-pointer transition-all ${
                      confirmStatus === 'satisfied'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    ✓ {language === 'ta' ? 'முழுமையாக தீர்க்கப்பட்டது' : 'Fully Resolved & Satisfied'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmStatus('unsatisfied')}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs cursor-pointer transition-all ${
                      confirmStatus === 'unsatisfied'
                        ? 'border-amber-600 bg-amber-50 text-amber-950'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    ⚠️ {language === 'ta' ? 'இன்னும் வேலை தேவை' : 'Needs Further Work'}
                  </button>
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-1 text-center py-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] block">
                  {language === 'ta' ? 'அதிகாரிகள் மற்றும் களப்பணி மதிப்பீடு *' : 'Rate Resolution Quality & Speed *'}
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setConfirmRating(star)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star className={`w-7 h-7 ${star <= confirmRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Remarks */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] block">
                  {language === 'ta' ? 'மனுதாரர் கருத்துரை (Remarks) *' : 'Citizen Remarks & Feedback *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={confirmRemarks}
                  onChange={(e) => setConfirmRemarks(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              {/* Aadhaar / Mobile OTP Verification */}
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 space-y-1">
                <label className="font-bold text-emerald-950 text-[10px] uppercase block">
                  {language === 'ta' ? 'ஆதார் பதிவு மொபைல் OTP சரிபார்ப்பு *' : 'Registered Mobile OTP Verification *'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={confirmOtp}
                    onChange={(e) => setConfirmOtp(e.target.value)}
                    className="w-28 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-center font-mono font-bold text-xs"
                  />
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    ✓ Verified for {selectedGrievance.citizenPhone}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmationOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'உறுதிசெய்து சான்றளிக்க' : 'Sign & Confirm Resolution'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
