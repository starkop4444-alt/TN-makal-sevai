import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CitizenProfile, UserRole } from '../types';
import { TN_DISTRICTS, DISTRICT_TAMIL_NAMES, getTaluksForDistrict, getVillagesForTaluk } from '../data/tamilNaduData';
import { 
  ShieldCheck, 
  X, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  MapPin, 
  Building2, 
  Sparkles,
  Smartphone,
  Lock,
  HardHat,
  KeyRound,
  FileCheck2,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AadhaarAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: CitizenProfile | null;
  currentRole: UserRole;
  onSaveProfile: (profile: CitizenProfile, role: UserRole) => void;
}

export const AadhaarAuthModal: React.FC<AadhaarAuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  currentRole,
  onSaveProfile,
}) => {
  const { language } = useLanguage();

  const [activeLoginRole, setActiveLoginRole] = useState<UserRole>(currentRole || 'citizen');

  // Common Citizen / Contractor Aadhaar + Mobile fields
  const [aadhaarRaw, setAadhaarRaw] = useState(
    currentProfile?.aadhaarNumber ? currentProfile.aadhaarNumber.replace(/\D/g, '') : '548962317840'
  );
  const [mobile, setMobile] = useState(currentProfile?.mobileNumber || '9840123456');
  const [fullName, setFullName] = useState(currentProfile?.fullName || 'M. Senthilkumar');
  const [district, setDistrict] = useState(currentProfile?.district || 'Ariyalur');
  const [taluk, setTaluk] = useState(currentProfile?.taluk || 'Sendurai');
  const [village, setVillage] = useState(currentProfile?.village || 'Sendurai South');

  // Contractor specific
  const [contractorLicense, setContractorLicense] = useState(currentProfile?.contractorLicenseId || 'TN-PWD-CL1-2026-9812');
  const [contractorFirm, setContractorFirm] = useState(currentProfile?.contractorFirmName || 'Sri Murugan Infra & Civil Works');
  const [contractorSpecialization, setContractorSpecialization] = useState(currentProfile?.contractorSpecialization || 'Civic Infrastructure & Welder Fabrications');

  // Supervisor & CM Cell Password fields
  const [supervisorMobile, setSupervisorMobile] = useState('9840123456');
  const [supervisorPassword, setSupervisorPassword] = useState('supervisor123');
  const [supervisorTaluk, setSupervisorTaluk] = useState('Sendurai');
  const [supervisorDistrict, setSupervisorDistrict] = useState('Ariyalur');
  const [supervisorName, setSupervisorName] = useState('Er. K. Murugesan');

  const [cmMobile, setCmMobile] = useState('9444011000');
  const [cmPassword, setCmPassword] = useState('cmcell2026');
  const [cmOfficerName, setCmOfficerName] = useState('Thiru. T. Udhayachandran IAS');

  // OTP Stage for Citizen & Contractor
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('729415');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen) return null;

  // Format Aadhaar with spaces: 1234 5678 9012
  const formatAadhaar = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarRaw(digits);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = e.target.value;
    setDistrict(newDist);
    const taluks = getTaluksForDistrict(newDist);
    setTaluk(taluks[0] || '');
    const villages = getVillagesForTaluk(taluks[0] || '');
    setVillage(villages[0] || '');
  };

  const handleTalukChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTaluk = e.target.value;
    setTaluk(newTaluk);
    const villages = getVillagesForTaluk(newTaluk);
    setVillage(villages[0] || '');
  };

  // 1. Citizen & Contractor OTP flow
  const handleSendAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarRaw.length !== 12) {
      alert(language === 'ta' ? 'தயவுசெய்து 12 இலக்க சரியான ஆதார் எண்ணை உள்ளிடவும்' : 'Please enter valid 12-digit Aadhaar number');
      return;
    }
    if (mobile.replace(/\D/g, '').length < 10) {
      alert(language === 'ta' ? 'தயவுசெய்து 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter valid 10-digit mobile number');
      return;
    }
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpCode('');
    setOtpError('');
    setStep('otp');
  };

  const handleVerifyAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '123456' && otpCode.length !== 6) {
      setOtpError(language === 'ta' ? 'தவறான OTP குறியீடு. மீண்டும் சரிபார்க்கவும்.' : 'Invalid OTP code. Please enter 6-digit OTP.');
      return;
    }

    const formattedAadhaar = formatAadhaar(aadhaarRaw);
    const profile: CitizenProfile = {
      aadhaarNumber: formattedAadhaar,
      mobileNumber: mobile,
      fullName: fullName.trim() || (activeLoginRole === 'contractor' ? 'R. Periasamy (Contractor)' : 'M. Senthilkumar'),
      district,
      taluk,
      village,
      isVerified: true,
      role: activeLoginRole,
      contractorLicenseId: activeLoginRole === 'contractor' ? contractorLicense : undefined,
      contractorFirmName: activeLoginRole === 'contractor' ? contractorFirm : undefined,
      contractorSpecialization: activeLoginRole === 'contractor' ? contractorSpecialization : undefined,
    };

    onSaveProfile(profile, activeLoginRole);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  // 2. Supervisor Login (Mobile No & Password)
  const handleSupervisorPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (supervisorMobile.replace(/\D/g, '').length < 10) {
      setPasswordError(language === 'ta' ? '10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்' : 'Enter 10-digit mobile number');
      return;
    }
    if (!supervisorPassword || supervisorPassword.length < 4) {
      setPasswordError(language === 'ta' ? 'சரியான கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter valid supervisor password');
      return;
    }

    const supervisorProfile: CitizenProfile = {
      aadhaarNumber: 'XXXX XXXX 7840',
      mobileNumber: supervisorMobile,
      fullName: supervisorName || 'Er. K. Murugesan (Supervisor)',
      district: supervisorDistrict,
      taluk: supervisorTaluk,
      village: `${supervisorTaluk} Taluk Nodal Desk`,
      isVerified: true,
      role: 'supervisor'
    };

    onSaveProfile(supervisorProfile, 'supervisor');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  // 3. CM Cell Login (Mobile No & Password)
  const handleCMCellPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (cmMobile.replace(/\D/g, '').length < 10) {
      setPasswordError(language === 'ta' ? '10 இலக்க முதலமைச்சர் பிரிவு தொலைபேசி எண்ணை உள்ளிடவும்' : 'Enter 10-digit authorized mobile number');
      return;
    }
    if (!cmPassword || cmPassword.length < 4) {
      setPasswordError(language === 'ta' ? 'சரியான முதலமைச்சர் பிரிவு கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter valid CM Cell password');
      return;
    }

    const cmProfile: CitizenProfile = {
      aadhaarNumber: 'XXXX XXXX 1100',
      mobileNumber: cmMobile,
      fullName: cmOfficerName || 'Thiru. T. Udhayachandran IAS (CM Special Secretary)',
      district: 'Chennai',
      taluk: 'Secretariat Fort St. George',
      village: 'CM Special Action Cell',
      isVerified: true,
      role: 'cm_cell'
    };

    onSaveProfile(cmProfile, 'cm_cell');
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const availableTaluks = getTaluksForDistrict(district);
  const availableVillages = getVillagesForTaluk(taluk);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xl border border-white/30 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {language === 'ta' ? '4-அடுக்கு அரசு & மக்கள் உள்நுழைவு தளம்' : '4-Tier Portal Authentication'}
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                {language === 'ta' ? 'பொதுமக்கள் • ஒப்பந்ததாரர் • மேற்பார்வையாளர் • முதல்வர் பிரிவு' : 'Citizen • Contractor • Supervisor • CM Cell'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Login Role Switcher Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            
            {/* 1. Public Citizen */}
            <button
              type="button"
              onClick={() => {
                setActiveLoginRole('citizen');
                setStep('details');
              }}
              className={`p-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                activeLoginRole === 'citizen'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[11px] leading-tight">
                {language === 'ta' ? '1. பொதுமக்கள்' : '1. Public (Citizen)'}
              </span>
              <span className="text-[9px] font-normal opacity-80">Aadhaar + Mobile</span>
            </button>

            {/* 2. Contractor */}
            <button
              type="button"
              onClick={() => {
                setActiveLoginRole('contractor');
                setStep('details');
              }}
              className={`p-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                activeLoginRole === 'contractor'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span className="text-[11px] leading-tight">
                {language === 'ta' ? '2. ஒப்பந்ததாரர்' : '2. Contractor'}
              </span>
              <span className="text-[9px] font-normal opacity-80">Aadhaar + Mobile</span>
            </button>

            {/* 3. Supervisor */}
            <button
              type="button"
              onClick={() => {
                setActiveLoginRole('supervisor');
                setPasswordError('');
              }}
              className={`p-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                activeLoginRole === 'supervisor'
                  ? 'bg-indigo-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] leading-tight">
                {language === 'ta' ? '3. மேற்பார்வையாளர்' : '3. Supervisor'}
              </span>
              <span className="text-[9px] font-normal opacity-80">Mobile + Password</span>
            </button>

            {/* 4. CM Cell */}
            <button
              type="button"
              onClick={() => {
                setActiveLoginRole('cm_cell');
                setPasswordError('');
              }}
              className={`p-2.5 rounded-xl font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                activeLoginRole === 'cm_cell'
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[11px] leading-tight">
                {language === 'ta' ? '4. முதல்வர் பிரிவு' : '4. CM Cell Apex'}
              </span>
              <span className="text-[9px] font-normal opacity-80">Mobile + Password</span>
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* ROLE 1 & 2: CITIZEN / CONTRACTOR (Aadhaar & Mobile with OTP)     */}
        {/* --------------------------------------------------------------- */}
        {(activeLoginRole === 'citizen' || activeLoginRole === 'contractor') && (
          <>
            {step === 'details' ? (
              <form onSubmit={handleSendAadhaarOtp} className="p-6 space-y-4 text-xs">
                
                {/* Role Badge Info */}
                <div className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold ${
                  activeLoginRole === 'contractor'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}>
                  {activeLoginRole === 'contractor' ? <HardHat className="w-4 h-4 text-amber-700" /> : <User className="w-4 h-4 text-red-700" />}
                  <span>
                    {activeLoginRole === 'contractor'
                      ? (language === 'ta' ? 'ஒப்பந்ததாரர் உள்நுழைவு: ஆதார் மற்றும் மொபைல் எண் மூலம் சரிபார்க்கவும்' : 'Contractor Auth: Login using Aadhaar and Registered Mobile No')
                      : (language === 'ta' ? 'பொதுமக்கள் உள்நுழைவு: ஆதார் மற்றும் மொபைல் எண் மூலம் சரிபார்க்கவும்' : 'Public Citizen Auth: Login using Aadhaar and Mobile No')}
                  </span>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    {activeLoginRole === 'contractor' 
                      ? (language === 'ta' ? 'ஒப்பந்ததாரர் பெயர் / Contact Person *' : 'Contractor Full Name *')
                      : (language === 'ta' ? 'மனுதாரர் முழுப் பெயர் *' : 'Citizen Full Name *')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={activeLoginRole === 'contractor' ? 'e.g. R. Periasamy' : 'e.g. M. Senthilkumar'}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Contractor License & Firm (If Contractor) */}
                {activeLoginRole === 'contractor' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        {language === 'ta' ? 'ஒப்பந்ததாரர் உரிம எண் (License ID) *' : 'Contractor License No *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contractorLicense}
                        onChange={(e) => setContractorLicense(e.target.value)}
                        placeholder="TN-PWD-CL1-2026-9812"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        {language === 'ta' ? 'நிறுவனம் / Firm Name *' : 'Contracting Firm Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={contractorFirm}
                        onChange={(e) => setContractorFirm(e.target.value)}
                        placeholder="Sri Murugan Infra & Civil Works"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Aadhaar and Mobile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        {language === 'ta' ? '12 இலக்க ஆதார் எண் *' : 'Aadhaar Number (12-Digit) *'}
                      </label>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                        UIDAI
                      </span>
                    </div>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={14}
                        value={formatAadhaar(aadhaarRaw)}
                        onChange={handleAadhaarChange}
                        placeholder="XXXX XXXX XXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      {language === 'ta' ? 'கைபேசி எண் (OTP பெற) *' : 'Mobile Number (10-Digit) *'}
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9840123456"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      {language === 'ta' ? 'மாவட்டம்' : 'District'}
                    </label>
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {TN_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d} ({DISTRICT_TAMIL_NAMES[d] || d})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      {language === 'ta' ? 'தாலுகா' : 'Taluk'}
                    </label>
                    <select
                      value={taluk}
                      onChange={handleTalukChange}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {availableTaluks.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      {language === 'ta' ? 'கிராமம் / வார்டு' : 'Village/Ward'}
                    </label>
                    <select
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      {availableVillages.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                  >
                    {language === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold shadow-md cursor-pointer ${
                      activeLoginRole === 'contractor'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                        : 'bg-gradient-to-r from-red-600 to-amber-600'
                    }`}
                  >
                    <span>{language === 'ta' ? 'OTP பெறுக & சரிபார்க்க' : 'Send OTP & Proceed'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: OTP Verification Screen */
              <form onSubmit={handleVerifyAadhaarOtp} className="p-6 space-y-5 text-xs">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'ta' ? 'ஆதார் & மொபைல் OTP சரிபார்ப்பு' : 'Aadhaar & Mobile OTP Verification'}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    {language === 'ta'
                      ? `உங்கள் கைபேசி +91 ${mobile} மற்றும் ஆதார் எண்ணிற்கு அனுப்பப்பட்ட 6 இலக்க OTP குறியீட்டை உள்ளிடவும்.`
                      : `Enter 6-digit OTP code sent to +91 ${mobile} linked to Aadhaar.`}
                  </p>
                </div>

                {/* OTP Autofill Simulator */}
                <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                    <span>💬 TN-GOV SMS OTP SIMULATOR</span>
                    <span className="font-mono text-emerald-400">Just Now</span>
                  </div>
                  <p className="text-slate-300 font-mono text-xs">
                    "Your portal authentication OTP is <strong className="text-amber-300 text-sm tracking-widest">{generatedOtp}</strong>. Valid for 10 mins."
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp)}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    ⚡ {language === 'ta' ? 'தானாக நிரப்புக (Autofill OTP)' : 'Click to Autofill OTP'}
                  </button>
                </div>

                {/* OTP Input */}
                <div className="space-y-1.5 text-center">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    placeholder="• • • • • •"
                    className="w-44 mx-auto px-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-2xl text-center font-mono font-black text-2xl tracking-[0.4em] text-slate-900 focus:bg-white focus:outline-none"
                  />
                  {otpError && (
                    <p className="text-xs text-red-600 font-bold">{otpError}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    ← {language === 'ta' ? 'விவரங்களை திருத்த' : 'Back to Details'}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>{language === 'ta' ? 'சரிபார்த்து உள்நுழைக' : 'Verify & Enter Portal'}</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* --------------------------------------------------------------- */}
        {/* ROLE 3: SUPERVISOR (Mobile No & Password)                        */}
        {/* --------------------------------------------------------------- */}
        {activeLoginRole === 'supervisor' && (
          <form onSubmit={handleSupervisorPasswordLogin} className="p-6 space-y-4 text-xs">
            
            {/* Supervisor Info Banner */}
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-950 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>{language === 'ta' ? 'தாலுகா கள மேற்பார்வையாளர் உள்நுழைவு' : 'Taluk Field Supervisor Portal Login'}</span>
              </div>
              <p className="text-[11px] text-indigo-800">
                {language === 'ta' 
                  ? 'மேற்பார்வையாளர்கள் மட்டுமே மனுக்களை கள ஆய்வு செய்து ஏற்கவும் (Accept) அல்லது தள்ளுபடி செய்யவும் (Reject), மற்றும் பணிகள் முடிந்ததும் "Work Finished" என குறிக்கவும் அணுகல் உண்டு.'
                  : 'Supervisors have restricted access to triage petitions (Accept or Reject), dispatch volunteer/civic work, and mark Work Finished status.'}
              </p>
            </div>

            {/* Quick Demo Autofill Button */}
            <button
              type="button"
              onClick={() => {
                setSupervisorMobile('9840123456');
                setSupervisorPassword('supervisor123');
                setSupervisorName('Er. K. Murugesan');
                setSupervisorTaluk('Sendurai');
                setSupervisorDistrict('Ariyalur');
              }}
              className="w-full py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-950 rounded-xl font-bold text-[11px] transition-colors border border-indigo-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
              <span>{language === 'ta' ? 'மேற்பார்வையாளர் மாதிரி தகவலை நிரப்புக (Demo Supervisor)' : 'Click to Autofill Demo Supervisor Credentials'}</span>
            </button>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {language === 'ta' ? 'பதிவு செய்யப்பட்ட கைபேசி எண் (Mobile No) *' : 'Registered Mobile Number *'}
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={supervisorMobile}
                  onChange={(e) => setSupervisorMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9840123456"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {language === 'ta' ? 'மேற்பார்வையாளர் கடவுச்சொல் (Password) *' : 'Supervisor Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={supervisorPassword}
                  onChange={(e) => setSupervisorPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Supervisor Officer & Taluk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">
                  {language === 'ta' ? 'அதிகாரி பெயர்' : 'Supervisor Name'}
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">
                  {language === 'ta' ? 'ஒதுக்கப்பட்ட தாலுகா' : 'Assigned Taluk / District'}
                </label>
                <input
                  type="text"
                  value={`${supervisorTaluk}, ${supervisorDistrict}`}
                  onChange={(e) => setSupervisorTaluk(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-xs text-red-600 font-bold">{passwordError}</p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
              >
                {language === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-800 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>{language === 'ta' ? 'மேற்பார்வையாளராக உள்நுழைக' : 'Login as Supervisor'}</span>
              </button>
            </div>
          </form>
        )}

        {/* --------------------------------------------------------------- */}
        {/* ROLE 4: CM CELL (Mobile No & Password)                           */}
        {/* --------------------------------------------------------------- */}
        {activeLoginRole === 'cm_cell' && (
          <form onSubmit={handleCMCellPasswordLogin} className="p-6 space-y-4 text-xs">
            
            {/* CM Cell Info Banner */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                <Building2 className="w-4 h-4 text-rose-700" />
                <span>{language === 'ta' ? 'முதலமைச்சர் நேரடி சிறப்புப் பிரிவு (CM Apex Cell Desk)' : 'Chief Minister Special Cell Apex Portal'}</span>
              </div>
              <p className="text-[11px] text-rose-800">
                {language === 'ta'
                  ? 'மேற்பார்வையாளர்களால் நிராகரிக்கப்பட்ட மனுக்களை மறுஆய்வு செய்து தள்ளுபடி செய்யவும் (Reject) அல்லது மறுபரிசீலனை செய்து (Reconsider) நேரடி பணி ஆணை வழங்கவும் அனுமதி உண்டு.'
                  : 'Apex state executive authority to review rejected petitions from supervisors to either uphold rejection or reconsider and sanction rapid work orders.'}
              </p>
            </div>

            {/* Quick Demo Autofill Button */}
            <button
              type="button"
              onClick={() => {
                setCmMobile('9444011000');
                setCmPassword('cmcell2026');
                setCmOfficerName('Thiru. T. Udhayachandran IAS');
              }}
              className="w-full py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-950 rounded-xl font-bold text-[11px] transition-colors border border-rose-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>{language === 'ta' ? 'முதல்வர் பிரிவு மாதிரி தகவலை நிரப்புக (Demo CM Cell)' : 'Click to Autofill Demo CM Cell Credentials'}</span>
            </button>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {language === 'ta' ? 'அதிகாரப்பூர்வ கைபேசி எண் (Mobile No) *' : 'Authorized Mobile Number *'}
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={cmMobile}
                  onChange={(e) => setCmMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9444011000"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {language === 'ta' ? 'முதலமைச்சர் பிரிவு கடவுச்சொல் (Password) *' : 'CM Special Cell Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={cmPassword}
                  onChange={(e) => setCmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Officer Name */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-600 uppercase">
                {language === 'ta' ? 'முதல்வர் சிறப்புச் செயலாளர் / தலைமை அதிகாரி' : 'Special Officer / Secretary Name'}
              </label>
              <input
                type="text"
                value={cmOfficerName}
                onChange={(e) => setCmOfficerName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>

            {passwordError && (
              <p className="text-xs text-red-600 font-bold">{passwordError}</p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
              >
                {language === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-red-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-yellow-300" />
                <span>{language === 'ta' ? 'முதல்வர் பிரிவாக உள்நுழைக' : 'Login as CM Cell Officer'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
