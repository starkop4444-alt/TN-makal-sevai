import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    ta: string;
    en: string;
  };
}

export const UI_TEXT: Translations = {
  portalTitle: {
    ta: 'தமிழ்நாடு மக்கள் சேவை',
    en: 'TN Makkal Sevai'
  },
  portalSubtitle: {
    ta: 'தளபதி விஜய் மக்கள் குறைதீர்ப்பு & சமூகம்சார் மக்கள் இயக்கம்',
    en: 'Citizen Grievance Redressal & Community Action Portal'
  },
  tagline: {
    ta: 'மக்களுக்காக, மக்களுடன் ஒரு வெளிப்படையான மக்களாட்சி!',
    en: 'Transparent, accountable grassroots civic governance for Tamil Nadu'
  },
  filePetition: {
    ta: '+ புதிய மனு பதிவு செய்',
    en: '+ File New Grievance'
  },
  trackPetition: {
    ta: 'மனுவின் நிலை அறிதல்',
    en: 'Track Status'
  },
  exploreIssues: {
    ta: 'பொது மக்கள் பிரச்சனைகள்',
    en: 'Community Feed'
  },
  districtAnalytics: {
    ta: '38 மாவட்ட பகுப்பாய்வு',
    en: 'District Analytics'
  },
  welfareSchemes: {
    ta: 'நலத்திட்டங்கள்',
    en: 'Welfare Schemes'
  },
  volunteerPadai: {
    ta: 'தளபதி மக்கள் பணிப்படை',
    en: 'Volunteer Action'
  },
  citizenPolls: {
    ta: 'மக்கள் குரல் & கருத்துக்கணிப்பு',
    en: 'Citizen Polls'
  },
  aiAssistant: {
    ta: 'மக்கள் சேவகர் AI',
    en: 'Makkal AI Assistant'
  },
  helplines: {
    ta: 'அவசர உதவி எண்கள்',
    en: 'Emergency Helplines'
  },
  searchPlaceholder: {
    ta: 'மனு எண் (எ.கா: TN-GRV-2026-8492) அல்லது தொலைபேசி எண் கொண்டு தேடுங்கள்...',
    en: 'Search by Petition Token (e.g. TN-GRV-2026-8492) or Mobile...'
  },
  allDistricts: {
    ta: 'அனைத்து மாவட்டங்களும்',
    en: 'All 38 Districts'
  },
  filterCategory: {
    ta: 'துறை வாரியாக',
    en: 'Filter by Category'
  },
  filterStatus: {
    ta: 'நிலை வாரியாக',
    en: 'Filter by Status'
  },
  urgency: {
    ta: 'அவசர நிலை',
    en: 'Urgency'
  },
  upvotes: {
    ta: 'ஆதரவு / நானும் பாதிக்கப்பட்டவன்',
    en: 'Endorsements / Me Too'
  },
  assignedTo: {
    ta: 'ஒதுக்கப்பட்ட துறை & அலுவலர்',
    en: 'Assigned Department & Nodal Officer'
  },
  viewDetails: {
    ta: 'முழு விவரம் பார்க்க',
    en: 'View Details'
  },
  downloadPetition: {
    ta: 'அரசு மாதிரி மனு பதிவிறக்கு (PDF/Print)',
    en: 'Generate Official Petition Letter'
  },
  close: {
    ta: 'மூடுக',
    en: 'Close'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tn_portal_lang');
    return (saved as Language) || 'ta';
  });

  useEffect(() => {
    localStorage.setItem('tn_portal_lang', language);
  }, [language]);

  const t = (key: string): string => {
    if (UI_TEXT[key]) {
      return UI_TEXT[key][language] || UI_TEXT[key]['en'] || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
