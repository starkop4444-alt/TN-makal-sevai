import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Grievance, 
  SupervisorReview, 
  CitizenProfile, 
  DailyProgressReport, 
  FundUtilisationSummary,
  DepartmentAssignmentDetails,
  VolunteerTask,
  VolunteerContribution
} from '../types';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Building2, 
  Sparkles, 
  Send, 
  ExternalLink,
  Search,
  Filter,
  Eye,
  Camera,
  Calendar,
  UserCheck,
  Award,
  IndianRupee,
  Users,
  Clock,
  HardHat,
  Briefcase,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  Phone,
  Check,
  Play,
  PlusCircle,
  QrCode,
  Utensils,
  Droplets,
  Share2,
  CheckCheck,
  Download,
  FileJson
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupervisorReviewViewProps {
  grievances: Grievance[];
  volunteerTasks?: VolunteerTask[];
  onSupervisorDecision: (
    grievanceId: string, 
    decision: 'approved' | 'rejected', 
    remarks: { 
      remarksTamil: string; 
      remarksEnglish: string; 
      fieldPhotos?: string[];
      actionRoute?: 'open_civic_task' | 'assign_department_districthq';
      openedTaskDetails?: {
        taskTitle: string;
        totalFundRequiredINR: number;
        labourCountRequired: number;
        dailyWageRateINR: number;
        daysRequired: number;
        workStartDate: string;
      };
      departmentAssignment?: DepartmentAssignmentDetails;
    }
  ) => void;
  onOpenGrievanceDetail: (grievance: Grievance) => void;
  currentProfile: CitizenProfile | null;
  onUpdateDailyProgress?: (grievanceId: string, report: DailyProgressReport, fundUpdate?: FundUtilisationSummary) => void;
  onStartVolunteerWork?: (taskId: string, supervisorNotes?: string) => void;
  onCreateDirectTask?: (newTask: VolunteerTask) => void;
  onMarkWorkFinished?: (grievanceId: string, finishData: { completionNotes: string; actualSpentINR?: number; completionPhotoUrl?: string }) => void;
}

