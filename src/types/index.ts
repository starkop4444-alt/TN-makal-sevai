export type Language = 'ta' | 'en';

export type UserRole = 'citizen' | 'contractor' | 'supervisor' | 'cm_cell';

export type NavigationTab = 
  | 'feed' 
  | 'track' 
  | 'contractor'
  | 'supervisor' 
  | 'cm_cell' 
  | 'volunteers';

export type RequirementType = 'basic_requirement_missing' | 'civic_hazard_complaint';

export type SupervisorDecision = 'approved' | 'rejected' | 'pending' | 'valid_proceed_cm_cell';

export interface CMTaskGenerationPayload {
  taskTitle: string;
  taskTitleTamil?: string;
  taskDescription?: string;
  assignedDepartment?: string;
  assignedDepartmentTamil?: string;
  nodalOfficerName?: string;
  nodalOfficerDesignation?: string;
  nodalOfficerPhone?: string;
  sanctionedBudget?: string;
  allocatedBudgetINR?: number;
  assignedContractor?: string;
  contractorPhone?: string;
  departmentName?: string;
  departmentNameTamil?: string;
  targetDeadline?: string;
  targetCompletionDate?: string;
  priorityLevel?: string;
  priority?: 'Critical Emergency' | 'High Priority' | 'Standard Directive';
  cmOfficerName?: string;
  reviewNotesTamil: string;
  reviewNotesEnglish: string;
}

export interface BackendTask {
  taskId: string;
  grievanceId: string;
  taskTitle: string;
  taskDescription?: string;
  assignedDepartment?: string;
  assignedDepartmentTamil?: string;
  nodalOfficer?: {
    name?: string;
    designation?: string;
    contactPhone?: string;
  };
  allocatedBudgetINR?: number;
  targetCompletionDate?: string;
  priorityLevel?: string;
  taskStatus?: string;
  workOrderPdfUrl?: string;
  createdAt?: string;
  updates?: Array<{
    status: string;
    note: string;
    timestamp: string;
    updatedBy?: string;
  }>;
}

export interface CitizenProfile {
  aadhaarNumber: string; // 12-digit masked or unmasked
  mobileNumber: string;
  fullName: string;
  district: string;
  taluk: string;
  village: string;
  isVerified: boolean;
  role?: UserRole;
  contractorLicenseId?: string;
  contractorFirmName?: string;
  contractorSpecialization?: string;
}

export type GrievanceCategory =
  | 'Water Supply & Drainage'
  | 'Roads & Traffic Infrastructure'
  | 'Electricity & Street Lighting'
  | 'Sanitation & Solid Waste'
  | 'Public Health & Hospitals'
  | 'Agriculture & Irrigation'
  | 'Education & Government Schools'
  | 'Women & Child Safety'
  | 'Revenue & Land Records'
  | 'Civil Supplies & Ration PDS'
  | 'Public Transport & Bus Services'
  | 'Environment & Pollution'
  | 'Other Civic Issue';

export type GrievanceStatus = 
  | 'Submitted' 
  | 'AI Verified'
  | 'Supervisor Review'
  | 'CM Cell Review'
  | 'CM Task Sanctioned'
  | 'Officer Assigned' 
  | 'Field Inspection' 
  | 'In Progress' 
  | 'Resolved' 
  | 'Resolved & Citizen Confirmed'
  | 'Escalated'
  | 'Rejected by Supervisor'
  | 'Rejected by CM Cell';

export type UrgencyLevel = 'Standard' | 'Medium' | 'High' | 'Critical';

export interface TimelineEvent {
  status: GrievanceStatus;
  titleTamil: string;
  titleEnglish: string;
  descriptionTamil: string;
  descriptionEnglish: string;
  timestamp: string;
  officerName?: string;
  officerDesignation?: string;
  department?: string;
  completed: boolean;
}

export interface AIVerificationResult {
  isVerified: boolean;
  genuineityScore: number; // 1-100
  status: 'AI_Approved' | 'AI_Flagged';
  photoVerified: boolean;
  duplicateDetected: boolean;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  detectedCategory?: string;
  department?: string;
  departmentTamil?: string;
  urgencyScore?: number;
  urgencyLevel?: UrgencyLevel;
  estimatedResolutionDays?: number;
  summaryTamil: string;
  summaryEnglish: string;
  actionPlanTamil: string[];
  actionPlanEnglish: string[];
  applicableRules: string;
  verifiedAt: string;
}

