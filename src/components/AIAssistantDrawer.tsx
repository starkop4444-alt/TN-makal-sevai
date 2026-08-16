import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  HelpCircle,
  PhoneCall,
  FileText,
  RotateCcw
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: language === 'ta'
        ? 'வணக்கம்! நான் உங்கள் "மக்கள் சேவகர் AI" (Makkal Sevai Assistant). தமிழ்நாடு அரசு நலத்திட்டங்கள், மனு பதிவு, ஆர்டிஐ (RTI) விண்ணப்பம் அல்லது அவசர உதவி எண்கள் குறித்து எதையும் என்னிடம் கேட்கலாம்!'
        : 'Vanakkam! I am your AI Makkal Sevai Assistant. Ask me anything about Tamil Nadu welfare schemes, grievance redressal rules, RTI petitions, or contact helplines!',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const samplePrompts = [
    {
      labelTa: 'மகளிர் உரிமைத்தொகை ₹1000 பெறுவது எப்படி?',
      labelEn: 'How to apply for ₹1,000 Magalir Urimai?',
    },
    {
      labelTa: 'மின்வாரியத்தில் புகார் செய்வது எப்படி?',
      labelEn: 'How to escalate electricity complaint to TANGEDCO?',
    },
    {
      labelTa: 'CMCHIS மருத்துவக் காப்பீடு அட்டை பெறுவது எப்படி?',
      labelEn: 'How to get CMCHIS ₹5 Lakh Health Card?',
    },
    {
      labelTa: 'தகவல் அறியும் உரிமை சட்டம் (RTI) மனு மாதிரி',
      labelEn: 'RTI application format in Tamil Nadu',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language: language === 'ta' ? 'Tamil' : 'English',
        }),
      });

      const json = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: json.reply || (language === 'ta' ? 'தகவல் பெறப்பட்டது.' : 'Response received.'),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: language === 'ta'
            ? 'மன்னிக்கவும், நெட்வொர்க் பிழை ஏற்பட்டது. அவசர உதவிக்கு 1100 அல்லது 108 அழைக்கலாம்.'
            : 'Sorry, a connection error occurred. Please try again or call 1100 helpline.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Chat Drawer Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-4 text-white flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">
                  {language === 'ta' ? 'மக்கள் சேவகர் AI' : 'Makkal Sevai AI'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-indigo-200">
                {language === 'ta' ? 'அரசு நலத்திட்டங்கள் & குறைதீர்ப்பு வழிகாட்டி' : 'TN Civic Schemes & Citizen Rights Advisor'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200 shadow-xs whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 p-3 rounded-2xl w-fit border border-indigo-100 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{language === 'ta' ? 'மக்கள் சேவகர் பதிலைத் தயார் செய்கிறது...' : 'Analyzing citizen database...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(language === 'ta' ? p.labelTa : p.labelEn)}
              className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 shrink-0 transition-colors cursor-pointer"
            >
              {language === 'ta' ? p.labelTa : p.labelEn}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === 'ta' ? 'நலத்திட்டம், மனு முறை பற்றி கேளுங்கள்...' : 'Ask about schemes, grievance status, rules...'}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
