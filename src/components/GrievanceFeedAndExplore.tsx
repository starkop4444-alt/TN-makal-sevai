import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Grievance, GrievanceCategory, GrievanceStatus } from '../types';
import { TN_DISTRICTS, DISTRICT_TAMIL_NAMES, CATEGORY_TAMIL_MAP } from '../data/tamilNaduData';
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  Clock, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Share2, 
  PlusCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

interface GrievanceFeedAndExploreProps {
  grievances: Grievance[];
  onUpvoteGrievance: (id: string) => void;
  onSelectGrievance: (grievance: Grievance) => void;
  onOpenNewGrievance: () => void;
  onOpenPetitionLetter: (grievance: Grievance) => void;
}

export const GrievanceFeedAndExplore: React.FC<GrievanceFeedAndExploreProps> = ({
  grievances,
  onUpvoteGrievance,
  onSelectGrievance,
  onOpenNewGrievance,
  onOpenPetitionLetter,
}) => {
  const { language, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent' | 'urgency'>('upvotes');

  // Filter logic
  const filteredGrievances = grievances.filter((g) => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = selectedDistrict === 'All' || g.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || g.status === selectedStatus;

    return matchesSearch && matchesDistrict && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
    if (sortBy === 'urgency') return b.urgencyScore - a.urgencyScore;
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  const totalCount = grievances.length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress' || g.status === 'Field Inspection').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Stats & Citizen Action Header */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-black/20 text-amber-100 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            {language === 'ta' ? 'தமிழ்நாடு மக்கள் குறைதீர்ப்பு & சமூகம்சார் இயக்கம்' : 'Tamil Nadu Grassroots Citizen Action Engine'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ta'
              ? 'உங்கள் பகுதி பிரச்சனைகளை பதிவு செய்து உடனடி தீர்வு காணுங்கள்'
              : 'Empowering Citizens with Direct Civic Accountability & Speed'}
          </h2>

          <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed">
            {language === 'ta'
              ? 'குடிநீர், சாலை, மின்சாரம், சுகாதாரம், பள்ளி மற்றும் விவசாய கோரிக்கைகளை பதிவு செய்து, அதிகாரிகள் நடவடிக்கைகளை நேரடியாக கண்காணிக்கலாம்.'
              : 'File public grievances, endorse neighborhood issues to accelerate priority, and monitor nodal officer field resolutions in real time.'}
          </p>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenNewGrievance}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>{t('filePetition')}</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">38</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'மாவட்டங்கள்' : 'TN Districts'}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">91.4%</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'தீர்வு விகிதம்' : 'Resolution Rate'}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">3.8 {language === 'ta' ? 'நாட்கள்' : 'Days'}</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'சராசரி தீர்வு காலம்' : 'Avg SLA Turnaround'}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">14,200+</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'செயல்வீரர்கள்' : 'Active Volunteers'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ta' ? 'மனு தலைப்பு, விபரம் அல்லது ஊர் பெயர் கொண்டு தேடுங்கள்...' : 'Search grievances, keywords, or locality...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">{language === 'ta' ? 'வரிசைப்படுத்து:' : 'Sort By:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
            >
              <option value="upvotes">{language === 'ta' ? 'அதிக ஆதரவு பெற்றவை (Upvotes)' : 'Most Endorsed (Me Too)'}</option>
              <option value="urgency">{language === 'ta' ? 'அவசர நிலை (Urgency Score)' : 'Highest Urgency'}</option>
              <option value="recent">{language === 'ta' ? 'சமீபத்தியவை (Recent)' : 'Most Recent'}</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {language === 'ta' ? 'மாவட்டம்' : 'District'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
            >
              <option value="All">{language === 'ta' ? 'அனைத்து மாவட்டங்களும்' : 'All 38 Districts'}</option>
              {TN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist} ({DISTRICT_TAMIL_NAMES[dist] || dist})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {language === 'ta' ? 'துறை வகை' : 'Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
            >
              <option value="All">{language === 'ta' ? 'அனைத்து துறைகளும்' : 'All Categories'}</option>
              {Object.entries(CATEGORY_TAMIL_MAP).map(([key, val]) => (
                <option key={key} value={key}>
                  {language === 'ta' ? val : key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {language === 'ta' ? 'நடவடிக்கை நிலை' : 'Status'}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
            >
              <option value="All">{language === 'ta' ? 'அனைத்து நிலைகளும்' : 'All Statuses'}</option>
              <option value="Submitted">{language === 'ta' ? 'மனு பெறப்பட்டது' : 'Submitted'}</option>
              <option value="Officer Assigned">{language === 'ta' ? 'அலுவலர் நியமனம்' : 'Officer Assigned'}</option>
              <option value="Field Inspection">{language === 'ta' ? 'கள ஆய்வு' : 'Field Inspection'}</option>
              <option value="In Progress">{language === 'ta' ? 'பணி நடைபெறுகிறது' : 'In Progress'}</option>
              <option value="Resolved">{language === 'ta' ? 'தீர்வு காணப்பட்டது' : 'Resolved'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievance Feed Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{language === 'ta' ? 'மக்கள் மனுக்கள்' : 'Citizen Grievances'}</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {filteredGrievances.length}
            </span>
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'ta' ? 'அதிக ஆதரவு பெற்ற மனுக்களுக்கு முன்னுரிமை வழங்கப்படும்' : 'High endorsement petitions escalated with top priority'}
          </span>
        </div>

        {filteredGrievances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGrievances.map((grievance) => {
              const isResolved = grievance.status === 'Resolved';
              return (
                <div
                  key={grievance.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Token ID, Category, Urgency */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {grievance.id}
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-indigo-100">
                          {language === 'ta' ? grievance.categoryTamil : grievance.category}
                        </span>
                      </div>

                      {/* Status badge */}
                      <div>
                        {isResolved ? (
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            ✓ {language === 'ta' ? 'தீர்வு' : 'Resolved'}
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                            ⚡ {grievance.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                      {grievance.title}
                    </h4>

                    {/* Location and Ward Tag */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-semibold text-slate-700">{grievance.district}</span>
                      <span>•</span>
                      <span>{grievance.ward}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {grievance.description}
                    </p>

                    {/* Photo preview thumbnail if exists */}
                    {grievance.images && grievance.images.length > 0 && (
                      <div className="h-28 rounded-xl overflow-hidden border border-slate-100">
                        <img src={grievance.images[0]} alt="Grievance evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}

                    {/* Department allocation info */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] flex items-center justify-between text-slate-700">
                      <span className="font-medium text-slate-500">{language === 'ta' ? 'துறை:' : 'Dept:'}</span>
                      <span className="font-semibold truncate max-w-[220px]">
                        {language === 'ta' ? grievance.assignedDepartmentTamil : grievance.assignedDepartment}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    {/* "Me Too / Upvote" Button */}
                    <button
                      onClick={() => onUpvoteGrievance(grievance.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        grievance.hasUpvoted
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${grievance.hasUpvoted ? 'fill-amber-600 text-amber-600' : ''}`} />
                      <span>{language === 'ta' ? 'நானும் பாதிக்கப்பட்டுள்ளேன்' : 'Me Too'}</span>
                      <span className="ml-1 bg-white px-1.5 py-0.2 rounded-full text-[10px]">
                        {grievance.upvotes}
                      </span>
                    </button>

                    {/* View Details & Track buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenPetitionLetter(grievance)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title={language === 'ta' ? 'அரசு மாதிரி மனு கடிதம்' : 'Official Petition Format'}
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectGrievance(grievance)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{language === 'ta' ? 'கண்காணிக்க' : 'Track'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 space-y-3 border border-slate-200">
            <Search className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="text-base font-bold text-slate-700">
              {language === 'ta' ? 'பொருத்தமான மனுக்கள் எதுவும் காணப்படவில்லை' : 'No matching grievances found'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'ta' ? 'வடிப்பான்களை மாற்றி மீண்டும் முயற்சிக்கவும் அல்லது புதிய மனு பதிவு செய்யவும்.' : 'Try adjusting search or category filters.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
