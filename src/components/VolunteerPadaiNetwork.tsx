import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VOLUNTEER_TASKS_DATA, TN_DISTRICTS } from '../data/tamilNaduData';
import { VolunteerTask, VolunteerContribution, SupervisorWorkPlan } from '../types';
import { DonationGatewayModal, DonationReceiptData } from './DonationGatewayModal';
import confetti from 'canvas-confetti';
import { 
  Users, 
  TreePine, 
  HeartHandshake, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Phone, 
  Award, 
  ShieldCheck, 
  PlusCircle,
  X,
  IndianRupee,
  Clock,
  HardHat,
  Hammer,
  Zap,
  QrCode,
  Download,
  Check,
  CreditCard,
  Share2,
  TrendingUp,
  AlertCircle,
  Utensils,
  Coffee,
  Truck,
  Settings2,
  Sliders,
  ArrowRightLeft,
  Coins,
  PackageCheck,
  FileText,
  Search,
  Filter,
  Receipt,
  ExternalLink,
  ArrowUpDown,
  FileJson
} from 'lucide-react';

interface VolunteerPadaiNetworkProps {
  tasks?: VolunteerTask[];
  onContribution?: (taskId: string, contribution: VolunteerContribution) => void;
  onStartWork?: (taskId: string, supervisorNotes?: string) => void;
  onCreateTask?: (newTask: VolunteerTask) => void;
  onToggleJoin?: (taskId: string) => void;
}

