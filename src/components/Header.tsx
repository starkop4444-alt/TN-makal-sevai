import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CitizenProfile, NavigationTab, UserRole } from '../types';
import { 
  FileText, 
  Search, 
  Layers, 
  Award, 
  Users, 
  Bot, 
  PhoneCall, 
  MapPin, 
  Languages,
  PlusCircle,
  AlertCircle,
  ShieldCheck,
  Building2,
  Cpu,
  UserCheck,
  KeyRound,
  HardHat,
  LogOut,
  Bell
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab?: (tab: NavigationTab) => void;
  onSelectTab?: (tab: NavigationTab) => void;
  selectedDistrict?: string;
  setSelectedDistrict?: (district: string) => void;
  onOpenNewGrievance: () => void;
  onOpenAiAssistant?: () => void;
  onOpenHelplines?: () => void;
  onOpenAadhaarAuth?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  onLogout?: () => void;
  onChangeRole?: (role: UserRole) => void;
  currentProfile?: CitizenProfile | null;
  currentRole?: UserRole;
  pendingSupervisorCount?: number;
  pendingCMCellCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  selectedDistrict,
  setSelectedDistrict,
  onOpenNewGrievance,
  onOpenAiAssistant,
  onOpenHelplines,
  onOpenAadhaarAuth,
  onOpenNotifications,
  unreadNotificationCount = 0,
  onLogout,
  onChangeRole,
  currentProfile,
  currentRole = 'citizen',
  pendingSupervisorCount = 0,
  pendingCMCellCount = 0,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleTabChange = (tabId: NavigationTab) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    } else if (typeof onSelectTab === 'function') {
      onSelectTab(tabId);
    }
  };

  // Determine navigation items strictly based on active user role
  let navItems: Array<{
    id: NavigationTab;
    labelTa: string;
    labelEn: string;
    icon: any;
    badge?: number | string;
    badgeColor?: string;
  }> = [];

  if (currentRole === 'citizen') {
    navItems = [
      { id: 'feed', labelTa: 'மக்கள் மனுக்கள்', labelEn: 'Public Grievances', icon: Layers },
      { id: 'track', labelTa: 'மனு நிலை & கண்காணிப்பு', labelEn: 'Track Petition', icon: Search },
      { id: 'volunteers', labelTa: 'தளபதி மக்கள் பணிப்படை', labelEn: 'Volunteer Padai', icon: Users },
    ];
  } else if (currentRole === 'supervisor') {
    navItems = [
      { 
        id: 'supervisor', 
        labelTa: 'நிலை 2: மேற்பார்வையாளர் ஆய்வு', 
        labelEn: 'L2: Supervisor Desk', 
        icon: UserCheck,
        badge: pendingSupervisorCount > 0 ? pendingSupervisorCount : undefined,
        badgeColor: 'bg-indigo-600 text-white'
      },
      { id: 'volunteers', labelTa: 'தளபதி மக்கள் பணிப்படை', labelEn: 'Volunteer Mobilization', icon: Users },
      { id: 'feed', labelTa: 'அனைத்து மனுக்கள்', labelEn: 'All Grievances', icon: Layers },
    ];
  } else if (currentRole === 'cm_cell') {
    navItems = [
      { 
        id: 'cm_cell', 
        labelTa: 'நிலை 3: முதலமைச்சர் சிறப்புப் பிரிவு', 
        labelEn: 'L3: CM Special Cell', 
        icon: Building2,
        badge: pendingCMCellCount > 0 ? pendingCMCellCount : undefined,
        badgeColor: 'bg-red-600 text-white'
      },
      { id: 'feed', labelTa: 'மனுக்கள் தணிக்கை', labelEn: 'Petitions Audit', icon: Layers },
    ];
  } else if (currentRole === 'contractor') {
    navItems = [
      { 
        id: 'contractor', 
        labelTa: 'ஒப்பந்ததாரர் பணிமனை', 
        labelEn: 'Contractor Work Orders', 
        icon: HardHat 
      },
      { id: 'volunteers', labelTa: 'தளபதி மக்கள் பணிப்படை', labelEn: 'Civic Works Mobilization', icon: Users },
      { id: 'feed', labelTa: 'பொது மனுக்கள்', labelEn: 'Public Grievances', icon: Layers },
    ];
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Emergency Helplines Marquee and Tamil Nadu Emblem / Identity */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              CM Vijay 3-Tier Redressal
            </span>
            <span className="hidden md:inline text-slate-300">
              {language === 'ta' 
                ? 'தமிழ்நாடு அனைத்து 38 மாவட்டங்களுக்கான ஆதார் அடிப்படையிலான AI சரிபார்ப்பு & முதல்வர் நேரடி பணி ஆணை தளம்'
                : 'Tamil Nadu 38-District Aadhaar-Verified AI Triage, Supervisor Review & CM Direct Work Order System'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenHelplines}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors font-medium cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? 'அவசர உதவி: 108 / 1100' : 'Helpline: 108 / 1100'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 font-medium transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'ta' ? 'AI மக்கள் சேவகர்' : 'AI Sevai Sahayak'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => handleTabChange('feed')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 font-black text-xl tracking-tighter">
              <span className="text-amber-100">CM</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                  CM Vijay
                </h1>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {language === 'ta' ? 'தமிழ்நாடு மக்கள் குறைதீர்ப்பு' : 'TN Civic Redressal'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {language === 'ta' 
                  ? 'ஆதார் பதிவு • AI சரிபார்ப்பு • மேற்பார்வையாளர் • முதல்வர் சிறப்பு பிரிவு'
                  : 'Aadhaar Auth • AI Level 1 • Supervisor L2 • CM Cell L3 Task Desk'}
              </p>
            </div>
          </div>

          {/* Quick Action CTA, Role Switcher & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role & Aadhaar Profile Card Button */}
            <button
              onClick={onOpenAadhaarAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 transition-all text-xs font-semibold text-slate-800 shadow-xs cursor-pointer group"
              title="Aadhaar Verification & Role Switcher"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                {currentRole === 'cm_cell' ? 'CM' : currentRole === 'supervisor' ? 'SV' : currentRole === 'contractor' ? 'CT' : 'AZ'}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-[11px] font-bold block leading-none text-slate-900">
                  {currentProfile?.fullName || (currentRole === 'contractor' ? 'R. Periasamy' : 'M. Senthilkumar')}
                </span>
                <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                  {currentRole === 'cm_cell' 
                    ? (language === 'ta' ? 'முதல்வர் சிறப்பு பிரிவு' : 'CM Cell Apex')
                    : currentRole === 'supervisor'
                    ? (language === 'ta' ? 'தாலுகா மேற்பார்வையாளர்' : 'Taluk Supervisor')
                    : currentRole === 'contractor'
                    ? (language === 'ta' ? 'அரசு ஒப்பந்ததாரர்' : 'Govt Contractor')
                    : (language === 'ta' ? 'பொதுமக்கள் (ஆதார்)' : 'Citizen (Verified)')}
                </span>
              </div>
            </button>

            {/* Location & Role Notification Bell Button */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/60 transition-all text-slate-700 hover:text-amber-800 cursor-pointer shadow-xs"
                title={language === 'ta' ? 'அறிவிப்புகள் மையம் (இடஅமைவு அடிப்படையில்)' : 'Location & Role Notifications'}
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center animate-bounce shadow-xs">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Language Switcher Button */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'ta'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Logout / Switch Role Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-xl border border-slate-200 hover:border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title={language === 'ta' ? 'வெளியேறு / கணக்கு மாற்று' : 'Logout / Switch Role'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ta' ? 'வெளியேறு' : 'Switch Role'}</span>
              </button>
            )}

            {/* File New Grievance Button */}
            <button
              onClick={onOpenNewGrievance}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-200" />
              <span>{language === 'ta' ? 'புதிய மனு பதிவு' : 'Report Issue'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 text-xs sm:text-sm">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer text-xs sm:text-sm ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{language === 'ta' ? tab.labelTa : tab.labelEn}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${tab.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