export const SupervisorReviewView: React.FC<SupervisorReviewViewProps> = ({
  grievances,
  volunteerTasks = [],
  onSupervisorDecision,
  onOpenGrievanceDetail,
  currentProfile,
  onUpdateDailyProgress,
  onStartVolunteerWork,
  onCreateDirectTask,
  onMarkWorkFinished,
}) => {
  const { language } = useLanguage();

  // Primary Super Tabs
  const [activeTab, setActiveTab] = useState<'grievances' | 'volunteer_desk' | 'daily_progress'>('grievances');

  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'in_progress' | 'rejected' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Review Modal State
  const [decisionType, setDecisionType] = useState<'approved' | 'rejected'>('approved');
  const [actionRoute, setActionRoute] = useState<'open_civic_task' | 'assign_department_districthq'>('open_civic_task');
  
  // Pathway A: Open Civic Work / Volunteer Task Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [totalFundRequired, setTotalFundRequired] = useState<number>(45000);
  const [labourCountRequired, setLabourCountRequired] = useState<number>(20);
  const [dailyWageRate, setDailyWageRate] = useState<number>(650); // Daily wage benchmark
  const [daysRequired, setDaysRequired] = useState<number>(3);
  const [workStartDate, setWorkStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Pathway B: Department & District HQ Assignment Fields
  const [assignedDepartment, setAssignedDepartment] = useState('Tamil Nadu Generation and Distribution Corp (TANGEDCO)');
  const [assignedDepartmentTamil, setAssignedDepartmentTamil] = useState('தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)');
  const [districtHQPhone, setDistrictHQPhone] = useState('044-25268320 (District Collectorate)');
  const [districtNodalOfficer, setDistrictNodalOfficer] = useState('Thiru. J. Radhakrishnan IAS / District Collector Nodal Cell');
  const [sanctionedBudget, setSanctionedBudget] = useState<number>(120000);
  const [resolutionTimelineDays, setResolutionTimelineDays] = useState<number>(7);

  // Common Review Fields
  const [remarksTamil, setRemarksTamil] = useState('');
  const [remarksEnglish, setRemarksEnglish] = useState('');
  const [supervisorName, setSupervisorName] = useState(currentProfile?.fullName || 'Er. K. Murugesan (Taluk Field Supervisor)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Task Creation Modal State
  const [isDirectTaskModalOpen, setIsDirectTaskModalOpen] = useState(false);
  const [directTitle, setDirectTitle] = useState('');
  const [directTitleTamil, setDirectTitleTamil] = useState('');
  const [directCategory, setDirectCategory] = useState<'Sanitation & Desilting' | 'Tree Plantation' | 'Road & Pothole Repair' | 'School & Library Renovation' | 'Water Body Restoration' | 'Disaster Relief'>('Sanitation & Desilting');
  const [directDistrict, setDirectDistrict] = useState(currentProfile?.district || 'Ariyalur');
  const [directTaluk, setDirectTaluk] = useState(currentProfile?.taluk || 'Sendurai');
  const [directLocation, setDirectLocation] = useState('Sendurai Eri & Water Supply Channel');
  const [directFunds, setDirectFunds] = useState<number>(55000);
  const [directLabour, setDirectLabour] = useState<number>(20);
  const [directWage, setDirectWage] = useState<number>(650);
  const [directDays, setDirectDays] = useState<number>(3);

  // Start Work Verification Modal State
  const [startWorkTask, setStartWorkTask] = useState<VolunteerTask | null>(null);
  const [startWorkNotes, setStartWorkNotes] = useState('கள ஆய்வு நிறைவுற்றது. தேவையான பொருட்கள், ஜேசிபி இயந்திரங்கள் மற்றும் தன்னார்வலர் பணிக்குழு தயாராக உள்ளனர். நேரடி களப்பணி துவங்கப்படுகிறது.');
  const [checkSafetyGear, setCheckSafetyGear] = useState(true);
  const [checkMachinery, setCheckMachinery] = useState(true);
  const [checkWorkersReady, setCheckWorkersReady] = useState(true);

  // Active Volunteer Task Roster Expansion
  const [expandedTaskRosterId, setExpandedTaskRosterId] = useState<string | null>(null);

  // Daily Progress Log Modal for In-Progress Tasks
  const [progressModalGrievance, setProgressModalGrievance] = useState<Grievance | null>(null);
  const [logDayNumber, setLogDayNumber] = useState<number>(1);
  const [logProgressPercentage, setLogProgressPercentage] = useState<number>(35);
  const [logSummaryTamil, setLogSummaryTamil] = useState('');
  const [logSummaryEnglish, setLogSummaryEnglish] = useState('');
  const [logFundsSpentToday, setLogFundsSpentToday] = useState<number>(12000);
  const [logSitePhoto, setLogSitePhoto] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');

  // Supervisor Mark Work Finished Modal State
  const [finishedWorkGrievance, setFinishedWorkGrievance] = useState<Grievance | null>(null);
  const [finishCompletionNotes, setFinishCompletionNotes] = useState(
    'களப்பணிகள் 100% முழுமையாக நிறைவுற்றன. மேற்பார்வையாளர் நேரில் ஆய்வு செய்து தரக்கட்டுப்பாடு சான்றிதழ் அளித்துள்ளார். மக்கள் பயன்பாட்டிற்கு திறக்கப்பட்டது.'
  );
  const [finishActualSpent, setFinishActualSpent] = useState<number>(45000);
  const [finishSitePhoto, setFinishSitePhoto] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');
  const [isFinishing, setIsFinishing] = useState(false);

  // Fund utilisation editor state
  const [spentMaterials, setSpentMaterials] = useState<number>(15000);
  const [spentMachinery, setSpentMachinery] = useState<number>(12000);
  const [spentLabourWages, setSpentLabourWages] = useState<number>(8500);
  const [spentContingency, setSpentContingency] = useState<number>(2500);

  // Filter grievances
  const relevantGrievances = grievances.filter((g) => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.taluk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.village.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'pending') {
      return g.status === 'AI Verified' || g.status === 'Supervisor Review' || (g.supervisorReview?.decision === 'pending') || (!g.supervisorReview?.isReviewed && g.status === 'Submitted');
    }
    if (activeFilter === 'approved') {
      return g.supervisorReview?.decision === 'approved' || g.status === 'CM Cell Review' || g.status === 'CM Task Sanctioned' || g.status === 'Officer Assigned';
    }
    if (activeFilter === 'in_progress') {
      return g.status === 'In Progress' || g.isWorkInitiated || g.status === 'Field Inspection';
    }
    if (activeFilter === 'rejected') {
      return g.supervisorReview?.decision === 'rejected' || g.status === 'Rejected by Supervisor' || g.status === 'Rejected by CM Cell';
    }
    return true;
  });

  const handleOpenReviewModal = (g: Grievance, type: 'approved' | 'rejected') => {
    setSelectedGrievance(g);
    setDecisionType(type);
    setTaskTitle(g.title);
    
    if (type === 'approved') {
      setRemarksTamil('களப்பணியாளர்கள் நேரில் ஆய்வு செய்து அடிப்படை வசதி தேவை மற்றும் இடர்பாட்டை உறுதி செய்தனர். பணி ஆணை / துறை ஒப்படைப்பு பரிந்துரைக்கப்படுகிறது.');
      setRemarksEnglish('Field inspection verified civic requirement validity on site. Recommended for direct task opening or department assignment.');
      
      // Auto set department based on category
      if (g.category === 'Electricity & Street Lighting') {
        setAssignedDepartment('Tamil Nadu Generation and Distribution Corp (TANGEDCO)');
        setAssignedDepartmentTamil('தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)');
      } else if (g.category === 'Roads & Traffic Infrastructure') {
        setAssignedDepartment('State Highways & Minor Ports Department');
        setAssignedDepartmentTamil('நெடுஞ்சாலைகள் மற்றும் சிறு துறைமுகங்கள் துறை');
      } else if (g.category === 'Water Supply & Drainage') {
        setAssignedDepartment('Tamil Nadu Water Supply and Drainage (TWAD) Board / Metro Water');
        setAssignedDepartmentTamil('தமிழ்நாடு குடிநீர் வடிகால் வாரியம் (TWAD)');
      } else {
        setAssignedDepartment('Rural Development & Municipal Administration Dept');
        setAssignedDepartmentTamil('ஊரக வளர்ச்சி & நகராட்சி நிர்வாகத் துறை');
      }
    } else {
      setRemarksTamil('மனுதாரரின் கோரிக்கை தனியார் நில எல்லை சார்ந்தது / நகல் மனு என கள ஆய்வில் கண்டறியப்பட்டது. இறுதி மறுஆய்விற்காக முதலமைச்சர் சிறப்பு பிரிவுக்கு அனுப்பப்படுகிறது.');
      setRemarksEnglish('Site verification indicates private dispute or duplicate petition. Escalating to CM Special Cell for mandatory second-level review.');
    }
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setIsSubmitting(true);

    const trackingToken = `TN-DEPT-HQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const departmentAssignmentData: DepartmentAssignmentDetails | undefined = 
      decisionType === 'approved' && actionRoute === 'assign_department_districthq'
        ? {
            assignedDepartmentName: assignedDepartment,
            assignedDepartmentTamil: assignedDepartmentTamil,
            districtHQCollectoratePhone: districtHQPhone,
            districtNodalOfficerName: districtNodalOfficer,
            sanctionedBudgetINR: sanctionedBudget,
            resolutionTimelineDays: resolutionTimelineDays,
            trackingToken,
            dualFollowupActive: true,
            assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        : undefined;

    const openedTaskData = 
      decisionType === 'approved' && actionRoute === 'open_civic_task'
        ? {
            taskTitle: taskTitle || selectedGrievance.title,
            totalFundRequiredINR: totalFundRequired,
            labourCountRequired: labourCountRequired,
            dailyWageRateINR: dailyWageRate,
            daysRequired: daysRequired,
            workStartDate: workStartDate
          }
        : undefined;

    setTimeout(() => {
      onSupervisorDecision(selectedGrievance.id, decisionType, {
        remarksTamil: remarksTamil.trim() || 'ஆய்வு முடிவு பதிவு செய்யப்பட்டது.',
        remarksEnglish: remarksEnglish.trim() || 'Supervisor field assessment recorded.',
        fieldPhotos: selectedGrievance.images,
        actionRoute: decisionType === 'approved' ? actionRoute : undefined,
        openedTaskDetails: openedTaskData,
        departmentAssignment: departmentAssignmentData
      });

      setIsSubmitting(false);
      setSelectedGrievance(null);
      if (decisionType === 'approved') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    }, 400);
  };

  // Handle Direct Task Creation by Supervisor
  const handleConfirmDirectTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directTitle.trim()) return;

    const newDirectTask: VolunteerTask = {
      id: `vol-direct-${Date.now()}`,
      titleTamil: directTitleTamil || directTitle,
      titleEnglish: directTitle,
      district: directDistrict,
      ward: 'Special Ward Zone',
      category: directCategory,
      date: `Starting ${new Date().toISOString().split('T')[0]} (07:00 AM)`,
      location: directLocation,
      targetVolunteers: directLabour,
      joinedVolunteers: 0,
      targetLabourVolunteers: directLabour,
      registeredLabourVolunteers: 0,
      dailyWageINR: directWage,
      targetFinancialINR: directFunds,
      collectedFinancialINR: 0,
      financialContributorsCount: 0,
      timelineWindowDays: directDays,
      volunteerWindowDeadline: `${directDays} Days Supervisor Rapid Mobilization`,
      hoursRemaining: directDays * 24,
      isActivatedTask: true,
      activationDate: new Date().toISOString(),
      descriptionTamil: `வட்டார கள மேற்பார்வையாளர் நேரடி முன்முயற்சியாக துவக்கிய தன்னாட்சி மக்கள் திட்டம். ${directDays} நாட்களில் மக்கள் மற்றும் தொண்டர் படை மூலம் முடிக்க இலக்கு நிர்ணயிக்கப்பட்டுள்ளது.`,
      descriptionEnglish: `Direct grassroots civic task sanctioned by Taluk Field Supervisor for completion within ${directDays} days.`,
      coordinatorName: supervisorName,
      coordinatorPhone: currentProfile?.mobileNumber || '9840123456',
      status: 'Upcoming',
      isWorkStarted: false,
      workExecutionStatus: 'Mobilizing',
      impactMetric: `Direct taluk civic enhancement in ${directTaluk}`,
      allowFinancialSupport: true,
      allowPhysicalLabour: true,
      allowFoodRefreshmentSupport: true,
      foodContributionsCount: 0,
      totalMealsPledged: 0,
      totalWaterBottlesPledged: 0,
      totalRefreshmentPacksPledged: 0,
      surplusAmountINR: 0,
      isSurplusTransferred: false,
      supervisorControl: {
        supervisorName: supervisorName,
        supervisorDesignation: 'Taluk Field Nodal Supervisor',
        supervisorPhone: currentProfile?.mobileNumber || '9840123456',
        estimatedTotalCostINR: directFunds,
        costBreakdown: {
          materialsCost: Math.round(directFunds * 0.4),
          machineryEquipmentCost: Math.round(directFunds * 0.3),
          labourAndSafetyCost: Math.round(directFunds * 0.2),
          contingencyLogisticsCost: Math.round(directFunds * 0.1),
        },
        workStartDate: new Date().toISOString().split('T')[0],
        workDurationDays: directDays,
        timelineWindowDays: directDays,
        shiftTiming: 'Morning Shift (06:30 AM - 01:30 PM)',
        requiredStaffCount: directLabour,
        requiredSpecialists: ['1 Lead Site Engineer', 'JCB Operator', 'Safety Marshal'],
        surplusFundAction: 'transfer_to_district_development_pool',
        surplusTransferredINR: 0,
        lastUpdatedTimestamp: new Date().toLocaleTimeString()
      },
      contributions: []
    };

    if (onCreateDirectTask) {
      onCreateDirectTask(newDirectTask);
    }

    setIsDirectTaskModalOpen(false);
    setDirectTitle('');
    setDirectTitleTamil('');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // Download JSON Financial Report for Specific Task in Supervisor View
  const handleDownloadTaskFinancialReport = (task: VolunteerTask) => {
    const financialContributions = (task.contributions || []).filter(
      (c) => c.type === 'financial' || (c.amountINR && c.amountINR > 0)
    );

    const targetFin = task.supervisorControl?.estimatedTotalCostINR || task.targetFinancialINR || 0;
    const collectedFin = task.collectedFinancialINR || 0;
    const surplusAmt = task.surplusAmountINR || (collectedFin > targetFin ? collectedFin - targetFin : 0);

    const reportPayload = {
      reportHeader: {
        reportType: "Civic Task Financial & Escrow Contribution Statement",
        reportVersion: "2026.1",
        generationTimestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        auditedBy: {
          supervisorName: task.supervisorControl?.supervisorName || supervisorName || "Taluk Nodal Supervisor",
          designation: task.supervisorControl?.supervisorDesignation || "Field Supervisor",
          contactNumber: task.coordinatorPhone || currentProfile?.mobileNumber || "9840XXXXXX",
          department: "Department of Municipal Administration & Water Supply, Govt of Tamil Nadu"
        },
        auditCertification: "100% Direct Civic Escrow Audited - Verified via NPCI UPI 2.0 Switch"
      },
      taskSummary: {
        taskId: task.id,
        titleEnglish: task.titleEnglish,
        titleTamil: task.titleTamil,
        district: task.district,
        ward: task.ward,
        location: task.location,
        category: task.category,
        timelineWindowDays: task.timelineWindowDays || 3,
        workExecutionStatus: task.workExecutionStatus || (task.isWorkStarted ? 'In Progress' : 'Mobilizing'),
        impactMetric: task.impactMetric || 'Grassroots civic betterment'
      },
      financialOverview: {
        currency: "INR (₹)",
        targetBudgetINR: targetFin,
        totalCollectedINR: collectedFin,
        fundingPercentage: targetFin > 0 ? Math.round((collectedFin / targetFin) * 100) : 0,
        totalFinancialContributors: task.financialContributorsCount || financialContributions.length,
        surplusAmountINR: surplusAmt,
        isSurplusTransferred: task.isSurplusTransferred || surplusAmt > 0,
        surplusEscrowAction: surplusAmt > 0 ? "Auto-routed to District Civic Development Pool" : "None Required",
        budgetCostBreakdown: task.supervisorControl?.costBreakdown || {
          materialsCost: Math.round(targetFin * 0.4),
          machineryEquipmentCost: Math.round(targetFin * 0.3),
          labourAndSafetyCost: Math.round(targetFin * 0.2),
          contingencyLogisticsCost: Math.round(targetFin * 0.1),
        }
      },
      simulatedFinancialContributions: financialContributions.map((c, index) => {
        const amt = c.amountINR || 0;
        return {
          itemNo: index + 1,
          contributionId: c.id,
          receiptNumber: `TN-ESCROW-${(c.id || `TX${index}`).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`,
          donorName: c.contributorName || "Anonymous Civic Benefactor",
          donorPhone: c.contributorPhone || "9840XXXXXX",
          amountINR: amt,
          paymentMethod: c.paymentMethod ? `${c.paymentMethod} (UPI)` : "UPI App",
          upiTransactionId: c.upiTransactionId || `SBI-NPCI-2026-${(c.id || `TX${index}`).replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`,
          timestamp: c.timestamp || "2026-08-16 10:30 AM",
          taxExemptionStatus: "Section 80G Certified",
          fundAllocation: {
            materialsINR: Math.round(amt * 0.4),
            machineryINR: Math.round(amt * 0.3),
            labourINR: Math.round(amt * 0.2),
            contingencyINR: Math.round(amt * 0.1),
          }
        };
      }),
      complianceAndVerification: {
        escrowReference: `TN-GOVT-ESCROW-${task.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`,
        statutoryFramework: "Tamil Nadu Civic Co-Governance & Public Participation Protocol",
        digitalSignatureStamp: `TN-AUDIT-SIG-${Date.now().toString(36).toUpperCase()}`
      }
    };

    const jsonBlob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(jsonBlob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `TN_Civic_Task_Financial_Report_${task.id}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(downloadUrl);
  };

  // Handle Supervisor Starting Volunteer Work Execution
  const handleConfirmStartWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startWorkTask) return;

    if (onStartVolunteerWork) {
      onStartVolunteerWork(startWorkTask.id, startWorkNotes);
    }

    setStartWorkTask(null);
  };

  // Handle Opening Progress Log Modal
  const handleOpenProgressModal = (g: Grievance) => {
    setProgressModalGrievance(g);
    const existingReports = g.dailyProgressReports || [];
    const nextDay = existingReports.length + 1;
    setLogDayNumber(nextDay);
    setLogProgressPercentage(Math.min(100, nextDay * 30));
    setLogSummaryTamil(`நாள் ${nextDay}: களப்பணிகள் திட்டமிட்டபடி நடைபெற்றன. பொருட்கள் இறக்கப்பட்டு தொழில்நுட்பப் பணிகள் முன்னேற்றம் அடைந்துள்ளன.`);
    setLogSummaryEnglish(`Day ${nextDay}: Field execution proceeded as planned. Materials deployed and technical works achieved critical milestones.`);
    setLogFundsSpentToday(10000);
  };

  // Submit Daily Progress Log
  const handleSubmitDailyProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressModalGrievance) return;

    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const newReport: DailyProgressReport = {
      dayNumber: logDayNumber,
      date: new Date().toLocaleDateString('en-IN'),
      progressPercentage: logProgressPercentage,
      workSummaryTamil: logSummaryTamil,
      workSummaryEnglish: logSummaryEnglish,
      fundsSpentTodayINR: logFundsSpentToday,
      sitePhoto: logSitePhoto,
      updatedBy: supervisorName,
      timestamp: nowStr
    };

    const totalBudget = progressModalGrievance.supervisorReview?.openedTaskDetails?.totalFundRequiredINR || 50000;
    const totalSpent = spentMaterials + spentMachinery + spentLabourWages + spentContingency + logFundsSpentToday;
    const fundSummary: FundUtilisationSummary = {
      totalBudgetINR: totalBudget,
      totalSpentINR: totalSpent,
      materialsSpentINR: spentMaterials,
      machinerySpentINR: spentMachinery,
      labourWagesPaidINR: spentLabourWages,
      contingencySpentINR: spentContingency,
      balanceRemainingINR: Math.max(0, totalBudget - totalSpent),
      lastUpdated: nowStr
    };

    if (onUpdateDailyProgress) {
      onUpdateDailyProgress(progressModalGrievance.id, newReport, fundSummary);
    }

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    setProgressModalGrievance(null);
  };

  // Open Finished Work Modal
  const handleOpenFinishModal = (g: Grievance) => {
    setFinishedWorkGrievance(g);
    const budget = g.fundUtilisation?.totalBudgetINR || g.supervisorReview?.openedTaskDetails?.totalFundRequiredINR || 45000;
    setFinishActualSpent(budget);
    setFinishCompletionNotes(
      language === 'ta'
        ? 'கள ஆய்வு அதிகாரியால் பணிகள் 100% நேரில் ஆய்வு செய்யப்பட்டு முழுமையாக நிறைவுற்றது என உறுதி செய்யப்பட்டது. தரம் சான்றளிக்கப்பட்டு மக்கள் பயன்பாட்டிற்கு ஒப்படைக்கப்பட்டது.'
        : 'Work 100% physically inspected and certified complete by Field Supervisor. Quality standards satisfied and handed over to public.'
    );
  };

  // Confirm Finished Work
  const handleConfirmFinishedWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishedWorkGrievance) return;
    setIsFinishing(true);

    setTimeout(() => {
      if (onMarkWorkFinished) {
        onMarkWorkFinished(finishedWorkGrievance.id, {
          completionNotes: finishCompletionNotes,
          actualSpentINR: finishActualSpent,
          completionPhotoUrl: finishSitePhoto
        });
      }
      setIsFinishing(false);
      setFinishedWorkGrievance(null);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 400);
  };

  // Total funds mobilized across volunteer padai
  const totalMobilizedINR = volunteerTasks.reduce((acc, t) => acc + (t.collectedFinancialINR || 0), 0);
  const totalTargetFundsINR = volunteerTasks.reduce((acc, t) => acc + (t.targetFinancialINR || 0), 0);
  const totalVolunteersJoined = volunteerTasks.reduce((acc, t) => acc + (t.registeredLabourVolunteers || 0) + (t.joinedVolunteers || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* View Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-300" />
              {language === 'ta' ? 'நிலை 2: வட்டார கள மேற்பார்வை & பணி மேலாண்மை' : 'Level 2: Taluk Field Supervisor & Work Operations Desk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'ta' ? 'மனுக்கள் ஆய்வு, தொண்டர் படை துவக்கம் & களப்பணி கட்டுப்பாடு' : 'Grievance Triage, Padai Task Launch & Field Operations'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {language === 'ta'
                ? 'பொதுமக்கள் மனுக்களை ஆய்வு செய்து ஏற்பளிக்கவும், தேவையான நிதி & ஆட்களுடன் தொண்டர் படையில் பணிகளை துவக்கவும், களப்பணியை சரிபார்த்து துவங்கவும்.'
                : 'Inspect AI-verified petitions, sanction tasks with funds & workforce to Volunteer Padai, verify resources, and launch on-ground execution.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-amber-300">
                {grievances.filter((g) => g.status === 'AI Verified' || g.status === 'Supervisor Review' || g.status === 'Submitted').length}
              </span>
              <p className="text-[11px] text-slate-300 font-medium">
                {language === 'ta' ? 'ஆய்வுக்குரியவை' : 'Pending Triage'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-emerald-300">
                {volunteerTasks.length}
              </span>
              <p className="text-[11px] text-slate-300 font-medium">
                {language === 'ta' ? 'தொண்டர் படை பணிகள்' : 'Padai Tasks'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <span className="text-2xl font-black text-cyan-300">
                ₹{totalMobilizedINR.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-slate-300 font-medium">
                {language === 'ta' ? 'திரட்டப்பட்ட நிதி' : 'Mobilized Funds'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Supervisor Section Switcher */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center gap-2 border border-slate-200">
        <button
          onClick={() => setActiveTab('grievances')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'grievances'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>{language === 'ta' ? '1. பொதுமக்கள் மனுக்கள் ஆய்வு (Triage)' : '1. Petitions Triage & Review'}</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
            {grievances.filter((g) => g.status === 'AI Verified' || g.status === 'Supervisor Review' || g.status === 'Submitted').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('volunteer_desk')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'volunteer_desk'
              ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{language === 'ta' ? '2. தொண்டர் படை நேரலை & பணி துவக்கம்' : '2. Volunteer Padai Live Desk & Launch'}</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
            {volunteerTasks.length} {language === 'ta' ? 'பணிகள்' : 'Tasks'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('daily_progress')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'daily_progress'
              ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-cyan-600" />
          <span>{language === 'ta' ? '3. தினசரி களப்பணி முன்னேற்றம்' : '3. Daily Field Progress Logs'}</span>
          <span className="bg-cyan-100 text-cyan-800 text-[10px] font-black px-2 py-0.5 rounded-full">
            {grievances.filter((g) => g.status === 'In Progress' || g.isWorkInitiated).length}
          </span>
        </button>
      </div>

      {/* ================= TAB 2: VOLUNTEER PADAI LIVE DESK & WORK INITIATION ================= */}
      {activeTab === 'volunteer_desk' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Volunteer Desk Header & Direct Task Launch Button */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'ta' ? 'நேரலை தொண்டர் படை ஒருங்கிணைப்பு' : 'Live Padai Synchronization'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'ta' ? 'மேற்பார்வையாளர் அங்கீகாரம் பெற்ற களப்பணிகள்' : 'Supervisor Sanctioned Field Operations'}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {language === 'ta' ? 'தொண்டர் படை நேரலை மேசை & களப்பணி துவக்கம்' : 'Volunteer Padai Control Desk & Work Initiation'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ta'
                  ? 'நிதி வரவு, கூலி ஆட்கள் மற்றும் தொண்டர்கள் விருப்பத்தை சரிபார்த்து களப்பணியைத் துவக்கவும்.'
                  : 'Verify mobilized escrow funds, daily-wage labour registrations, and launch on-site work directly.'}
              </p>
            </div>

            <button
              onClick={() => setIsDirectTaskModalOpen(true)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'ta' ? '+ புதிய மக்கள் களப்பணி துவங்கு' : '+ Sanction Direct Padai Task'}</span>
            </button>
          </div>

          {/* Volunteer Tasks List */}
          {volunteerTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700">
                {language === 'ta' ? 'தொண்டர் படை பணிகள் எதுவும் இல்லை' : 'No Volunteer Tasks Sanctioned Yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ta'
                  ? 'மனுக்கள் ஆய்வில் ஒப்புதல் அளித்து தொண்டர் படை பணியை உருவாக்கவும் அல்லது மேலே உள்ள பொத்தானை அழுத்தி புதிய பணியைத் துவங்கவும்.'
                  : 'Approve a petition in the Triage tab to open a task, or click "Sanction Direct Padai Task" above.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {volunteerTasks.map((task) => {
                const fundPercent = Math.min(100, Math.round(((task.collectedFinancialINR || 0) / (task.targetFinancialINR || 1)) * 100));
                const labourCount = (task.registeredLabourVolunteers || 0) + (task.joinedVolunteers || 0);
                const labourTarget = task.targetLabourVolunteers || task.targetVolunteers || 15;
                const isReadyToStart = (task.collectedFinancialINR || 0) > 0 || labourCount > 0;
                const isWorkStarted = task.isWorkStarted || task.status === 'In Progress';
                const contributions = task.contributions || [];
                const isRosterExpanded = expandedTaskRosterId === task.id;

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-5"
                  >
                    {/* Task Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] font-bold bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-800 border border-slate-200">
                            {task.id}
                          </span>
                          {task.linkedGrievanceId && (
                            <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-indigo-200">
                              {language === 'ta' ? `இணைக்கப்பட்ட மனு: ${task.linkedGrievanceId}` : `Linked Grievance: ${task.linkedGrievanceId}`}
                            </span>
                          )}
                          <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                            {task.category}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2">
                          {language === 'ta' ? task.titleTamil : task.titleEnglish}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.location} ({task.district})</span>
                          <span className="text-slate-300">•</span>
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.date}</span>
                        </p>
                      </div>

                      {/* Status & Work Badge */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        {isWorkStarted ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {language === 'ta' ? 'களப்பணி நடைபெறுகிறது' : 'Work In Progress'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {language === 'ta' ? 'ஆட்கள் & நிதி திரட்டல்' : 'Mobilizing'}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {language === 'ta' ? `கால அளவு: ${task.timelineWindowDays || 3} நாட்கள்` : `Timeline: ${task.timelineWindowDays || 3} Days`}
                        </span>
                      </div>
                    </div>

                    {/* Progress Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Financial Mobilization */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                            {language === 'ta' ? 'நிதி இலக்கு & வரவு' : 'Fund Mobilized'}
                          </span>
                          <span className="font-bold text-emerald-700">{fundPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${fundPercent}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{language === 'ta' ? 'வரவு:' : 'Raised:'} <strong className="text-slate-800">₹{(task.collectedFinancialINR || 0).toLocaleString('en-IN')}</strong></span>
                          <span>{language === 'ta' ? 'இலக்கு:' : 'Target:'} <strong className="text-slate-800">₹{(task.targetFinancialINR || 0).toLocaleString('en-IN')}</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex items-center justify-between">
                          <span>{task.financialContributorsCount || 0} {language === 'ta' ? 'நன்கொடையாளர்கள் (UPI)' : 'UPI Donors'}</span>
                          <span>{language === 'ta' ? '40-30-20-10 வெளிப்படை' : 'Transparent Escrow'}</span>
                        </div>
                      </div>

                      {/* Labour / Workforce */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <HardHat className="w-3.5 h-3.5 text-amber-600" />
                            {language === 'ta' ? 'பணியாளர்கள் & தொண்டர்கள்' : 'Labour & Volunteers'}
                          </span>
                          <span className="font-bold text-amber-700">{labourCount} / {labourTarget}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((labourCount / labourTarget) * 100))}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{language === 'ta' ? 'பதிவானோர்:' : 'Registered:'} <strong className="text-slate-800">{labourCount} {language === 'ta' ? 'பேர்' : 'people'}</strong></span>
                          <span>{language === 'ta' ? 'தேவை:' : 'Target:'} <strong className="text-slate-800">{labourTarget} {language === 'ta' ? 'பேர்' : 'people'}</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex items-center justify-between">
                          <span>{language === 'ta' ? `தினக்கூலி: ₹${task.dailyWageINR || 650}/நாள்` : `Wage: ₹${task.dailyWageINR || 650}/day`}</span>
                          <span>{language === 'ta' ? 'இலவச சிரமதானம் உண்டு' : 'Shramdaan Active'}</span>
                        </div>
                      </div>

                      {/* Food & Refreshment Support */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Utensils className="w-3.5 h-3.5 text-indigo-600" />
                            {language === 'ta' ? 'உணவு & குடிநீர் உதவி' : 'Food & Water Pledges'}
                          </span>
                          <span className="font-bold text-indigo-700">{task.totalMealsPledged || 0} {language === 'ta' ? 'பொட்டலங்கள்' : 'Meals'}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-1 py-1">
                          <div className="flex items-center justify-between">
                            <span>{language === 'ta' ? '🍱 மதிய உணவு:' : '🍱 Meals Pledged:'}</span>
                            <strong className="text-slate-800">{task.totalMealsPledged || 0} {language === 'ta' ? 'பேருக்கு' : 'packs'}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{language === 'ta' ? '💧 குடிநீர் பாட்டில்கள்:' : '💧 Water Bottles:'}</span>
                            <strong className="text-slate-800">{task.totalWaterBottlesPledged || 0} {language === 'ta' ? 'பாட்டில்கள்' : 'bottles'}</strong>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                          {language === 'ta' ? 'களப்பணியாளர்களுக்கு நேரடியாக விநியோகம்' : 'Direct site distribution'}
                        </div>
                      </div>

                    </div>

                    {/* Action Bar & Donors Roster Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => setExpandedTaskRosterId(isRosterExpanded ? null : task.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>
                            {isRosterExpanded 
                              ? (language === 'ta' ? 'பட்டியலை மறைக்க' : 'Hide Contributors Roster') 
                              : (language === 'ta' ? `பங்களிப்பாளர்கள் பட்டியல் (${contributions.length})` : `View Donors & Volunteers Roster (${contributions.length})`)}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDownloadTaskFinancialReport(task)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
                          title="Download itemized JSON summary of all simulated financial contributions and escrow budget"
                        >
                          <FileJson className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{language === 'ta' ? 'நிதி அறிக்கை (JSON)' : 'Download Financial Report'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {!isWorkStarted ? (
                          <button
                            onClick={() => {
                              setStartWorkTask(task);
                              setStartWorkNotes(`வட்டார மேற்பார்வையாளர் ${supervisorName} கள ஆய்வு செய்தார். ₹${(task.collectedFinancialINR || 0).toLocaleString('en-IN')} நிதி மற்றும் ${labourCount} பணியாளர்கள் சரிபார்க்கப்பட்டு பணிகள் துவங்கப்படுகின்றன.`);
                            }}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{language === 'ta' ? 'சரிபார்த்து களப்பணியைத் துவங்கு' : 'Inspect & Start Ground Work'}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              {language === 'ta' ? 'களப்பணி தொடங்கப்பட்டது' : 'Execution Started'}
                            </span>
                            {task.linkedGrievanceId && (
                              <button
                                onClick={() => {
                                  const linkedG = grievances.find(g => g.id === task.linkedGrievanceId);
                                  if (linkedG) handleOpenProgressModal(linkedG);
                                }}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>{language === 'ta' ? 'முன்னேற்றப் பதிவு' : 'Log Daily Progress'}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Donors & Registered Volunteers Accordion Table */}
                    {isRosterExpanded && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            {language === 'ta' ? 'நேரலை பதிவு செய்த தன்னார்வலர்கள் மற்றும் நிதி நன்கொடையாளர்கள்' : 'Live Registered Benefactors & Volunteers'}
                          </h4>
                          <button
                            onClick={() => handleDownloadTaskFinancialReport(task)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] rounded-lg shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{language === 'ta' ? 'நிதி அறிக்கை பதிவிறக்கம் (JSON)' : 'Download Financial Report (JSON)'}</span>
                          </button>
                        </div>

                        {contributions.length === 0 ? (
                          <p className="text-xs text-slate-500 py-3 text-center">
                            {language === 'ta' 
                              ? 'இன்னும் பொதுப் பங்களிப்புகள் பதிவாகவில்லை. தொண்டர் படை பக்கத்தில் பொதுமக்கள் நிதி, கூலி ஆட்கள் மற்றும் உணவு வழங்கி பங்களிக்கலாம்.'
                              : 'No external contributions logged yet. Citizens can contribute via UPI or volunteer in the Volunteer Padai tab.'}
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                  <th className="pb-2 font-medium">{language === 'ta' ? 'பெயர்' : 'Contributor'}</th>
                                  <th className="pb-2 font-medium">{language === 'ta' ? 'வகை' : 'Type'}</th>
                                  <th className="pb-2 font-medium">{language === 'ta' ? 'விவரம் / தொகை' : 'Details'}</th>
                                  <th className="pb-2 font-medium">{language === 'ta' ? 'UPI குறிப்பு / தொடர்பு' : 'Ref / Phone'}</th>
                                  <th className="pb-2 font-medium text-right">{language === 'ta' ? 'நேரம்' : 'Time'}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {contributions.map((c) => (
                                  <tr key={c.id} className="text-slate-800">
                                    <td className="py-2.5 font-bold">{c.contributorName}</td>
                                    <td className="py-2.5">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                        c.type === 'financial' ? 'bg-emerald-100 text-emerald-800' :
                                        c.type === 'physical_labour' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                                      }`}>
                                        {c.type === 'financial' ? 'UPI Fund' : c.type === 'physical_labour' ? 'Labour' : 'Food'}
                                      </span>
                                    </td>
                                    <td className="py-2.5">
                                      {c.type === 'financial' && <strong className="text-emerald-700">₹{c.amountINR.toLocaleString('en-IN')}</strong>}
                                      {c.type === 'physical_labour' && <span>{c.preferredRole} ({c.shramdaanOrWage === 'daily_wage' ? 'Wage' : 'Free'})</span>}
                                      {c.type === 'food_refreshment' && <span>{c.mealsCount || 0} meals / {c.waterBottlesCount || 0} water</span>}
                                    </td>
                                    <td className="py-2.5 font-mono text-[11px] text-slate-500">
                                      {c.upiTransactionId || c.contributorPhone || 'N/A'}
                                    </td>
                                    <td className="py-2.5 text-right text-slate-400 text-[11px]">{c.timestamp}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 1: GRIEVANCES REVIEW & TRIAGE ================= */}
      {activeTab === 'grievances' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filters & Search Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'pending'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⏳ {language === 'ta' ? 'ஆய்வு செய்ய வேண்டியவை' : 'Awaiting Review'}
              </button>
              <button
                onClick={() => setActiveFilter('in_progress')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'in_progress'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⚡ {language === 'ta' ? 'நடப்பு களப்பணி முன்னேற்றம்' : 'Active Field Progress'}
              </button>
              <button
                onClick={() => setActiveFilter('approved')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ✅ {language === 'ta' ? 'ஏற்கப்பட்டவை' : 'Approved'}
              </button>
              <button
                onClick={() => setActiveFilter('rejected')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'rejected'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⚠️ {language === 'ta' ? 'தள்ளுபடி (CM மறுஆய்வு)' : 'Rejected (CM Re-Review)'}
              </button>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📋 {language === 'ta' ? 'அனைத்தும்' : 'All Petitions'}
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'ta' ? 'மனு எண் / ஊர் தேடுக...' : 'Search token or village...'}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Grievance Review Grid */}
          {relevantGrievances.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-700 text-base">
                {language === 'ta' ? 'மனுக்கள் எதுவும் இல்லை' : 'No Petitions in this Category'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'ta' 
                  ? 'தேர்ந்தெடுக்கப்பட்ட பிரிவில் ஆய்வுக்குரிய மனுக்கள் ஏதுமில்லை.'
                  : 'There are no grievances matching your current filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantGrievances.map((g) => {
                const hasSupervisorReviewed = g.supervisorReview?.isReviewed;
                const isApproved = g.supervisorReview?.decision === 'approved';
                const isRejected = g.supervisorReview?.decision === 'rejected';
                const hasProgressLogs = (g.dailyProgressReports && g.dailyProgressReports.length > 0);

                return (
                  <div
                    key={g.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                            {g.id}
                          </span>
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-200 text-[11px]">
                            {language === 'ta' ? g.categoryTamil : g.category}
                          </span>
                        </div>

                        {/* AI Genuineity Score Badge */}
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          AI Score: {g.aiVerification?.genuineityScore || 92}% {language === 'ta' ? 'உண்மை' : 'Genuine'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {language === 'ta' ? g.titleTamil || g.title : g.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {language === 'ta' ? g.descriptionTamil || g.description : g.description}
                        </p>
                      </div>

                      {/* Location & Citizen Identity */}
                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            {g.village}, {g.taluk} ({g.district})
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            Aadhaar: {g.citizenAadhaarMasked}
                          </span>
                        </div>
                      </div>

                      {/* Supervisor Decision Pill or Status */}
                      {hasSupervisorReviewed && (
                        <div className={`p-3 rounded-2xl border text-xs ${
                          isApproved ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                        }`}>
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5">
                              {isApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                              {isApproved 
                                ? (language === 'ta' ? 'மேற்பார்வையாளர் ஏற்றார்' : 'Approved by Supervisor')
                                : (language === 'ta' ? 'தள்ளுபடி செய்யப்பட்டது (CM Cell மறுஆய்வு)' : 'Rejected (Escalated to CM Cell)')}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {g.supervisorReview?.fieldInspectionDate}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-600 italic">
                            "{language === 'ta' ? g.supervisorReview?.remarksTamil : g.supervisorReview?.remarksEnglish}"
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onOpenGrievanceDetail(g)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'விவரம்' : 'View Full Details'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {!hasSupervisorReviewed ? (
                          <>
                            <button
                              onClick={() => handleOpenReviewModal(g, 'rejected')}
                              className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                            >
                              ✕ {language === 'ta' ? 'தள்ளுபடி' : 'Reject'}
                            </button>
                            <button
                              onClick={() => handleOpenReviewModal(g, 'approved')}
                              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              ✓ {language === 'ta' ? 'ஆய்வு செய்து அனுமதி' : 'Approve & Sanction'}
                            </button>
                          </>
                        ) : isApproved && (g.status === 'In Progress' || g.isWorkInitiated) ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenProgressModal(g)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'முன்னேற்ற அறிக்கை' : 'Progress'}</span>
                            </button>
                            <button
                              onClick={() => handleOpenFinishModal(g)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{language === 'ta' ? 'பணி நிறைவுற்றது' : 'Mark Finished'}</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: DAILY FIELD PROGRESS LOGS ================= */}
      {activeTab === 'daily_progress' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-xl font-black text-slate-900">
              {language === 'ta' ? 'நடப்பு களப்பணி முன்னேற்றம் மற்றும் நிதி கண்காணிப்பு' : 'Active Field Progress & Fund Utilization Desk'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ta'
                ? 'நேரடி களப்பணிகளுக்கு தினசரி புகைப்படம், முன்னேற்ற சதவீதம் மற்றும் நிதிச் செலவு அறிக்கைகளை இங்கு பதிவு செய்யலாம்.'
                : 'Log daily milestone completion %, upload site inspection photos, and update transparent fund utilization.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grievances.filter(g => g.status === 'In Progress' || g.isWorkInitiated).map(g => (
              <div key={g.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                    {g.id}
                  </span>
                  <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {language === 'ta' ? 'களப்பணி நடப்பில் உள்ளது' : 'In Progress'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{language === 'ta' ? g.titleTamil : g.title}</h3>
                <p className="text-xs text-slate-500">{g.village}, {g.taluk}</p>

                {g.fundUtilisation && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === 'ta' ? 'ஒதுக்கப்பட்ட நிதி:' : 'Budget:'}</span>
                      <strong className="text-slate-800">₹{g.fundUtilisation.totalBudgetINR.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === 'ta' ? 'செலவிடப்பட்டது:' : 'Spent:'}</span>
                      <strong className="text-emerald-700">₹{g.fundUtilisation.totalSpentINR.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleOpenProgressModal(g)}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{language === 'ta' ? 'இன்றைய முன்னேற்ற அறிக்கை பதிவு செய்க' : 'Log Today Progress Report'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL 1: SUPERVISOR DECISION MODAL ================= */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
            
            {/* Modal Header */}
            <div className={`p-6 text-white ${decisionType === 'approved' ? 'bg-indigo-900' : 'bg-red-900'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    {decisionType === 'approved' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {decisionType === 'approved' 
                        ? (language === 'ta' ? 'மேற்பார்வையாளர் கள ஆய்வு ஒப்புதல் & பணி துவக்கம்' : 'Supervisor Inspection Approval & Task Sanction')
                        : (language === 'ta' ? 'மனு தள்ளுபடி & CM Cell மறுஆய்வுக்கு அனுப்புதல்' : 'Petition Rejection & CM Cell Escalation')}
                    </h3>
                    <p className="text-xs text-white/70">
                      Token: {selectedGrievance.id} • {selectedGrievance.village}, {selectedGrievance.taluk}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmDecision} className="p-6 space-y-5 text-xs">
              
              {/* Route Selector (Approved only) */}
              {decisionType === 'approved' && (
                <div className="space-y-3">
                  <label className="font-bold text-slate-800 block text-xs">
                    {language === 'ta' ? 'பணி செயல்படுத்தும் பாதை தேர்வு செய்க:' : 'Select Execution Pathway:'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionRoute('open_civic_task')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        actionRoute === 'open_civic_task'
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-indigo-700">
                        <Users className="w-4 h-4" />
                        <span>{language === 'ta' ? 'பாதை A: தொண்டர் படை நேரடி மக்கள் பணி' : 'Pathway A: Volunteer Padai Civic Work'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {language === 'ta' ? 'நிதி மற்றும் தினக்கூலி ஆட்களுடன் தொண்டர் படையில் உடனடியாக துவங்குதல்.' : 'Immediate grassroots execution with mobilized budget & labour workforce.'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionRoute('assign_department_districthq')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        actionRoute === 'assign_department_districthq'
                          ? 'border-purple-600 bg-purple-50/70 text-purple-950 ring-2 ring-purple-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-purple-700">
                        <Building2 className="w-4 h-4" />
                        <span>{language === 'ta' ? 'பாதை B: சிறப்புத் துறை & மாவட்ட HQ ஒப்படைப்பு' : 'Pathway B: Department & District HQ'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {language === 'ta' ? 'TANGEDCO / TWAD / நெடுஞ்சாலை துறை மற்றும் மாவட்ட ஆட்சியர் மேற்பார்வை.' : 'Official nodal department work order with Collectorate tracking.'}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Pathway A Parameters Form */}
              {decisionType === 'approved' && actionRoute === 'open_civic_task' && (
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3 animate-in fade-in">
                  <h4 className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    {language === 'ta' ? 'தொண்டர் படை பணிக்கான நிதி மற்றும் ஆட்கள் ஒதுக்கீடு:' : 'Task Budget, Labour Count & Window Specifications:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">
                        {language === 'ta' ? 'தேவையான மொத்த நிதி (₹):' : 'Total Fund Required (₹):'}
                      </label>
                      <input
                        type="number"
                        value={totalFundRequired}
                        onChange={(e) => setTotalFundRequired(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">
                        {language === 'ta' ? 'தேவையான களப்பணியாளர்கள் எண்ணிக்கை:' : 'Required Labour Count:'}
                      </label>
                      <input
                        type="number"
                        value={labourCountRequired}
                        onChange={(e) => setLabourCountRequired(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">
                        {language === 'ta' ? 'அரசு தினக்கூலி வீதம் (₹/நாள்):' : 'Daily Wage Rate (₹/day):'}
                      </label>
                      <input
                        type="number"
                        value={dailyWageRate}
                        onChange={(e) => setDailyWageRate(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-700 block mb-1">
                        {language === 'ta' ? 'முடிக்க வேண்டிய கால அளவு (நாட்கள்):' : 'Resolution Window (Days):'}
                      </label>
                      <input
                        type="number"
                        value={daysRequired}
                        onChange={(e) => setDaysRequired(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks Fields */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'ta' ? 'மேற்பார்வையாளர் கள ஆய்வு குறிப்பு (தமிழ்):' : 'Supervisor Inspection Remarks (Tamil):'}
                  </label>
                  <textarea
                    rows={2}
                    value={remarksTamil}
                    onChange={(e) => setRemarksTamil(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'ta' ? 'மேற்பார்வையாளர் கள ஆய்வு குறிப்பு (ஆங்கிலம்):' : 'Supervisor Inspection Remarks (English):'}
                  </label>
                  <textarea
                    rows={2}
                    value={remarksEnglish}
                    onChange={(e) => setRemarksEnglish(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md cursor-pointer ${
                    decisionType === 'approved' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting 
                    ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting...') 
                    : (decisionType === 'approved' ? (language === 'ta' ? '✓ ஒப்புதல் வழங்கி துவங்கு' : '✓ Sanction & Launch') : (language === 'ta' ? 'தள்ளுபடி செய் (CM Cell)' : 'Reject & Forward'))}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: DIRECT TASK CREATION MODAL ================= */}
      {isDirectTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
            
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {language === 'ta' ? 'புதிய தொண்டர் படை மக்கள் பணி துவங்குதல்' : 'Sanction Direct Volunteer Padai Task'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {language === 'ta' ? 'மேற்பார்வையாளர் நேரடி மக்கள் பணி ஆணை' : 'Supervisor Grassroots Task Sanction'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDirectTaskModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDirectTask} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'ta' ? 'பணி தலைப்பு (தமிழ்):' : 'Task Title (Tamil):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="எ.கா: செந்துறை பெரிய ஏரி தூர்வாருதல் மற்றும் கரைகள் சீரமைப்பு"
                  value={directTitleTamil}
                  onChange={(e) => setDirectTitleTamil(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'ta' ? 'பணி தலைப்பு (ஆங்கிலம்):' : 'Task Title (English):'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sendurai Big Lake Desilting and Bund Restoration"
                  value={directTitle}
                  onChange={(e) => setDirectTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'ta' ? 'பணி வகை:' : 'Task Category:'}
                  </label>
                  <select
                    value={directCategory}
                    onChange={(e) => setDirectCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Sanitation & Desilting">Sanitation & Desilting</option>
                    <option value="Tree Plantation">Tree Plantation</option>
                    <option value="Road & Pothole Repair">Road & Pothole Repair</option>
                    <option value="School & Library Renovation">School & Library Renovation</option>
                    <option value="Water Body Restoration">Water Body Restoration</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'ta' ? 'இடம் / கிராமம்:' : 'Location / Village:'}
                  </label>
                  <input
                    type="text"
                    value={directLocation}
                    onChange={(e) => setDirectLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'ta' ? 'தேவையான நிதி (₹):' : 'Target Fund (₹):'}
                  </label>
                  <input
                    type="number"
                    value={directFunds}
                    onChange={(e) => setDirectFunds(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'ta' ? 'ஆட்கள் (பேர்):' : 'Workers (Count):'}
                  </label>
                  <input
                    type="number"
                    value={directLabour}
                    onChange={(e) => setDirectLabour(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'ta' ? 'தினக்கூலி (₹):' : 'Wage (₹):'}
                  </label>
                  <input
                    type="number"
                    value={directWage}
                    onChange={(e) => setDirectWage(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'ta' ? 'நாட்கள்:' : 'Days:'}
                  </label>
                  <input
                    type="number"
                    value={directDays}
                    onChange={(e) => setDirectDays(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDirectTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {language === 'ta' ? '🚀 தொண்டர் படையில் பணிகளை துவங்கு' : '🚀 Publish Task to Volunteer Padai'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: START WORK EXECUTION MODAL ================= */}
      {startWorkTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-indigo-400 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {language === 'ta' ? 'கள ஆய்வு சரிபார்ப்பு & நேரடி பணி துவக்கம்' : 'Supervisor Inspection & Field Work Launch'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {startWorkTask.id} • {language === 'ta' ? startWorkTask.titleTamil : startWorkTask.titleEnglish}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStartWorkTask(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmStartWork} className="p-6 space-y-4 text-xs">
              
              {/* Readiness checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-800 text-xs">
                  {language === 'ta' ? 'களப்பணி தயார்நிலை சரிபார்ப்பு பட்டியல்:' : 'Field Readiness Checklist:'}
                </h4>
                
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkSafetyGear}
                    onChange={(e) => setCheckSafetyGear(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>{language === 'ta' ? 'பாதுகாப்பு உபகரணங்கள் மற்றும் முதல் உதவி பெட்டி தயார்' : 'Safety helmets, gloves & first-aid kit stationed'}</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkMachinery}
                    onChange={(e) => setCheckMachinery(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>{language === 'ta' ? 'ஜேசிபி / டிராக்டர் மற்றும் மூலப்பொருட்கள் களத்தில் இறக்கப்பட்டுள்ளன' : 'JCB machinery & raw materials deployed to site'}</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkWorkersReady}
                    onChange={(e) => setCheckWorkersReady(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>{language === 'ta' ? 'தன்னார்வலர்கள் மற்றும் கூலித் தொழிலாளர்களுக்கு பணி ஆணை வழங்கப்பட்டுள்ளது' : 'Volunteers & workforce assigned shifts'}</span>
                </label>
              </div>

              {/* Start Notes */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'ta' ? 'மேற்பார்வையாளர் துவக்க குறிப்பு:' : 'Supervisor Launch Notes:'}
                </label>
                <textarea
                  rows={3}
                  value={startWorkNotes}
                  onChange={(e) => setStartWorkNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStartWorkTask(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!checkSafetyGear || !checkMachinery || !checkWorkersReady}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {language === 'ta' ? '🚀 களப்பணியைத் துவங்கு (Confirm Start Work)' : '🚀 Launch Ground Execution'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: DAILY PROGRESS LOG MODAL ================= */}
      {progressModalGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
            
            <div className="p-6 bg-cyan-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {language === 'ta' ? 'தினசரி களப்பணி முன்னேற்றம் மற்றும் செலவு அறிக்கை' : 'Log Daily Progress & Fund Expenditure'}
                  </h3>
                  <p className="text-xs text-cyan-200">
                    {progressModalGrievance.id} • {progressModalGrievance.village}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProgressModalGrievance(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDailyProgress} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'ta' ? 'களப்பணி நாள் எண்:' : 'Day Number:'}
                  </label>
                  <input
                    type="number"
                    value={logDayNumber}
                    onChange={(e) => setLogDayNumber(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'ta' ? 'ஒட்டுமொத்த நிறைவு (%):' : 'Overall Completion (%):'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={logProgressPercentage}
                    onChange={(e) => setLogProgressPercentage(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'ta' ? 'இன்றைய பணி சுருக்கம் (தமிழ்):' : 'Work Summary (Tamil):'}
                </label>
                <textarea
                  rows={2}
                  value={logSummaryTamil}
                  onChange={(e) => setLogSummaryTamil(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'ta' ? 'இன்றைய களப்பணி செலவு (₹):' : 'Funds Spent Today (₹):'}
                </label>
                <input
                  type="number"
                  value={logFundsSpentToday}
                  onChange={(e) => setLogFundsSpentToday(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setProgressModalGrievance(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {language === 'ta' ? '✓ முன்னேற்ற அறிக்கை பதிவு செய்க' : '✓ Submit Daily Progress'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Supervisor Finished Work Modal */}
      {finishedWorkGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-200" />
                <div>
                  <h3 className="text-sm font-bold">
                    {language === 'ta' ? 'பணி நிறைவு சான்றிதழ் & இறுதி ஒப்புதல்' : 'Work Completion Certification & Sign-off'}
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-mono">
                    Token: {finishedWorkGrievance.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFinishedWorkGrievance(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmFinishedWork} className="p-6 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-950 text-[11px] space-y-1">
                <span className="font-bold block">
                  {language === 'ta' ? 'பணித் தலைப்பு:' : 'Task:'} {finishedWorkGrievance.title}
                </span>
                <p>
                  {language === 'ta'
                    ? 'இப்பணியின் களப்பணிகள் 100% நிறைவுற்றதாக பதிவு செய்யப்பட்டு, மனுவின் நிலை "நிறைவுற்றது (Resolved)" என மாற்றப்படும்.'
                    : 'This marks the field work as 100% completed, verified by Supervisor, and updates grievance status to Resolved.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ta' ? 'மேற்பார்வையாளர் நிறைவு சான்றிதழ் குறிப்பு *' : 'Supervisor Completion Sign-off Remarks *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={finishCompletionNotes}
                  onChange={(e) => setFinishCompletionNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    {language === 'ta' ? 'மொத்த நிதி செலவு (₹) *' : 'Final Actual Spent (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={finishActualSpent}
                    onChange={(e) => setFinishActualSpent(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    {language === 'ta' ? 'முடித்த கள புகைப்படம் (URL) *' : 'Completion Photo URL *'}
                  </label>
                  <input
                    type="url"
                    value={finishSitePhoto}
                    onChange={(e) => setFinishSitePhoto(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFinishedWorkGrievance(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isFinishing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'ta' ? 'பணி நிறைவுற்றது என உறுதிசெய்' : 'Confirm Work Finished'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
