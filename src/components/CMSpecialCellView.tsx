import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Grievance, CMCellTask, CitizenProfile } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  FileCheck2, 
  Zap, 
  Clock, 
  IndianRupee, 
  HardHat, 
  Phone, 
  Printer, 
  Eye, 
  Search, 
  AlertOctagon,
  ArrowUpRight,
  Send,
  SlidersHorizontal,
  Layers,
  Flame,
  Award,
  RotateCcw,
  Ban,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CMSpecialCellViewProps {
  grievances: Grievance[];
  onGenerateCMTask: (
    grievanceId: string, 
    taskDetails: {
      taskTitle: string;
      taskTitleTamil: string;
      sanctionedBudget: string;
      assignedContractor: string;
      contractorPhone: string;
      departmentName: string;
      departmentNameTamil: string;
      targetDeadline: string;
      priority: 'Critical Emergency' | 'High Priority' | 'Standard Directive';
      reviewNotesTamil: string;
      reviewNotesEnglish: string;
    }
  ) => void;
  onCMUpholdRejection?: (grievanceId: string, rejectionReason: string) => void;
  onOpenGrievanceDetail: (grievance: Grievance) => void;
  onOpenSanctionOrder: (grievance: Grievance) => void;
  currentProfile: CitizenProfile | null;
}

