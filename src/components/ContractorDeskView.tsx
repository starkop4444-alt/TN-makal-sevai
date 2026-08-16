import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Grievance, CitizenProfile, VolunteerTask, ContractorWorkforceSelection } from '../types';
import { 
  HardHat, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  FileText, 
  MapPin, 
  Phone, 
  Users, 
  Wrench, 
  Truck, 
  Layers, 
  AlertCircle, 
  Send, 
  Camera, 
  Sparkles, 
  Check, 
  Briefcase,
  XCircle,
  RotateCcw,
  CheckCheck,
  Flame,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContractorDeskViewProps {
  grievances: Grievance[];
  volunteerTasks: VolunteerTask[];
  currentProfile: CitizenProfile | null;
  onUpdateExecutionStatus?: (grievanceId: string, statusNote: string, progressPct: number) => void;
  onContractorAcceptProject?: (projectId: string, isTask: boolean, workforce?: ContractorWorkforceSelection) => void;
  onContractorRejectProject?: (projectId: string, reason: string, isTask: boolean) => void;
}

export const ContractorDeskView: React.FC<ContractorDeskViewProps> = ({
  grievances,
  volunteerTasks,
  currentProfile,
  onUpdateExecutionStatus,
  onContractorAcceptProject,
  onContractorRejectProject
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'available_projects' | 'active_executions' | 'declined_projects' | 'workforce_bidding'>('available_projects');
  
  // Track accepted and rejected project IDs locally with default initial sample
  const [acceptedProjectIds, setAcceptedProjectIds] = useState<string[]>(['TN-GRV-2026-8492']);
  const [rejectedProjects, setRejectedProjects] = useState<Array<{ id: string; reason: string; title: string }>>([]);

  // Acceptance & Workforce Modal state
  const [acceptingGrievance, setAcceptingGrievance] = useState<Grievance | null>(null);
  const [workforceType, setWorkforceType] = useState<'own_labour' | 'volunteer_padai' | 'hybrid'>('own_labour');
  const [ownLabourCount, setOwnLabourCount] = useState<number>(15);
  const [volunteerPadaiCount, setVolunteerPadaiCount] = useState<number>(20);
  const [selectedTrades, setSelectedTrades] = useState<string[]>(['Certified Welders', 'Masons', 'JCB Operators']);
  const [machineryNote, setMachineryNote] = useState<string>('1 JCB 3DX Excavator, 1 Water Tanker, 2 Tipper Trucks');
  const [estDays, setEstDays] = useState<number>(3);
  const [acceptanceNotes, setAcceptanceNotes] = useState<string>('ஆட்கள் மற்றும் இயந்திரங்கள் தயார் நிலையில் உள்ளன. மேற்பார்வையாளர் வழிகாட்டுதலில் உடனே பணி துவங்கப்படும்.');

  // Modal states
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [rejectingItem, setRejectingItem] = useState<{ id: string; title: string; isTask: boolean } | null>(null);
  const [rejectReason, setRejectReason] = useState('தற்போது வேறு திட்டப் பணிகளில் இயந்திரங்கள் மற்றும் ஆட்கள் ஈடுபடுத்தப்பட்டுள்ளதால் இப்பணியை ஏற்க இயலவில்லை.');

  // Work update form state
  const [progressPct, setProgressPct] = useState(50);
  const [statusNote, setStatusNote] = useState('');
  const [deployedMachinery, setDeployedMachinery] = useState('1 JCB Excavator, 1 Water Tanker');
  const [deployedTradesLabour, setDeployedTradesLabour] = useState('4 Certified Welders, 12 Field Helpers');
  const [isUpdating, setIsUpdating] = useState(false);

  // Available candidate projects from grievances (CM work orders or Supervisor approved civic tasks)
  const candidateGrievances = grievances.filter((g) => 
    g.status === 'CM Task Sanctioned' || 
    g.cmCellReview?.decision === 'task_generated' ||
    g.supervisorReview?.actionRoute === 'open_civic_task' ||
    g.supervisorReview?.decision === 'approved' ||
    g.status === 'In Progress' ||
    g.status === 'Officer Assigned'
  );

  // Filter available projects (not yet accepted or rejected)
  const availableGrievances = candidateGrievances.filter(
    (g) => !acceptedProjectIds.includes(g.id) && !rejectedProjects.some((r) => r.id === g.id) && g.contractorStatus !== 'accepted'
  );

  const activeGrievances = candidateGrievances.filter(
    (g) => acceptedProjectIds.includes(g.id) || g.contractorStatus === 'accepted'
  );

  // Open Workforce Selection Modal
  const handleOpenAcceptModal = (g: Grievance) => {
    setAcceptingGrievance(g);
    const reqLabour = g.supervisorReview?.openedTaskDetails?.labourCountRequired || 15;
    setOwnLabourCount(reqLabour);
    setVolunteerPadaiCount(reqLabour);
  };

  // Handle Contractor Confirm Accept Project with Workforce
  const handleConfirmAcceptWithWorkforce = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingGrievance) return;

    const workforceDetails: ContractorWorkforceSelection = {
      workforceType,
      ownLabourCount: workforceType === 'volunteer_padai' ? 0 : ownLabourCount,
      volunteerPadaiCount: workforceType === 'own_labour' ? 0 : volunteerPadaiCount,
      ownTrades: selectedTrades,
      machineryDeployed: machineryNote,
      estimatedDaysToFinish: estDays,
      contractorFirmName: currentProfile?.contractorFirmName || `${currentProfile?.fullName || 'Tamil Nadu Civil'} Infra Corp`,
      contractorLicenseId: currentProfile?.contractorLicenseId || 'TN-PWD-CL1-2026-9812',
      acceptedAtTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: acceptanceNotes
    };

    setAcceptedProjectIds((prev) => [...prev, acceptingGrievance.id]);
    if (onContractorAcceptProject) {
      onContractorAcceptProject(acceptingGrievance.id, false, workforceDetails);
    }

    setAcceptingGrievance(null);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // Handle Contractor Reject / Decline Project
  const handleConfirmRejectProject = () => {
    if (!rejectingItem) return;
    setRejectedProjects((prev) => [
      ...prev.filter((r) => r.id !== rejectingItem.id),
      { id: rejectingItem.id, reason: rejectReason, title: rejectingItem.title }
    ]);
    if (onContractorRejectProject) {
      onContractorRejectProject(rejectingItem.id, rejectReason, rejectingItem.isTask);
    }
    setRejectingItem(null);
  };

  const handleOpenUpdateModal = (g: Grievance) => {
    setSelectedGrievance(g);
    setStatusNote(
      language === 'ta'
        ? 'தளத்தில் பொருட்கள், வெல்டர்கள் மற்றும் கட்டுமான இயந்திரங்கள் களமிறக்கப்பட்டு பணிகள் விறுவிறுப்பாக நடைபெறுகின்றன.'
        : 'Materials, welders, and civil equipment deployed at site. Structural and groundwork underway.'
    );
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setIsUpdating(true);

    setTimeout(() => {
      if (onUpdateExecutionStatus) {
        onUpdateExecutionStatus(selectedGrievance.id, statusNote, progressPct);
      }
      setIsUpdating(false);
      setSelectedGrievance(null);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Contractor Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <HardHat className="w-4 h-4 text-amber-400" />
              {language === 'ta' ? 'அரசு அங்கீகாரம் பெற்ற ஒப்பந்ததாரர் பணிமனை' : 'TN Registered Contractor Work Orders Desk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'ta' ? 'அரசு & முதலமைச்சர் திட்டப் பணிகள் & 6 மணி நேர ஒப்பந்த ஏற்பு' : 'Civic Work Orders, 6-Hour SLA Acceptance & Workforce'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ta'
                ? `வரவேற்கிறோம், ${currentProfile?.fullName || 'ஒப்பந்ததாரர்'}. உரிமம்: ${currentProfile?.contractorLicenseId || 'TN-PWD-CL1-2026-9812'}. மேற்பார்வையாளர் அனுமதித்த பணிகளை 6 மணி நேரத்திற்குள் பரிசீலித்து, சொந்த ஆட்கள் அல்லது தளபதி மக்கள் பணிப்படை மூலம் ஏற்கலாம்.`
                : `Welcome, ${currentProfile?.fullName || 'Licensed Contractor'}. License: ${currentProfile?.contractorLicenseId || 'TN-PWD-CL1-2026-9812'}. Review supervisor-sanctioned civic works within the 6-Hour SLA window and choose Own Labour or Volunteer Padai.`}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {availableGrievances.length}
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5">
                {language === 'ta' ? 'கிடைக்கும் பணிகள்' : 'Available (6h SLA)'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {activeGrievances.length}
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5">
                {language === 'ta' ? 'ஏற்றுக்கொண்டவை' : 'Active Works'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                {rejectedProjects.length}
              </span>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5">
                {language === 'ta' ? 'நிராகரித்தவை' : 'Declined'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contractor Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('available_projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'available_projects'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'ta' ? 'ஏற்புக்கு கிடைக்கும் பணிகள் (6 மணி நேர கெடு)' : 'Available Projects (6h SLA Window)'}</span>
          <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
            {availableGrievances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('active_executions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'active_executions'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>{language === 'ta' ? 'என் வசம் உள்ள நடப்பு பணிகள்' : 'My Active Contracts'}</span>
          <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
            {activeGrievances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('declined_projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'declined_projects'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>{language === 'ta' ? 'நிராகரிக்கப்பட்ட பணிகள்' : 'Declined Projects'}</span>
          <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
            {rejectedProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('workforce_bidding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'workforce_bidding'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'ta' ? 'தளபதி மக்கள் பணிப்படை இணைப்பு' : 'Volunteer Padai Mobilization'}</span>
        </button>
      </div>

      {/* TAB 1: Available Projects for Contractor to Accept within 6 Hours */}
      {activeTab === 'available_projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>{language === 'ta' ? 'மேற்பார்வையாளர் அனுமதித்த நேரடி ஒப்பந்த பணிகள் (6 மணி நேர கெடு)' : 'Supervisor-Approved Works Pending Contractor Acceptance (6h SLA)'}</span>
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>{language === 'ta' ? 'ஒப்பந்ததாரர் 6 மணி நேரத்திற்குள் ஏற்க வேண்டும்' : 'Must Accept Within 6-Hour SLA Window'}</span>
            </div>
          </div>

          {availableGrievances.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'ta' ? 'அனைத்து திட்டப் பணிகளுக்கும் முடிவெடுக்கப்பட்டுள்ளது' : 'All Available Projects Have Been Reviewed'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ta'
                  ? 'புதிய திட்டங்கள் மேற்பார்வையாளரால் அனுமதிக்கப்பட்டதும் இடஅமைவு அடிப்படையில் 6 மணி நேர கெடுவுடன் இங்கு தோன்றும்.'
                  : 'New projects approved by supervisors in your location will appear here with 6-Hour SLA timer.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableGrievances.map((g) => {
                const task = g.cmCellReview?.generatedTask;
                const supDetails = g.supervisorReview?.openedTaskDetails;
                
                const budgetStr = task?.sanctionedBudget || 
                  (supDetails?.totalFundRequiredINR ? `₹${supDetails.totalFundRequiredINR.toLocaleString('en-IN')}` : '') ||
                  (g.fundUtilisation?.totalBudgetINR ? `₹${g.fundUtilisation.totalBudgetINR.toLocaleString('en-IN')}` : '₹4,50,000');

                const labourStr = supDetails?.labourCountRequired 
                  ? `${supDetails.labourCountRequired} ஆட்கள் (@ ₹${supDetails.dailyWageRateINR || 650}/நாள்)`
                  : '15-20 Skilled Tradesmen / Volunteers';

                const deadlineStr = task?.targetDeadline || (supDetails?.daysRequired ? `${supDetails.daysRequired} Days Timeline` : '3 Days Fast-Track');

                return (
                  <div key={g.id} className="bg-white rounded-3xl border-2 border-amber-300 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Top 6-Hour SLA Banner */}
                    <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-3.5 py-1.5 -mx-5 -mt-5 flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        {language === 'ta' ? 'ஏற்பு காலக்கெடு: 6 மணி நேரம் (6h SLA)' : 'Acceptance SLA: 6 Hours Window'}
                      </span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono">
                        📍 {g.district}, {g.taluk}
                      </span>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-lg border border-amber-300">
                            {task?.workOrderNumber || `TN-CIVIC-ORD-${g.id.slice(-4)}`}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                            {g.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-100 text-amber-900 shrink-0">
                          {language === 'ta' ? 'ஒப்பந்த ஏற்புக்கு தயார்' : 'Ready to Accept'}
                        </span>
                      </div>

                      {/* Transparent Budget & Requirement Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 font-medium">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">
                            {language === 'ta' ? 'முழு திட்ட நிதி (Sanctioned Budget)' : 'Sanctioned Total Budget'}
                          </span>
                          <span className="text-base font-black text-emerald-700 font-mono">
                            {budgetStr}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">
                            {language === 'ta' ? 'பணி கால அளவு (Target Duration)' : 'Target Duration'}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {deadlineStr}
                          </span>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-slate-200 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">
                            {language === 'ta' ? 'தேவைப்படும் ஆட்கள் / வெல்டர்கள்' : 'Required Trades / Workforce'}
                          </span>
                          <span className="text-xs font-semibold text-indigo-900">
                            {labourStr}
                          </span>
                        </div>
                        <div className="col-span-2 pt-1 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/60">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            {g.district}, {g.taluk} ({g.village || 'Ward'})
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            ID: {g.id}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {g.description}
                      </p>
                    </div>

                    {/* Prominent Accept / Reject Actions */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleOpenAcceptModal(g)}
                        className="py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>{language === 'ta' ? 'ஏற்கவும்: ஆட்கள் தேர்வு' : 'Accept (Choose Labour)'}</span>
                      </button>

                      <button
                        onClick={() => setRejectingItem({ id: g.id, title: g.title, isTask: false })}
                        className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>{language === 'ta' ? 'பணியை நிராகரி' : 'Decline Project'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Active Contracts / Executions */}
      {activeTab === 'active_executions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCheck className="w-5 h-5 text-emerald-600" />
              <span>{language === 'ta' ? 'ஒப்பந்ததாரரால் ஏற்கப்பட்டு களத்தில் உள்ள பணிகள்' : 'Active Accepted Contracts & Field Operations'}</span>
            </h2>
          </div>

          {activeGrievances.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">
                {language === 'ta' ? 'தற்போது நடப்பில் பணிகள் ஏதுமில்லை' : 'No active projects under execution'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGrievances.map((g) => {
                const workforce = g.contractorWorkforce;
                return (
                  <div key={g.id} className="bg-white rounded-3xl border-2 border-emerald-300 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                            ACTIVE WORK ORDER: {g.id}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 mt-1.5">{g.title}</h3>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                          {language === 'ta' ? 'களப்பணி நடப்பில் உள்ளது' : 'In Execution'}
                        </span>
                      </div>

                      {/* Workforce Mode Summary Card */}
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-700" />
                            {language === 'ta' ? 'ஆட்கள் தேர்வு முறை:' : 'Workforce Model:'}
                          </span>
                          <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                            {workforce?.workforceType === 'own_labour'
                              ? (language === 'ta' ? '👷‍♂️ சொந்த ஆட்கள்' : '👷‍♂️ Own Labour')
                              : workforce?.workforceType === 'volunteer_padai'
                              ? (language === 'ta' ? '🤝 தளபதி மக்கள் பணிப்படை' : '🤝 Volunteer Padai')
                              : (language === 'ta' ? '⚡ கலப்பு முறை (Own + Volunteer)' : '⚡ Hybrid Model')}
                          </span>
                        </div>

                        {workforce && (
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 border-t border-emerald-200/60">
                            {workforce.ownLabourCount ? (
                              <span>👷‍♂️ சொந்த ஆட்கள்: <strong>{workforce.ownLabourCount} பேர்</strong></span>
                            ) : null}
                            {workforce.volunteerPadaiCount ? (
                              <span>🤝 தொண்டர்கள்: <strong>{workforce.volunteerPadaiCount} பேர்</strong></span>
                            ) : null}
                            <span className="col-span-2">🚜 இயந்திரங்கள்: {workforce.machineryDeployed || '1 JCB, 1 Tipper'}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          {g.district}, {g.taluk}
                        </span>
                        <span className="font-semibold text-indigo-700">
                          {language === 'ta' ? 'மேற்பார்வையாளர் அறிவிக்கப்பட்டது' : 'Supervisor Notified'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => handleOpenUpdateModal(g)}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'ta' ? 'கள முன்னேற்ற அறிக்கை சமர்ப்பி' : 'Submit Progress Log / Notes'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Declined Projects */}
      {activeTab === 'declined_projects' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>{language === 'ta' ? 'ஒப்பந்ததாரரால் மறுக்கப்பட்ட திட்டப் பணிகள்' : 'Declined Projects Log'}</span>
          </h2>

          {rejectedProjects.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                {language === 'ta' ? 'எந்தவொரு பணியும் நிராகரிக்கப்படவில்லை' : 'No projects have been declined'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejectedProjects.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl border border-rose-200 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-700">{r.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {language === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Declined'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                  <p className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <strong>{language === 'ta' ? 'காரணம்: ' : 'Reason: '}</strong>{r.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Workforce / Volunteer Padai Mobilization */}
      {activeTab === 'workforce_bidding' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 p-6 rounded-3xl space-y-2">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{language === 'ta' ? 'தளபதி மக்கள் பணிப்படை (Volunteer Padai) நேரடி ஆட்கள் திரட்டல்' : 'Direct Volunteer Padai Labour Mobilization'}</span>
            </h3>
            <p className="text-xs font-medium max-w-2xl text-slate-900">
              {language === 'ta'
                ? 'ஒப்பந்ததாரர்கள் தங்கள் திட்டப் பணிகளுக்கு சொந்த ஆட்களுடன் கூடுதலாகவோ அல்லது முழுமையாகவோ தளபதி மக்கள் பணிப்படை தன்னார்வலர்களைப் பயன்படுத்தி விரைவாக பணிகளை முடிக்கலாம்.'
                : 'Contractors can tap into local registered Volunteer Padai youth and community volunteers to execute ground clearing, masonry support, and tree planting with high community ownership.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <HardHat className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">{language === 'ta' ? '1. சொந்த ஆட்கள் முறை' : '1. Own Regular Tradesmen'}</h4>
              <p className="text-xs text-slate-500">{language === 'ta' ? 'ஒப்பந்ததாரரின் சொந்த வெல்டர்கள், மேஸ்திரிகள் & ஆட்கள்.' : 'Full deployment of licensed contractor skilled crew & machinery.'}</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">{language === 'ta' ? '2. தளபதி மக்கள் பணிப்படை' : '2. Volunteer Padai'}</h4>
              <p className="text-xs text-slate-500">{language === 'ta' ? 'மக்களின் சமூகம் சார்ந்த தொண்டர் படை மூலம் உடனடி களப்பணி.' : 'Grassroots volunteer mobilization of registered community cadre.'}</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">{language === 'ta' ? '3. கலப்பு முறை (Hybrid)' : '3. Hybrid Synergy'}</h4>
              <p className="text-xs text-slate-500">{language === 'ta' ? 'முக்கிய தொழில்நுட்ப ஆட்கள் + தொண்டர் படை கூட்டமைப்பு.' : 'Contractor master tradesmen guiding eager volunteer workforce.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Accept Project & Choose Workforce (Own Labour vs Volunteer Padai) */}
      {acceptingGrievance && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <HardHat className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    {language === 'ta' ? 'பணி ஆணை ஏற்பு & ஆட்கள் முறை தேர்வு' : 'Work Order Acceptance & Workforce Selection'}
                  </h3>
                  <span className="text-[10px] text-amber-200 font-mono">
                    Project: {acceptingGrievance.id} (6h SLA Window)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAcceptingGrievance(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAcceptWithWorkforce} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] text-amber-800 font-mono font-bold block uppercase">
                  {language === 'ta' ? 'அனுமதிக்கப்பட்ட திட்டம் & இடம்' : 'Sanctioned Project & Location'}
                </span>
                <p className="text-xs font-bold text-slate-900">{acceptingGrievance.title}</p>
                <p className="text-[11px] text-slate-600">
                  📍 {acceptingGrievance.district}, {acceptingGrievance.taluk} ({acceptingGrievance.village})
                </p>
              </div>

              {/* Workforce Mode Selection Cards */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  {language === 'ta' ? 'பணியாளர்களை பயன்படுத்தும் முறையை தேர்வு செய்யவும் *' : 'Choose Workforce Deployment Model *'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Own Labour */}
                  <div
                    onClick={() => setWorkforceType('own_labour')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${
                      workforceType === 'own_labour'
                        ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <HardHat className="w-4 h-4 text-amber-700" />
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                        {workforceType === 'own_labour' && <span className="w-2 h-2 rounded-full bg-amber-600"></span>}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{language === 'ta' ? 'சொந்த ஆட்கள்' : 'Own Labour'}</p>
                    <p className="text-[10px] text-slate-500">{language === 'ta' ? 'ஒப்பந்ததாரரின் சொந்த குழு' : 'Contractor own crew'}</p>
                  </div>

                  {/* Option 2: Volunteer Padai */}
                  <div
                    onClick={() => setWorkforceType('volunteer_padai')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${
                      workforceType === 'volunteer_padai'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Users className="w-4 h-4 text-emerald-700" />
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                        {workforceType === 'volunteer_padai' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{language === 'ta' ? 'மக்கள் பணிப்படை' : 'Volunteer Padai'}</p>
                    <p className="text-[10px] text-slate-500">{language === 'ta' ? 'தொண்டர் படை திரட்டல்' : 'Grassroots volunteer crew'}</p>
                  </div>

                  {/* Option 3: Hybrid */}
                  <div
                    onClick={() => setWorkforceType('hybrid')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${
                      workforceType === 'hybrid'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sparkles className="w-4 h-4 text-indigo-700" />
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                        {workforceType === 'hybrid' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{language === 'ta' ? 'கலப்பு முறை' : 'Hybrid Synergy'}</p>
                    <p className="text-[10px] text-slate-500">{language === 'ta' ? 'தொழில் வல்லுநர் + தொண்டர்கள்' : 'Own trades + volunteers'}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Inputs based on selection */}
              {workforceType === 'own_labour' && (
                <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">
                      {language === 'ta' ? 'ஈடுபடுத்தப்படும் சொந்த ஆட்கள் எண்ணிக்கை:' : 'Number of Own Tradesmen & Labourers:'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={ownLabourCount}
                      onChange={(e) => setOwnLabourCount(Number(e.target.value))}
                      className="w-20 px-3 py-1 bg-white border border-slate-300 rounded-lg text-center font-bold text-xs"
                    />
                  </div>
                </div>
              )}

              {workforceType === 'volunteer_padai' && (
                <div className="space-y-3 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-emerald-950">
                      {language === 'ta' ? 'திரட்டப்படும் தளபதி மக்கள் பணிப்படை தன்னார்வலர்கள்:' : 'Requested Volunteer Padai Count:'}
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={volunteerPadaiCount}
                      onChange={(e) => setVolunteerPadaiCount(Number(e.target.value))}
                      className="w-20 px-3 py-1 bg-white border border-emerald-300 rounded-lg text-center font-bold text-xs"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {language === 'ta' 
                      ? '✓ ஒப்பந்ததாரர் ஒப்புதல் அளித்தவுடன் உள்ளூர் மக்கள் பணிப்படை தொண்டர்களுக்கு இடஅமைவு அறிவிப்பு செல்லும்.'
                      : '✓ Instant location-based broadcast will alert local registered Volunteer Padai cadre.'}
                  </p>
                </div>
              )}

              {workforceType === 'hybrid' && (
                <div className="grid grid-cols-2 gap-2 p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl">
                  <div>
                    <label className="font-bold text-indigo-950 block text-[11px]">
                      {language === 'ta' ? 'சொந்த வல்லுநர்கள் / வெல்டர்கள்:' : 'Own Skilled Trades:'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={ownLabourCount}
                      onChange={(e) => setOwnLabourCount(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-indigo-300 rounded-lg text-center font-bold text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-indigo-950 block text-[11px]">
                      {language === 'ta' ? 'மக்கள் பணிப்படை தொண்டர்கள்:' : 'Volunteer Helpers:'}
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={volunteerPadaiCount}
                      onChange={(e) => setVolunteerPadaiCount(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-indigo-300 rounded-lg text-center font-bold text-xs mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'இயந்திரங்கள் & உபகரணங்கள் (Machinery)' : 'Deployed Machinery'}
                </label>
                <input
                  type="text"
                  value={machineryNote}
                  onChange={(e) => setMachineryNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'ஒப்பந்த ஏற்பு உறுதிமொழி & குறிப்பு' : 'Contractor Commitment & Notes'}
                </label>
                <textarea
                  rows={2}
                  value={acceptanceNotes}
                  onChange={(e) => setAcceptanceNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAcceptingGrievance(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-pointer"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>{language === 'ta' ? 'ஒப்பந்தத்தை உறுதி செய்து ஏற்பளி (6h SLA)' : 'Confirm & Accept Work (6h SLA)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold">
                  {language === 'ta' ? 'பணியை நிராகரித்தல்' : 'Decline Project Assignment'}
                </h3>
              </div>
              <button
                onClick={() => setRejectingItem(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Project ID: {rejectingItem.id}</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{rejectingItem.title}</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'நிராகரிப்பதற்கான காரணம் *' : 'Reason for Declining *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-pointer"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejectProject}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'நிராகரிப்பை உறுதிசெய்' : 'Confirm Decline'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execution Status Update Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardHat className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    {language === 'ta' ? 'ஒப்பந்ததாரர் கள முன்னேற்றப் பதிவு' : 'Contractor Work Execution Update'}
                  </h3>
                  <span className="text-[10px] text-amber-200 font-mono">
                    Order ID: {selectedGrievance.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'களப்பணி நிறைவு சதவீதம் (%) *' : 'Work Completion Progress (%) *'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={progressPct}
                    onChange={(e) => setProgressPct(Number(e.target.value))}
                    className="flex-1 accent-amber-600"
                  />
                  <span className="font-mono font-black text-sm bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
                    {progressPct}%
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'ஈடுபடுத்தப்பட்ட பணியாளர்கள் & வெல்டர்கள்' : 'Deployed Tradesmen & Crew'}
                </label>
                <input
                  type="text"
                  value={deployedTradesLabour}
                  onChange={(e) => setDeployedTradesLabour(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'இயந்திரங்கள் & உபகரணங்கள்' : 'Deployed Machinery & Equipment'}
                </label>
                <input
                  type="text"
                  value={deployedMachinery}
                  onChange={(e) => setDeployedMachinery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  {language === 'ta' ? 'ஒப்பந்ததாரர் கள அறிக்கை & குறிப்புகள் *' : 'Site Progress Summary *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-pointer"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isUpdating ? 'Updating...' : (language === 'ta' ? 'அறிக்கையை சமர்ப்பி' : 'Submit Progress')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