export interface DailyProgressReport {
  dayNumber: number;
  date: string;
  progressPercentage: number;
  workSummaryTamil: string;
  workSummaryEnglish: string;
  fundsSpentTodayINR: number;
  sitePhoto?: string;
  updatedBy: string;
  timestamp: string;
}

export interface FundUtilisationSummary {
  totalBudgetINR: number;
  totalSpentINR: number;
  materialsSpentINR: number;
  machinerySpentINR: number;
  labourWagesPaidINR: number;
  contingencySpentINR: number;
  balanceRemainingINR: number;
  lastUpdated: string;
}

export interface CitizenResolutionConfirmation {
  isConfirmed?: boolean;
  isConfirmedByCitizen?: boolean;
  citizenFeedbackTamil?: string;
  citizenFeedbackEnglish?: string;
  feedbackTamil?: string;
  feedbackEnglish?: string;
  satisfactionRating?: number; // 1-5
  rating?: number;
  confirmedAt: string;
  confirmedByCitizenName?: string;
  citizenMobile?: string;
  verificationOtpOrSign?: string;
  confirmationOtpVerified?: boolean;
  digitalSignatureToken?: string;
  needsFurtherWork?: boolean;
}

export interface DepartmentAssignmentDetails {
  assignedDepartmentName: string;
  assignedDepartmentTamil: string;
  districtHQCollectoratePhone: string;
  districtNodalOfficerName: string;
  sanctionedBudgetINR: number;
  resolutionTimelineDays: number;
  trackingToken: string;
  dualFollowupActive: boolean;
  assignedAt: string;
}

