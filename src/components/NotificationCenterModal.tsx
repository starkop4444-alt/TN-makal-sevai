import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SystemNotification, UserRole, CitizenProfile } from '../types';
import { TN_DISTRICTS, DISTRICT_TAMIL_NAMES } from '../data/tamilNaduData';
import { 
  Bell, 
  X, 
  CheckCheck, 
  MapPin, 
  Clock, 
  HardHat, 
  UserCheck, 
  Users, 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  currentRole: UserRole;
  currentProfile: CitizenProfile | null;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectAction: (notification: SystemNotification) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  currentRole,
  currentProfile,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectAction
}) => {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'my_role' | 'my_location' | 'unread'>('my_role');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentProfile?.district || 'All');

  if (!isOpen) return null;

  const currentDistrict = currentProfile?.district || 'Ariyalur';

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    // Check unread
    if (filterType === 'unread' && notif.read) return false;

    // Check my role
    if (filterType === 'my_role') {
      if (notif.recipientRole !== 'all' && notif.recipientRole !== currentRole && !(currentRole === 'citizen' && notif.recipientRole === 'volunteer')) {
        return false;
      }
    }

    // Check district filter
    if (selectedDistrict !== 'All') {
      if (notif.targetDistrict !== 'All' && notif.targetDistrict !== selectedDistrict) {
        return false;
      }
    }

    // Check location filter
    if (filterType === 'my_location') {
      if (notif.targetDistrict !== 'All' && notif.targetDistrict !== currentDistrict) {
        return false;
      }
    }

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIconForType = (type: SystemNotification['type']) => {
    switch (type) {
      case 'complaint_lodged':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'supervisor_approved':
        return <HardHat className="w-5 h-5 text-blue-600" />;
      case 'contractor_assigned':
      case 'contractor_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'contractor_declined':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'work_started':
      case 'work_progress':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case 'work_finished':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getRoleBadge = (role: SystemNotification['recipientRole']) => {
    switch (role) {
      case 'supervisor':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">மேற்பார்வையாளர் (Supervisor)</span>;
      case 'contractor':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">ஒப்பந்ததாரர் (Contractor)</span>;
      case 'volunteer':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">மக்கள் பணிப்படை (Padai)</span>;
      case 'cm_cell':
        return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold">CM சிறப்புப் பிரிவு</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">அனைவருக்கும் (Broadcast)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">
                  {language === 'ta' ? 'அறிவிப்பு & தகவல் மையம்' : 'Real-Time Notification Hub'}
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                    {unreadCount} {language === 'ta' ? 'புதியவை' : 'New'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'ta' 
                    ? `இடஅமைவு அடிப்படையிலான தகவல் பகிர்வு: ${currentDistrict} மாவட்டம்`
                    : `Location-based Dispatch: ${currentDistrict} District`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title={language === 'ta' ? 'அனைத்தையும் வாசித்ததாக குறி' : 'Mark all as read'}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'ta' ? 'அனைத்தும் வாசி' : 'Mark All Read'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-3 sm:px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setFilterType('my_role')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'my_role'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? 'என் பொறுப்பு' : 'My Role'}
            </button>
            <button
              onClick={() => setFilterType('my_location')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'my_location'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? 'என் மாவட்டம்' : 'My District'}
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'unread'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? 'படிக்காதவை' : 'Unread'}
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? 'அனைத்தும்' : 'All'}
            </button>
          </div>

          {/* District Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">{language === 'ta' ? 'அனைத்து மாவட்டங்கள்' : 'All 38 Districts'}</option>
              {TN_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {DISTRICT_TAMIL_NAMES[d]} ({d})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3 flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                {language === 'ta' ? 'புதிய அறிவிப்புகள் ஏதுமில்லை' : 'No notifications in this category'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'ta' 
                  ? 'புகார்கள், மேற்பார்வையாளர் ஒப்புதல்கள் மற்றும் ஒப்பந்ததாரர் முடிவுகள் இங்கு உடனுக்குடன் தோன்றும்.'
                  : 'Lodged complaints, supervisor approvals, and contractor SLA decisions will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                  notif.read
                    ? 'bg-white border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
                    : 'bg-indigo-50/60 border-indigo-200 shadow-xs hover:border-indigo-300'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></span>
                )}

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getRoleBadge(notif.recipientRole)}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {notif.targetDistrict}{notif.targetTaluk ? `, ${notif.targetTaluk}` : ''}
                      </span>
                      {notif.slaDeadline && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 animate-pulse">
                          <Clock className="w-3 h-3 text-rose-600" />
                          {language === 'ta' ? '6 மணி நேர கெடு (6h SLA)' : '6-Hour SLA Window'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {language === 'ta' ? notif.titleTamil : notif.titleEnglish}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'ta' ? notif.messageTamil : notif.messageEnglish}
                    </p>

                    {/* Workforce Choice Details if present */}
                    {notif.workforceChoice && (
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                        <HardHat className="w-4 h-4 text-amber-600" />
                        <span className="font-bold">
                          {language === 'ta' ? 'தேர்வு செய்யப்பட்ட ஆட்கள் முறை: ' : 'Selected Workforce Mode: '}
                        </span>
                        <span className="font-semibold text-indigo-700">
                          {notif.workforceChoice === 'own_labour'
                            ? (language === 'ta' ? '👷‍♂️ சொந்த ஆட்கள் & வெல்டர்கள்' : '👷‍♂️ Own Labourers & Tradesmen')
                            : notif.workforceChoice === 'volunteer_padai'
                            ? (language === 'ta' ? '🤝 தளபதி மக்கள் பணிப்படை' : '🤝 Volunteer Padai Mobilization')
                            : (language === 'ta' ? '⚡ கலப்பு முறை (Own + Volunteer)' : '⚡ Hybrid (Own + Volunteer)')}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notif.id);
                          onSelectAction(notif);
                        }}
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-100/60 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-all"
                      >
                        <span>{language === 'ta' ? 'நடவடிக்கை காண்க' : 'Take Action / View'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {language === 'ta' ? 'தானியங்கி இடஅமைவு அறிவிப்பு தளம்' : 'Automated Location-Based Redressal Dispatch'}
          </span>
          <span className="font-mono text-[11px]">
            Active Role: {currentRole.toUpperCase()}
          </span>
        </div>

      </div>
    </div>
  );
};
