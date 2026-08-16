import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VolunteerTask, VolunteerContribution } from '../types';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  X,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Download,
  Share2,
  Copy,
  QrCode,
  Smartphone,
  CreditCard,
  Building,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  HeartHandshake,
  FileText,
  RefreshCw,
  ScanLine,
  ExternalLink,
  Layers,
  Printer
} from 'lucide-react';

export interface DonationReceiptData {
  receiptNo: string;
  urn: string;
  amount: number;
  donorName: string;
  donorPhone: string;
  donorPan?: string;
  taskTitle: string;
  location: string;
  timestamp: string;
  paymentMethod: string;
  purpose: string;
  surplusRerouted?: number;
  fundBreakdown?: {
    materials: number;
    machinery: number;
    labour: number;
    safetyContingency: number;
  };
}

interface DonationGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: VolunteerTask[];
  selectedTask?: VolunteerTask | null;
  onDonateSuccess: (taskId: string, contribution: VolunteerContribution) => void;
  viewReceiptData?: DonationReceiptData | null;
  onViewLedger?: () => void;
}

type PaymentGatewayMode = 'upi_apps' | 'qr_code' | 'vpa_id' | 'netbanking';
type UpiApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred' | 'amazonpay';
type PaymentStep = 'configure' | 'upi_pin' | 'processing' | 'success';