export interface SupervisorReview {
  isReviewed: boolean;
  decision: 'approved' | 'rejected' | 'pending';
  supervisorName: string;
  supervisorDesignation: string;
  supervisorTaluk: string;
  remarksTamil: string;
  remarksEnglish: string;
  fieldInspectionDate: string;
  forwardedToCMCellAt: string;
  fieldPhotos?: string[];
  // If approved: either opened as direct task or assigned to Dept + District HQ
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

export interface CMCellTask {
  taskId: string;
  taskTitle: string;
  taskTitleTamil: string;
  sanctionedBudget: string; // e.g. "₹4,50,000"
  assignedContractor: string;
  contractorPhone: string;
  departmentName: string;
  departmentNameTamil: string;
  targetDeadline: string;
  priority: 'Critical Emergency' | 'High Priority' | 'Standard Directive';
  workOrderNumber: string;
  sanctionedDate: string;
  qrCodeText: string;
  status: 'Sanctioned' | 'Work Commenced' | 'Completed';
}

export interface CMCellReview {
  isReviewed: boolean;
  decision: 'task_generated' | 'rejected_final' | 'under_review' | 'override_approved';
  cmOfficerName: string;
  reviewNotesTamil: string;
  reviewNotesEnglish: string;
  reviewedAt?: string;
  generatedTask?: CMCellTask;
}

export interface Grievance {
  id: string; // e.g. "TN-GRV-2026-8492"
  title: string;
  description: string;
  requirementType?: RequirementType;
  category: GrievanceCategory;
  categoryTamil: string;
  district: string;
  taluk: string;
  village: string;
  ward: string;
  locationDetails: string;
  landmark?: string;
  citizenName: string;
  citizenPhone: string;
  citizenAadhaar?: string;
  submittedAt: string;
  status: GrievanceStatus;
  urgency: UrgencyLevel;
  urgencyScore: number; // 1-10
  upvotes: number;
  hasUpvoted?: boolean;
  assignedDepartment: string;
  assignedDepartmentTamil: string;
  assignedOfficer: {
    name: string;
    designation: string;
    contactPhone: string;
  };
  estimatedResolutionDays: number;
  slaDeadline: string;
  timeline: TimelineEvent[];
  images?: string[];
  resolvedProofImage?: string;
  resolutionRemarks?: string;
  citizenRating?: number; // 1-5
  aiVerification?: AIVerificationResult;
  aiAnalysis?: {
    summaryTamil: string;
    summaryEnglish: string;
    actionPlanTamil: string[];
    actionPlanEnglish: string[];
    applicableRules: string;
  };
  supervisorReview?: SupervisorReview;
  cmCellReview?: CMCellReview;
  // Contractor SLA & Workforce selection
  contractorStatus?: 'pending_acceptance' | 'accepted' | 'declined' | 'expired';
  contractorSlaDeadline?: string;
  contractorAcceptedAt?: string;
  contractorWorkforce?: ContractorWorkforceSelection;
  contractorAssignedName?: string;
  // Day to day progress and fund utilisation
  isWorkInitiated?: boolean;
  workInitiatedAt?: string;
  dailyProgressReports?: DailyProgressReport[];
  fundUtilisation?: FundUtilisationSummary;
  citizenConfirmation?: CitizenResolutionConfirmation;
  comments?: Array<{
    id: string;
    author: string;
    role: 'Citizen' | 'Volunteer' | 'Official' | 'Supervisor' | 'CM Cell';
    text: string;
    time: string;
  }>;
}

export interface ContractorWorkforceSelection {
  workforceType: 'own_labour' | 'volunteer_padai' | 'hybrid';
  ownLabourCount?: number;
  ownTrades?: string[];
  volunteerPadaiCount?: number;
  machineryDeployed?: string;
  estimatedDaysToFinish?: number;
  contractorFirmName?: string;
  contractorLicenseId?: string;
  acceptedAtTimestamp?: string;
  notes?: string;
}

export interface SystemNotification {
  id: string;
  recipientRole: UserRole | 'volunteer' | 'all';
  targetDistrict: string;
  targetTaluk?: string;
  targetVillage?: string;
  type: 
    | 'complaint_lodged' 
    | 'supervisor_approved' 
    | 'contractor_assigned' 
    | 'contractor_accepted' 
    | 'contractor_declined' 
    | 'work_started' 
    | 'work_progress' 
    | 'work_finished';
  titleTamil: string;
  titleEnglish: string;
  messageTamil: string;
  messageEnglish: string;
  timestamp: string;
  read: boolean;
  grievanceId?: string;
  taskId?: string;
  slaDeadline?: string;
  workforceChoice?: 'own_labour' | 'volunteer_padai' | 'hybrid';
  contractorFirm?: string;
}

export interface WelfareScheme {
  id: string;
  titleTamil: string;
  titleEnglish: string;
  category: 'Women Welfare' | 'Students & Youth' | 'Agriculture & Farmers' | 'Senior Citizens & Pension' | 'Healthcare' | 'Housing & Sanitation' | 'Employment & Skills';
  departmentTamil: string;
  departmentEnglish: string;
  benefitAmount: string;
  descriptionTamil: string;
  descriptionEnglish: string;
  eligibilityCriteriaTamil: string[];
  eligibilityCriteriaEnglish: string[];
  requiredDocuments: string[];
  applicationMode: 'Online e-Sevai' | 'Direct Camp' | 'Taluk Office' | 'Bank / Portal';
  portalUrl: string;
  popularScore: number;
  highlightTag?: string;
}

export interface VolunteerContribution {
  id: string;
  contributorName: string;
  contributorPhone: string;
  contributorDistrict?: string;
  type: 'financial' | 'physical_labour' | 'food_refreshment';
  amountINR?: number;
  paymentMethod?: 'UPI' | 'Card' | 'Direct Escrow';
  upiTransactionId?: string;
  labourHours?: number;
  labourSkill?: string;
  preferredRole?: string;
  shramdaanOrWage?: 'voluntary_free' | 'daily_wage' | 'free_voluntary' | 'paid_daily_wage';
  // Free vs Paid Labour support
  labourCompensationType?: 'free_voluntary' | 'paid_daily_wage';
  compensationType?: 'free' | 'paid';
  dailyWageClaimINR?: number;
  dailyWageRateINR?: number;
  // Food & Refreshment support fields
  foodCategory?: 'cooked_meals' | 'drinking_water' | 'breakfast_tea' | 'tender_coconut_buttermilk' | 'snacks_biscuits';
  foodItemName?: string;
  foodQuantity?: number;
  foodUnit?: string;
  foodDeliverySlot?: string;
  foodDeliveryMethod?: 'self_delivery_to_camp' | 'volunteer_pickup_needed';
  foodDeliveryAddress?: string;
  mealsCount?: number;
  waterBottlesCount?: number;
  timestamp: string;
}

export interface SupervisorWorkPlan {
  supervisorName: string;
  supervisorDesignation: string;
  supervisorPhone?: string;
  estimatedTotalCostINR: number;
  costBreakdown: {
    materialsCost: number;
    machineryEquipmentCost: number;
    labourAndSafetyCost: number;
    contingencyLogisticsCost: number;
  };
  workStartDate: string;
  workDurationDays: number;
  timelineWindowDays: number; // Modifiable by supervisor (e.g. 1 to 14 days)
  shiftTiming: string;
  requiredStaffCount: number;
  dailyWageBenchmarkINR?: number; // e.g. 650/day
  requiredSpecialists: string[];
  surplusFundAction: 'transfer_to_district_development_pool';
  surplusTransferredINR: number;
  lastUpdatedTimestamp: string;
}

export interface VolunteerTask {
  id: string;
  linkedGrievanceId?: string;
  titleTamil: string;
  titleEnglish: string;
  district: string;
  ward: string;
  category: 'Tree Plantation' | 'Sanitation & Desilting' | 'Medical Camp Support' | 'Education & Tuition' | 'Food & Relief' | 'Elderly Support';
  date: string;
  location: string;
  targetVolunteers: number;
  joinedVolunteers: number;
  descriptionTamil: string;
  descriptionEnglish: string;
  coordinatorName: string;
  coordinatorPhone: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  impactMetric: string;
  isJoined?: boolean;
  // 3-Day Volunteer Window & Supervisor Controls
  isActivatedTask?: boolean;
  activationDate?: string;
  volunteerWindowDeadline?: string; // e.g. 72 Hours Mobilization
  hoursRemaining?: number;
  timelineWindowDays?: number; // default 3 days, customizable by supervisor
  targetFinancialINR?: number;
  collectedFinancialINR?: number;
  financialContributorsCount?: number;
  targetLabourVolunteers?: number;
  registeredLabourVolunteers?: number;
  dailyWageINR?: number; // e.g. 650 INR/day for paid workers
  allowFinancialSupport?: boolean;
  allowPhysicalLabour?: boolean;
  allowFoodRefreshmentSupport?: boolean;
  // Food & Refreshment support tallies
  foodContributionsCount?: number;
  totalMealsPledged?: number;
  totalWaterBottlesPledged?: number;
  totalRefreshmentPacksPledged?: number;
  // Supervisor cost & operational controls
  supervisorControl?: SupervisorWorkPlan;
  surplusAmountINR?: number;
  isSurplusTransferred?: boolean;
  contributions?: VolunteerContribution[];
  // Day to day progress and fund utilisation
  isWorkStarted?: boolean;
  workExecutionStatus?: 'Mobilizing' | 'Work In Progress' | 'Resolved & Completed';
  dailyProgressReports?: DailyProgressReport[];
  fundUtilisation?: FundUtilisationSummary;
  citizenConfirmation?: CitizenResolutionConfirmation;
}

export interface CommunityPoll {
  id: string;
  questionTamil: string;
  questionEnglish: string;
  category: string;
  district: string;
  totalVotes: number;
  options: Array<{
    id: string;
    textTamil: string;
    textEnglish: string;
    votes: number;
  }>;
  userVotedOptionId?: string;
  endDate: string;
  contextTamil: string;
  contextEnglish: string;
}

export interface DistrictStat {
  district: string;
  districtTamil: string;
  zone: 'North' | 'South' | 'Central' | 'West';
  totalGrievances: number;
  resolvedGrievances: number;
  inProgressGrievances: number;
  resolutionRate: number; // percentage
  avgResolutionDays: number;
  topIssueCategory: string;
  activeVolunteers: number;
  nodalOfficer: string;
  collectoratePhone: string;
}

export interface TestCaseResult {
  id: string;
  name: string;
  nameTamil: string;
  category: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  executionTimeMs?: number;
  logs: string[];
  details?: any;
}
