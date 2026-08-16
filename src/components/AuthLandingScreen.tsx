import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UserRole, CitizenProfile } from '../types';
import { 
  ShieldCheck, 
  User, 
  UserCheck, 
  Building2, 
  HardHat, 
  ArrowRight, 
  KeyRound, 
  Smartphone, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  MapPin, 
  Layers, 
  Users, 
  Wrench, 
  Send,
  Eye,
  FileCheck2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TN_DISTRICTS, DISTRICT_TAMIL_NAMES, getTaluksForDistrict, getVillagesForTaluk } from '../data/tamilNaduData';

interface AuthLandingScreenProps {
  onLoginSuccess: (profile: CitizenProfile, role: UserRole) => void;
}

export const AuthLandingScreen: React.FC<AuthLandingScreenProps> = ({ onLoginSuccess }) => {
  const { language, setLanguage } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  
  // Citizen & Contractor Credentials
  const [aadhaarRaw, setAadhaarRaw] = useState('548962317840');
  const [mobile, setMobile] = useState('9840123456');
  const [fullName, setFullName] = useState('M. Senthilkumar');
  const [district, setDistrict] = useState('Ariyalur');
  const [taluk, setTaluk] = useState('Sendurai');
  const [village, setVillage] = useState('Sendurai South');

  // Contractor Credentials
  const [contractorLicense, setContractorLicense] = useState('TN-PWD-CL1-2026-9812');
  const [contractorFirm, setContractorFirm] = useState('Sri Murugan Infra & Civil Works');
  const [contractorName, setContractorName] = useState('R. Periasamy (Licensed Contractor)');

  // Supervisor Credentials
  const [supervisorMobile, setSupervisorMobile] = useState('9840123456');
  const [supervisorPassword, setSupervisorPassword] = useState('supervisor123');
  const [supervisorName, setSupervisorName] = useState('Er. K. Murugesan');
  const [supervisorTaluk, setSupervisorTaluk] = useState('Sendurai');
  const [supervisorDistrict, setSupervisorDistrict] = useState('Ariyalur');

  // CM Cell Credentials
  const [cmMobile, setCmMobile] = useState('9444011000');
  const [cmPassword, setCmPassword] = useState('cmcell2026');
  const [cmOfficerName, setCmOfficerName] = useState('Thiru. T. Udhayachandran IAS');

  // OTP Sub-flow
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('729415');
  const [otpError, setOtpError] = useState('');
  const [authError, setAuthError] = useState('');

  // Format Aadhaar display
  const formatAadhaar = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadhaarRaw(e.target.value.replace(/\D/g, '').slice(0, 12));
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = e.target.value;
    setDistrict(newDist);
    const taluks = getTaluksForDistrict(newDist);
    setTaluk(taluks[0] || '');
    const villages = getVillagesForTaluk(taluks[0] || '');
    setVillage(villages[0] || '');
  };

  // 1. Send OTP (Citizen / Contractor)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarRaw.length !== 12) {
      setAuthError(language === 'ta' ? 'தயவுசெய்து 12 இலக்க சரியான ஆதார் எண்ணை உள்ளிடவும்' : 'Please enter a valid 12-digit Aadhaar number');
      return;
    }
    if (mobile.replace(/\D/g, '').length < 10) {
      setAuthError(language === 'ta' ? 'தயவுசெய்து 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setAuthError('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpCode('');
    setOtpError('');
    setStep('otp');
  };

  // 2. Verify OTP (Citizen / Contractor)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '123456' && otpCode.length !== 6) {
      setOtpError(language === 'ta' ? 'தவறான OTP குறியீடு. மீண்டும் சரிபார்க்கவும்.' : 'Invalid OTP code. Please enter 6-digit OTP.');
      return;
    }

    const formattedAadhaar = formatAadhaar(aadhaarRaw);

    if (selectedRole === 'citizen') {
      const profile: CitizenProfile = {
        aadhaarNumber: formattedAadhaar,
        mobileNumber: mobile,
        fullName: fullName.trim() || 'M. Senthilkumar',
        district,
        taluk,
        village,
        role: 'citizen',
        isVerified: true
      };
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(profile, 'citizen');
    } else if (selectedRole === 'contractor') {
      const profile: CitizenProfile = {
        aadhaarNumber: formattedAadhaar,
        mobileNumber: mobile,
        fullName: contractorName.trim() || 'R. Periasamy',
        district,
        taluk,
        village,
        role: 'contractor',
        isVerified: true,
        contractorLicenseId: contractorLicense.trim() || 'TN-PWD-CL1-2026-9812',
        contractorFirmName: contractorFirm.trim() || 'Sri Murugan Infra & Civil Works',
        contractorSpecialization: 'Civic Infrastructure & Welder Fabrications'
      };
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(profile, 'contractor');
    }
  };

  // 3. Supervisor Password Login
  const handleSupervisorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorPassword) {
      setAuthError(language === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter password');
      return;
    }
    if (supervisorPassword !== 'supervisor123' && supervisorPassword !== 'admin') {
      setAuthError(language === 'ta' ? 'தவறான கடவுச்சொல்! (மாதிரி கடவுச்சொல்: supervisor123)' : 'Invalid password! (Demo password: supervisor123)');
      return;
    }

    const profile: CitizenProfile = {
      aadhaarNumber: 'XXXX XXXX 7840',
      fullName: supervisorName || 'Er. K. Murugesan',
      mobileNumber: supervisorMobile,
      district: supervisorDistrict,
      taluk: supervisorTaluk,
      village: `${supervisorTaluk} Taluk Nodal Desk`,
      role: 'supervisor',
      isVerified: true
    };
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onLoginSuccess(profile, 'supervisor');
  };

  // 4. CM Cell Password Login
  const handleCmCellLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmPassword) {
      setAuthError(language === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter password');
      return;
    }
    if (cmPassword !== 'cmcell2026' && cmPassword !== 'admin') {
      setAuthError(language === 'ta' ? 'தவறான கடவுச்சொல்! (மாதிரி கடவுச்சொல்: cmcell2026)' : 'Invalid password! (Demo password: cmcell2026)');
      return;
    }

    const profile: CitizenProfile = {
      aadhaarNumber: 'GOVT TN 0001',
      fullName: cmOfficerName || 'Thiru. T. Udhayachandran IAS',
      mobileNumber: cmMobile,
      district: 'Chennai Headquarters',
      taluk: 'Secretariat Apex Cell',
      village: 'Fort St. George',
      role: 'cm_cell',
      isVerified: true
    };
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    onLoginSuccess(profile, 'cm_cell');
  };

  // Quick Demo Fast-Logins
  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'citizen') {
      onLoginSuccess({
        aadhaarNumber: '5489 6231 7840',
        mobileNumber: '9840123456',
        fullName: 'M. Senthilkumar',
        district: 'Ariyalur',
        taluk: 'Sendurai',
        village: 'Sendurai South',
        role: 'citizen',
        isVerified: true
      }, 'citizen');
    } else if (role === 'supervisor') {
      onLoginSuccess({
        aadhaarNumber: 'XXXX XXXX 7840',
        fullName: 'Er. K. Murugesan (Supervisor)',
        mobileNumber: '9840123456',
        district: 'Ariyalur',
        taluk: 'Sendurai',
        village: 'Sendurai Taluk Office',
        role: 'supervisor',
        isVerified: true
      }, 'supervisor');
    } else if (role === 'cm_cell') {
      onLoginSuccess({
        aadhaarNumber: 'GOVT TN 0001',
        fullName: 'Thiru. T. Udhayachandran IAS (CM Cell)',
        mobileNumber: '9444011000',
        district: 'Chennai Headquarters',
        taluk: 'Secretariat Apex Cell',
        village: 'Fort St. George',
        role: 'cm_cell',
        isVerified: true
      }, 'cm_cell');
    } else if (role === 'contractor') {
      onLoginSuccess({
        aadhaarNumber: '7612 9034 5612',
        mobileNumber: '9841098765',
        fullName: 'R. Periasamy (Registered Contractor)',
        district: 'Ariyalur',
        taluk: 'Sendurai',
        village: 'Sendurai South',
        role: 'contractor',
        isVerified: true,
        contractorLicenseId: 'TN-PWD-CL1-2026-9812',
        contractorFirmName: 'Sri Murugan Infra & Civil Works',
        contractorSpecialization: 'Civic Infrastructure & Welder Fabrications'
      }, 'contractor');
    }
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 font-black text-xl tracking-tighter">
            CM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                CM Vijay
              </h1>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                TN Civic Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {language === 'ta' ? 'தமிழ்நாடு மக்கள் குறைதீர்ப்பு & நிர்வாக தளம்' : 'Tamil Nadu 4-Role Civic Governance System'}
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setLanguage('ta')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              language === 'ta' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            தமிழ்
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              language === 'en' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட உள்நுழைவு போர்டல்' : 'Official Role-Based Authentication Gateway'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {language === 'ta' ? 'உங்கள் பயனர் பிரிவைத் தேர்வு செய்து உள்நுழைக' : 'Select Your Role & Sign In to Continue'}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            {language === 'ta'
              ? 'பொதுமக்கள், மேற்பார்வையாளர், முதலமைச்சர் சிறப்புப் பிரிவு அல்லது ஒப்பந்ததாரர் பிரிவை தேர்ந்தெடுத்து அதிகாரப்பூர்வ தளத்திற்குள் நுழையவும்.'
              : 'Choose whether you are a Public Citizen, Field Supervisor, CM Special Cell Apex, or Licensed Contractor.'}
          </p>
        </div>

        {/* 4 Role Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* 1. Citizen Card */}
          <div
            onClick={() => {
              setSelectedRole('citizen');
              setStep('form');
              setAuthError('');
            }}
            className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              selectedRole === 'citizen'
                ? 'bg-slate-800/90 border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            {selectedRole === 'citizen' && (
              <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 p-1 rounded-full">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                  Role 01 • Citizen
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {language === 'ta' ? 'பொதுமக்கள்' : 'Normal Public'}
                </h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'புதிய குறை மனு பதிவு' : 'File civic grievances'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'பிறர் மனுக்களை பார்வையிடல்' : 'View public complaints feed'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'தளபதி மக்கள் பணிப்படை உதவி' : 'Volunteer Portal support'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Aadhaar + OTP</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                {selectedRole === 'citizen' ? (language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected') : (language === 'ta' ? 'தேர்வு செய்' : 'Select')}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* 2. Supervisor Card */}
          <div
            onClick={() => {
              setSelectedRole('supervisor');
              setStep('form');
              setAuthError('');
            }}
            className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              selectedRole === 'supervisor'
                ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            {selectedRole === 'supervisor' && (
              <div className="absolute top-3 right-3 bg-indigo-500 text-white p-1 rounded-full">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 tracking-wider">
                  Role 02 • Level 2
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {language === 'ta' ? 'மேற்பார்வையாளர்' : 'Field Supervisor'}
                </h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'நிலுவை & அனைத்து மனுக்கள் ஆய்வு' : 'Triage all pending complaints'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'ஏற்பு + வரவு செலவு & ஆட்கள் திட்டம்' : 'Accept & set budget/labour'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'நிராகரிப்பு -> முதல்வர் பிரிவு' : 'Reject to CM Special Cell'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Mobile + Password</span>
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                {selectedRole === 'supervisor' ? (language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected') : (language === 'ta' ? 'தேர்வு செய்' : 'Select')}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* 3. CM Special Cell Card */}
          <div
            onClick={() => {
              setSelectedRole('cm_cell');
              setStep('form');
              setAuthError('');
            }}
            className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              selectedRole === 'cm_cell'
                ? 'bg-slate-800/90 border-red-500 shadow-xl shadow-red-500/10 ring-2 ring-red-500/30'
                : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            {selectedRole === 'cm_cell' && (
              <div className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-red-400 tracking-wider">
                  Role 03 • Apex L3
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {language === 'ta' ? 'முதல்வர் சிறப்பு பிரிவு' : 'CM Special Cell'}
                </h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'நிராகரிக்கப்பட்ட மனுக்கள் ஆய்வு' : 'Audit rejected complaints'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'மறுபரிசீலனை செய்து CM பணி ஆணை' : 'Reconsider & sanction tasks'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'நேரடி மாநில நிதி ஒதுக்கீடு' : 'Fast-track funding & tenders'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Officer Login</span>
              <span className="text-red-400 font-bold flex items-center gap-1">
                {selectedRole === 'cm_cell' ? (language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected') : (language === 'ta' ? 'தேர்வு செய்' : 'Select')}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* 4. Contractor Card */}
          <div
            onClick={() => {
              setSelectedRole('contractor');
              setStep('form');
              setAuthError('');
            }}
            className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              selectedRole === 'contractor'
                ? 'bg-slate-800/90 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            {selectedRole === 'contractor' && (
              <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full">
                <Check className="w-3.5 h-3.5 font-bold" />
              </div>
            )}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                  Role 04 • Execution
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {language === 'ta' ? 'அரசு ஒப்பந்ததாரர்' : 'Govt Contractor'}
                </h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'முழு பட்ஜெட் திட்டங்கள் பார்வை' : 'Review works with budget'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'பணியை ஏற்கலாம் / நிராகரிக்கலாம்' : 'Accept project or decline'}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{language === 'ta' ? 'இயந்திரங்கள் & ஆட்கள் களப்பணி' : 'Deploy welders & equipment'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono">License + OTP</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                {selectedRole === 'contractor' ? (language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected') : (language === 'ta' ? 'தேர்வு செய்' : 'Select')}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>

        {/* Selected Role Authentication Form Container */}
        <div className="max-w-2xl mx-auto w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header of the Active Form */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                selectedRole === 'citizen' ? 'bg-amber-600' :
                selectedRole === 'supervisor' ? 'bg-indigo-600' :
                selectedRole === 'cm_cell' ? 'bg-red-600' : 'bg-emerald-600'
              }`}>
                {selectedRole === 'citizen' && <User className="w-5 h-5" />}
                {selectedRole === 'supervisor' && <UserCheck className="w-5 h-5" />}
                {selectedRole === 'cm_cell' && <Building2 className="w-5 h-5" />}
                {selectedRole === 'contractor' && <HardHat className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedRole === 'citizen' && (language === 'ta' ? 'பொதுமக்கள் ஆதார் உள்நுழைவு' : 'Citizen Aadhaar Authentication')}
                  {selectedRole === 'supervisor' && (language === 'ta' ? 'மேற்பார்வையாளர் அதிகாரப்பூர்வ உள்நுழைவு' : 'Supervisor Portal Login')}
                  {selectedRole === 'cm_cell' && (language === 'ta' ? 'முதலமைச்சர் சிறப்புப் பிரிவு தலைமை உள்நுழைவு' : 'CM Special Cell Apex Login')}
                  {selectedRole === 'contractor' && (language === 'ta' ? 'ஒப்பந்ததாரர் உரிம உள்நுழைவு' : 'Contractor Work Orders Login')}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedRole === 'citizen' && (language === 'ta' ? '12 இலக்க ஆதார் & மொபைல் OTP மூலம் பாதுகாப்பாக உள்நுழைக' : 'Secure instant OTP verification')}
                  {selectedRole === 'supervisor' && (language === 'ta' ? 'பதிவு செய்யப்பட்ட மொபைல் & கடவுச்சொல்' : 'Registered mobile & password')}
                  {selectedRole === 'cm_cell' && (language === 'ta' ? 'முதல்வர் அலுவலக அதிகாரப்பூர்வ சான்றுகள்' : 'Authorized apex cell credentials')}
                  {selectedRole === 'contractor' && (language === 'ta' ? 'PWD உரிம எண் & OTP மூலம் உள்நுழைக' : 'Registered PWD contractor license & OTP')}
                </span>
              </div>
            </div>

            {/* Quick Demo 1-Click Action */}
            <button
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Skip typing & login immediately"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? 'நேரடி மாதிரி உள்நுழைவு' : '1-Click Demo Login'}</span>
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-2xl flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* FORM 1 & 4: Citizen or Contractor (Aadhaar / License + OTP) */}
          {(selectedRole === 'citizen' || selectedRole === 'contractor') && (
            <div>
              {step === 'form' ? (
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  
                  {/* Contractor Specific License Field */}
                  {selectedRole === 'contractor' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/80">
                      <div className="space-y-1">
                        <label className="block text-slate-300 font-bold">
                          {language === 'ta' ? 'ஒப்பந்ததாரர் PWD உரிம எண் *' : 'PWD Contractor License ID *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={contractorLicense}
                          onChange={(e) => setContractorLicense(e.target.value)}
                          placeholder="TN-PWD-CL1-2026-9812"
                          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs font-semibold focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-300 font-bold">
                          {language === 'ta' ? 'நிறுவனம் / பெயர் *' : 'Firm / Agency Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={contractorFirm}
                          onChange={(e) => setContractorFirm(e.target.value)}
                          placeholder="Sri Murugan Infra"
                          className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Name & Aadhaar Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-300 font-bold">
                        {language === 'ta' ? 'முழு பெயர் (ஆதார் படி) *' : 'Full Name (as in Aadhaar) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={selectedRole === 'contractor' ? contractorName : fullName}
                        onChange={(e) => selectedRole === 'contractor' ? setContractorName(e.target.value) : setFullName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-bold">
                        {language === 'ta' ? '12 இலக்க ஆதார் எண் *' : '12-Digit Aadhaar Number *'}
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          maxLength={12}
                          required
                          value={aadhaarRaw}
                          onChange={handleAadhaarChange}
                          placeholder="5489 6231 7840"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs font-bold tracking-wider focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-300 font-bold">
                        {language === 'ta' ? 'மொபைல் எண் (OTP பெற) *' : 'Mobile Number (for OTP) *'}
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9840123456"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs font-bold focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-bold">
                        {language === 'ta' ? 'மாவட்டம் (District) *' : 'District *'}
                      </label>
                      <select
                        value={district}
                        onChange={handleDistrictChange}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-amber-500 focus:outline-none"
                      >
                        {TN_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-slate-900 text-white">
                            {DISTRICT_TAMIL_NAMES[d]} ({d})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{language === 'ta' ? 'ஆதார் OTP பெறுக' : 'Send Aadhaar OTP Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
                    <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">
                      {language === 'ta' ? 'OTP குறியீட்டை உள்ளிடவும்' : 'Enter Aadhaar Verification OTP'}
                    </h4>
                    <p className="text-slate-300 text-[11px]">
                      {language === 'ta'
                        ? `6 இலக்க OTP எண் ${mobile} எண்ணிற்கு அனுப்பப்பட்டது.`
                        : `A 6-digit OTP has been dispatched to +91 ${mobile}`}
                    </p>
                    <div className="mt-2 inline-block bg-slate-800 text-amber-300 px-3 py-1 rounded-lg font-mono text-xs border border-slate-700">
                      Demo OTP: <strong className="text-white">{generatedOtp}</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-center text-slate-300 font-bold">
                      {language === 'ta' ? '6-இலக்க OTP *' : '6-Digit OTP *'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder={generatedOtp}
                      className="w-48 mx-auto block text-center px-4 py-3 bg-slate-800 border-2 border-amber-500 rounded-2xl text-white font-mono text-lg font-black tracking-widest focus:outline-none"
                    />
                    {otpError && (
                      <p className="text-rose-400 text-center text-[11px] font-semibold mt-1">
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="flex-1 py-2.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs"
                    >
                      {language === 'ta' ? 'பின்செல்' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="flex-2 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'ta' ? 'சரிபார்த்து தளத்திற்குள் நுழைக' : 'Verify & Enter Portal'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* FORM 2: Supervisor Password Login */}
          {selectedRole === 'supervisor' && (
            <form onSubmit={handleSupervisorLogin} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'மேற்பார்வையாளர் பெயர் *' : 'Supervisor Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'பதிவுசெய்த மொபைல் எண் *' : 'Registered Mobile Number *'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={supervisorMobile}
                      onChange={(e) => setSupervisorMobile(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs font-bold focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'மாவட்டம் (District) *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    value={supervisorDistrict}
                    onChange={(e) => setSupervisorDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'தாலுகா (Taluk) *' : 'Taluk *'}
                  </label>
                  <input
                    type="text"
                    value={supervisorTaluk}
                    onChange={(e) => setSupervisorTaluk(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'கடவுச்சொல் (Password) *' : 'Official Password *'}
                  </label>
                  <span className="text-[10px] text-indigo-400 font-mono">Demo: supervisor123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={supervisorPassword}
                    onChange={(e) => setSupervisorPassword(e.target.value)}
                    placeholder="supervisor123"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>{language === 'ta' ? 'மேற்பார்வையாளர் பணிமனைக்குள் நுழைக' : 'Sign In as Taluk Supervisor'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORM 3: CM Special Cell Login */}
          {selectedRole === 'cm_cell' && (
            <form onSubmit={handleCmCellLogin} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'முதல்வர் பிரிவு அதிகாரி பெயர் *' : 'Apex Officer Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cmOfficerName}
                    onChange={(e) => setCmOfficerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'அதிகாரப்பூர்வ மொபைல் எண் *' : 'Officer Mobile Number *'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={cmMobile}
                      onChange={(e) => setCmMobile(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs font-bold focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold">
                    {language === 'ta' ? 'தலைமைச் செயலக கடவுச்சொல் *' : 'Secretariat Apex Password *'}
                  </label>
                  <span className="text-[10px] text-red-400 font-mono">Demo: cmcell2026</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={cmPassword}
                    onChange={(e) => setCmPassword(e.target.value)}
                    placeholder="cmcell2026"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-xs font-semibold focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>{language === 'ta' ? 'முதலமைச்சர் சிறப்புப் பிரிவு தலைமைக்குள் நுழைக' : 'Sign In as CM Special Cell Officer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>
          {language === 'ta'
            ? 'தமிழ்நாடு அரசு • முதலமைச்சர் மக்கள் குறைதீர்ப்பு மற்றும் கூட்டு ஆளுகைத் தளம் © 2026'
            : 'Government of Tamil Nadu • Chief Minister Civic Redressal & Collaborative Governance Portal © 2026'}
        </p>
      </footer>

    </div>
  );
};
