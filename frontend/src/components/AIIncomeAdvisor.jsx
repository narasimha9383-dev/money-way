// src/components/AIIncomeAdvisor.jsx
// Section 24: AI response — use skeleton/fade-in, NOT fake typing animation
// Section 5: No fake earning claims in advisor responses
// Section 3: Source-first — advisor explicitly states when info is unverified

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  ShieldCheck,
  Info
} from 'lucide-react';
import { chatAdvisor } from '../services/api.js';

// Skeleton loader for incoming bot message (Section 24 — no fake typing)
function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="max-w-[82%] space-y-2 flex-1">
        <div className="p-4 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 space-y-2">
          <div className="h-3 bg-slate-800 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-slate-800 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-800 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-slate-800 rounded animate-pulse w-2/3" />
        </div>
      </div>
    </div>
  );
}

// Individual message bubble with fade-in animation (Section 24)
function MessageBubble({ msg, onPromptClick }) {
  return (
    <div
      className={`flex items-start gap-3 animate-in fade-in duration-300 ${
        msg.sender === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          msg.sender === 'user'
            ? 'bg-emerald-500 text-slate-950'
            : 'bg-slate-800 text-emerald-400 border border-slate-700'
        }`}
      >
        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className="max-w-[82%] space-y-3">
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            msg.sender === 'user'
              ? 'bg-emerald-600 text-white rounded-tr-none'
              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
          }`}
        >
          {msg.text}

          {msg.source && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Advisor · Powered by {msg.source}</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        {msg.prompts && msg.prompts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {msg.prompts.map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => onPromptClick(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 hover:border-emerald-500/50 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIIncomeAdvisor({ userProfile, onSelectOpportunityId }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I am your Money Way AI Advisor.\n\nI have your profile constraints loaded:\n• Budget: ${userProfile?.budget || '₹0'}\n• Time: ${userProfile?.availableTime || '2 hours/day'}\n• Country: ${userProfile?.country || 'India'}\n\nI can help you explore verified income pathways. My responses are based on the verified opportunity database — if something is unknown, I will say so.\n\nWhat would you like to explore?`,
      prompts: [
        "I have ₹0 budget and 2 hours a day",
        "I know Python — what can I do from home?",
        "I want to work alone without talking to customers",
        "What can I start this week with zero capital?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || inputText).trim();
    if (!textToSend || loading) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await chatAdvisor(textToSend, userProfile);
      const botMessage = {
        sender: 'bot',
        text: response.reply,
        prompts: response.suggestedPrompts || [],
        matchedOpportunities: response.matchedOpportunities || [],
        source: response.source || null,
        isLlmPowered: response.isLlmPowered || false
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I encountered an error connecting to the advice engine. Please verify the backend server is active on port 5000."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-900">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profile-Aware · Verified Database</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Ask the Income Advisor</h1>
        <p className="text-xs text-slate-400">
          Responses are based on verified platform data. The advisor will not invent opportunities, platforms, or income claims.
        </p>
      </div>

      {/* Accuracy disclaimer banner */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Accuracy policy:</strong> If a reliable answer is not available, the advisor
          will say <em>"Information could not be verified."</em> No fake platforms, no guaranteed income figures,
          no invented statistics.
        </span>
      </div>

      {/* Chat Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden" style={{ height: '520px' }}>
        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} msg={msg} onPromptClick={handleSend} />
          ))}

          {/* Skeleton loader while waiting (Section 24 — skeleton, not fake typing) */}
          {loading && <MessageSkeleton />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g. 'I have no laptop', 'weekend only', 'I know React')…"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              aria-label="Ask the income advisor"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold disabled:opacity-50 transition-colors shadow-md shadow-emerald-500/20"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-600 mt-1.5 text-center">
            Responses are rule-based and draw from the verified opportunity database only.
          </p>
        </div>
      </div>
    </div>
  );
}
