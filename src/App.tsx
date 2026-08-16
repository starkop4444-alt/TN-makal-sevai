import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { INITIAL_GRIEVANCES, VOLUNTEER_TASKS_DATA, INITIAL_SYSTEM_NOTIFICATIONS } from './data/tamilNaduData';
import { 
  Grievance, 
  NavigationTab, 
  UserRole, 
  CitizenProfile, 
  SupervisorDecision, 
  CMTaskGenerationPayload, 
  BackendTask,
  VolunteerTask,
  VolunteerContribution,
  SystemNotification,
  ContractorWorkforceSelection
} from './types';
import { Header } from './components/Header';
import { GrievanceFormModal } from './components/GrievanceFormModal';
import { GrievanceFeedAndExplore } from './components/GrievanceFeedAndExplore';
import { GrievanceTrackerView } from './components/GrievanceTrackerView';
import { VolunteerPadaiNetwork } from './components/VolunteerPadaiNetwork';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { PetitionLetterModal } from './components/PetitionLetterModal';
import { AadhaarAuthModal } from './components/AadhaarAuthModal';
import { AuthLandingScreen } from './components/AuthLandingScreen';
import { SupervisorReviewView } from './components/SupervisorReviewView';
import { CMSpecialCellView } from './components/CMSpecialCellView';
import { ContractorDeskView } from './components/ContractorDeskView';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import confetti from 'canvas-confetti';
import { 
  Bot, 
  PlusCircle, 
  PhoneCall, 
  ShieldAlert, 
  Heart, 
  Sparkles,
  ExternalLink,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { language, t } = useLanguage();

  // Authentication State - Defaults to false so user chooses role initially
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Active Role and Profile
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentProfile, setCurrentProfile] = useState<CitizenProfile>({
    fullName: 'M. Senthilkumar',
    aadhaarNumber: '5489 6231 7840',
    mobileNumber: '9840123456',
    district: 'Ariyalur',
    taluk: 'Sendurai',
    village: 'Sendurai South',
    role: 'citizen',
    isVerified: true,
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('feed');
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [volunteerTasks, setVolunteerTasks] = useState<VolunteerTask[]>(VOLUNTEER_TASKS_DATA);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_SYSTEM_NOTIFICATIONS);
  
  // Modals & Drawers state
  const [isNewGrievanceOpen, setIsNewGrievanceOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAadhaarAuthOpen, setIsAadhaarAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [letterGrievance, setLetterGrievance] = useState<Grievance | null>(null);

  // Helper to add dynamic system notification
  const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotificationAction = (notification: SystemNotification) => {
    handleMarkNotificationAsRead(notification.id);
    setIsNotificationsOpen(false);
    if (notification.grievanceId) {
      if (currentRole === 'contractor') {
        setActiveTab('contractor');
      } else if (currentRole === 'supervisor') {
        setActiveTab('supervisor');
      } else if (currentRole === 'citizen') {
        setActiveTab('track');
      } else if (currentRole === 'cm_cell') {
        setActiveTab('cm_cell');
      }
    }
  };

  // Initial Authentication handler
  const handleLoginSuccess = (profile: CitizenProfile, role: UserRole) => {
    setCurrentProfile(profile);
    setCurrentRole(role);
    setIsAuthenticated(true);
    if (role === 'citizen') {
      setActiveTab('feed');
    } else if (role === 'contractor') {
      setActiveTab('contractor');
    } else if (role === 'supervisor') {
      setActiveTab('supervisor');
    } else if (role === 'cm_cell') {
      setActiveTab('cm_cell');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Upvote / Me Too Handler
  const handleUpvoteGrievance = (id: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const hasVoted = g.hasUpvoted;
          if (!hasVoted) {
            confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
          }
          return {
            ...g,
            upvotes: hasVoted ? g.upvotes - 1 : g.upvotes + 1,
            hasUpvoted: !hasVoted,
          };
        }
        return g;
      })
    );
  };

  // Add new submitted grievance with Location-based Supervisor Notification
  const handleCreateGrievance = (newG: Grievance) => {
    setGrievances((prev) => [newG, ...prev]);

    // 1. Send Location-Based Notification to the concerned Taluk/District Supervisor
    addNotification({
      recipientRole: 'supervisor',
      targetDistrict: newG.district,
      targetTaluk: newG.taluk,
      targetVillage: newG.village,
      type: 'complaint_lodged',
      titleTamil: `புதிய மனு பதிவு: ${newG.title}`,
      titleEnglish: `New Grievance Lodged: ${newG.title}`,
      messageTamil: `${newG.taluk} தாலுகா, ${newG.village || newG.ward} பகுதியிலிருந்து புதிய மனு எண் ${newG.id} பதிவாகியுள்ளது. இடஅமைவு அடிப்படையில் நேரடி கள ஆய்வை துவங்குங்கள்.`,
      messageEnglish: `Citizen lodged grievance ${newG.id} in ${newG.taluk}, ${newG.district}. Dispatched to local field supervisor for review and inspection.`,
      grievanceId: newG.id
    });

    // 2. Notification to Citizen Confirming Registration
    addNotification({
      recipientRole: 'citizen',
      targetDistrict: newG.district,
      targetTaluk: newG.taluk,
      type: 'complaint_lodged',
      titleTamil: `மனு பதிவு வெற்றிகரமாக பெறப்பட்டது: ${newG.id}`,
      titleEnglish: `Grievance Registered Successfully: ${newG.id}`,
      messageTamil: `உங்கள் மனு ${newG.taluk} தாலுகா மேற்பார்வையாளரின் நேரடி பார்வைக்கு அனுப்பப்பட்டுள்ளது.`,
      messageEnglish: `Your grievance has been submitted and routed to ${newG.taluk} field supervisor for physical inspection.`,
      grievanceId: newG.id
    });

    setActiveTab('feed');
  };

  // Rate grievance resolution
  const handleRateGrievance = (id: string, rating: number, comment: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newComments = comment
            ? [
                ...(g.comments || []),
                {
                  id: `comm-${Date.now()}`,
                  author: language === 'ta' ? 'மனுதாரர் சரிபார்ப்பு' : 'Citizen Verification',
                  text: `Rating: ${rating} ⭐ - "${comment}"`,
                  time: language === 'ta' ? 'சற்று முன்' : 'Just now',
                },
              ]
            : g.comments;

          return {
            ...g,
            comments: newComments,
          };
        }
        return g;
      })
    );
  };

  // Level 2: Supervisor Decision Handler (Approve with Task/Budget OR Reject for CM Cell Re-Review)
  const handleSupervisorDecision = (
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
      departmentAssignment?: any;
    }
  ) => {
    const targetG = grievances.find((g) => g.id === grievanceId);

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const isValid = decision === 'approved';
          const newStatus = isValid 
            ? (remarks.actionRoute === 'open_civic_task' ? 'In Progress' : 'Officer Assigned') 
            : 'Rejected by Supervisor';
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          let timelineTitleTamil = isValid 
            ? (remarks.actionRoute === 'open_civic_task' 
                ? 'நிலை 2: மேற்பார்வையாளர் களப்பணி ஒப்புதல் & திட்ட துவக்கம்' 
                : 'நிலை 2: சிறப்புத் துறை மற்றும் மாவட்ட ஆட்சியர் தலைமையகத்திற்கு ஒப்படைப்பு')
            : 'நிலை 2: மேற்பார்வையாளர் தள்ளுபடி செய்தார் - CM செல் மறுஆய்வுக்கு அனுப்பப்பட்டது';

          let timelineTitleEnglish = isValid
            ? (remarks.actionRoute === 'open_civic_task'
                ? 'Level 2: Supervisor Sanctioned Civic Task Execution'
                : 'Level 2: Assigned to Department & District Headquarters')
            : 'Level 2: Supervisor Flagged Rejection - Escalate for CM Cell Apex Review';

          let timelineDescTamil = remarks.remarksTamil;
          if (remarks.openedTaskDetails) {
            timelineDescTamil += ` (தேவைப்படும் நிதி: ₹${remarks.openedTaskDetails.totalFundRequiredINR?.toLocaleString('en-IN')}, ஆட்கள்: ${remarks.openedTaskDetails.labourCountRequired} பேர் @ ₹${remarks.openedTaskDetails.dailyWageRateINR}/நாள், கால அளவு: ${remarks.openedTaskDetails.daysRequired} நாட்கள்)`;
          } else if (remarks.departmentAssignment) {
            timelineDescTamil += ` (ஒப்படைக்கப்பட்ட துறை: ${remarks.departmentAssignment.assignedDepartmentName}, மாவட்ட HQ தொடர்பு: ${remarks.departmentAssignment.districtHQCollectoratePhone})`;
          }

          const timelineEvent = {
            status: newStatus as any,
            titleTamil: timelineTitleTamil,
            titleEnglish: timelineTitleEnglish,
            descriptionTamil: timelineDescTamil,
            descriptionEnglish: remarks.remarksEnglish,
            timestamp: nowStr,
            completed: true,
          };

          return {
            ...g,
            status: newStatus as any,
            contractorStatus: isValid ? ('pending_acceptance' as const) : g.contractorStatus,
            contractorSlaDeadline: isValid ? '6h 00m Remaining' : undefined,
            isWorkInitiated: isValid && remarks.actionRoute === 'open_civic_task',
            assignedDepartment: remarks.departmentAssignment?.assignedDepartmentName || g.assignedDepartment,
            assignedDepartmentTamil: remarks.departmentAssignment?.assignedDepartmentTamil || g.assignedDepartmentTamil,
            supervisorReview: {
              isReviewed: true,
              decision,
              actionRoute: remarks.actionRoute,
              openedTaskDetails: remarks.openedTaskDetails,
              departmentAssignment: remarks.departmentAssignment,
              supervisorName: `Er. ${currentProfile.fullName || 'K. Murugesan'} (${g.taluk} Supervisor)`,
              supervisorDesignation: 'Taluk Field Nodal Supervisor',
              supervisorTaluk: g.taluk,
              remarksTamil: remarks.remarksTamil,
              remarksEnglish: remarks.remarksEnglish,
              fieldInspectionDate: new Date().toLocaleDateString('en-IN'),
              forwardedToCMCellAt: nowStr,
              fieldPhotos: remarks.fieldPhotos
            },
            fundUtilisation: remarks.openedTaskDetails ? {
              totalBudgetINR: remarks.openedTaskDetails.totalFundRequiredINR,
              totalSpentINR: 0,
              materialsSpentINR: 0,
              machinerySpentINR: 0,
              labourWagesPaidINR: 0,
              contingencySpentINR: 0,
              balanceRemainingINR: remarks.openedTaskDetails.totalFundRequiredINR,
              lastUpdated: nowStr
            } : g.fundUtilisation,
            timeline: [...g.timeline, timelineEvent],
          };
        }
        return g;
      })
    );

    // If supervisor approved/accepted: Send location-based message to Contractors (6h SLA) and Volunteer Padai
    if (decision === 'approved' && targetG) {
      // 1. Dispatch to Contractors with 6-Hour SLA Window
      addNotification({
        recipientRole: 'contractor',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        targetVillage: targetG.village,
        type: 'supervisor_approved',
        titleTamil: `புதிய திட்டப் பணி ஒதுக்கீடு: 6 மணி நேர ஒப்பந்த ஏற்பு (6h SLA)`,
        titleEnglish: `Sanctioned Project Available: 6-Hour SLA Contractor Window`,
        messageTamil: `மேற்பார்வையாளர் ${targetG.taluk} தாலுகாவில் பணி ${targetG.id} க்கு அனுமதித்துள்ளார். 6 மணி நேரத்திற்குள் சொந்த ஆட்கள் அல்லது தளபதி மக்கள் பணிப்படை மூலம் ஒப்பந்தத்தை ஏற்கவும்.`,
        messageEnglish: `Field supervisor approved project ${targetG.id} in ${targetG.taluk}. Licensed contractors must accept within 6-hour SLA window and designate workforce.`,
        grievanceId: targetG.id,
        slaDeadline: '6h 00m Remaining'
      });

      // 2. Dispatch to Volunteer Padai Network regarding Job Availability
      addNotification({
        recipientRole: 'volunteer',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'supervisor_approved',
        titleTamil: `தளபதி மக்கள் பணிப்படை: ${targetG.taluk} பகுதி பணிக்கு தன்னார்வலர்கள் அழைப்பு`,
        titleEnglish: `Volunteer Padai Mobilization: Civic Works in ${targetG.taluk}`,
        messageTamil: `மேற்பார்வையாளர் மற்றும் ஒப்பந்ததாரர் வழிகாட்டுதலில் மக்கள் பணிப்படை தன்னார்வலர்கள் பங்களிக்க அழைக்கப்படுகிறார்கள் (${targetG.title}).`,
        messageEnglish: `Supervisor approved civic task ${targetG.id}. Local volunteers and cadre invited for rapid ground execution.`,
        grievanceId: targetG.id
      });
    }

    // If supervisor opened civic task, synchronize with Volunteer Padai
    if (decision === 'approved' && remarks.actionRoute === 'open_civic_task' && remarks.openedTaskDetails) {
      if (targetG) {
        const totalFunds = remarks.openedTaskDetails.totalFundRequiredINR || 45000;
        const labourCount = remarks.openedTaskDetails.labourCountRequired || 20;
        const dailyWage = remarks.openedTaskDetails.dailyWageRateINR || 650;
        const days = remarks.openedTaskDetails.daysRequired || 3;
        const startDate = remarks.openedTaskDetails.workStartDate || new Date().toISOString().split('T')[0];

        const newVolunteerTask: VolunteerTask = {
          id: `vol-${targetG.id}`,
          linkedGrievanceId: targetG.id,
          titleTamil: remarks.openedTaskDetails.taskTitle || targetG.titleTamil || targetG.title,
          titleEnglish: remarks.openedTaskDetails.taskTitle || targetG.title,
          district: targetG.district,
          ward: targetG.ward || targetG.village || 'Ward 1',
          category: (targetG.category === 'Sanitation & Solid Waste' || targetG.category === 'Water Supply & Drainage') ? 'Sanitation & Desilting' : 'Tree Plantation',
          date: `Starting ${startDate} (07:00 AM)`,
          location: `${targetG.locationDetails || targetG.landmark || targetG.village}, ${targetG.taluk}`,
          targetVolunteers: labourCount,
          joinedVolunteers: 0,
          targetLabourVolunteers: labourCount,
          registeredLabourVolunteers: 0,
          dailyWageINR: dailyWage,
          targetFinancialINR: totalFunds,
          collectedFinancialINR: 0,
          financialContributorsCount: 0,
          timelineWindowDays: days,
          volunteerWindowDeadline: `${days} Days Supervisor Rapid Mobilization`,
          hoursRemaining: days * 24,
          isActivatedTask: true,
          activationDate: new Date().toISOString(),
          descriptionTamil: `${targetG.description}. மேற்பார்வையாளர் கள ஆய்வு செய்து ${days} நாட்களில் முடிக்க மக்கள் மற்றும் தொண்டர் படை மூலம் துவக்க அனுமதித்துள்ளார்.`,
          descriptionEnglish: `${targetG.description}. Field supervisor inspected site and sanctioned grassroots rapid execution within ${days} days.`,
          coordinatorName: `Er. ${currentProfile.fullName || 'K. Murugesan'} (Supervisor)`,
          coordinatorPhone: currentProfile.mobileNumber || '9840123456',
          status: 'Upcoming',
          isWorkStarted: false,
          workExecutionStatus: 'Mobilizing',
          impactMetric: `Resolves citizen grievance ${targetG.id} in ${targetG.taluk}`,
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
            supervisorName: `Er. ${currentProfile.fullName || 'K. Murugesan'}`,
            supervisorDesignation: 'Taluk Field Nodal Supervisor',
            supervisorPhone: currentProfile.mobileNumber || '9840123456',
            estimatedTotalCostINR: totalFunds,
            costBreakdown: {
              materialsCost: Math.round(totalFunds * 0.4),
              machineryEquipmentCost: Math.round(totalFunds * 0.3),
              labourAndSafetyCost: Math.round(totalFunds * 0.2),
              contingencyLogisticsCost: Math.round(totalFunds * 0.1),
            },
            workStartDate: startDate,
            workDurationDays: days,
            timelineWindowDays: days,
            shiftTiming: 'Morning Shift (06:30 AM - 01:30 PM)',
            requiredStaffCount: labourCount,
            requiredSpecialists: ['1 Lead Site Supervisor', 'JCB Operator', 'Safety Marshal'],
            surplusFundAction: 'transfer_to_district_development_pool',
            surplusTransferredINR: 0,
            lastUpdatedTimestamp: new Date().toLocaleTimeString()
          },
          contributions: []
        };

        setVolunteerTasks((prevVol) => [newVolunteerTask, ...prevVol.filter((t) => t.id !== newVolunteerTask.id)]);
      }
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Contractor Accept Project with Workforce Selection Handler
  const handleContractorAcceptProject = (
    projectId: string, 
    isTask: boolean, 
    workforce?: ContractorWorkforceSelection
  ) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetG = grievances.find((g) => g.id === projectId);
    const workforceTypeLabel = workforce?.workforceType === 'own_labour' 
      ? `சொந்த ஆட்கள் (${workforce.ownLabourCount || 15} பேர்)`
      : workforce?.workforceType === 'volunteer_padai'
      ? `தளபதி மக்கள் பணிப்படை (${workforce.volunteerPadaiCount || 20} பேர்)`
      : `இருவகை கூட்டு பணி (${workforce?.ownLabourCount || 10} சொந்த ஆட்கள் + ${workforce?.volunteerPadaiCount || 15} பணிப்படை)`;

    const workforceTypeLabelEn = workforce?.workforceType === 'own_labour'
      ? `Contractor Own Labour (${workforce.ownLabourCount || 15} workers)`
      : workforce?.workforceType === 'volunteer_padai'
      ? `Volunteer Padai (${workforce.volunteerPadaiCount || 20} cadre)`
      : `Hybrid Workforce Model`;

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === projectId) {
          const timelineEvent = {
            status: 'In Progress' as any,
            titleTamil: `ஒப்பந்ததாரர் ஏற்பு: ${workforceTypeLabel}`,
            titleEnglish: `Contractor Accepted Work Order: ${workforceTypeLabelEn}`,
            descriptionTamil: `ஒப்பந்ததாரர் ${workforce?.contractorFirmName || 'அரசு ஒப்பந்ததாரர்'} 6 மணி நேர கெடுவிற்குள் பணியை ஏற்றுக்கொண்டார். ஆட்கள்: ${workforceTypeLabel}. இயந்திரங்கள்: ${workforce?.machineryDeployed || 'இயந்திரங்கள் தயார்'}. மதிப்பீடு: ${workforce?.estimatedDaysToFinish || 3} நாட்கள்.`,
            descriptionEnglish: `Contractor accepted work order within 6-hour SLA. Model: ${workforceTypeLabelEn}. Machinery: ${workforce?.machineryDeployed}. Est: ${workforce?.estimatedDaysToFinish} days.`,
            timestamp: nowStr,
            completed: true
          };

          return {
            ...g,
            status: 'In Progress' as any,
            contractorStatus: 'accepted' as const,
            contractorAcceptedAt: nowStr,
            contractorWorkforce: workforce,
            contractorAssignedName: workforce?.contractorFirmName || 'TN Civil Infra Corp',
            timeline: [...g.timeline, timelineEvent]
          };
        }
        return g;
      })
    );

    // Notify Supervisor that Contractor Accepted and they should supervise work start & update status
    if (targetG) {
      addNotification({
        recipientRole: 'supervisor',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'contractor_accepted',
        titleTamil: `ஒப்பந்ததாரர் பணி ஏற்பு: ${targetG.taluk} பணி ${projectId}`,
        titleEnglish: `Contractor Accepted Work Order: ${projectId} (${targetG.taluk})`,
        messageTamil: `ஒப்பந்ததாரர் (${workforce?.contractorFirmName || 'அரசு ஒப்பந்ததாரர்'}) பணியை ஏற்றுக்கொண்டார் [ஆட்கள்: ${workforceTypeLabel}]. மேற்பார்வையாளர் பணி துவங்குவதை உறுதிசெய்து களப்பணி நிலையை பதியவும்.`,
        messageEnglish: `Contractor accepted work order ${projectId} with ${workforceTypeLabelEn}. Field supervisor can now coordinate start of work and log daily progress.`,
        grievanceId: projectId,
        workforceChoice: workforce?.workforceType,
        contractorFirm: workforce?.contractorFirmName
      });

      // Notify Citizen
      addNotification({
        recipientRole: 'citizen',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'work_started',
        titleTamil: `உங்கள் மனு மீது ஒப்பந்ததாரர் பணி ஒதுக்கீடு உறுதியானது`,
        titleEnglish: `Work Order Accepted on Your Grievance`,
        messageTamil: `மனு எண் ${projectId} மீது அரசு ஒப்பந்ததாரர் பணியை ஏற்றுக்கொண்டு ஆட்களை களமிறக்குகிறார்.`,
        messageEnglish: `Licensed contractor accepted work order on your petition ${projectId}. Ground execution is underway.`,
        grievanceId: projectId
      });
    }

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  // Contractor Reject / Decline Project Handler
  const handleContractorRejectProject = (projectId: string, reason: string, isTask: boolean) => {
    const targetG = grievances.find((g) => g.id === projectId);
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === projectId) {
          return {
            ...g,
            contractorStatus: 'declined' as const,
          };
        }
        return g;
      })
    );

    if (targetG) {
      addNotification({
        recipientRole: 'supervisor',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'contractor_declined',
        titleTamil: `ஒப்பந்ததாரர் மறுப்பு: மாற்று ஒப்பந்ததாரருக்கு ஒதுக்கீடு தேவை`,
        titleEnglish: `Contractor Declined Work Order: Re-allocation Needed`,
        messageTamil: `பணி ${projectId} ஒப்பந்ததாரரால் மறுக்கப்பட்டது (காரணம்: ${reason}). மேற்பார்வையாளர் மாற்று ஒப்பந்ததாரர் அல்லது மக்கள் பணிப்படைக்கு மாற்றவும்.`,
        messageEnglish: `Contractor declined project ${projectId} (${reason}). Dispatched to supervisor for alternative assignment.`,
        grievanceId: projectId
      });
    }
  };

  // Supervisor Mark Work Finished Handler
  const handleMarkWorkFinished = (
    grievanceId: string, 
    finishData: { completionNotes: string; actualSpentINR?: number; completionPhotoUrl?: string }
  ) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetG = grievances.find((g) => g.id === grievanceId);

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const timelineEvent = {
            status: 'Resolved' as any,
            titleTamil: 'பணி நிறைவுற்றது: மேற்பார்வையாளர் நேரடி ஆய்வு & தரச் சான்றிதழ்',
            titleEnglish: 'Work Finished: Supervisor Field Inspection & Quality Certification',
            descriptionTamil: `${finishData.completionNotes} (மொத்த செலவு: ₹${finishData.actualSpentINR?.toLocaleString('en-IN') || '45,000'})`,
            descriptionEnglish: `${finishData.completionNotes} (Final Spent: ₹${finishData.actualSpentINR || '45000'})`,
            timestamp: nowStr,
            completed: true
          };

          return {
            ...g,
            status: 'Resolved' as any,
            resolvedAt: new Date().toLocaleDateString('en-IN'),
            resolutionProof: {
              afterPhoto: finishData.completionPhotoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
              completionRemarksTamil: finishData.completionNotes,
              completionRemarksEnglish: finishData.completionNotes,
              officialName: `Er. ${currentProfile.fullName || 'K. Murugesan'} (Supervisor)`,
              officialDesignation: 'Taluk Field Nodal Supervisor',
              completionDate: new Date().toLocaleDateString('en-IN')
            },
            timeline: [...g.timeline, timelineEvent]
          };
        }
        return g;
      })
    );

    if (targetG) {
      addNotification({
        recipientRole: 'citizen',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'work_finished',
        titleTamil: `பணி வெற்றிகரமாக நிறைவுற்றது: மதிப்பீடு வழங்கவும்`,
        titleEnglish: `Work Completed & Quality Certified: Rate Your Experience`,
        messageTamil: `மேற்பார்வையாளர் பணி நிறைவுற்றதை உறுதிசெய்து சான்றளித்துள்ளார். உங்கள் திருப்தி மதிப்பீட்டை பதிவு செய்யவும்.`,
        messageEnglish: `Supervisor inspected and certified completion of work on petition ${grievanceId}. Please confirm and rate resolution.`,
        grievanceId
      });

      addNotification({
        recipientRole: 'cm_cell',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'work_finished',
        titleTamil: `பணி நிறைவு தணிக்கை அறிக்கை: ${targetG.id} (${targetG.taluk})`,
        titleEnglish: `Work Completion Certified for Apex Audit: ${targetG.id}`,
        messageTamil: `மேற்பார்வையாளர் Er. ${currentProfile.fullName || 'K. Murugesan'} பணி எண் ${targetG.id} முழுமையாக நிறைவடைந்ததாக சான்றளித்துள்ளார்.`,
        messageEnglish: `Taluk supervisor submitted final field completion certificate and expenditure log for apex scrutiny.`,
        grievanceId
      });
    }

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  // CM Cell Uphold Rejection Handler
  const handleCMUpholdRejection = (grievanceId: string, rejectionReason: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const timelineEvent = {
            status: 'Rejected by CM Cell' as any,
            titleTamil: 'முதலமைச்சர் பிரிவு: தள்ளுபடி உறுதி செய்யப்பட்டது',
            titleEnglish: 'CM Special Cell: Rejection Confirmed & Upheld',
            descriptionTamil: rejectionReason,
            descriptionEnglish: 'Chief Minister Apex Desk reviewed supervisor inspection and confirmed rejection.',
            timestamp: nowStr,
            completed: true
          };

          return {
            ...g,
            status: 'Rejected by CM Cell' as any,
            cmCellReview: {
              isReviewed: true,
              decision: 'rejected' as const,
              cmOfficerName: 'Thiru. T. Udhayachandran IAS (CM Special Secretary)',
              reviewNotesTamil: rejectionReason,
              reviewNotesEnglish: 'Rejection upheld after apex scrutiny.',
              reviewedAt: nowStr
            },
            timeline: [...g.timeline, timelineEvent]
          };
        }
        return g;
      })
    );
  };

  // Contractor Update Execution Status Handler
  const handleUpdateContractorWorkStatus = (grievanceId: string, statusNote: string, progressPct: number) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetG = grievances.find((g) => g.id === grievanceId);

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const isFinished = progressPct >= 100;
          const timelineEvent = {
            status: isFinished ? 'In Progress' : 'In Progress',
            titleTamil: `ஒப்பந்ததாரர் களப்பணி நிலை: ${progressPct}% (${statusNote})`,
            titleEnglish: `Contractor Execution Update: ${progressPct}%`,
            descriptionTamil: `ஒப்பந்ததாரர் அறிக்கை: ${statusNote}`,
            descriptionEnglish: `Contractor log: ${statusNote}`,
            timestamp: nowStr,
            completed: true
          };

          return {
            ...g,
            status: 'In Progress' as any,
            timeline: [...g.timeline, timelineEvent]
          };
        }
        return g;
      })
    );

    if (targetG) {
      addNotification({
        recipientRole: 'supervisor',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'work_progress',
        titleTamil: `களப்பணி நிலை அறிக்கை (${progressPct}% நிறைவு): ${targetG.taluk}`,
        titleEnglish: `Execution Progress Updated: ${progressPct}% (${targetG.taluk})`,
        messageTamil: `ஒப்பந்ததாரர் பணி முன்னேற்றத்தை ${progressPct}% என புதுப்பித்துள்ளார். குறிப்பு: ${statusNote}`,
        messageEnglish: `Contractor logged progress ${progressPct}% on grievance ${grievanceId}. Log: ${statusNote}`,
        grievanceId
      });

      addNotification({
        recipientRole: 'citizen',
        targetDistrict: targetG.district,
        targetTaluk: targetG.taluk,
        type: 'work_progress',
        titleTamil: `உங்கள் மனு மீதான பணி முன்னேற்றம்: ${progressPct}% நிறைவு`,
        titleEnglish: `Work Progress on Your Grievance: ${progressPct}%`,
        messageTamil: `களப்பணி ${progressPct}% நிறைவடைந்துள்ளது. குறிப்பு: ${statusNote}`,
        messageEnglish: `Work is now ${progressPct}% complete on your registered petition.`,
        grievanceId
      });
    }

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // Volunteer Padai contributions update VolunteerTask & linked Grievance
  const handleVolunteerContribution = (taskId: string, contribution: VolunteerContribution) => {
    setVolunteerTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const updatedContributions = [...(t.contributions || []), contribution];
          const addedFunds = contribution.type === 'financial' ? contribution.amountINR : 0;
          const addedLabour = contribution.type === 'physical_labour' ? 1 : 0;
          const addedMeals = contribution.type === 'food_refreshment' ? (contribution.mealsCount || 0) : 0;
          const addedWater = contribution.type === 'food_refreshment' ? (contribution.waterBottlesCount || 0) : 0;

          return {
            ...t,
            collectedFinancialINR: t.collectedFinancialINR + addedFunds,
            financialContributorsCount: t.financialContributorsCount + (contribution.type === 'financial' ? 1 : 0),
            registeredLabourVolunteers: t.registeredLabourVolunteers + addedLabour,
            joinedVolunteers: t.joinedVolunteers + (contribution.type !== 'financial' ? 1 : 0),
            totalMealsPledged: (t.totalMealsPledged || 0) + addedMeals,
            totalWaterBottlesPledged: (t.totalWaterBottlesPledged || 0) + addedWater,
            contributions: updatedContributions,
          };
        }
        return t;
      })
    );
  };

  // Supervisor Check & Start Work Execution Handler
  const handleSupervisorStartWork = (taskId: string, supervisorNotes?: string) => {
    setVolunteerTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'In Progress',
            isWorkStarted: true,
            workExecutionStatus: 'Work In Progress',
          };
        }
        return t;
      })
    );
  };

  // Supervisor Direct Task Creation Handler
  const handleCreateDirectVolunteerTask = (newTask: VolunteerTask) => {
    setVolunteerTasks((prev) => [newTask, ...prev]);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Daily Progress Log and Fund Utilisation Update
  const handleUpdateDailyProgress = (
    grievanceId: string,
    report: any,
    fundUpdate?: any
  ) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const updatedReports = [...(g.dailyProgressReports || []), report];
          const isFullyDone = report.progressPercentage >= 100;
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const timelineEvent = {
            status: isFullyDone ? 'Resolved' as any : 'In Progress' as any,
            titleTamil: `தினசரி களப்பணி அறிக்கை: நாள் ${report.dayNumber} (${report.progressPercentage}% நிறைவு)`,
            titleEnglish: `Daily Field Progress: Day ${report.dayNumber} (${report.progressPercentage}% Completed)`,
            descriptionTamil: `${report.workSummaryTamil} (இன்றைய செலவு: ₹${report.fundsSpentTodayINR?.toLocaleString('en-IN')})`,
            descriptionEnglish: `${report.workSummaryEnglish} (Today funds spent: ₹${report.fundsSpentTodayINR})`,
            timestamp: nowStr,
            completed: true
          };

          return {
            ...g,
            status: isFullyDone ? 'Resolved' as any : 'In Progress' as any,
            dailyProgressReports: updatedReports,
            fundUtilisation: fundUpdate || g.fundUtilisation,
            timeline: [...g.timeline, timelineEvent]
          };
        }
        return g;
      })
    );
  };

  // Citizen Resolution Confirmation Handler
  const handleCitizenConfirmResolution = (
    grievanceId: string,
    confirmation: any
  ) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const timelineEvent = {
            status: 'Resolved' as any,
            titleTamil: 'மனுதாரர் நிறைவு உறுதிப்படுத்தல் (Citizen Confirmation Verified)',
            titleEnglish: 'Citizen Resolution Verified & Digital Signed',
            descriptionTamil: `மனுதாரர் திருப்தி மதிப்பீடு: ${confirmation.rating}/5 நட்சத்திரங்கள். கருத்து: ${confirmation.feedbackTamil}`,
            descriptionEnglish: `Citizen rated ${confirmation.rating}/5 stars. Feedback: ${confirmation.feedbackEnglish}`,
            timestamp: nowStr,
            completed: true
          };

          return {
            ...g,
            status: 'Resolved' as any,
            citizenConfirmation: confirmation,
            citizenRating: confirmation.rating,
            timeline: [...g.timeline, timelineEvent]
          };
        }
        return g;
      })
    );
  };

  // Level 3: CM Special Cell Apex Review & Rapid Backend Task Generation (or Reconsideration)
  const handleGenerateCMTask = (
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
  ) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const taskId = `CM-TASK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          const createdTask = {
            taskId,
            taskTitle: taskDetails.taskTitle,
            taskTitleTamil: taskDetails.taskTitleTamil,
            sanctionedBudget: taskDetails.sanctionedBudget,
            assignedContractor: taskDetails.assignedContractor,
            contractorPhone: taskDetails.contractorPhone,
            departmentName: taskDetails.departmentName,
            departmentNameTamil: taskDetails.departmentNameTamil,
            targetDeadline: taskDetails.targetDeadline,
            priority: taskDetails.priority,
            workOrderNumber: `TN-WO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            sanctionedDate: new Date().toLocaleDateString('en-IN'),
            qrCodeText: `TN-CM-GOV-SANCTION:${taskId}`,
            status: 'Sanctioned' as const
          };

          const timelineEvent = {
            status: 'CM Task Sanctioned' as any,
            titleTamil: 'நிலை 3: முதலமைச்சர் நேரடி பணி ஆணை & நிதி ஒதுக்கீடு',
            titleEnglish: 'Level 3: CM Direct Work Order Sanctioned',
            descriptionTamil: `முதல்வர் சிறப்புப் பிரிவு மனு எண் ${g.id} க்கு நேரடி பணி ஆணை ${taskId} பிறப்பித்தது. நிதி: ${taskDetails.sanctionedBudget}. ஒப்பந்ததாரர்: ${taskDetails.assignedContractor}.`,
            descriptionEnglish: `CM Apex Cell sanctioned direct work order ${taskId} with ${taskDetails.sanctionedBudget} budget to ${taskDetails.assignedContractor}.`,
            timestamp: nowStr,
            completed: true,
          };

          return {
            ...g,
            status: 'CM Task Sanctioned' as any,
            cmCellReview: {
              isReviewed: true,
              decision: 'task_generated' as const,
              cmOfficerName: 'Thiru. T. Udhayachandran IAS (CM Special Secretary)',
              reviewNotesTamil: taskDetails.reviewNotesTamil,
              reviewNotesEnglish: taskDetails.reviewNotesEnglish,
              reviewedAt: nowStr,
              generatedTask: createdTask,
            },
            timeline: [...g.timeline, timelineEvent],
          };
        }
        return g;
      })
    );

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  // Switch Role & Profile handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'citizen') {
      setActiveTab('feed');
    } else if (newRole === 'contractor') {
      setActiveTab('contractor');
    } else if (newRole === 'supervisor') {
      setActiveTab('supervisor');
    } else if (newRole === 'cm_cell') {
      setActiveTab('cm_cell');
    }
  };

  // Quick select to track
  const handleSelectGrievanceToTrack = (g: Grievance) => {
    setActiveTab('track');
  };

  // If user is not yet logged in, show initial Role Selection & Authentication Gateway
  if (!isAuthenticated) {
    return <AuthLandingScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenNewGrievance={() => setIsNewGrievanceOpen(true)}
        onOpenAiAssistant={() => setIsAiChatOpen(true)}
        onOpenHelplines={() => {}}
        onOpenAadhaarAuth={() => setIsAadhaarAuthOpen(true)}
        onLogout={handleLogout}
        onChangeRole={handleRoleChange}
        currentProfile={currentProfile}
        currentRole={currentRole}
        pendingSupervisorCount={grievances.filter(g => g.status === 'Supervisor Review' || g.status === 'Submitted').length}
        pendingCMCellCount={grievances.filter(g => g.status === 'CM Cell Review' || g.status === 'Rejected by Supervisor' || g.supervisorReview?.decision === 'rejected').length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationCount={
          notifications.filter(
            (n) =>
              !n.read &&
              (n.recipientRole === 'all' ||
                n.recipientRole === currentRole ||
                (currentRole === 'supervisor' && n.targetTaluk === currentProfile.taluk))
          ).length
        }
      />

      {/* Emergency Helplines Quick Ticker */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider animate-pulse">
              Emergency
            </span>
            <span className="text-slate-300 font-medium">
              {language === 'ta' ? 'அரசு அவசர உதவி எண்கள்:' : 'TN Civic Emergency Helplines:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <span className="hover:text-amber-300 transition-colors">
              <strong>CM Helpline:</strong> 1100
            </span>
            <span className="hover:text-amber-300 transition-colors">
              <strong>Electricity (TANGEDCO):</strong> 1912
            </span>
            <span className="hover:text-amber-300 transition-colors">
              <strong>Chennai Corp:</strong> 1913
            </span>
            <span className="hover:text-amber-300 transition-colors">
              <strong>Police:</strong> 100
            </span>
            <span className="hover:text-amber-300 transition-colors">
              <strong>Ambulance:</strong> 108
            </span>
            <span className="hover:text-amber-300 transition-colors">
              <strong>Women Helpline:</strong> 181
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1 pb-20">
        {activeTab === 'feed' && (
          <GrievanceFeedAndExplore
            grievances={grievances}
            onUpvoteGrievance={handleUpvoteGrievance}
            onSelectGrievance={handleSelectGrievanceToTrack}
            onOpenNewGrievance={() => setIsNewGrievanceOpen(true)}
            onOpenPetitionLetter={(g) => setLetterGrievance(g)}
          />
        )}

        {activeTab === 'track' && (
          <GrievanceTrackerView
            grievances={grievances}
            onOpenPetitionLetter={(g) => setLetterGrievance(g)}
            onRateGrievance={handleRateGrievance}
            onCitizenConfirmResolution={handleCitizenConfirmResolution}
          />
        )}

        {activeTab === 'contractor' && (
          <ContractorDeskView
            grievances={grievances}
            volunteerTasks={volunteerTasks}
            currentProfile={currentProfile}
            onAcceptProject={handleContractorAcceptProject}
            onRejectProject={handleContractorRejectProject}
            onUpdateExecutionStatus={handleUpdateContractorWorkStatus}
          />
        )}

        {activeTab === 'volunteers' && (
          <VolunteerPadaiNetwork
            tasks={volunteerTasks}
            onContribution={handleVolunteerContribution}
            onStartWork={handleSupervisorStartWork}
            onCreateTask={handleCreateDirectVolunteerTask}
          />
        )}

        {/* Level 2: Supervisor Triage Interface */}
        {activeTab === 'supervisor' && (
          <SupervisorReviewView
            grievances={grievances}
            volunteerTasks={volunteerTasks}
            onSupervisorDecision={handleSupervisorDecision}
            onUpdateDailyProgress={handleUpdateDailyProgress}
            onStartVolunteerWork={handleSupervisorStartWork}
            onCreateDirectTask={handleCreateDirectVolunteerTask}
            onOpenGrievanceDetail={(g) => setLetterGrievance(g)}
            onMarkWorkFinished={handleMarkWorkFinished}
            currentProfile={currentProfile}
          />
        )}

        {/* Level 3: CM Special Cell Apex Control Desk */}
        {activeTab === 'cm_cell' && (
          <CMSpecialCellView
            grievances={grievances}
            onGenerateCMTask={handleGenerateCMTask}
            onCMUpholdRejection={handleCMUpholdRejection}
            onOpenGrievanceDetail={(g) => setLetterGrievance(g)}
            onOpenSanctionOrder={(g) => setLetterGrievance(g)}
            currentProfile={currentProfile}
          />
        )}
      </main>

      {/* Global AI Assistant Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-white/20 active:scale-95"
          title="Makkal Sevai AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-700"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-tight">
              {language === 'ta' ? 'மக்கள் சேவகர் AI' : 'Makkal Sevai AI'}
            </span>
            <span className="text-[10px] text-indigo-200 block">
              {language === 'ta' ? 'அரசு நலத்திட்ட வழிகாட்டி' : 'TN Schemes & Redressal'}
            </span>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-between text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-sm">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span>{t('appTitle')}</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              {language === 'ta' ? 'தமிழ்நாடு மக்கள் உரிமைகள், 4-அடுக்கு சரிபார்ப்பு மற்றும் உடனடி குறைதீர்ப்பு இயக்கம்.' : 'Tamil Nadu Grassroots Citizen Action & 4-Tier Grievance Redressal Portal.'}
            </p>
          </div>

          <div className="text-center text-slate-500 text-[11px]">
            {language === 'ta'
              ? 'பொதுமக்கள் • அரசு ஒப்பந்ததாரர் • வட்டார மேற்பார்வையாளர் • முதல்வர் சிறப்பு பிரிவு.'
              : 'Public • Contractor • Field Supervisor • CM Special Cell.'}
          </div>

          <div className="text-center sm:text-right text-slate-400 font-mono text-[11px]">
            v3.2.0 • CM Vijay Tamil Nadu Gov
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <GrievanceFormModal
        isOpen={isNewGrievanceOpen}
        onClose={() => setIsNewGrievanceOpen(false)}
        onSubmitGrievance={handleCreateGrievance}
        currentProfile={currentProfile}
        onOpenAadhaarAuth={() => setIsAadhaarAuthOpen(true)}
      />

      <AadhaarAuthModal
        isOpen={isAadhaarAuthOpen}
        onClose={() => setIsAadhaarAuthOpen(false)}
        currentProfile={currentProfile}
        currentRole={currentRole}
        onSaveProfile={(profile, role) => {
          setCurrentProfile(profile);
          setCurrentRole(role);
          if (role === 'citizen') setActiveTab('feed');
          if (role === 'contractor') setActiveTab('contractor');
          if (role === 'supervisor') setActiveTab('supervisor');
          if (role === 'cm_cell') setActiveTab('cm_cell');
        }}
      />

      <PetitionLetterModal
        isOpen={!!letterGrievance}
        onClose={() => setLetterGrievance(null)}
        grievance={letterGrievance}
      />

      <AIAssistantDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        currentRole={currentRole}
        currentTaluk={currentProfile.taluk}
        currentDistrict={currentProfile.district}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectAction={handleSelectNotificationAction}
      />

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