export const CMSpecialCellView: React.FC<CMSpecialCellViewProps> = ({
  grievances,
  onGenerateCMTask,
  onCMUpholdRejection,
  onOpenGrievanceDetail,
  onOpenSanctionOrder,
  currentProfile,
}) => {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'pending' | 'rejected_by_sup' | 'sanctioned_tasks' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  // Uphold Rejection Modal State
  const [rejectionModalGrievance, setRejectionModalGrievance] = useState<Grievance | null>(null);
  const [cmRejectionReason, setCmRejectionReason] = useState(
    'மேற்பார்வையாளர் சமர்ப்பித்த கள ஆய்வு அறிக்கை மற்றும் ஆவணங்களை முதலமைச்சர் சிறப்பு பிரிவு முழுமையாக பரிசீலித்தது. இது தனியார் சொத்து விவகாரம் / சட்ட வரம்பிற்கு அப்பாற்பட்டது என உறுதி செய்யப்பட்டு இறுதி தள்ளுபடி செய்யப்படுகிறது.'
  );

  // CM Task Generation Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTitleTamil, setTaskTitleTamil] = useState('');
  const [sanctionedBudget, setSanctionedBudget] = useState('₹4,50,000');
  const [assignedContractor, setAssignedContractor] = useState('Tamil Nadu Water Supply & Infra Rapid Wing (TWAD)');
  const [contractorPhone, setContractorPhone] = useState('9443312345');
  const [departmentName, setDepartmentName] = useState('CM Special Action Task Force');
  const [departmentNameTamil, setDepartmentNameTamil] = useState('முதலமைச்சர் சிறப்பு செயல் திட்டம்');
  const [targetDeadline, setTargetDeadline] = useState('48 Hours (Direct CM Directive)');
  const [priority, setPriority] = useState<'Critical Emergency' | 'High Priority' | 'Standard Directive'>('Critical Emergency');
  const [reviewNotesTamil, setReviewNotesTamil] = useState('');
  const [reviewNotesEnglish, setReviewNotesEnglish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter grievances for CM Cell Apex Desk
  const cmGrievances = grievances.filter((g) => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.taluk.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'pending') {
      return (
        (g.supervisorReview?.decision === 'approved' && !g.cmCellReview?.generatedTask) ||
        g.status === 'CM Cell Review' ||
        (g.status === 'Submitted' && g.urgency === 'Critical')
      );
    }
    if (activeTab === 'rejected_by_sup') {
      // Supervisor rejected petitions requiring mandatory CM re-review (Reject or Reconsider)
      return (
        g.supervisorReview?.decision === 'rejected' || 
        g.status === 'Rejected by Supervisor' || 
        g.status === 'Rejected by CM Cell'
      );
    }
    if (activeTab === 'sanctioned_tasks') {
      return g.cmCellReview?.decision === 'task_generated' || g.status === 'CM Task Sanctioned';
    }
    return true;
  });

  const handleOpenTaskModal = (g: Grievance, isOverride: boolean = false) => {
    setSelectedGrievance(g);
    setTaskTitle(`Rapid Civic Rectification: ${g.title}`);
    setTaskTitleTamil(`உடனடி மக்கள் நலப் பணி: ${g.title}`);
    setDepartmentName(g.assignedDepartment || 'Municipal Administration & Water Supply Dept');
    setDepartmentNameTamil(g.assignedDepartmentTamil || 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை');

    if (g.category === 'Water Supply & Drainage') {
      setSanctionedBudget('₹3,50,000');
      setAssignedContractor('TWAD Board Fast-Track Emergency Pipeline Wing');
      setContractorPhone('9443188990');
    } else if (g.category === 'Roads & Traffic Infrastructure') {
      setSanctionedBudget('₹7,80,000');
      setAssignedContractor('State Highways Fast-Track Asphalt Repair Unit');
      setContractorPhone('9443277881');
    } else if (g.category === 'Electricity & Street Lighting') {
      setSanctionedBudget('₹1,90,000');
      setAssignedContractor('TANGEDCO Rapid Line & Transformer Team');
      setContractorPhone('9443455667');
    } else {
      setSanctionedBudget('₹2,50,000');
      setAssignedContractor('District Collector Rapid Action Cell');
      setContractorPhone('9443011223');
    }

    if (isOverride) {
      setReviewNotesTamil('வட்டார ஆய்வாளரின் நிராகரிப்பு மறுஆய்வு செய்யப்பட்டது. பொதுமக்களின் அத்தியாவசிய தேவை மற்றும் AI சான்றுகளின் உண்மைத்தன்மை அடிப்படையில் முதலமைச்சர் சிறப்பு நிதியிலிருந்து பணி ஆணை பிறப்பிக்கப்படுகிறது.');
      setReviewNotesEnglish('Supervisor rejection reviewed and reconsidered. Confirmed as genuine critical public requirement. Direct CM Work Order sanctioned immediately.');
    } else {
      setReviewNotesTamil('மனுதாரரின் நியாயமான கோரிக்கை ஏற்கப்பட்டு, முதலமைச்சர் சிறப்பு நிதியிலிருந்து நேரடி பணி உத்தரவு மற்றும் நிதி ஒதுக்கீடு செய்யப்படுகிறது.');
      setReviewNotesEnglish('Approved under Chief Minister Fast-Track Civic Mission. Work order sanctioned with dedicated contractor and strict SLA.');
    }
  };

  const handleGenerateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setIsSubmitting(true);

    setTimeout(() => {
      onGenerateCMTask(selectedGrievance.id, {
        taskTitle,
        taskTitleTamil,
        sanctionedBudget,
        assignedContractor,
        contractorPhone,
        departmentName,
        departmentNameTamil,
        targetDeadline,
        priority,
        reviewNotesTamil,
        reviewNotesEnglish,
      });

      setIsSubmitting(false);
      setSelectedGrievance(null);
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    }, 450);
  };

  const handleConfirmUpholdRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalGrievance) return;
    if (onCMUpholdRejection) {
      onCMUpholdRejection(rejectionModalGrievance.id, cmRejectionReason);
    }
    setRejectionModalGrievance(null);
  };

  return (
    <div className="space-y-6">
      
      {/* CM Cell Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-700 to-yellow-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Award className="w-4 h-4 text-yellow-300" />
              {language === 'ta' ? 'நிலை 3: முதலமைச்சர் நேரடி சிறப்பு பிரிவு (CM Cell Apex Desk)' : 'Level 3: Chief Minister Special Cell Apex Control Desk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'ta' ? 'உடனடி பணி ஆணை, நிதி ஒதுக்கீடு & நிராகரிப்பு மறுஆய்வு மையம்' : 'Direct CM Task Sanction & Rejection Re-Review'}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              {language === 'ta'
                ? 'பொதுமக்களின் நியாயமான அடிப்படைத் தேவைகளுக்கு நிதியை அனுமதித்தல், ஒப்பந்ததாரரை நியமித்தல் மற்றும் மேற்பார்வையாளர்களால் நிராகரிக்கப்பட்ட மனுக்களை மறுஆய்வு செய்து தள்ளுபடி செய்யவும் (Reject) அல்லது மறுபரிசீலனை செய்யவும் (Reconsider) நேரடி அதிகாரம்.'
                : 'Direct state apex executive authority to issue fast-track work orders, allocate budgets, deploy contractors, and review supervisor-rejected applications to either uphold rejection or reconsider and sanction tasks.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-black/20 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-yellow-300">
                {grievances.filter((g) => g.status === 'CM Task Sanctioned' || g.cmCellReview?.decision === 'task_generated').length}
              </span>
              <p className="text-[11px] text-amber-100 font-bold">
                {language === 'ta' ? 'CM பணி ஆணைகள்' : 'CM Work Orders'}
              </p>
            </div>
            <div className="bg-black/20 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-rose-300">
                {grievances.filter((g) => g.supervisorReview?.decision === 'rejected' || g.status === 'Rejected by Supervisor').length}
              </span>
              <p className="text-[11px] text-amber-100 font-bold">
                {language === 'ta' ? 'நிராகரிப்பு மறுஆய்வு' : 'Rejection Re-Review'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚡ {language === 'ta' ? 'பணி ஆணைக்கு தயார்' : 'Ready for CM Sanction'}
          </button>

          <button
            onClick={() => setActiveTab('rejected_by_sup')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'rejected_by_sup'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚠️ {language === 'ta' ? 'நிராகரித்த மனுக்கள் (மறுஆய்வு / Reconsider)' : 'Rejected Petitions (Review / Reconsider)'}
          </button>

          <button
            onClick={() => setActiveTab('sanctioned_tasks')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'sanctioned_tasks'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚀 {language === 'ta' ? 'பிறப்பிக்கப்பட்ட பணி ஆணைகள்' : 'Sanctioned Tasks'}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📋 {language === 'ta' ? 'அனைத்து மனுக்கள்' : 'All Petitions'}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ta' ? 'மனு எண் / மாவட்டம் தேடுக...' : 'Search token / district...'}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Grid of Grievances */}
      {cmGrievances.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {language === 'ta' ? 'தற்போது நிலுவை மனுக்கள் ஏதுமில்லை' : 'No Petitions in this CM Desk Queue'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'ta'
              ? 'அனைத்து மனுக்களுக்கும் முதலமைச்சர் பணி ஆணைகள் பிறப்பிக்கப்பட்டு களப்பணிகள் நடைபெறுகின்றன.'
              : 'All evaluated civic grievances have been reviewed and allocated actions.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cmGrievances.map((g) => {
            const isSupervisorRejected = g.supervisorReview?.decision === 'rejected' || g.status === 'Rejected by Supervisor';
            const isCMRejected = g.status === 'Rejected by CM Cell';
            const isTaskSanctioned = g.status === 'CM Task Sanctioned' || !!g.cmCellReview?.generatedTask;
            const task = g.cmCellReview?.generatedTask;

            return (
              <div
                key={g.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  isCMRejected
                    ? 'border-slate-300 bg-slate-50/50'
                    : isSupervisorRejected
                    ? 'border-red-300 ring-2 ring-red-500/10'
                    : isTaskSanctioned
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-lg">
                      {g.id}
                    </span>

                    {/* Stage Status */}
                    {isTaskSanctioned ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                        🚀 {language === 'ta' ? 'CM பணி ஆணை பிறப்பிக்கப்பட்டது' : 'CM Task Sanctioned'}
                      </span>
                    ) : isCMRejected ? (
                      <span className="bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                        ✕ {language === 'ta' ? 'CM பிரிவு தள்ளுபடியை உறுதிசெய்தது' : 'Rejection Upheld by CM Cell'}
                      </span>
                    ) : isSupervisorRejected ? (
                      <span className="bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                        ⚠️ {language === 'ta' ? 'மேற்பார்வையாளர் நிராகரிப்பு • CM மறுஆய்வு தேவை' : 'Supervisor Rejected • CM Review Needed'}
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                        ⚡ {language === 'ta' ? 'மேற்பார்வையாளர் ஒப்புதல் • CM பணி ஆணை தயார்' : 'Supervisor Approved • Ready for CM Task'}
                      </span>
                    )}

                    {/* AI Genuineity Score */}
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      AI Score: {g.aiVerification?.genuineityScore || 96}%
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {g.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2">
                      {g.description}
                    </p>
                  </div>

                  {/* Location & Village */}
                  <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 text-[11px] flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'ta' ? 'மாவட்டம் / கிராமம்:' : 'District & Village:'}</span>
                      <span className="font-bold text-slate-800">{g.district} • {g.taluk} • {g.village || g.ward}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'ta' ? 'மனுதாரர்:' : 'Citizen:'}</span>
                      <span className="font-bold text-slate-800">{g.citizenName}</span>
                    </div>
                  </div>

                  {/* Supervisor Remarks Box */}
                  {g.supervisorReview && (
                    <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      g.supervisorReview.decision === 'approved'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-red-50/70 border-red-200 text-red-950'
                    }`}>
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span>
                          {g.supervisorReview.decision === 'approved'
                            ? `👷 ${language === 'ta' ? 'வட்டார ஆய்வாளர் ஒப்புதல் குறிப்பு:' : 'Supervisor Inspection Note:'}`
                            : `⚠️ ${language === 'ta' ? 'வட்டார ஆய்வாளர் நிராகரிப்பு காரணம்:' : 'Supervisor Rejection Grounds:'}`}
                        </span>
                        <span className="text-[10px] opacity-75">{g.supervisorReview.supervisorName}</span>
                      </div>
                      <p className="text-[11px] italic">
                        "{language === 'ta' ? g.supervisorReview.remarksTamil : g.supervisorReview.remarksEnglish}"
                      </p>
                    </div>
                  )}

                  {/* CM Task Sanction Details Box (If Generated) */}
                  {task && (
                    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200 text-amber-950 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-[11px] text-amber-900 border-b border-amber-200 pb-1.5">
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-amber-600" />
                          {language === 'ta' ? 'அரசாணை & பணி ஆணை விவரம்:' : 'Official CM Work Order Directives:'}
                        </span>
                        <span className="font-mono text-xs bg-amber-200/80 px-2 py-0.5 rounded font-bold">
                          {task.workOrderNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-amber-700 block font-medium">{language === 'ta' ? 'அனுமதிக்கப்பட்ட நிதி:' : 'Sanctioned Budget:'}</span>
                          <span className="font-black text-emerald-800 text-sm">{task.sanctionedBudget}</span>
                        </div>
                        <div>
                          <span className="text-amber-700 block font-medium">{language === 'ta' ? 'இலக்கு காலக்கெடு:' : 'Target Deadline:'}</span>
                          <span className="font-bold text-red-700">{task.targetDeadline}</span>
                        </div>
                      </div>

                      <div className="text-[11px] pt-1 border-t border-amber-200">
                        <span className="text-amber-700 block font-medium">{language === 'ta' ? 'நியமிக்கப்பட்ட ஒப்பந்த பிரிவு:' : 'Assigned Execution Unit:'}</span>
                        <span className="font-bold text-slate-800">{task.assignedContractor} (📞 {task.contractorPhone})</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* CM Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenGrievanceDetail(g)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'விவரம்' : 'Details'}</span>
                    </button>

                    {isTaskSanctioned && (
                      <button
                        onClick={() => onOpenSanctionOrder(g)}
                        className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'ta' ? 'அரசாணை ஆவணம்' : 'Sanction Order'}</span>
                      </button>
                    )}
                  </div>

                  {/* Primary CM Decision Trigger */}
                  {!isTaskSanctioned && !isCMRejected && (
                    <div className="flex items-center gap-2">
                      {isSupervisorRejected ? (
                        <>
                          {/* 1. Reject / Uphold Rejection */}
                          <button
                            onClick={() => setRejectionModalGrievance(g)}
                            className="px-3.5 py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Ban className="w-3.5 h-3.5 text-red-600" />
                            <span>{language === 'ta' ? 'தள்ளுபடியை உறுதிசெய் (Reject)' : 'Uphold Rejection'}</span>
                          </button>

                          {/* 2. Reconsider & Sanction Work Order */}
                          <button
                            onClick={() => handleOpenTaskModal(g, true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-yellow-200" />
                            <span>{language === 'ta' ? 'மறுபரிசீலனை செய்து பணி ஆணை (Reconsider)' : 'Reconsider & Sanction'}</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenTaskModal(g, false)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer active:scale-95"
                        >
                          <Award className="w-3.5 h-3.5 text-yellow-200" />
                          <span>{language === 'ta' ? 'CM பணி ஆணை & நிதி அனுமதி' : 'Generate CM Task & Budget'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Uphold Rejection Modal */}
      {rejectionModalGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Ban className="w-5 h-5 text-yellow-300" />
                <h3 className="text-sm font-bold">
                  {language === 'ta' ? 'முதலமைச்சர் சிறப்பு பிரிவு: தள்ளுபடி உறுதிப்படுத்தல்' : 'CM Cell: Uphold Petition Rejection'}
                </h3>
              </div>
              <button
                onClick={() => setRejectionModalGrievance(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUpholdRejection} className="p-6 space-y-4 text-xs">
              <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-red-900 text-[11px] space-y-1">
                <span className="font-bold block">
                  {language === 'ta' ? 'மனு எண்:' : 'Token ID:'} {rejectionModalGrievance.id} - {rejectionModalGrievance.title}
                </span>
                <p>
                  {language === 'ta' 
                    ? 'மேற்பார்வையாளரின் கள ஆய்வு முடிவை ஏற்று, இந்த மனுவை மாநில அளவில் இறுதியாக தள்ளுபடி செய்ய உள்ளீர்கள்.'
                    : 'Confirming this will mark the petition as permanently rejected by Chief Minister Special Cell.'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  {language === 'ta' ? 'முதலமைச்சர் பிரிவு தள்ளுபடி உத்தரவுக் குறிப்பு *' : 'CM Cell Rejection Order Summary *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={cmRejectionReason}
                  onChange={(e) => setCmRejectionReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectionModalGrievance(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'தள்ளுபடியை உறுதிசெய்' : 'Confirm Final Rejection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CM Task Generation Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Top Banner */}
            <div className="bg-gradient-to-r from-red-700 via-amber-700 to-yellow-600 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xl border border-white/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {language === 'ta' ? 'முதலமைச்சர் நேரடி பணி ஆணை & நிதி அனுமதி' : 'Chief Minister Direct Sanction & Work Order'}
                  </h3>
                  <p className="text-xs text-amber-100 font-mono">
                    Token ID: {selectedGrievance.id} • {selectedGrievance.district}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerateTaskSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Task Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  {language === 'ta' ? 'அரசாணை பணித் தலைப்பு (தமிழ்) *' : 'Sanctioned Task Title (Tamil) *'}
                </label>
                <input
                  type="text"
                  required
                  value={taskTitleTamil}
                  onChange={(e) => setTaskTitleTamil(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sanction Budget & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    {language === 'ta' ? 'அனுமதிக்கப்பட்ட நிதி ஒதுக்கீடு (CM Special Fund) *' : 'Sanctioned Budget (CM Special Fund) *'}
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={sanctionedBudget}
                      onChange={(e) => setSanctionedBudget(e.target.value)}
                      placeholder="₹4,50,000"
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-700 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    {language === 'ta' ? 'இலக்கு காலக்கெடு (SLA) *' : 'Target SLA Execution Deadline *'}
                  </label>
                  <select
                    value={targetDeadline}
                    onChange={(e) => setTargetDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="24 Hours (Urgent Emergency Directive)">24 Hours (Urgent Emergency Directive)</option>
                    <option value="48 Hours (Direct CM Directive)">48 Hours (Direct CM Directive)</option>
                    <option value="72 Hours (Rapid Infrastructure Repair)">72 Hours (Rapid Infrastructure Repair)</option>
                    <option value="7 Days (Major Pipeline / Road Overhaul)">7 Days (Major Pipeline / Road Overhaul)</option>
                  </select>
                </div>
              </div>

              {/* Contractor & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    {language === 'ta' ? 'பொறுப்பான ஒப்பந்த பிரிவு / துறை *' : 'Assigned Executing Contractor / Wing *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={assignedContractor}
                    onChange={(e) => setAssignedContractor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    {language === 'ta' ? 'ஒப்பந்ததாரர் தொலைபேசி எண் *' : 'Contractor Contact Mobile *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={contractorPhone}
                    onChange={(e) => setContractorPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* CM Review Directive Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  {language === 'ta' ? 'முதலமைச்சர் நேரடி உத்தரவுக் குறிப்பு *' : 'Chief Minister Official Directive Notes *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={reviewNotesTamil}
                  onChange={(e) => setReviewNotesTamil(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'ta'
                    ? 'பணி ஆணை பிறப்பித்தவுடன், மனுதாரர் மற்றும் கள அதிகாரிகளுக்கு SMS மூலம் ஆணை எண், நிதி மற்றும் காலக்கெடு தானாக சென்றடையும்.'
                    : 'Generating this CM task immediately triggers SMS notifications, assigns barcode/work order number, and initiates live countdown tracking.'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-700 hover:to-amber-700 text-white font-bold shadow-md shadow-amber-600/20 cursor-pointer active:scale-95"
                >
                  <Award className="w-4 h-4 text-yellow-200" />
                  <span>{language === 'ta' ? 'பணி ஆணையை உடனடியாக பிறப்பி' : 'Sanction & Issue CM Work Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
