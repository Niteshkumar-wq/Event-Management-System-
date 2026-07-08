"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Send, Bot, User, Sparkles, Lightbulb, Calendar, Users, DollarSign, BarChart3 } from "lucide-react";

const suggestions = [
  { icon: Calendar, text: "What events are happening this week?", color: "text-teal-600" },
  { icon: Users, text: "Show me VIP guest list for NexGen Launch", color: "text-purple-400" },
  { icon: DollarSign, text: "Generate a budget summary for Q2 2026", color: "text-emerald-400" },
  { icon: BarChart3, text: "Compare revenue across all events", color: "text-amber-400" },
  { icon: Lightbulb, text: "Suggest cost optimizations for upcoming events", color: "text-cyan-400" },
  { icon: Sparkles, text: "Create a risk assessment for Summer Music Festival", color: "text-pink-400" },
];

type Message = { role: "user" | "assistant"; content: string; timestamp: Date };

const botResponses: Record<string, string> = {
  "what events are happening this week?": "📅 This week you have:\n\n1. **NexGen Series X Launch** - Jul 7-9 at Grand Exhibit Hall (Planning phase)\n2. **Elite Awards Night 2026** - Jul 7 at The Royal Plaza (Pre-Event)\n\n💡 The NexGen launch has 3 overdue tasks in venue setup. Would you like me to escalate those?",
  "default": "I can help you with event planning, guest management, budget analysis, vendor coordination, and more. Try asking me about:\n\n• Event schedules and timelines\n• Guest lists and RSVP status\n• Budget summaries and forecasts\n• Vendor availability\n• Risk assessments\n• Team workload analysis",
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hello! I'm your AI Event Assistant. I can help you with event planning, guest management, budget analysis, and more. How can I assist you today?", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg, timestamp: new Date() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = botResponses[msg.toLowerCase()] || botResponses.default;
      setMessages((prev) => [...prev, { role: "assistant", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <div><h1 className="text-2xl font-bold text-slate-900">AI Event Assistant</h1><p className="text-sm text-slate-500 mt-0.5">Your intelligent event planning companion</p></div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === "user" ? "bg-gradient-to-br from-teal-500 to-purple-600" : "bg-gradient-to-br from-cyan-500/20 to-blue-500/20")}>
                {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className={cn("max-w-[70%] rounded-xl px-4 py-3", msg.role === "user" ? "bg-teal-600/20 border border-violet-500/20" : "bg-slate-100 border border-slate-200")}>
                <div className="text-sm text-slate-800 whitespace-pre-line">{msg.content}</div>
                <p className="text-[9px] text-slate-600 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"><Bot className="w-4 h-4 text-cyan-400" /></div>
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex gap-1"><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} /><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} /><span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} /></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-5 pb-3">
            <p className="text-xs text-slate-500 mb-2">Try asking:</p>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((s) => (
                <button key={s.text} onClick={() => handleSend(s.text)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-800 transition-colors border border-slate-200">
                  <s.icon className={cn("w-3 h-3", s.color)} /><span className="truncate max-w-[200px]">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-200/50">
          <div className="flex items-center gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your events..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-violet-500/50" />
            <button onClick={() => handleSend()} disabled={!input.trim()} className="p-2.5 bg-teal-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