export const VolunteerPadaiNetwork: React.FC<VolunteerPadaiNetworkProps> = ({
  tasks: propTasks,
  onContribution,
  onStartWork,
  onCreateTask: propCreateTask,
  onToggleJoin,
}) => {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<VolunteerTask[]>(propTasks || VOLUNTEER_TASKS_DATA);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Keep synced with propTasks if passed
  React.useEffect(() => {
    if (propTasks && propTasks.length > 0) {
      setTasks(propTasks);
    }
  }, [propTasks]);
  
  // Registration modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerDistrict, setVolunteerDistrict] = useState('Chennai');
  const [volunteerWard, setVolunteerWard] = useState('');
  const [volunteerSkill, setVolunteerSkill] = useState('Field Action & Physical Aid');
  const [isRegistered, setIsRegistered] = useState(false);

  // Dedicated Donation & Simulated UPI Gateway Modal State
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationModalTask, setDonationModalTask] = useState<VolunteerTask | null>(null);
  const [viewReceiptData, setViewReceiptData] = useState<DonationReceiptData | null>(null);

  // Transaction Ledger Filters & Sorting
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txModeFilter, setTxModeFilter] = useState('all');

  // 3-Day Support Modal State (Financial, Physical Labour, OR Food & Refreshments)
  const [supportModalTask, setSupportModalTask] = useState<VolunteerTask | null>(null);
  const [supportType, setSupportType] = useState<'physical_labour' | 'financial' | 'food_refreshment'>('financial');
  
  // Financial support form & Enhanced UPI
  const [financialAmount, setFinancialAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [paymentPurpose, setPaymentPurpose] = useState('Raw Materials & Equipment (Pipes, Cement, Plants)');
  const [upiMode, setUpiMode] = useState<'apps' | 'qr' | 'vpa'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [enteredVpa, setEnteredVpa] = useState<string>('');
  const [isCopiedVpa, setIsCopiedVpa] = useState<boolean>(false);
  const [financialReceipt, setFinancialReceipt] = useState<{
    receiptNo: string;
    amount: number;
    taskTitle: string;
    donorName: string;
    donorPhone?: string;
    timestamp: string;
    paymentMethod: string;
    upiRefId: string;
    purpose: string;
    surplusStatus?: string;
  } | null>(null);

  // Physical labour form
  const [labourVolunteerName, setLabourVolunteerName] = useState('');
  const [labourVolunteerPhone, setLabourVolunteerPhone] = useState('');
  const [labourCompensationType, setLabourCompensationType] = useState<'free' | 'paid'>('free');
  const [committedHours, setCommittedHours] = useState<number>(4);
  const [labourSkill, setLabourSkill] = useState('Desilting & Debris Clearing');
  const [toolsBringing, setToolsBringing] = useState('Safety Gloves & Basic Tools');
  const [labourDutyPass, setLabourDutyPass] = useState<{
    passId: string;
    volunteerName: string;
    taskTitle: string;
    hours: number;
    location: string;
    date: string;
    compensationType: 'free' | 'paid';
    dailyWageClaim?: string;
  } | null>(null);

  // Food, Drink & Refreshment form
  const [foodDonorName, setFoodDonorName] = useState('');
  const [foodDonorPhone, setFoodDonorPhone] = useState('');
  const [foodCategory, setFoodCategory] = useState<'cooked_meals' | 'drinking_water' | 'breakfast_tea' | 'tender_coconut_buttermilk' | 'snacks_biscuits'>('cooked_meals');
  const [foodItemName, setFoodItemName] = useState('');
  const [foodQuantity, setFoodQuantity] = useState<number>(50);
  const [foodUnit, setFoodUnit] = useState<string>('Meal Packs (சாப்பாடு பொட்டலங்கள்)');
  const [foodDeliverySlot, setFoodDeliverySlot] = useState<string>('Lunch Shift (12:30 PM)');
  const [foodDeliveryMethod, setFoodDeliveryMethod] = useState<'self_delivery_to_camp' | 'volunteer_pickup_needed'>('self_delivery_to_camp');
  const [foodDeliveryAddress, setFoodDeliveryAddress] = useState<string>('');
  const [foodRefreshmentPass, setFoodRefreshmentPass] = useState<{
    passId: string;
    donorName: string;
    taskTitle: string;
    foodDetails: string;
    quantity: number;
    slot: string;
    location: string;
    coordinatorPhone: string;
    timestamp: string;
  } | null>(null);

  // Supervisor Operations & Cost Control Modal
  const [supervisorTaskModal, setSupervisorTaskModal] = useState<VolunteerTask | null>(null);
  const [editSupervisorName, setEditSupervisorName] = useState('');
  const [editSupervisorDesignation, setEditSupervisorDesignation] = useState('');
  const [editTimelineDays, setEditTimelineDays] = useState<number>(3);
  const [editWorkStartDate, setEditWorkStartDate] = useState('');
  const [editWorkDurationDays, setEditWorkDurationDays] = useState<number>(3);
  const [editShiftTiming, setEditShiftTiming] = useState('Morning Shift (06:30 AM - 01:30 PM)');
  const [editRequiredStaffCount, setEditRequiredStaffCount] = useState<number>(6);
  const [editSpecialists, setEditSpecialists] = useState<string>('1 Civil Supervisor, 2 JCB Operators, 3 Safety Marshals');
  
  // Cost breakdown
  const [editCostMaterials, setEditCostMaterials] = useState<number>(18000);
  const [editCostMachinery, setEditCostMachinery] = useState<number>(20000);
  const [editCostLabourSafety, setEditCostLabourSafety] = useState<number>(8000);
  const [editCostContingency, setEditCostContingency] = useState<number>(4000);
  const [supervisorSaveSuccess, setSupervisorSaveSuccess] = useState(false);

  // Create new task modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTitleTamil, setNewTaskTitleTamil] = useState('');
  const [newTaskDistrict, setNewTaskDistrict] = useState('Chennai');
  const [newTaskWard, setNewTaskWard] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Sanitation & Desilting' | 'Tree Plantation' | 'Education & Tuition' | 'Medical Camp Support' | 'Food & Relief' | 'Elderly Support'>('Sanitation & Desilting');
  const [newTaskFinancialTarget, setNewTaskFinancialTarget] = useState('35000');
  const [newTaskLabourTarget, setNewTaskLabourTarget] = useState('30');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskTimelineDays, setNewTaskTimelineDays] = useState('3');

  // Handle Quick Join / Leave Task
  const handleToggleJoin = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowJoined = !t.isJoined;
          if (isNowJoined) {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
          }
          return {
            ...t,
            isJoined: isNowJoined,
            joinedVolunteers: isNowJoined ? t.joinedVolunteers + 1 : Math.max(0, t.joinedVolunteers - 1),
            registeredLabourVolunteers: isNowJoined ? (t.registeredLabourVolunteers || 0) + 1 : Math.max(0, (t.registeredLabourVolunteers || 1) - 1),
          };
        }
        return t;
      })
    );
  };

  // Handle General Cadre Registration
  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone) return;

    setIsRegistered(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      setShowRegisterModal(false);
      setIsRegistered(false);
      setVolunteerName('');
      setVolunteerPhone('');
    }, 2000);
  };

  // Open Dedicated Donation & UPI Gateway Modal
  const handleOpenDonationModal = (task?: VolunteerTask) => {
    setViewReceiptData(null);
    setDonationModalTask(task || tasks[0] || null);
    setIsDonationModalOpen(true);
  };

  // Open Receipt Details in Success Modal
  const handleViewReceipt = (receipt: DonationReceiptData) => {
    setViewReceiptData(receipt);
    setIsDonationModalOpen(true);
  };

  // Handle Success callback from DonationGatewayModal
  const handleDonationSuccess = (taskId: string, contribution: VolunteerContribution) => {
    // Propagate up to App.tsx / global supervisor state
    onContribution?.(taskId, contribution);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newCollected = (t.collectedFinancialINR || 0) + contribution.amountINR;
          const targetNeeded = t.supervisorControl?.estimatedTotalCostINR || t.targetFinancialINR || 50000;
          const surplus = newCollected > targetNeeded ? newCollected - targetNeeded : 0;

          return {
            ...t,
            collectedFinancialINR: newCollected,
            financialContributorsCount: (t.financialContributorsCount || 0) + 1,
            surplusAmountINR: surplus,
            isSurplusTransferred: surplus > 0,
            supervisorControl: t.supervisorControl ? {
              ...t.supervisorControl,
              surplusTransferredINR: surplus
            } : undefined,
            contributions: [contribution, ...(t.contributions || [])]
          };
        }
        return t;
      })
    );
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
          supervisorName: task.supervisorControl?.supervisorName || task.coordinatorName || "Taluk Nodal Supervisor",
          designation: task.supervisorControl?.supervisorDesignation || "Civic Field Officer",
          contactNumber: task.coordinatorPhone || "9840XXXXXX",
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

  // Aggregated Financial Transactions for the Civic Ledger
  const allFinancialTransactions: DonationReceiptData[] = useMemo(() => {
    const list: DonationReceiptData[] = [];

    tasks.forEach((t) => {
      (t.contributions || []).forEach((c, idx) => {
        if (c.type === 'financial') {
          const urn = c.upiTransactionId || `SBI-NPCI-${(c.id || `TX${idx}`).replace(/[^a-zA-Z0-9]/g, '').slice(-8) || (49000000 + idx * 713).toString()}`;
          const amt = c.amountINR || 0;
          list.push({
            receiptNo: `TN-UPI-ESCROW-${(c.id || `TX${idx}`).slice(-6).toUpperCase()}`,
            urn,
            amount: amt,
            donorName: c.contributorName || 'Anonymous Civic Benefactor',
            donorPhone: c.contributorPhone || '9840XXXXXX',
            taskTitle: language === 'ta' ? t.titleTamil : t.titleEnglish,
            location: `${t.district} - ${t.ward}`,
            timestamp: c.timestamp || '2026-08-14 11:20 AM',
            paymentMethod: c.paymentMethod ? `${c.paymentMethod} (UPI)` : 'UPI App',
            purpose: '100% Escrow Direct Civic Aid',
            surplusRerouted: t.surplusAmountINR && t.surplusAmountINR > 0 ? Math.round(amt * 0.12) : undefined,
            fundBreakdown: {
              materials: Math.round(amt * 0.4),
              machinery: Math.round(amt * 0.3),
              labour: Math.round(amt * 0.2),
              safetyContingency: Math.round(amt * 0.1),
            }
          });
        }
      });
    });

    return list;
  }, [tasks, language]);

  // Submit Financial Support & Calculate Surplus Rollover with Enhanced UPI
  const handleSubmitFinancialSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportModalTask) return;
    const finalAmount = customAmount ? parseFloat(customAmount) || financialAmount : financialAmount;
    if (finalAmount <= 0) return;

    const receiptNo = `TN-UPI-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const upiRefId = `SBI-NPCI-${Date.now().toString().slice(-8)}`;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const newContrib: VolunteerContribution = {
      id: receiptNo,
      contributorName: donorName || 'Civic Benefactor',
      contributorPhone: donorPhone || '9840XXXXXX',
      type: 'financial',
      amountINR: finalAmount,
      paymentMethod: 'UPI',
      upiTransactionId: upiRefId,
      timestamp: nowStr
    };

    // Propagate up to App.tsx / global supervisor state
    onContribution?.(supportModalTask.id, newContrib);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === supportModalTask.id) {
          const newCollected = (t.collectedFinancialINR || 0) + finalAmount;
          const targetNeeded = t.supervisorControl?.estimatedTotalCostINR || t.targetFinancialINR || 50000;
          const surplus = newCollected > targetNeeded ? newCollected - targetNeeded : 0;

          return {
            ...t,
            collectedFinancialINR: newCollected,
            financialContributorsCount: (t.financialContributorsCount || 0) + 1,
            surplusAmountINR: surplus,
            isSurplusTransferred: surplus > 0,
            supervisorControl: t.supervisorControl ? {
              ...t.supervisorControl,
              surplusTransferredINR: surplus
            } : undefined,
            contributions: [newContrib, ...(t.contributions || [])]
          };
        }
        return t;
      })
    );

    const taskNeededCost = supportModalTask.supervisorControl?.estimatedTotalCostINR || supportModalTask.targetFinancialINR || 50000;
    const projectedTotal = (supportModalTask.collectedFinancialINR || 0) + finalAmount;
    const surplusAmt = projectedTotal > taskNeededCost ? projectedTotal - taskNeededCost : 0;

    setFinancialReceipt({
      receiptNo,
      amount: finalAmount,
      taskTitle: language === 'ta' ? supportModalTask.titleTamil : supportModalTask.titleEnglish,
      donorName: donorName || 'Concerned Citizen Benefactor',
      donorPhone: donorPhone || '9840123456',
      timestamp: nowStr,
      paymentMethod: selectedUpiApp === 'gpay' ? 'Google Pay UPI' : selectedUpiApp === 'phonepe' ? 'PhonePe UPI' : selectedUpiApp === 'paytm' ? 'Paytm UPI' : 'BHIM / SBI UPI Instant Escrow',
      upiRefId,
      purpose: paymentPurpose,
      surplusStatus: surplusAmt > 0 
        ? `₹${surplusAmt.toLocaleString('en-IN')} Extra Surplus routed to District Civic Development Pool` 
        : undefined
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Submit Physical Labour Support
  const handleSubmitPhysicalLabour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportModalTask) return;

    const passId = `SHRAM-PASS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const dailyWageRate = supportModalTask.supervisorControl?.dailyWageBenchmarkINR || supportModalTask.supervisorControl?.estimatedTotalCostINR ? 650 : (supportModalTask.dailyWageINR || 650);

    const newContrib: VolunteerContribution = {
      id: passId,
      contributorName: labourVolunteerName || 'Sevai Volunteer',
      contributorPhone: labourVolunteerPhone || '9840XXXXXX',
      type: 'physical_labour',
      labourHours: committedHours,
      labourSkill,
      timestamp: nowStr,
      compensationType: labourCompensationType,
      dailyWageClaimINR: labourCompensationType === 'paid' ? dailyWageRate : 0
    };

    // Propagate up to App.tsx / global supervisor state
    onContribution?.(supportModalTask.id, newContrib);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === supportModalTask.id) {
          return {
            ...t,
            registeredLabourVolunteers: (t.registeredLabourVolunteers || t.joinedVolunteers || 0) + 1,
            joinedVolunteers: (t.joinedVolunteers || 0) + 1,
            isJoined: true,
            contributions: [newContrib, ...(t.contributions || [])]
          };
        }
        return t;
      })
    );

    setLabourDutyPass({
      passId,
      volunteerName: labourVolunteerName || 'Sevai Volunteer',
      taskTitle: language === 'ta' ? supportModalTask.titleTamil : supportModalTask.titleEnglish,
      hours: committedHours,
      location: `${supportModalTask.district} - ${supportModalTask.ward} (${supportModalTask.location})`,
      date: supportModalTask.date,
      compensationType: labourCompensationType,
      dailyWageClaim: labourCompensationType === 'paid' ? `TN-WAGE-CLAIM-₹${dailyWageRate}/Day` : undefined
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Submit Food, Drink & Refreshment Support
  const handleSubmitFoodSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportModalTask) return;

    const passId = `FOOD-SEVAI-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    
    let defaultItemDesc = foodItemName;
    if (!defaultItemDesc) {
      if (foodCategory === 'cooked_meals') defaultItemDesc = 'Hot Cooked Meals & Variety Rice Packets';
      else if (foodCategory === 'drinking_water') defaultItemDesc = 'Clean RO Drinking Water Bottles & Water Cans';
      else if (foodCategory === 'breakfast_tea') defaultItemDesc = 'Morning Tiffin (Idli/Pongal) & Hot Tea/Coffee Flasks';
      else if (foodCategory === 'tender_coconut_buttermilk') defaultItemDesc = 'Fresh Tender Coconuts & Cold Spiced Buttermilk Pouches';
      else defaultItemDesc = 'Energy Biscuits, Bananas & Evening Snacks';
    }

    const newContrib: VolunteerContribution = {
      id: passId,
      contributorName: foodDonorName || 'Civic Food & Refreshment Patron',
      contributorPhone: foodDonorPhone || '9840XXXXXX',
      type: 'food_refreshment',
      foodCategory,
      foodItemName: defaultItemDesc,
      foodQuantity,
      foodUnit,
      foodDeliverySlot,
      foodDeliveryMethod,
      foodDeliveryAddress,
      timestamp: nowStr
    };

    // Propagate up to App.tsx / global supervisor state
    onContribution?.(supportModalTask.id, newContrib);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === supportModalTask.id) {
          const isMeal = foodCategory === 'cooked_meals' || foodCategory === 'breakfast_tea';
          const isWater = foodCategory === 'drinking_water' || foodCategory === 'tender_coconut_buttermilk';
          return {
            ...t,
            foodContributionsCount: (t.foodContributionsCount || 0) + 1,
            totalMealsPledged: isMeal ? (t.totalMealsPledged || 0) + foodQuantity : (t.totalMealsPledged || 0),
            totalWaterBottlesPledged: isWater ? (t.totalWaterBottlesPledged || 0) + foodQuantity : (t.totalWaterBottlesPledged || 0),
            totalRefreshmentPacksPledged: (t.totalRefreshmentPacksPledged || 0) + foodQuantity,
            contributions: [newContrib, ...(t.contributions || [])]
          };
        }
        return t;
      })
    );

    setFoodRefreshmentPass({
      passId,
      donorName: foodDonorName || 'Civic Food Patron',
      taskTitle: language === 'ta' ? supportModalTask.titleTamil : supportModalTask.titleEnglish,
      foodDetails: `${foodQuantity} ${foodUnit} (${defaultItemDesc})`,
      quantity: foodQuantity,
      slot: foodDeliverySlot,
      location: `${supportModalTask.district} - ${supportModalTask.ward} (${supportModalTask.location})`,
      coordinatorPhone: supportModalTask.coordinatorPhone,
      timestamp: nowStr
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Open Supervisor Control Modal
  const handleOpenSupervisorModal = (task: VolunteerTask) => {
    setSupervisorTaskModal(task);
    const plan = task.supervisorControl;
    setEditSupervisorName(plan?.supervisorName || 'Er. K. Murugesan');
    setEditSupervisorDesignation(plan?.supervisorDesignation || 'Taluk Field Engineer & Supervisor');
    setEditTimelineDays(task.timelineWindowDays || plan?.timelineWindowDays || 3);
    setEditWorkStartDate(plan?.workStartDate || new Date().toISOString().split('T')[0]);
    setEditWorkDurationDays(plan?.workDurationDays || 3);
    setEditShiftTiming(plan?.shiftTiming || 'Morning Shift (06:30 AM - 01:30 PM)');
    setEditRequiredStaffCount(plan?.requiredStaffCount || 6);
    setEditSpecialists(plan?.requiredSpecialists.join(', ') || '1 Civil Engineer, 2 JCB Operators, 3 Safety Marshals');
    
    // Cost breakdown
    setEditCostMaterials(plan?.costBreakdown.materialsCost || 18000);
    setEditCostMachinery(plan?.costBreakdown.machineryEquipmentCost || 20000);
    setEditCostLabourSafety(plan?.costBreakdown.labourAndSafetyCost || 8000);
    setEditCostContingency(plan?.costBreakdown.contingencyLogisticsCost || 4000);
    setSupervisorSaveSuccess(false);
  };

  // Save Supervisor Operational Plan & Recalculate Budget & Surplus
  const handleSaveSupervisorControl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorTaskModal) return;

    const totalEstimatedCost = editCostMaterials + editCostMachinery + editCostLabourSafety + editCostContingency;
    const specialistArr = editSpecialists.split(',').map((s) => s.trim()).filter(Boolean);
    const collected = supervisorTaskModal.collectedFinancialINR || 0;
    const surplus = collected > totalEstimatedCost ? collected - totalEstimatedCost : 0;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const updatedPlan: SupervisorWorkPlan = {
      supervisorName: editSupervisorName,
      supervisorDesignation: editSupervisorDesignation,
      estimatedTotalCostINR: totalEstimatedCost,
      costBreakdown: {
        materialsCost: editCostMaterials,
        machineryEquipmentCost: editCostMachinery,
        labourAndSafetyCost: editCostLabourSafety,
        contingencyLogisticsCost: editCostContingency
      },
      workStartDate: editWorkStartDate,
      workDurationDays: editWorkDurationDays,
      timelineWindowDays: editTimelineDays,
      shiftTiming: editShiftTiming,
      requiredStaffCount: editRequiredStaffCount,
      requiredSpecialists: specialistArr,
      surplusFundAction: 'transfer_to_district_development_pool',
      surplusTransferredINR: surplus,
      lastUpdatedTimestamp: nowStr
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === supervisorTaskModal.id) {
          return {
            ...t,
            timelineWindowDays: editTimelineDays,
            hoursRemaining: editTimelineDays * 24,
            volunteerWindowDeadline: `${editTimelineDays} Days Mobilization (Under Supervisor Control)`,
            targetFinancialINR: totalEstimatedCost,
            surplusAmountINR: surplus,
            isSurplusTransferred: surplus > 0,
            supervisorControl: updatedPlan
          };
        }
        return t;
      })
    );

    setSupervisorSaveSuccess(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setSupervisorTaskModal(null);
      setSupervisorSaveSuccess(false);
    }, 1500);
  };

  // Create brand new task
  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskWard) return;

    const days = parseInt(newTaskTimelineDays) || 3;
    const targetFin = parseInt(newTaskFinancialTarget) || 35000;

    const newTask: VolunteerTask = {
      id: `vol-task-${Date.now()}`,
      titleTamil: newTaskTitleTamil || newTaskTitle,
      titleEnglish: newTaskTitle,
      district: newTaskDistrict,
      ward: newTaskWard,
      category: newTaskCategory,
      date: `Starts in ${days} Days (Scheduled by Supervisor)`,
      location: `${newTaskWard}, ${newTaskDistrict}`,
      targetVolunteers: parseInt(newTaskLabourTarget) || 25,
      joinedVolunteers: 1,
      registeredLabourVolunteers: 1,
      descriptionTamil: newTaskDescription || 'பொதுமக்கள் நிதி, உணவு மற்றும் உடல் உழைப்பு மூலம் மேற்பார்வையாளர் வழிகாட்டுதலில் நிறைவேற்றப்படும் கூட்டு மக்கள் நலப் பணி.',
      descriptionEnglish: newTaskDescription || 'Community mobilization task with flexible supervisor timeline for financial, shramdaan, and refreshment support.',
      coordinatorName: 'Citizen Action Committee',
      coordinatorPhone: '9443012345',
      status: 'In Progress',
      impactMetric: `Direct community resolution within ${days} days`,
      isJoined: true,
      isActivatedTask: true,
      activationDate: new Date().toLocaleDateString('en-IN'),
      volunteerWindowDeadline: `${days * 24} Hours Mobilization (${days} Days Window)`,
      hoursRemaining: days * 24,
      timelineWindowDays: days,
      targetFinancialINR: targetFin,
      collectedFinancialINR: 0,
      financialContributorsCount: 0,
      targetLabourVolunteers: parseInt(newTaskLabourTarget) || 25,
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
        supervisorName: 'Er. R. Murugesan',
        supervisorDesignation: 'Taluk Field Engineer & Supervisor',
        estimatedTotalCostINR: targetFin,
        costBreakdown: {
          materialsCost: Math.round(targetFin * 0.45),
          machineryEquipmentCost: Math.round(targetFin * 0.35),
          labourAndSafetyCost: Math.round(targetFin * 0.12),
          contingencyLogisticsCost: Math.round(targetFin * 0.08)
        },
        workStartDate: new Date().toISOString().split('T')[0],
        workDurationDays: days,
        timelineWindowDays: days,
        shiftTiming: 'Morning Shift (06:30 AM - 01:30 PM)',
        requiredStaffCount: 5,
        requiredSpecialists: ['1 Civil Supervisor', '2 Operators', '2 Safety Marshals'],
        surplusFundAction: 'transfer_to_district_development_pool',
        surplusTransferredINR: 0,
        lastUpdatedTimestamp: new Date().toLocaleString('en-IN')
      },
      contributions: []
    };

    setTasks([newTask, ...tasks]);
    setShowCreateTaskModal(false);
    setNewTaskTitle('');
    setNewTaskTitleTamil('');
    setNewTaskWard('');
    setNewTaskDescription('');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === '3day_window') return t.isActivatedTask;
    if (filterCategory === 'sanitation') return t.category === 'Sanitation & Desilting';
    if (filterCategory === 'tree') return t.category === 'Tree Plantation';
    if (filterCategory === 'education') return t.category === 'Education & Tuition';
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-red-500 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-black/20 text-yellow-200 text-xs font-bold px-3.5 py-1 rounded-full border border-white/20">
            <Users className="w-3.5 h-3.5" />
            {language === 'ta' ? 'தளபதி மக்கள் பணிப்படை & தோழர் பாசறை இயக்கம்' : 'TVK Grassroots Civic Volunteer & Sevai Cadre'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ta'
              ? 'மக்கள் ஆதரவு களம்: நிதி, உடல் உழைப்பு அல்லது உணவு & குடிநீர் உதவி!'
              : 'Triple-Support Civic Mobilization: Financial, Physical Labour & Refreshments'}
          </h2>

          <p className="text-sm text-amber-100 font-medium leading-relaxed">
            {language === 'ta'
              ? 'மக்கள் பணியில் நிதி அல்லது உடல் உழைப்பு வழங்க இயலாதவர்கள், களத்தில் உழைக்கும் தன்னார்வலர்களுக்கு உணவு, குடிநீர், மோர், தேநீர் & சிற்றுண்டி வழங்கலாம்! மேற்பார்வையாளர்கள் பணிக்கான கால வரம்பு, தொடங்கும் நாள், தேவையான பணியாளர்கள் மற்றும் மொத்த மதிப்பீட்டை நிர்ணயிப்பர்; அதிகப்படியான உபரி நிதி மற்ற வளர்ச்சிப் பணிகளுக்கு தானாக மாற்றப்படும்.'
              : 'Citizens who cannot offer financial money or physical labour can provide Meals, Drinking Water, or Refreshments for on-ground workers. Field Supervisors control work duration, timeline, start dates, staffing, and itemized cost estimation; surplus funds automatically roll over to the District Development Pool.'}
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleOpenDonationModal()}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-xl border border-emerald-400/40 transition-all cursor-pointer active:scale-95 ring-2 ring-white/20"
            >
              <IndianRupee className="w-4 h-4 text-emerald-200" />
              <span>{language === 'ta' ? '💛 மக்கள் நேரடி நிதிப் பங்களிப்பு (UPI Escrow)' : '💛 Direct Civic Contribution (100% Escrow)'}</span>
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>{language === 'ta' ? 'மக்கள் பணிப்படை உறுப்பினராக பதிவு செய்க' : 'Register as TVK Civic Volunteer'}</span>
            </button>

            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/40 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg backdrop-blur-xs transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-yellow-300" />
              <span>{language === 'ta' ? 'புதிய பணி தொடங்கு' : 'Activate Civic Task'}</span>
            </button>
          </div>
        </div>

        {/* Impact stats */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center relative z-10">
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">₹14.8 L</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'மக்கள் நிதி பங்களிப்பு' : 'Direct Civic Funds Raised'}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">3-7 Days</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'மேற்பார்வையாளர் கால வரம்பு' : 'Supervisor Mobilization'}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">2,450+</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'உணவு & குடிநீர் பாக்கெட்டுகள்' : 'Meals & Drinks Pledged'}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white block">4,200+</span>
            <span className="text-xs text-amber-100 font-medium">{language === 'ta' ? 'உடல் உழைப்பு மணித்துளிகள்' : 'Physical Labour Hours'}</span>
          </div>
        </div>
      </div>

      {/* 3 Modalities & Supervisor Governance Explainer Banner */}
      <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <span>{language === 'ta' ? 'முப்பெரும் மக்கள் ஆதரவு & மேற்பார்வையாளர் விதிமுறை:' : 'Triple Support Modality & Supervisor Protocol:'}</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">Gov Policy</span>
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {language === 'ta'
                ? '1. நிதி உதவி (Direct Fund) • 2. உடல் உழைப்பு (Shramdaan) • 3. உணவு & குடிநீர் ஆதரவு (Food & Refreshment). மேற்பார்வையாளர் தேவைக்கேற்ப 3 நாள் காலக்கெடுவை நீட்டிக்க/மாற்றலாம்; திட்டத்திற்கு தேவைப்படும் உண்மையான செலவை விட கூடுதல் நிதி திரண்டால், அந்த உபரி நிதி மாவட்டத்தின் பிற மக்கள் பணிகளுக்கு மாற்றப்படும்.'
                : '1. Financial Contribution • 2. Physical Shramdaan • 3. Food & Refreshment Packs. Supervisors control timeline extensions, work start dates, and staff counts. Any surplus funds beyond estimated project cost roll over to the District Civic Development Pool.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1.5 rounded-xl">
            <IndianRupee className="w-3.5 h-3.5" /> {language === 'ta' ? 'நிதி உதவி' : 'Financial'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-1.5 rounded-xl">
            <HardHat className="w-3.5 h-3.5" /> {language === 'ta' ? 'உடல் உழைப்பு' : 'Labour'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200 px-2.5 py-1.5 rounded-xl">
            <Utensils className="w-3.5 h-3.5" /> {language === 'ta' ? 'உணவு & குடிநீர்' : 'Food/Drinks'}
          </span>
        </div>
      </div>

      {/* Simulated UPI Donation Spotlight Callout */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shrink-0 shadow-inner">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                100% Escrow Verified UPI Gateway
              </span>
              <span className="text-xs text-emerald-200/80">
                GPay • PhonePe • Paytm • BHIM SBI
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {language === 'ta' ? 'மக்கள் நேரடி நிதிப் பங்களிப்பு நுழைவாயில் (Instant UPI Direct Aid)' : 'Citizen Micro-Donation & Simulated UPI Gateway'}
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'ta' ? 'குறிப்பிட்ட பணிக்கு நிதி வழங்கி உடனடி ரசீது, URN எண் மற்றும் வரி விலக்குச் சான்றிதழைப் பெறுங்கள்.' : 'Contribute directly to any civic task with simulated UPI apps, QR scan, or VPA with instant e-receipts.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterCategory('transactions')}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-emerald-300" />
            <span>{language === 'ta' ? 'வரலாறு' : 'View Ledger'}</span>
          </button>
          <button
            onClick={() => handleOpenDonationModal()}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <IndianRupee className="w-4 h-4" />
            <span>{language === 'ta' ? 'நன்கொடை செலுத்துக' : 'Contribute (UPI)'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'ta' ? 'அனைத்து பணிகள்' : 'All Missions'} ({tasks.length})
          </button>

          <button
            onClick={() => setFilterCategory('3day_window')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterCategory === '3day_window'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xs'
                : 'bg-amber-100/70 text-amber-900 border border-amber-300 hover:bg-amber-200/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ta' ? '⚡ விரைவு ஆதரவு பணிகள்' : '⚡ Rapid Support Windows'}</span>
            <span className="bg-white/30 text-current text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {tasks.filter(t => t.isActivatedTask).length}
            </span>
          </button>

          <button
            onClick={() => setFilterCategory('sanitation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'sanitation'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'ta' ? 'துப்புரவு & தூர்வாருதல்' : 'Desilting & Sanitation'}
          </button>

          <button
            onClick={() => setFilterCategory('tree')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'tree'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'ta' ? 'மரக்கன்றுகள் நடுதல்' : 'Tree Plantation'}
          </button>

          <button
            onClick={() => setFilterCategory('transactions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterCategory === 'transactions'
                ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-500'
                : 'bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'ta' ? '📜 பரிவர்த்தனை வரலாறு' : '📜 Transaction History & Ledger'}</span>
            <span className="bg-emerald-200 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {allFinancialTransactions.length}
            </span>
          </button>
        </div>

        <button
          onClick={() => setShowCreateTaskModal(true)}
          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ta' ? 'புதிய பணி தொடங்கு' : 'Post Community Task'}</span>
        </button>
      </div>

      {/* Transaction History & Civic Ledger View */}
      {filterCategory === 'transactions' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Metrics summary banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-5 rounded-3xl border border-emerald-700/50 shadow-md">
              <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-1">
                <span>Total Capital Mobilized</span>
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-black block">
                ₹{allFinancialTransactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-200 mt-1 block">100% Escrow Allocated & Tax-Exempt</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                <span>Verified Contributions</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
                {allFinancialTransactions.length}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Across {tasks.length} Civic Mission Camps</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                <span>Average Benefaction</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
                ₹{allFinancialTransactions.length > 0 ? Math.round(allFinancialTransactions.reduce((acc, t) => acc + t.amount, 0) / allFinancialTransactions.length).toLocaleString('en-IN') : '0'}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Simulated NPCI Instant Settlement</span>
            </div>

            <div className="bg-gradient-to-br from-amber-900 to-yellow-900 text-white p-5 rounded-3xl border border-amber-700/50 shadow-md">
              <div className="flex items-center justify-between text-xs text-amber-200 font-bold mb-1">
                <span>Surplus Development Pool</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-black block">
                ₹{allFinancialTransactions.reduce((acc, t) => acc + (t.surplusRerouted || 0), 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-amber-200 mt-1 block">Rerouted to District Civic Contingencies</span>
            </div>
          </div>

          {/* Search & Filter Toolbar for Ledger */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                placeholder={language === 'ta' ? 'பெயர், URN எண், அல்லது பணி தேட...' : 'Search by Benefactor, URN, or Mission...'}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> {language === 'ta' ? 'வகை:' : 'Mode:'}
              </span>
              {['all', 'UPI', 'GPay', 'PhonePe', 'Paytm', 'BHIM'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTxModeFilter(mode)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    txModeFilter === mode
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mode === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All Modes') : mode}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  const csvRows = [
                    ['Receipt No', 'URN', 'Benefactor', 'Amount (INR)', 'Mission', 'Location', 'Mode', 'Timestamp'],
                    ...allFinancialTransactions.map(t => [
                      t.receiptNo,
                      t.urn,
                      `"${t.donorName}"`,
                      t.amount,
                      `"${t.taskTitle}"`,
                      `"${t.location}"`,
                      t.paymentMethod,
                      `"${t.timestamp}"`
                    ])
                  ];
                  const csvString = csvRows.map(e => e.join(',')).join('\n');
                  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', `TN_Civic_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="ml-auto px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                title="Download CSV Audit Statement"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'CSV ஏற்றுமதி' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {allFinancialTransactions
              .filter((tx) => {
                if (txModeFilter !== 'all' && !tx.paymentMethod.toLowerCase().includes(txModeFilter.toLowerCase())) {
                  return false;
                }
                if (txSearchQuery) {
                  const query = txSearchQuery.toLowerCase();
                  return (
                    tx.donorName.toLowerCase().includes(query) ||
                    tx.urn.toLowerCase().includes(query) ||
                    tx.receiptNo.toLowerCase().includes(query) ||
                    tx.taskTitle.toLowerCase().includes(query) ||
                    tx.location.toLowerCase().includes(query)
                  );
                }
                return true;
              })
              .map((tx) => (
                <div
                  key={tx.urn}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {tx.urn}
                      </span>
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tx.paymentMethod}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tx.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {tx.donorName}
                      </h4>
                      {tx.donorPhone && (
                        <span className="text-xs text-slate-400 font-mono">
                          ({tx.donorPhone})
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-900">{tx.taskTitle}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" /> {tx.location}
                      </span>
                    </div>

                    {tx.surplusRerouted && (
                      <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>₹{tx.surplusRerouted.toLocaleString('en-IN')} excess routed to District Civic Contingency Pool</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-lg sm:text-xl font-black text-emerald-700 block">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> 80G Tax Exempt
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleViewReceipt(tx)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'ரசீது காண்க' : 'View E-Receipt'}</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {allFinancialTransactions.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">
                {language === 'ta' ? 'பரிவர்த்தனைகள் எதுவும் இல்லை' : 'No Financial Contributions Recorded Yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {language === 'ta'
                  ? 'தன்னார்வப் பணிகளுக்கு நிதி வழங்கி உடனடி UPI கட்டண நுழைவாயிலை சோதிக்கவும்.'
                  : 'Contribute to any civic task via simulated UPI to record your first transaction.'}
              </p>
              <button
                type="button"
                onClick={() => handleOpenDonationModal()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <IndianRupee className="w-4 h-4" />
                <span>{language === 'ta' ? 'நன்கொடை செலுத்துக' : 'Make a Contribution'}</span>
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Volunteer Tasks List */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const volunteerPercentage = Math.min(100, Math.round(((task.registeredLabourVolunteers || task.joinedVolunteers) / (task.targetLabourVolunteers || task.targetVolunteers)) * 100));
            const targetFin = task.supervisorControl?.estimatedTotalCostINR || task.targetFinancialINR || 50000;
            const collectedFin = task.collectedFinancialINR || 0;
            const financialPercentage = targetFin ? Math.min(100, Math.round((collectedFin / targetFin) * 100)) : 0;
            const surplusAmt = task.surplusAmountINR || (collectedFin > targetFin ? collectedFin - targetFin : 0);

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* 3-Day Window Top Badge */}
                {task.isActivatedTask && (
                  <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-white px-4 py-1.5 -mx-6 -mt-6 mb-2 flex items-center justify-between text-xs font-black">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      {language === 'ta' ? `${task.timelineWindowDays || 3} நாள் மக்கள் ஆதரவு களம்` : `${task.timelineWindowDays || 3}-Day Community Window`}
                    </span>
                    <span className="bg-black/30 px-2 py-0.5 rounded text-[11px] font-mono">
                      ⏳ {task.hoursRemaining ? `${task.hoursRemaining}h remaining` : 'Active'}
                    </span>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
                      {task.category}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                      {task.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {language === 'ta' ? task.titleTamil : task.titleEnglish}
                  </h4>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{task.district} • {task.ward} ({task.location})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{task.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'ta' ? task.descriptionTamil : task.descriptionEnglish}
                  </p>

                  {/* Supervisor Operational Summary Card */}
                  {task.supervisorControl && (
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-indigo-950">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          {task.supervisorControl.supervisorName} ({language === 'ta' ? 'கள மேற்பார்வையாளர்' : 'Supervisor'})
                        </span>
                        <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-md font-mono">
                          {task.supervisorControl.timelineWindowDays} {language === 'ta' ? 'நாட்கள் அவகாசம்' : 'Days Window'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-indigo-200/60">
                        <div>
                          <span className="text-slate-400 block">{language === 'ta' ? 'வேலை தொடங்கும் நாள்:' : 'Work Start Date:'}</span>
                          <span className="font-bold text-slate-800">{task.supervisorControl.workStartDate} ({task.supervisorControl.workDurationDays}d)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">{language === 'ta' ? 'தேவையான பணியாளர்கள்:' : 'Required Staff:'}</span>
                          <span className="font-bold text-slate-800">{task.supervisorControl.requiredStaffCount} Staff ({task.supervisorControl.shiftTiming})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-indigo-800 pt-0.5">
                        <span>{language === 'ta' ? 'தொழில்நுட்ப வல்லுநர்கள்:' : 'Specialists:'} {task.supervisorControl.requiredSpecialists.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Daily Wage & Volunteer Terms Ribbon */}
                  <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <Coins className="w-4 h-4 text-amber-700" />
                      <span>{language === 'ta' ? 'அரசு நிர்ணய தினசரி கூலி:' : 'Standard Daily Wage Rate:'}</span>
                      <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-black">
                        ₹{task.supervisorControl?.dailyWageRateINR || 650} / {language === 'ta' ? 'நாள்' : 'Day'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      {language === 'ta' ? 'இலவச சேவை / ஊதிய பணி' : 'Free Aid or Paid'}
                    </span>
                  </div>

                  {/* Triple Support Trackers: Financial + Labour + Food & Refreshments */}
                  <div className="space-y-3 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    
                    {/* 1. Financial Support Tracker & Surplus Rollover */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {language === 'ta' ? 'தேவையான மொத்த மதிப்பீடு:' : 'Estimated Needed Cost:'} ₹{collectedFin.toLocaleString('en-IN')} / ₹{targetFin.toLocaleString('en-IN')}
                        </span>
                        <span className="text-emerald-800 font-black">{financialPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                          style={{ width: `${financialPercentage}%` }}
                        />
                      </div>

                      {/* Surplus Transfer Alert Banner if Collected > Target */}
                      {surplusAmt > 0 ? (
                        <div className="bg-amber-100 border border-amber-300 text-amber-950 p-2 rounded-xl text-[10px] font-bold flex items-center justify-between gap-1 mt-1">
                          <span className="flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3 text-amber-700" />
                            {language === 'ta' ? `கூடுதல் உபரி நிதி ₹${surplusAmt.toLocaleString('en-IN')} மாவட்ட வளர்ச்சி நிதிக்கு மாற்றப்பட்டது` : `Extra Surplus ₹${surplusAmt.toLocaleString('en-IN')} rolled over to District Development Fund`}
                          </span>
                          <span className="bg-amber-600 text-white px-1.5 py-0.2 rounded font-mono">Surplus Rerouted</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>{task.financialContributorsCount || 0} {language === 'ta' ? 'பங்களிப்பாளர்கள்' : 'benefactors pledged'}</span>
                          <span>{targetFin - collectedFin > 0 ? `₹${(targetFin - collectedFin).toLocaleString('en-IN')} needed` : '100% Target Reached'}</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Physical Labour (Shramdaan) Tracker */}
                    <div className="space-y-1 pt-1 border-t border-slate-200/60">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1 text-indigo-700">
                          <HardHat className="w-3.5 h-3.5" />
                          {language === 'ta' ? 'உடல் உழைப்பு தன்னார்வலர்கள்:' : 'Physical Labour Force:'} {task.registeredLabourVolunteers || task.joinedVolunteers} / {task.targetLabourVolunteers || task.targetVolunteers}
                        </span>
                        <span className="text-indigo-800 font-black">{volunteerPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 rounded-full transition-all"
                          style={{ width: `${volunteerPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* 3. Food & Refreshment Support Tally */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'ta' ? 'உணவு & குடிநீர் ஆதரவு:' : 'Food & Drinks Pledged:'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          🍲 {task.totalMealsPledged || 0} {language === 'ta' ? 'உணவு' : 'Meals'}
                        </span>
                        <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md">
                          💧 {task.totalWaterBottlesPledged || 0} {language === 'ta' ? 'குடிநீர்' : 'Water'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Coordinator contact & Supervisor Control Quick Button */}
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span>{language === 'ta' ? 'ஒருங்கிணைப்பாளர்:' : 'Coordinator:'} {task.coordinatorName} ({task.coordinatorPhone})</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadTaskFinancialReport(task)}
                        className="text-slate-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-lg transition-all cursor-pointer border border-slate-200"
                        title="Download itemized JSON summary of financial contributions for this task"
                      >
                        <FileJson className="w-3 h-3 text-indigo-600" />
                        <span>{language === 'ta' ? 'நிதி அறிக்கை' : 'Report (JSON)'}</span>
                      </button>
                      <button
                        onClick={() => handleOpenSupervisorModal(task)}
                        className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        title="Adjust timeline, cost estimation, and staffing requirements"
                      >
                        <Settings2 className="w-3 h-3" />
                        <span>{language === 'ta' ? 'மேற்பார்வையாளர் மேலாண்மை' : 'Supervisor Controls'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: 3 Support Options */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  
                  {/* Option 1: Food & Refreshment Support */}
                  <button
                    onClick={() => {
                      setSupportModalTask(task);
                      setSupportType('food_refreshment');
                      setFoodRefreshmentPass(null);
                    }}
                    className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[11px] shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 text-center"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === 'ta' ? 'உணவு / குடிநீர்' : 'Food/Drinks'}</span>
                  </button>

                  {/* Option 2: Financial Support & Simulated UPI Donation */}
                  <button
                    onClick={() => handleOpenDonationModal(task)}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 text-center"
                  >
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-200" />
                    <span>{language === 'ta' ? '💛 நன்கொடை (UPI)' : '💛 Donate (UPI)'}</span>
                  </button>

                  {/* Option 3: Physical Labour (Shramdaan) */}
                  <button
                    onClick={() => {
                      setSupportModalTask(task);
                      setSupportType('physical_labour');
                      setLabourDutyPass(null);
                    }}
                    className={`py-2.5 rounded-xl font-bold text-[11px] shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 text-center ${
                      task.isJoined
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{language === 'ta' ? 'உடல் உழைப்பு' : 'Shramdaan'}</span>
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Support Action Modal (Tab 1: Labour, Tab 2: Financial, Tab 3: Food & Drinks) */}
      {supportModalTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 via-amber-700 to-yellow-600 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-black/20 text-yellow-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {language === 'ta' ? `${supportModalTask.timelineWindowDays || 3} நாள் மக்கள் ஆதரவு களம்` : `${supportModalTask.timelineWindowDays || 3}-Day Rapid Support Window`}
                </span>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {language === 'ta' ? supportModalTask.titleTamil : supportModalTask.titleEnglish}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSupportModalTask(null);
                  setFinancialReceipt(null);
                  setLabourDutyPass(null);
                  setFoodRefreshmentPass(null);
                }}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Support Type Selector: 3 Options */}
            <div className="p-3 bg-slate-100/90 border-b border-slate-200 grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSupportType('food_refreshment');
                  setFinancialReceipt(null);
                  setLabourDutyPass(null);
                }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  supportType === 'food_refreshment'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Utensils className="w-3.5 h-3.5 text-yellow-300" />
                <span>{language === 'ta' ? 'உணவு / குடிநீர்' : 'Food / Drinks'}</span>
              </button>

              <button
                onClick={() => {
                  setSupportType('financial');
                  setLabourDutyPass(null);
                  setFoodRefreshmentPass(null);
                }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  supportType === 'financial'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ta' ? 'நிதி உதவி' : 'Financial Aid'}</span>
              </button>

              <button
                onClick={() => {
                  setSupportType('physical_labour');
                  setFinancialReceipt(null);
                  setFoodRefreshmentPass(null);
                }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  supportType === 'physical_labour'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HardHat className="w-3.5 h-3.5 text-yellow-400" />
                <span>{language === 'ta' ? 'உடல் உழைப்பு' : 'Shramdaan'}</span>
              </button>
            </div>

            <div className="p-6">
              
              {/* === TAB 1: FOOD, DRINK & REFRESHMENT SUPPORT === */}
              {supportType === 'food_refreshment' && (
                <div>
                  {foodRefreshmentPass ? (
                    <div className="space-y-4 text-center">
                      <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Utensils className="w-8 h-8" />
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-slate-900">
                          {language === 'ta' ? 'உணவு & குடிநீர் ஆதரவு பதிவு செய்யப்பட்டது!' : 'Food & Refreshment Support Confirmed!'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {language === 'ta' ? 'களப்பணியாளர்களின் பசியாற்றும் உங்கள் உதவிக்கு மனமார்ந்த நன்றி. சேவை அட்டை கீழே உள்ளது.' : 'Thank you for nourishing our on-ground volunteers. Field Service Pass generated.'}
                        </p>
                      </div>

                      {/* Official Food Service Pass */}
                      <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 text-white rounded-2xl p-4 text-left space-y-3 shadow-lg border border-amber-500/40">
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                            <Coffee className="w-3.5 h-3.5" /> TVK SEVAI ANNADANAM PASS
                          </span>
                          <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded font-bold text-amber-200">
                            {foodRefreshmentPass.passId}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Patron Name:</span>
                            <span className="font-bold text-white text-sm">{foodRefreshmentPass.donorName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Item & Quantity:</span>
                            <span className="font-bold text-amber-300">{foodRefreshmentPass.foodDetails}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Handover Time Slot:</span>
                            <span className="font-semibold text-white">{foodRefreshmentPass.slot}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Camp Coordinator:</span>
                            <span className="font-semibold text-white">{foodRefreshmentPass.coordinatorPhone}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                          <span>Deliver to field camp directly</span>
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            <QrCode className="w-3.5 h-3.5" /> Food Camp QR Active
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSupportModalTask(null);
                          setFoodRefreshmentPass(null);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer"
                      >
                        {language === 'ta' ? 'முடிந்தது' : 'Done'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFoodSupport} className="space-y-4">
                      
                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'உணவு / குடிநீர் வகை *' : 'Select Food / Drink Category *'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'cooked_meals', label: '🍛 Cooked Meals (மதிய உணவு)' },
                            { id: 'drinking_water', label: '💧 Drinking Water (குடிநீர்)' },
                            { id: 'breakfast_tea', label: '☕ Breakfast & Tea (டிபன் & டீ)' },
                            { id: 'tender_coconut_buttermilk', label: '🥥 Tender Coconut/Buttermilk' },
                            { id: 'snacks_biscuits', label: '🥪 Snacks & Biscuits (சிற்றுண்டி)' }
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setFoodCategory(item.id as any);
                                if (item.id === 'cooked_meals') setFoodUnit('Meal Packs (சாப்பாடு பொட்டலங்கள்)');
                                else if (item.id === 'drinking_water') setFoodUnit('Water Bottles / Pouches');
                                else if (item.id === 'breakfast_tea') setFoodUnit('Breakfast Packs + Tea Flasks');
                                else if (item.id === 'tender_coconut_buttermilk') setFoodUnit('Fresh Coconuts / Packets');
                                else setFoodUnit('Snack Boxes');
                              }}
                              className={`p-2 rounded-xl text-[11px] font-bold text-left transition-all cursor-pointer ${
                                foodCategory === item.id
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Item description & Quantity */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'உணவு பொருள் விவரம்' : 'Specific Item Details'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sambar Rice & Curd Rice Packets"
                            value={foodItemName}
                            onChange={(e) => setFoodItemName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'எண்ணிக்கை (Quantity) *' : 'Quantity *'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              required
                              min="5"
                              value={foodQuantity}
                              onChange={(e) => setFoodQuantity(parseInt(e.target.value) || 0)}
                              className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-900 focus:bg-white"
                            />
                            <span className="text-xs text-slate-600 font-medium truncate">{foodUnit}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Slot & Mode */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'வழங்கும் நேரம் (Delivery Slot) *' : 'Delivery / Handover Time *'}
                          </label>
                          <select
                            value={foodDeliverySlot}
                            onChange={(e) => setFoodDeliverySlot(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                          >
                            <option value="Morning Shift (07:30 AM)">Morning Breakfast Shift (07:30 AM)</option>
                            <option value="Mid-Morning Refreshment (10:30 AM)">Mid-Morning Drinks & Buttermilk (10:30 AM)</option>
                            <option value="Lunch Shift (12:30 PM)">Lunch Meals Shift (12:30 PM)</option>
                            <option value="Evening Tea & Snacks (04:30 PM)">Evening Tea & Snacks (04:30 PM)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'வழங்கும் முறை' : 'Delivery Mode'}
                          </label>
                          <select
                            value={foodDeliveryMethod}
                            onChange={(e) => setFoodDeliveryMethod(e.target.value as any)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                          >
                            <option value="self_delivery_to_camp">Self-Delivery to On-Ground Camp (நேரில் வழங்குதல்)</option>
                            <option value="volunteer_pickup_needed">Volunteer Pickup Required (தன்னார்வலர் வந்து பெறுதல்)</option>
                          </select>
                        </div>
                      </div>

                      {/* Donor Name & Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'உங்கள் பெயர் / அமைப்பின் பெயர் *' : 'Your Name / Trust Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. S. Meenakshi & Friends"
                            value={foodDonorName}
                            onChange={(e) => setFoodDonorName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'தொடர்பு மொபைல் எண் *' : 'Contact Mobile *'}
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="9840XXXXXX"
                            value={foodDonorPhone}
                            onChange={(e) => setFoodDonorPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-yellow-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Utensils className="w-4 h-4 text-yellow-200" />
                        <span>{language === 'ta' ? 'உணவு & குடிநீர் ஆதரவை உறுதி செய்க (Generate Food Pass)' : 'Confirm Food / Drink Pledge & Issue Pass'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* === TAB 2: FINANCIAL SUPPORT & ENHANCED UPI ESCROW === */}
              {supportType === 'financial' && (
                <div>
                  {financialReceipt ? (
                    <div className="space-y-4 text-center">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-slate-900">
                          {language === 'ta' ? 'மக்கள் நிதி பங்களிப்பு வெற்றிகரமானது!' : 'Civic Financial Contribution Successful!'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {language === 'ta' ? 'உங்கள் பங்களிப்புக்கு நெஞ்சார்ந்த நன்றி. அரசு மேற்பார்வையாளர் நேரலை தணிக்கை எண் மற்றும் ரசீது கீழே உள்ளது.' : 'Thank you for funding this grassroots mission. Official UPI Escrow receipt generated.'}
                        </p>
                      </div>

                      {/* Official E-Receipt Box */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs shadow-xs">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Receipt No</span>
                            <span className="font-mono font-bold text-slate-900 text-xs">{financialReceipt.receiptNo}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">UPI Ref / URN</span>
                            <span className="font-mono font-bold text-emerald-700 text-xs">{financialReceipt.upiRefId}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">Benefactor:</span>
                          <span className="font-semibold text-slate-900">{financialReceipt.donorName} ({financialReceipt.donorPhone})</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">Amount Contributed:</span>
                          <span className="font-black text-emerald-700 text-sm">₹{financialReceipt.amount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">Payment Gateway / App:</span>
                          <span className="font-medium text-slate-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px] font-mono">{financialReceipt.paymentMethod}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">Allocated Mission:</span>
                          <span className="font-medium text-slate-800 truncate max-w-[220px]">{financialReceipt.taskTitle}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">Fund Purpose:</span>
                          <span className="font-medium text-slate-700 text-[11px] truncate max-w-[220px]">{financialReceipt.purpose}</span>
                        </div>

                        {financialReceipt.surplusStatus && (
                          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center gap-1.5">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>{financialReceipt.surplusStatus}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                          <span>Timestamp: {financialReceipt.timestamp}</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> 100% Supervisor Verified
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText?.(`Receipt: ${financialReceipt.receiptNo}, Amount: ₹${financialReceipt.amount}, Ref: ${financialReceipt.upiRefId}`);
                            alert(language === 'ta' ? 'ரசீது விவரங்கள் நகலெடுக்கப்பட்டது!' : 'Receipt details copied to clipboard!');
                          }}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'ta' ? 'ரசீது பதிவிறக்கம்' : 'Download Receipt'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSupportModalTask(null);
                            setFinancialReceipt(null);
                          }}
                          className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer"
                        >
                          {language === 'ta' ? 'முடிந்தது' : 'Done'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFinancialSupport} className="space-y-4">
                      
                      {/* Amount presets */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'பங்களிப்பு தொகையை தேர்ந்தெடுக்கவும் (INR) *' : 'Select Contribution Amount (INR) *'}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[500, 1000, 2500, 5000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setFinancialAmount(amt);
                                setCustomAmount('');
                              }}
                              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                financialAmount === amt && !customAmount
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              ₹{amt.toLocaleString('en-IN')}
                            </button>
                          ))}
                        </div>

                        {/* Custom amount */}
                        <div className="relative mt-2">
                          <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            min="10"
                            placeholder={language === 'ta' ? 'வேறு தொகை (Custom Amount)' : 'Or Enter Custom Amount'}
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              if (e.target.value) setFinancialAmount(parseFloat(e.target.value) || 0);
                            }}
                            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Transparent Fund Split Visualizer */}
                      {(() => {
                        const currentAmt = customAmount ? parseFloat(customAmount) || 0 : financialAmount;
                        const mat = Math.round(currentAmt * 0.4);
                        const mac = Math.round(currentAmt * 0.3);
                        const lab = Math.round(currentAmt * 0.2);
                        const con = currentAmt - mat - mac - lab;
                        return (
                          <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100 space-y-2">
                            <div className="flex justify-between items-center text-[11px] font-bold text-emerald-900">
                              <span>{language === 'ta' ? 'வெளிப்படையான நிதி பங்கீடு (100% Escrow):' : 'Transparent Fund Split (100% Escrow):'}</span>
                              <span className="font-mono">₹{currentAmt.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center">
                              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/60">
                                <span className="text-slate-500 block">கட்டுமானம் (40%)</span>
                                <span className="font-black text-slate-800">₹{mat.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/60">
                                <span className="text-slate-500 block">இயந்திரம் (30%)</span>
                                <span className="font-black text-slate-800">₹{mac.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/60">
                                <span className="text-slate-500 block">கூலி (20%)</span>
                                <span className="font-black text-slate-800">₹{lab.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/60">
                                <span className="text-slate-500 block">பாதுகாப்பு (10%)</span>
                                <span className="font-black text-slate-800">₹{con.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Enhanced UPI Modes */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'UPI செலுத்து முறை (Select UPI Gateway) *' : 'UPI Payment Method (Instant Escrow) *'}
                        </label>

                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                          <button
                            type="button"
                            onClick={() => setUpiMode('apps')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              upiMode === 'apps' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            ⚡ UPI Apps
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiMode('qr')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              upiMode === 'qr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            📲 Scan QR
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiMode('vpa')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              upiMode === 'vpa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            🆔 UPI ID / VPA
                          </button>
                        </div>

                        {/* Mode 1: Apps */}
                        {upiMode === 'apps' && (
                          <div className="grid grid-cols-4 gap-2 pt-1">
                            {[
                              { id: 'gpay', name: 'Google Pay', icon: '🟢', color: 'border-blue-300 bg-blue-50/50' },
                              { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'border-purple-300 bg-purple-50/50' },
                              { id: 'paytm', name: 'Paytm UPI', icon: '🔵', color: 'border-cyan-300 bg-cyan-50/50' },
                              { id: 'bhim', name: 'BHIM / SBI', icon: '🇮🇳', color: 'border-amber-300 bg-amber-50/50' },
                            ].map((app) => (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => setSelectedUpiApp(app.id)}
                                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                                  selectedUpiApp === app.id
                                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 text-slate-900'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="text-lg block mb-0.5">{app.icon}</span>
                                <span className="text-[11px] font-bold block truncate">{app.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Mode 2: Dynamic QR Code */}
                        {upiMode === 'qr' && (
                          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center space-y-3">
                            <div className="bg-white p-3 rounded-xl inline-block shadow-md">
                              {/* Vector QR Representation */}
                              <svg className="w-36 h-36 mx-auto" viewBox="0 0 120 120" fill="none">
                                <rect width="120" height="120" fill="white"/>
                                <rect x="10" y="10" width="30" height="30" fill="#0f172a" rx="4"/>
                                <rect x="16" y="16" width="18" height="18" fill="white" rx="2"/>
                                <rect x="20" y="20" width="10" height="10" fill="#059669" rx="1"/>
                                
                                <rect x="80" y="10" width="30" height="30" fill="#0f172a" rx="4"/>
                                <rect x="86" y="16" width="18" height="18" fill="white" rx="2"/>
                                <rect x="90" y="20" width="10" height="10" fill="#059669" rx="1"/>

                                <rect x="10" y="80" width="30" height="30" fill="#0f172a" rx="4"/>
                                <rect x="16" y="86" width="18" height="18" fill="white" rx="2"/>
                                <rect x="20" y="90" width="10" height="10" fill="#059669" rx="1"/>

                                <rect x="48" y="15" width="8" height="8" fill="#0f172a"/>
                                <rect x="62" y="22" width="8" height="8" fill="#0f172a"/>
                                <rect x="48" y="32" width="16" height="8" fill="#059669"/>
                                <rect x="15" y="48" width="8" height="16" fill="#0f172a"/>
                                <rect x="30" y="55" width="10" height="10" fill="#0f172a"/>
                                <rect x="48" y="48" width="24" height="24" fill="#0f172a" rx="2"/>
                                <circle cx="60" cy="60" r="4" fill="#10b981"/>
                                <rect x="80" y="48" width="10" height="8" fill="#0f172a"/>
                                <rect x="96" y="55" width="12" height="12" fill="#059669"/>
                                <rect x="48" y="80" width="14" height="8" fill="#0f172a"/>
                                <rect x="68" y="88" width="10" height="16" fill="#0f172a"/>
                                <rect x="85" y="82" width="22" height="10" fill="#059669"/>
                                <rect x="92" y="98" width="16" height="12" fill="#0f172a"/>
                              </svg>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-emerald-400 block">Scan with any UPI App</span>
                              <span className="text-[11px] text-slate-400 font-mono">makkalseva.tn@sbi • ₹{(customAmount ? parseFloat(customAmount) || 0 : financialAmount).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        )}

                        {/* Mode 3: Direct VPA */}
                        {upiMode === 'vpa' && (
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold block">Official Civic VPA ID</span>
                                <span className="font-mono text-xs font-black text-emerald-800">makkalseva.tn@sbi</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText?.('makkalseva.tn@sbi');
                                  setIsCopiedVpa(true);
                                  setTimeout(() => setIsCopiedVpa(false), 2000);
                                }}
                                className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold cursor-pointer transition-all"
                              >
                                {isCopiedVpa ? '✓ Copied' : 'Copy VPA'}
                              </button>
                            </div>

                            <input
                              type="text"
                              placeholder="Or enter your UPI ID (e.g. citizen@okhdfcbank)"
                              value={enteredVpa}
                              onChange={(e) => setEnteredVpa(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white"
                            />
                          </div>
                        )}
                      </div>

                      {/* Purpose */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'நிதி பயன்பாட்டு விருப்பம்' : 'Funding Allocation Area'}
                        </label>
                        <select
                          value={paymentPurpose}
                          onChange={(e) => setPaymentPurpose(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                        >
                          <option value="Raw Materials & Equipment (Pipes, Cement, Plants)">Raw Materials & Equipment (Pipes, Cement, Saplings)</option>
                          <option value="JCB / Excavator & Tool Hire">JCB / Excavator & Heavy Equipment Hire</option>
                          <option value="Field Volunteer Safety Gear & Refreshments">Field Volunteer Safety Gear & Refreshments</option>
                          <option value="General Fast-Track Mission Pool">General Fast-Track Mission Pool</option>
                        </select>
                      </div>

                      {/* Benefactor Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'உங்கள் பெயர் (விருப்பப்பட்டால்)' : 'Your Name (Optional)'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. S. Ramanathan"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'தொலைபேசி எண் (ரசீது SMS பெற)' : 'Mobile (For SMS Receipt)'}
                          </label>
                          <input
                            type="tel"
                            placeholder="9840XXXXXX"
                            value={donorPhone}
                            onChange={(e) => setDonorPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Payment Notice */}
                      <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>
                          {language === 'ta'
                            ? 'தேவையான தொகையை விட அதிகப்படியான நிதி திரண்டால், கூடுதல் நிதி மாவட்ட பொது வளர்ச்சி நிதிக்கு தானாக மாற்றப்பட்டு பிற அவசர பணிகளுக்கு பயன்படுத்தப்படும்.'
                            : 'If public contributions exceed estimated project cost, surplus funds automatically roll over to the District Civic Pool.'}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-200" />
                        <span>{language === 'ta' ? `₹${(customAmount ? parseFloat(customAmount) || 0 : financialAmount).toLocaleString('en-IN')} நிதி வழங்குக (Instant UPI Pay)` : `Contribute ₹${(customAmount ? parseFloat(customAmount) || 0 : financialAmount).toLocaleString('en-IN')} (Instant UPI Escrow)`}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* === TAB 3: PHYSICAL LABOUR SUPPORT === */}
              {supportType === 'physical_labour' && (
                <div>
                  {labourDutyPass ? (
                    <div className="space-y-4 text-center">
                      <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Award className="w-8 h-8" />
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-slate-900">
                          {language === 'ta' ? 'உடல் உழைப்பு களப்பணி உறுதி செய்யப்பட்டது!' : 'Physical Labour Commitment Confirmed!'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {language === 'ta' ? 'உங்களின் சேவை கள அடையாள அட்டை தயாராக உள்ளது.' : 'Your official Shramdaan Volunteer Duty Pass is ready.'}
                        </p>
                      </div>

                      {/* Official Duty Pass Card */}
                      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 text-left space-y-3 shadow-lg border border-indigo-500/30">
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                            TVK SEVAI PADAI • VOLUNTEER PASS
                          </span>
                          <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded font-bold">
                            {labourDutyPass.passId}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Volunteer Name:</span>
                            <span className="font-bold text-white text-sm">{labourDutyPass.volunteerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Committed Shramdaan:</span>
                            <span className="font-bold text-amber-400">{labourDutyPass.hours} Hours on Field</span>
                          </div>
                        </div>

                        {/* Compensation Badge on Duty Pass */}
                        <div className="bg-white/10 rounded-xl p-2 flex items-center justify-between text-xs">
                          <span className="text-slate-300">
                            {labourDutyPass.compensationType === 'paid' ? '💰 கூலி ஊதிய பணி (Paid Worker)' : '🤝 இலவச மக்கள் சேவை (Free Shramdaan)'}
                          </span>
                          <span className="font-mono text-amber-300 font-bold">
                            {labourDutyPass.dailyWageClaim || 'Honorary Volunteer (₹0)'}
                          </span>
                        </div>

                        <div className="text-xs">
                          <span className="text-slate-400 text-[10px] block">Location & Mission:</span>
                          <span className="font-medium text-slate-200">{labourDutyPass.location}</span>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Report to Coordinator at 06:30 AM</span>
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <QrCode className="w-3.5 h-3.5" /> Duty QR Active
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSupportModalTask(null);
                          setLabourDutyPass(null);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer"
                      >
                        {language === 'ta' ? 'முடிந்தது' : 'Done'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitPhysicalLabour} className="space-y-4">
                      
                      {/* FREE VOLUNTEER vs PAID DAILY WAGE SELECTION */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {language === 'ta' ? 'சேவை முறை: இலவசம் அல்லது தினசரி ஊதியம்? *' : 'Support Mode: Free Voluntary or Paid Daily Wage? *'}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setLabourCompensationType('free')}
                            className={`p-2.5 rounded-xl border-2 font-bold text-xs text-left cursor-pointer transition-all ${
                              labourCompensationType === 'free'
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center">
                                {labourCompensationType === 'free' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                              </span>
                              <span>{language === 'ta' ? '🤝 இலவச மக்கள் சேவை' : '🤝 Free Voluntary'}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5 ml-5">
                              {language === 'ta' ? 'ஊதியமின்றி தன்னார்வ தொண்டு (₹0)' : 'Honorary Civic Aid (₹0)'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setLabourCompensationType('paid')}
                            className={`p-2.5 rounded-xl border-2 font-bold text-xs text-left cursor-pointer transition-all ${
                              labourCompensationType === 'paid'
                                ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-3.5 h-3.5 rounded-full border border-amber-600 flex items-center justify-center">
                                {labourCompensationType === 'paid' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                              </span>
                              <span>{language === 'ta' ? '💰 கூலி ஊதிய களப்பணி' : '💰 Paid Daily Wage'}</span>
                            </div>
                            <span className="text-[10px] text-amber-800 font-bold block mt-0.5 ml-5">
                              ₹{supportModalTask?.supervisorControl?.dailyWageRateINR || 650} / {language === 'ta' ? 'நாள் அரசு கூலி' : 'Day Govt Rate'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'தன்னார்வலர் பெயர் *' : 'Volunteer Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. M. Vijay"
                            value={labourVolunteerName}
                            onChange={(e) => setLabourVolunteerName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {language === 'ta' ? 'வாட்ஸ்அப் எண் *' : 'WhatsApp Mobile *'}
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="9840XXXXXX"
                            value={labourVolunteerPhone}
                            onChange={(e) => setLabourVolunteerPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Hours Committed */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'வழங்க விரும்பும் உடல் உழைப்பு நேரம் (Shramdaan Hours) *' : 'Committed Physical Labour Hours *'}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { hrs: 2, label: '2 Hours' },
                            { hrs: 4, label: '4 Hours (Half Day)' },
                            { hrs: 8, label: '8 Hours (Full Day)' },
                            { hrs: 16, label: 'Full 3 Days' }
                          ].map((item) => (
                            <button
                              key={item.hrs}
                              type="button"
                              onClick={() => setCommittedHours(item.hrs)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                committedHours === item.hrs
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Field Skill */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'களப்பணி பிரிவு / திறன்' : 'Physical Aid Specialization'}
                        </label>
                        <select
                          value={labourSkill}
                          onChange={(e) => setLabourSkill(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                        >
                          <option value="Desilting & Debris Clearing">Desilting & Debris Clearing (கால்வாய் தூர்வாருதல்)</option>
                          <option value="Tree Plantation & Soil Digging">Tree Plantation & Soil Digging (மரம் நடுதல் & குழி தோண்டுதல்)</option>
                          <option value="Masonry, Welding & Civil Fix">Masonry, Welding & Civil Work (கொத்தனார் / பழுது நீக்குதல்)</option>
                          <option value="Electrical & Street Light Repair">Electrical & Street Light Setup (மின்சார பராமரிப்பு)</option>
                          <option value="Logistics, Crowd & Food Supply">Logistics, Crowd & Refreshment Supply (உணவு & மேலாண்மை)</option>
                        </select>
                      </div>

                      {/* Tools bringing */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'ta' ? 'கொண்டு வரக்கூடிய உபகரணங்கள் (விருப்பப்பட்டால்)' : 'Tools / Gear You Can Bring (Optional)'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Spade (மண்வெட்டி), Gloves, Sickle, Two-wheeler"
                          value={toolsBringing}
                          onChange={(e) => setToolsBringing(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <HardHat className="w-4 h-4 text-yellow-200" />
                        <span>{language === 'ta' ? 'உடல் உழைப்பு களப்பணியை உறுதி செய்க (Generate Duty Pass)' : 'Confirm Physical Labour Commitment & Pass'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* SUPERVISOR CONTROL & COST ESTIMATION MODAL */}
      {supervisorTaskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
                  <Settings2 className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ta' ? 'மேற்பார்வையாளர் திட்ட மேலாண்மை & செலவு மதிப்பீடு' : 'Supervisor Operational & Budget Estimation Desk'}
                  </h3>
                  <p className="text-xs text-indigo-200">
                    {language === 'ta' ? supervisorTaskModal.titleTamil : supervisorTaskModal.titleEnglish}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSupervisorTaskModal(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSupervisorControl} className="p-6 space-y-4 text-xs">
              
              {/* Supervisor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    {language === 'ta' ? 'மேற்பார்வையாளர் பெயர் *' : 'Supervisor Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editSupervisorName}
                    onChange={(e) => setEditSupervisorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    {language === 'ta' ? 'பதவி & துறை *' : 'Designation & Department *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editSupervisorDesignation}
                    onChange={(e) => setEditSupervisorDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              {/* 1. Timeline Window & Duration Control */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'ta' ? 'கால வரம்பு & வேலை தொடங்கும் அட்டவணை (Timeline & Start Schedule)' : 'Timeline Window & Execution Schedule'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'மக்கள் ஆதரவு அவகாசம் (Days)' : 'Mobilization Window (Days)'}
                    </label>
                    <select
                      value={editTimelineDays}
                      onChange={(e) => setEditTimelineDays(parseInt(e.target.value) || 3)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-900"
                    >
                      <option value="1">1 Day (24 Hours Emergency)</option>
                      <option value="2">2 Days (48 Hours)</option>
                      <option value="3">3 Days (72 Hours Standard)</option>
                      <option value="5">5 Days (120 Hours Extended)</option>
                      <option value="7">7 Days (1 Week Comprehensive)</option>
                      <option value="10">10 Days Window</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'வேலை தொடங்கும் நாள் (Start Date)' : 'Work Start Date'}
                    </label>
                    <input
                      type="date"
                      required
                      value={editWorkStartDate}
                      onChange={(e) => setEditWorkStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'பணி நீடிக்கும் நாட்கள் (Duration)' : 'Work Duration (Days)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      required
                      value={editWorkDurationDays}
                      onChange={(e) => setEditWorkDurationDays(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">
                    {language === 'ta' ? 'ஷிப்ட் நேரம் (Shift Timing)' : 'Shift Timing'}
                  </label>
                  <select
                    value={editShiftTiming}
                    onChange={(e) => setEditShiftTiming(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Morning Shift (06:30 AM - 01:30 PM)">Morning Cool Shift (06:30 AM - 01:30 PM)</option>
                    <option value="Full Day Double Shift (07:00 AM - 05:30 PM)">Full Day Double Shift (07:00 AM - 05:30 PM)</option>
                    <option value="Evening Cool Batch (04:00 PM - 08:30 PM)">Evening Cool Batch (04:00 PM - 08:30 PM)</option>
                    <option value="Night Urgent Shift (10:00 PM - 05:00 AM)">Night Low-Traffic Shift (10:00 PM - 05:00 AM)</option>
                  </select>
                </div>
              </div>

              {/* 2. Staff & Specialists Requirements */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <HardHat className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ta' ? 'பணியாளர்கள் & தொழில்நுட்ப வல்லுநர்கள் தேவை' : 'Staff & Technical Specialists Needed'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'அதிகாரப்பூர்வ பணியாளர்கள் எண்ணிக்கை' : 'Required Staff Count'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editRequiredStaffCount}
                      onChange={(e) => setEditRequiredStaffCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'தேவைப்படும் தொழில்நுட்ப வல்லுநர்கள்' : 'Specialist Roles Required'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Civil Supervisor, 2 JCB Operators, 2 Drainage Technicians"
                      value={editSpecialists}
                      onChange={(e) => setEditSpecialists(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Cost Estimation Breakdown & Surplus Redirection Policy */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <Coins className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'ta' ? 'பணிக்கான மொத்த மதிப்பீடு & உபரி நிதி மேலாண்மை' : 'Itemized Cost Estimation & Surplus Rollover Policy'}</span>
                  </h4>
                  <span className="text-xs font-black text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-300">
                    Total: ₹{(editCostMaterials + editCostMachinery + editCostLabourSafety + editCostContingency).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'மூலப்பொருட்கள்' : 'Materials (₹)'}
                    </label>
                    <input
                      type="number"
                      value={editCostMaterials}
                      onChange={(e) => setEditCostMaterials(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'இயந்திர வாடகை (JCB)' : 'Machinery (₹)'}
                    </label>
                    <input
                      type="number"
                      value={editCostMachinery}
                      onChange={(e) => setEditCostMachinery(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'பாதுகாப்பு & கூலி' : 'Labour & Safety (₹)'}
                    </label>
                    <input
                      type="number"
                      value={editCostLabourSafety}
                      onChange={(e) => setEditCostLabourSafety(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">
                      {language === 'ta' ? 'இதர செலவுகள்' : 'Contingency (₹)'}
                    </label>
                    <input
                      type="number"
                      value={editCostContingency}
                      onChange={(e) => setEditCostContingency(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Surplus Policy Auto-Trigger Notice */}
                <div className="bg-white p-3 rounded-xl border border-emerald-300 text-[11px] text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
                      {language === 'ta' ? 'கூடுதல் நிதி பரிமாற்ற உத்தரவு:' : 'Surplus Funds Transfer Protocol:'}
                    </span>
                    <span className="text-emerald-700 font-mono">100% Escrow Auto-Rollover</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-600">
                    {language === 'ta'
                      ? 'பொதுமக்கள் வழங்கும் மொத்த நிதி இந்த ₹' + (editCostMaterials + editCostMachinery + editCostLabourSafety + editCostContingency).toLocaleString('en-IN') + ' மதிப்பீட்டை விட அதிகமாக இருந்தால், அந்த கூடுதல் உபரி நிதி தானாக "மாவட்ட மக்கள் வளர்ச்சி நிதிக்கு" மாற்றப்பட்டு பிற தேவைகளுக்கு பயன்படுத்தப்படும்.'
                      : `Any public contributions exceeding ₹${(editCostMaterials + editCostMachinery + editCostLabourSafety + editCostContingency).toLocaleString('en-IN')} will automatically roll over to the District Development Pool to finance other underfunded civic works.`}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDownloadTaskFinancialReport(supervisorTaskModal)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Download simulated financial contributions and budget summary for this task as JSON"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'ta' ? 'நிதி அறிக்கை பதிவிறக்கம் (JSON)' : 'Download Financial Report (JSON)'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSupervisorTaskModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    {language === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>{language === 'ta' ? 'மேற்பார்வை திட்டத்தை சேமிக்க' : 'Save Supervisor Plan & Budget'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activate New Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ta' ? 'புதிய மக்கள் பணியை தொடங்கு' : 'Activate Civic Mobilization Task'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'ta' ? 'பணியின் பெயர் (தமிழ் / English) *' : 'Task Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Ward 28 Main Road Pothole Patching & Drain Clean"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'மாவட்டம்' : 'District'}
                  </label>
                  <select
                    value={newTaskDistrict}
                    onChange={(e) => setNewTaskDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white"
                  >
                    {TN_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'வார்டு / இடம் *' : 'Ward / Location *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskWard}
                    onChange={(e) => setNewTaskWard(e.target.value)}
                    placeholder="e.g. Ward 28, Arapalayam"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'கால வரம்பு (Days)' : 'Timeline Days'}
                  </label>
                  <select
                    value={newTaskTimelineDays}
                    onChange={(e) => setNewTaskTimelineDays(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-900"
                  >
                    <option value="1">1 Day (24h)</option>
                    <option value="2">2 Days (48h)</option>
                    <option value="3">3 Days (72h)</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'தேவைப்படும் நிதி (₹)' : 'Financial Goal'}
                  </label>
                  <input
                    type="number"
                    value={newTaskFinancialTarget}
                    onChange={(e) => setNewTaskFinancialTarget(e.target.value)}
                    placeholder="35000"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'தன்னார்வலர்கள்' : 'Volunteers'}
                  </label>
                  <input
                    type="number"
                    value={newTaskLabourTarget}
                    onChange={(e) => setNewTaskLabourTarget(e.target.value)}
                    placeholder="30"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-800 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'ta' ? 'பணி விளக்கம்' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Details of the civic problem and plan of action..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {language === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer active:scale-95"
                >
                  {language === 'ta' ? 'பணியை உருவாக்குக' : 'Activate Mission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cadre Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ta' ? 'பணிப்படை உறுப்பினர் சேர்க்கை' : 'TVK Civic Volunteer Enrolment'}
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isRegistered ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'ta' ? 'பதிவு வெற்றிகரமானது!' : 'Registration Successful!'}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === 'ta' ? 'உங்கள் தொகுதி ஒருங்கிணைப்பாளர் உங்களை தொடர்பு கொள்வார்.' : 'Your ward coordinator will connect with you for upcoming field actions.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterVolunteer} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'முழுப் பெயர் *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    placeholder="e.g. S. Karthik"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === 'ta' ? 'தொலைபேசி எண் *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                    placeholder="9840XXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === 'ta' ? 'மாவட்டம்' : 'District'}
                    </label>
                    <select
                      value={volunteerDistrict}
                      onChange={(e) => setVolunteerDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                    >
                      {TN_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === 'ta' ? 'வார்டு / ஊர்' : 'Ward / Village'}
                    </label>
                    <input
                      type="text"
                      value={volunteerWard}
                      onChange={(e) => setVolunteerWard(e.target.value)}
                      placeholder="e.g. Ward 45"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    {language === 'ta' ? 'ரத்து' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer active:scale-95"
                  >
                    {language === 'ta' ? 'பதிவு செய்க' : 'Register Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dedicated Simulated UPI Donation Gateway Modal */}
      <DonationGatewayModal
        isOpen={isDonationModalOpen}
        onClose={() => {
          setIsDonationModalOpen(false);
          setDonationModalTask(null);
          setViewReceiptData(null);
        }}
        tasks={tasks}
        selectedTask={donationModalTask}
        onDonateSuccess={handleDonationSuccess}
        viewReceiptData={viewReceiptData}
        onViewLedger={() => setFilterCategory('transactions')}
      />

    </div>
  );
};