export const DonationGatewayModal: React.FC<DonationGatewayModalProps> = ({
  isOpen,
  onClose,
  tasks,
  selectedTask: initialTask,
  onDonateSuccess,
  viewReceiptData,
  onViewLedger,
}) => {
  const { language } = useLanguage();

  // Selected target task
  const [activeTask, setActiveTask] = useState<VolunteerTask | null>(initialTask || tasks[0] || null);

  // Amount state
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Donor details
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [fundPurpose, setFundPurpose] = useState<string>('Raw Materials & Equipment (Pipes, Cement, Tools)');

  // Gateway mode & Selected App
  const [gatewayMode, setGatewayMode] = useState<PaymentGatewayMode>('upi_apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp>('gpay');
  const [enteredVpa, setEnteredVpa] = useState<string>('');
  const [isCopiedVpa, setIsCopiedVpa] = useState<boolean>(false);
  const [isCopiedReceipt, setIsCopiedReceipt] = useState<boolean>(false);

  // Dynamic Merchant QR Generator States
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSessionSeconds, setQrSessionSeconds] = useState<number>(180);
  const [qrSessionId, setQrSessionId] = useState<string>(`TN-POS-${Date.now().toString().slice(-6)}`);
  const [isCopiedQrUri, setIsCopiedQrUri] = useState<boolean>(false);
  const [isScanningAnimation, setIsScanningAnimation] = useState<boolean>(true);
  const [isQrGenerating, setIsQrGenerating] = useState<boolean>(false);

  // Simulated Pin & Processing Steps
  const [step, setStep] = useState<PaymentStep>(viewReceiptData ? 'success' : 'configure');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [processingStatusText, setProcessingStatusText] = useState<string>('Connecting to NPCI Payments Switch...');
  const [processingProgress, setProcessingProgress] = useState<number>(15);

  // Final Receipt State
  const [receiptData, setReceiptData] = useState<DonationReceiptData | null>(viewReceiptData || null);

  // Keep activeTask synced when initialTask or viewReceiptData prop changes
  useEffect(() => {
    if (viewReceiptData) {
      setReceiptData(viewReceiptData);
      setStep('success');
    } else {
      if (initialTask) {
        setActiveTask(initialTask);
      } else if (tasks.length > 0 && !activeTask) {
        setActiveTask(tasks[0]);
      }
      setStep('configure');
    }
  }, [viewReceiptData, initialTask, tasks]);

  // Reset internal states when opened
  useEffect(() => {
    if (isOpen) {
      setStep('configure');
      setEnteredPin('');
      setReceiptData(null);
      setQrSessionSeconds(180);
      setQrSessionId(`TN-POS-${Date.now().toString().slice(-6)}`);
    }
  }, [isOpen]);

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const targetTask = activeTask || tasks[0];

  // Dynamic UPI Intent URI for NPCI Standard
  const upiIntentUri = useMemo(() => {
    const taskIdClean = (targetTask?.id || 'CIVIC').replace(/[^a-zA-Z0-9]/g, '');
    const cleanSession = qrSessionId.replace(/[^a-zA-Z0-9]/g, '');
    const safeTitle = encodeURIComponent((targetTask?.titleEnglish || 'Civic Work').slice(0, 30));
    return `upi://pay?pa=makkal.sevai@sbi&pn=TamilNadu%20Civic%20Escrow&mc=9399&tid=TNPAY${taskIdClean.slice(-4)}${cleanSession.slice(-4)}&tr=TN${taskIdClean}${cleanSession}&tn=Civic%20Aid%20${safeTitle}&am=${currentAmount > 0 ? currentAmount.toFixed(2) : '1000.00'}&cu=INR`;
  }, [targetTask, qrSessionId, currentAmount]);

  // Generate Real-World Dynamic QR Code whenever amount, task, or session changes
  useEffect(() => {
    let isMounted = true;
    const generateQr = async () => {
      try {
        setIsQrGenerating(true);
        const dataUrl = await QRCode.toDataURL(upiIntentUri, {
          width: 380,
          margin: 2,
          color: {
            dark: '#042f2e', // Deep emerald dark module
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setIsQrGenerating(false);
        }
      } catch (err) {
        console.error('QR Generation failed:', err);
        if (isMounted) setIsQrGenerating(false);
      }
    };

    generateQr();

    return () => {
      isMounted = false;
    };
  }, [upiIntentUri]);

  // QR Session Validity Timer Countdown
  useEffect(() => {
    if (!isOpen || gatewayMode !== 'qr_code' || step !== 'configure') return;

    const timer = setInterval(() => {
      setQrSessionSeconds((prev) => {
        if (prev <= 1) {
          // Auto refresh session ID
          setQrSessionId(`TN-POS-${Date.now().toString().slice(-6)}`);
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gatewayMode, step]);

  // Refresh QR Session Manually
  const handleRefreshQrSession = () => {
    setQrSessionSeconds(180);
    setQrSessionId(`TN-POS-${Date.now().toString().slice(-6)}`);
  };

  // Download High-Resolution Printable Merchant QR Flyer
  const handleDownloadQrFlyer = () => {
    if (!qrDataUrl || !targetTask) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 800, 1100);

    // Header Banner
    const gradient = ctx.createLinearGradient(0, 0, 800, 0);
    gradient.addColorStop(0, '#064e3b');
    gradient.addColorStop(0.5, '#047857');
    gradient.addColorStop(1, '#065f46');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 180);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAMIL NADU CIVIC GOVERNANCE ESCROW', 400, 70);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('NPCI Bharat QR / UPI 2.0 Official Merchant Terminal', 400, 105);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`Merchant VPA: makkal.sevai@sbi • MCC: 9399 • POS: ${qrSessionId}`, 400, 140);

    // Task Card Box
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(50, 210, 700, 140, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(targetTask.titleEnglish.slice(0, 48), 80, 250);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Location: ${targetTask.district} - ${targetTask.ward || targetTask.taluk || 'Ground'}`, 80, 285);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#047857';
    ctx.fillText(`Pay Amount: ₹${currentAmount.toLocaleString('en-IN')}.00`, 80, 325);

    // Draw QR Code Image
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 175, 380, 450, 450);

      // Central Emblem Badge in QR
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.roundRect(360, 565, 80, 80, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TN', 400, 612);

      // Footer Supported Apps Bar
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('ACCEPTED VIA ALL UPI APPS', 400, 875);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Google Pay • PhonePe • Paytm • BHIM SBI • CRED • Amazon Pay', 400, 910);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('100% Tax Exempt under Sec 80G • Direct Civic Escrow Lock', 400, 950);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText(`Generated: ${new Date().toLocaleString('en-IN')} | Ref: ${targetTask.id}`, 400, 1020);

      // Trigger Download
      const flyerUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = flyerUrl;
      a.download = `TN_Govt_Civic_Merchant_QR_${targetTask.id}_${currentAmount}INR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    qrImg.src = qrDataUrl;
  };

  if (!isOpen) return null;

  const targetNeededCost = targetTask?.supervisorControl?.estimatedTotalCostINR || targetTask?.targetFinancialINR || 50000;
  const currentCollected = targetTask?.collectedFinancialINR || 0;
  const remainingNeeded = Math.max(0, targetNeededCost - currentCollected);
  const currentProgressPct = Math.min(100, Math.round((currentCollected / targetNeededCost) * 100));

  // Handle Preset Click
  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  // Initiate Payment -> Open Pin / Gateway Simulation
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    if (gatewayMode === 'upi_apps' || gatewayMode === 'vpa_id') {
      setStep('upi_pin');
      setEnteredPin('');
    } else if (gatewayMode === 'qr_code') {
      // Simulate scanning QR and completing payment
      handleSimulateProcessing();
    } else {
      handleSimulateProcessing();
    }
  };

  // Simulate PIN Pad Key Click
  const handlePinPadClick = (digit: string) => {
    if (enteredPin.length < 6) {
      setEnteredPin((prev) => prev + digit);
    }
  };

  const handlePinPadBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
  };

  // Run the multi-step NPCI simulation
  const handleSimulateProcessing = () => {
    setStep('processing');
    setProcessingProgress(20);
    setProcessingStatusText(
      language === 'ta'
        ? 'NPCI சர்வர் உடன் பாதுகாப்பான தொடர்பு ஏற்படுத்தப்படுகிறது...'
        : 'Connecting to NPCI Unified Payments Switch...'
    );

    setTimeout(() => {
      setProcessingProgress(50);
      setProcessingStatusText(
        language === 'ta'
          ? 'வங்கி கணக்கிலிருந்து தொகை சரிபார்க்கப்பட்டு எஸ்க்ரோவில் பூட்டப்படுகிறது...'
          : 'Verifying Bank Authorization & Locking Escrow Funds...'
      );
    }, 900);

    setTimeout(() => {
      setProcessingProgress(85);
      setProcessingStatusText(
        language === 'ta'
          ? 'மேற்பார்வையாளர் திட்ட கணக்கிற்கு நிதி மாற்றம் உறுதி செய்யப்படுகிறது...'
          : 'Routing to Taluk Grievance Project Escrow Account...'
      );
    }, 1800);

    setTimeout(() => {
      setProcessingProgress(100);
      handleFinalizePaymentSuccess();
    }, 2600);
  };

  // Finalize payment after simulation completes
  const handleFinalizePaymentSuccess = () => {
    if (!targetTask) return;

    const receiptNo = `TN-UPI-ESCROW-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const urn = `SBI-NPCI-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const finalDonorName = isAnonymous ? 'Anonymous Civic Benefactor' : (donorName || 'Concerned Citizen Benefactor');
    const finalPhone = donorPhone || '9840123456';

    const newCollected = currentCollected + currentAmount;
    const surplus = newCollected > targetNeededCost ? newCollected - targetNeededCost : 0;

    const newContrib: VolunteerContribution = {
      id: receiptNo,
      contributorName: finalDonorName,
      contributorPhone: finalPhone,
      type: 'financial',
      amountINR: currentAmount,
      paymentMethod: 'UPI',
      upiTransactionId: urn,
      timestamp: nowStr,
    };

    // Callback to parent components to update state
    onDonateSuccess(targetTask.id, newContrib);

    // Set Receipt State
    setReceiptData({
      receiptNo,
      urn,
      amount: currentAmount,
      donorName: finalDonorName,
      donorPhone: finalPhone,
      taskTitle: language === 'ta' ? targetTask.titleTamil : targetTask.titleEnglish,
      location: `${targetTask.district} • ${targetTask.ward || targetTask.taluk || 'Ground Site'}`,
      timestamp: nowStr,
      paymentMethod: selectedUpiApp === 'gpay' ? 'Google Pay (UPI 2.0)' : selectedUpiApp === 'phonepe' ? 'PhonePe (NPCI Escrow)' : selectedUpiApp === 'paytm' ? 'Paytm UPI' : selectedUpiApp === 'cred' ? 'CRED UPI' : 'BHIM / SBI Instant UPI',
      purpose: fundPurpose,
      surplusRerouted: surplus > 0 ? surplus : undefined
    });

    setStep('success');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const getAppName = (app: UpiApp) => {
    switch (app) {
      case 'gpay': return 'Google Pay';
      case 'phonepe': return 'PhonePe';
      case 'paytm': return 'Paytm UPI';
      case 'bhim': return 'BHIM / SBI';
      case 'cred': return 'CRED UPI';
      case 'amazonpay': return 'Amazon Pay';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 relative">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {language === 'ta' ? 'அரசு எஸ்க்ரோ தணிக்கை UPI வாயில்' : 'Govt Escrow Verified UPI Gateway'}
              </span>
              <span className="text-[10px] text-slate-300 font-mono">100% Tax Exempt</span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              <span>{language === 'ta' ? 'மக்கள் திட்ட நிதி பங்களிப்பு' : 'Civic Grievance Task Donation Gateway'}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Based on Step */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">

          {/* ================= STEP 1: CONFIGURE DONATION & CHOOSE GATEWAY ================= */}
          {step === 'configure' && (
            <form onSubmit={handleInitiatePayment} className="space-y-5">
              
              {/* 1. Target Grievance Task Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'ta' ? 'நிதி பெறப்படும் பணி (Select Target Task) *' : 'Target Grievance Task *'}</span>
                  <span className="text-[11px] text-emerald-700 font-bold lowercase">{tasks.length} tasks open</span>
                </label>

                <select
                  value={targetTask?.id || ''}
                  onChange={(e) => {
                    const found = tasks.find((t) => t.id === e.target.value);
                    if (found) setActiveTask(found);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {language === 'ta' ? t.titleTamil : t.titleEnglish} ({t.district} - {t.ward || t.taluk || 'Ground'})
                    </option>
                  ))}
                </select>

                {/* Target Task Brief Card */}
                {targetTask && (
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2 mt-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {language === 'ta' ? targetTask.titleTamil : targetTask.titleEnglish}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5 font-medium">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span>{targetTask.district} • {targetTask.ward || targetTask.taluk || 'Ground Site'}</span>
                          <span>•</span>
                          <span>{targetTask.category}</span>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">
                        {currentProgressPct}% Funded
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                          style={{ width: `${currentProgressPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Raised: ₹{currentCollected.toLocaleString('en-IN')}</span>
                        <span>Goal: ₹{targetNeededCost.toLocaleString('en-IN')} (₹{remainingNeeded.toLocaleString('en-IN')} remaining)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Amount Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'பங்களிப்பு தொகையை தேர்ந்தெடுக்கவும் (INR) *' : 'Select Contribution Amount (INR) *'}
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[250, 500, 1000, 2500, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        amount === amt && !customAmount
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative mt-2">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="10"
                    placeholder={language === 'ta' ? 'வேறு தொகை குறிப்பிடவும் (Custom Amount INR)' : 'Or Enter Custom Amount in INR (e.g. 1500)'}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setAmount(parseFloat(e.target.value) || 0);
                    }}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 3. Transparent Fund Split Visualizer */}
              {(() => {
                const mat = Math.round(currentAmount * 0.4);
                const mac = Math.round(currentAmount * 0.3);
                const lab = Math.round(currentAmount * 0.2);
                const con = currentAmount - mat - mac - lab;
                return (
                  <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200/80 space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        {language === 'ta' ? 'நேரடி திட்ட நிதி பயன்பாடு (100% Escrow Split):' : 'Direct Project Fund Allocation (100% Escrow):'}
                      </span>
                      <span className="font-mono font-black text-emerald-800">₹{currentAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center">
                      <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 block">கட்டுமானம் (40%)</span>
                        <span className="font-bold text-slate-800">₹{mat.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 block">இயந்திரம் (30%)</span>
                        <span className="font-bold text-slate-800">₹{mac.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 block">கூலி (20%)</span>
                        <span className="font-bold text-slate-800">₹{lab.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-200">
                        <span className="text-slate-500 block">பாதுகாப்பு (10%)</span>
                        <span className="font-bold text-slate-800">₹{con.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 4. Payment Gateway Mode Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? 'UPI செலுத்து முறை (Select Simulated Gateway) *' : 'Simulated Payment Gateway Mode *'}
                </label>

                <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => setGatewayMode('upi_apps')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      gatewayMode === 'upi_apps' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>UPI Apps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGatewayMode('qr_code')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      gatewayMode === 'qr_code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dynamic QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGatewayMode('vpa_id')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      gatewayMode === 'vpa_id' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <span>UPI ID / VPA</span>
                  </button>
                </div>

                {/* Sub-view: UPI Apps */}
                {gatewayMode === 'upi_apps' && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢', color: 'border-blue-300' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'border-purple-300' },
                      { id: 'paytm', name: 'Paytm UPI', icon: '🔵', color: 'border-cyan-300' },
                      { id: 'bhim', name: 'BHIM / SBI', icon: '🇮🇳', color: 'border-amber-300' },
                      { id: 'cred', name: 'CRED UPI', icon: '💳', color: 'border-slate-400' },
                      { id: 'amazonpay', name: 'Amazon Pay', icon: '🛒', color: 'border-amber-400' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as UpiApp)}
                        className={`p-2.5 rounded-2xl text-center border transition-all cursor-pointer ${
                          selectedUpiApp === app.id
                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xl block mb-1">{app.icon}</span>
                        <span className="text-[11px] font-bold block truncate">{app.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Sub-view: Dynamic Live Merchant QR Code Generator */}
                {gatewayMode === 'qr_code' && (
                  <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 border border-emerald-900/60 shadow-xl space-y-4 animate-in fade-in">
                    
                    {/* Merchant Terminal Top Bar */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-900/40">
                          TN
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white tracking-wide">
                              {language === 'ta' ? 'தமிழ்நாடு அரசு மக்கள் நல நிதி (எஸ்க்ரோ)' : 'TN Civic Infrastructure Escrow'}
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-400/30 flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                              NPCI Verified
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            VPA: <span className="text-emerald-400">makkal.sevai@sbi</span> • MCC: 9399 • POS: {qrSessionId}
                          </span>
                        </div>
                      </div>

                      {/* Timer & Refresh */}
                      <button
                        type="button"
                        onClick={handleRefreshQrSession}
                        className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                        title="Regenerate dynamic QR code and refresh session reference"
                      >
                        <RefreshCw className={`w-3 h-3 text-emerald-400 ${isQrGenerating ? 'animate-spin' : ''}`} />
                        <span className="font-mono text-emerald-400 font-bold">
                          {Math.floor(qrSessionSeconds / 60)}:{(qrSessionSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </button>
                    </div>

                    {/* QR Code Presentation Box */}
                    <div className="flex flex-col items-center justify-center space-y-3 py-1">
                      <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl relative border-4 border-emerald-500/30 group">
                        
                        {/* Dynamic QR Image with Scanner Beam */}
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-white rounded-2xl overflow-hidden">
                          {qrDataUrl ? (
                            <img
                              src={qrDataUrl}
                              alt="Dynamic Merchant UPI QR Code"
                              className="w-full h-full object-contain select-none"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                              <span className="text-xs font-semibold">Generating Merchant QR...</span>
                            </div>
                          )}

                          {/* Central TN Civic Escrow Logo Overlay in QR */}
                          {qrDataUrl && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 border-2 border-white shadow-lg flex flex-col items-center justify-center text-white">
                                <span className="text-[10px] font-black leading-none">TN</span>
                                <span className="text-[7px] font-bold text-emerald-200 leading-none mt-0.5">UPI</span>
                              </div>
                            </div>
                          )}

                          {/* Scanner Laser Beam Animation */}
                          {isScanningAnimation && (
                            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_#10b981] animate-[bounce_2.5s_infinite] pointer-events-none opacity-80" />
                          )}
                        </div>

                        {/* Amount Badge Pill */}
                        <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black px-4 py-1 rounded-full shadow-lg border border-emerald-400/40 flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            <span>{currentAmount.toLocaleString('en-IN')}.00</span>
                          </span>
                        </div>
                      </div>

                      {/* Instructions & Scannable Help */}
                      <div className="text-center pt-2 space-y-1">
                        <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                          <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            {language === 'ta'
                              ? 'Google Pay, PhonePe, Paytm, BHIM கொண்டு ஸ்கேன் செய்யவும்'
                              : 'Scan using any UPI App (GPay, PhonePe, Paytm, BHIM)'}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Ref: <span className="text-slate-300">BILL-{targetTask?.id.slice(-6).toUpperCase()}-{Math.round(currentAmount)}</span> • Sec 80G Certified
                        </p>
                      </div>
                    </div>

                    {/* Interactive QR Action Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                      
                      {/* Action 1: Simulate Scan & Pay Confirmation */}
                      <button
                        type="button"
                        onClick={handleSimulateProcessing}
                        className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        title="Simulate smartphone scanning this merchant QR code and confirming payment"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{language === 'ta' ? 'ஸ்கேன் செய்து செலுத்து (சோதனை)' : 'Simulate Scan & Pay'}</span>
                      </button>

                      {/* Action 2: Download Merchant QR Flyer */}
                      <button
                        type="button"
                        onClick={handleDownloadQrFlyer}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        title="Download printable high-resolution merchant collection QR poster"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'ta' ? 'QR சுவரொட்டி பதிவிறக்கு' : 'Download QR Flyer'}</span>
                      </button>

                      {/* Action 3: Copy UPI DeepLink */}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText?.(upiIntentUri);
                          setIsCopiedQrUri(true);
                          setTimeout(() => setIsCopiedQrUri(false), 2500);
                        }}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        title="Copy official NPCI UPI Deep Link URL"
                      >
                        {isCopiedQrUri ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">URI Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copy UPI Intent</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Supported Apps Ecosystem Badges */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-300">Accepted by:</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 border border-slate-700">🟢 Google Pay</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 border border-slate-700">🟣 PhonePe</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 border border-slate-700">🔵 Paytm</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 border border-slate-700">🇮🇳 BHIM SBI</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 border border-slate-700">💳 CRED</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 border border-slate-700">🛒 Amazon Pay</span>
                    </div>
                  </div>
                )}

                {/* Sub-view: UPI VPA */}
                {gatewayMode === 'vpa_id' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Official Escrow VPA</span>
                        <span className="font-mono text-xs font-black text-emerald-800">makkal.sevai@sbi</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText?.('makkal.sevai@sbi');
                          setIsCopiedVpa(true);
                          setTimeout(() => setIsCopiedVpa(false), 2000);
                        }}
                        className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        {isCopiedVpa ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopiedVpa ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Or enter your UPI ID (e.g. citizen@okaxis)"
                      value={enteredVpa}
                      onChange={(e) => setEnteredVpa(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* 5. Optional Donor Identity & Tax Exemption */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {language === 'ta' ? 'பங்களிப்பாளர் விவரம் (விருப்பப்பட்டால்)' : 'Donor Details (Optional)'}
                  </span>
                  
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{language === 'ta' ? 'பெயர் வெளியிடாமல் வழங்குக (Anonymous)' : 'Make Anonymous'}</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        {language === 'ta' ? 'உங்கள் பெயர்' : 'Full Name'}
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
                      <label className="block text-[11px] font-bold text-slate-600">
                        {language === 'ta' ? 'மொபைல் எண் (SMS ரசீது பெற)' : 'Mobile (For SMS e-Receipt)'}
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
                )}
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Lock className="w-4 h-4 text-emerald-200" />
                <span>
                  {language === 'ta'
                    ? `₹${currentAmount.toLocaleString('en-IN')} நிதி செலுத்துக (${getAppName(selectedUpiApp)})`
                    : `Proceed to Pay ₹${currentAmount.toLocaleString('en-IN')} via ${getAppName(selectedUpiApp)}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= STEP 2: SIMULATED UPI PIN & BANK PAD ================= */}
          {step === 'upi_pin' && (
            <div className="space-y-6 text-center max-w-md mx-auto py-2">
              {/* Bank Header */}
              <div className="bg-slate-900 text-white p-4 rounded-3xl space-y-2 border border-slate-800 shadow-md">
                <div className="flex justify-between items-center text-xs text-slate-300 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Building className="w-3.5 h-3.5" /> State Bank of India
                  </span>
                  <span className="font-mono text-[11px]">A/C •••• 4281</span>
                </div>

                <div className="py-1">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Transferring to Gov Escrow</span>
                  <span className="text-xl font-black text-white">₹{currentAmount.toLocaleString('en-IN')}.00</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">To: makkal.sevai@sbi</span>
                </div>
              </div>

              {/* Pin Indicator Dots */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {language === 'ta' ? '6-இலக்க UPI கடவுச்சொல் (PIN) உள்ளிடவும்' : 'Enter 4 or 6-Digit UPI PIN'}
                </span>
                
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        enteredPin.length > idx
                          ? 'bg-slate-900 border-slate-900 scale-110'
                          : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Virtual Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handlePinPadClick(digit)}
                    className="py-3.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 text-base font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handlePinPadBackspace}
                  className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
                >
                  ⌫ Back
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePinPadClick('0')}
                  className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-base font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
                >
                  0
                </button>
                
                <button
                  type="button"
                  onClick={handleSimulateProcessing}
                  className="py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep('configure')}
                  className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  ← Change Details
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleSimulateProcessing}
                  className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                >
                  ⚡ Fast Biometric Pass (FaceID)
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: SIMULATED PROCESSING STATE ================= */}
          {step === 'processing' && (
            <div className="py-12 space-y-6 text-center max-w-md mx-auto">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-2 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-black text-slate-900">
                  {language === 'ta' ? 'பாதுகாப்பான நிதி பரிவர்த்தனை நடைபெறுகிறது...' : 'Processing Secure UPI Escrow Payment...'}
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {processingStatusText}
                </p>
              </div>

              {/* Step Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                NPCI Node: SBI-GW-CHENNAI-04 • End-to-End Encrypted
              </div>
            </div>
          )}

          {/* ================= STEP 4: SUCCESS E-RECEIPT ================= */}
          {step === 'success' && receiptData && (
            <div className="space-y-5 text-center">
              
              {/* Success Badge */}
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  {language === 'ta' ? 'பங்களிப்பு வெற்றிகரமாக பெறப்பட்டது!' : 'Donation Payment Successful!'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {language === 'ta'
                    ? 'உங்கள் பங்களிப்பு அரசு மேற்பார்வையாளர் வழிகாட்டுதலில் தணிக்கை செய்யப்பட்டு திட்ட கணக்கில் சேர்க்கப்பட்டது.'
                    : 'Your contribution has been deposited into the Taluk Escrow Account and audited by the Field Supervisor.'}
                </p>
              </div>

              {/* Official E-Receipt Box */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-left space-y-3 text-xs shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Official Gov Escrow Receipt
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-3 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Receipt No</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{receiptData.receiptNo}</span>
                  </div>
                  <div className="text-right pr-16">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bank URN / NPCI Ref</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">{receiptData.urn}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] block uppercase">Benefactor</span>
                    <span className="font-semibold text-slate-900">{receiptData.donorName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] block uppercase">Amount Contributed</span>
                    <span className="font-black text-emerald-700 text-base">₹{receiptData.amount.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] block uppercase">Payment Mode</span>
                    <span className="font-medium text-slate-800">{receiptData.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] block uppercase">Location / Taluk</span>
                    <span className="font-medium text-slate-800">{receiptData.location}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-200/60">
                  <span className="font-bold text-slate-400 text-[10px] block uppercase">Allocated Grievance Mission</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{receiptData.taskTitle}</span>
                </div>

                {receiptData.surplusRerouted && (
                  <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>₹{receiptData.surplusRerouted.toLocaleString('en-IN')} extra surplus safely rerouted to District Civic Development Pool.</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                  <span>Timestamp: {receiptData.timestamp}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Tax Exempt & Escrow Audited
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText?.(
                        `Govt of Tamil Nadu Civic Task Donation Receipt\nReceipt No: ${receiptData.receiptNo}\nAmount: ₹${receiptData.amount}\nMission: ${receiptData.taskTitle}\nURN: ${receiptData.urn}`
                      );
                      setIsCopiedReceipt(true);
                      setTimeout(() => setIsCopiedReceipt(false), 2000);
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isCopiedReceipt ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopiedReceipt ? 'Copied' : 'Copy Receipt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const printContent = `
                      ===========================================================
                      GOVERNMENT OF TAMIL NADU - CIVIC ESCROW E-RECEIPT
                      ===========================================================
                      Receipt No   : ${receiptData.receiptNo}
                      NPCI URN     : ${receiptData.urn}
                      Benefactor   : ${receiptData.donorName}
                      Amount       : INR ${receiptData.amount.toLocaleString('en-IN')}.00
                      Mission      : ${receiptData.taskTitle}
                      Location     : ${receiptData.location}
                      Payment Mode : ${receiptData.paymentMethod}
                      Timestamp    : ${receiptData.timestamp}
                      Audit Status : 100% Tax Exempt (80G) • Escrow Audited
                      ===========================================================
                      `;
                      const blob = new Blob([printContent], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${receiptData.receiptNo}.txt`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-2xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'ta' ? 'ரசீது பதிவிறக்கம்' : 'Download Receipt'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {onViewLedger && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onViewLedger();
                      }}
                      className="flex-1 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-2xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>{language === 'ta' ? '📜 பரிவர்த்தனை வரலாறு' : '📜 Transaction Ledger'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setStep('configure');
                      setCustomAmount('');
                      setEnteredPin('');
                    }}
                    className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-2xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    <HeartHandshake className="w-4 h-4 text-amber-600" />
                    <span>{language === 'ta' ? 'மற்றொரு பங்களிப்பு' : 'Donate Again'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs cursor-pointer transition-all"
                  >
                    {language === 'ta' ? 'முடிந்தது' : 'Done'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
