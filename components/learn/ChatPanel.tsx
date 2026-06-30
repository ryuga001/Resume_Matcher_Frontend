"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { COLORS } from "./constants";
import { useChatSubtopicMutation } from "@/store/api/coursesApi";

type Message = { role: "user" | "model"; content: string };

const SUGGESTIONS = [
  "Summarise the key concepts",
  "Give me a real-world example",
  "What should I focus on?",
];

const EXPANDED_WIDTH  = 384;
const COLLAPSED_WIDTH = 48;

type Props = {
  courseId:      string;
  order:         number;
  subtopicTitle: string;
};

export function ChatPanel({ courseId, order, subtopicTitle }: Props) {
  const [open,     setOpen]     = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLTextAreaElement>(null);

  const [chat, { isLoading }] = useChatSubtopicMutation();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    const userMsg: Message = { role: "user", content: msg };
    const next             = [...messages, userMsg];
    setMessages(next);
    setInput("");

    try {
      const res = await chat({ courseId, order, message: msg, history: messages }).unwrap();
      setMessages([...next, { role: "model", content: res.reply }]);
    } catch {
      setMessages([...next, {
        role:    "model",
        content: "Sorry, I couldn't answer that right now. Please try again.",
      }]);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <aside
      className="relative flex flex-col flex-shrink-0 border-l overflow-hidden"
      style={{
        width:      open ? `${EXPANDED_WIDTH}px` : `${COLLAPSED_WIDTH}px`,
        minWidth:   `${COLLAPSED_WIDTH}px`,
        borderColor: COLORS.border,
        background:  "#faf5ee",
        transition:  "width 280ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* ── Toggle tab — always visible ─────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={open ? "Collapse AI Tutor" : "Expand AI Tutor"}
        className="absolute top-1/2 -translate-y-1/2 -left-px z-10 flex flex-col items-center justify-center gap-1 transition-colors hover:opacity-80"
        style={{
          width:        "20px",
          height:       "72px",
          background:   "#ffffff",
          border:       `1px solid ${COLORS.border}`,
          borderRight:  "none",
          borderRadius: "8px 0 0 8px",
          color:        COLORS.primary,
        }}
      >
        {open
          ? <ChevronRight className="size-3.5" strokeWidth={2.5} />
          : <ChevronLeft  className="size-3.5" strokeWidth={2.5} />}
      </button>

      {/* ── Collapsed strip ──────────────────────────────────────────────── */}
      {!open && (
        <div
          className="flex flex-col items-center justify-center flex-1 gap-3 cursor-pointer select-none"
          onClick={() => setOpen(true)}
        >
          <div
            className="size-8 rounded-md flex items-center justify-center"
            style={{ background: COLORS.primaryLight }}
          >
            <Bot className="size-4" style={{ color: COLORS.primary }} strokeWidth={1.8} />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap"
            style={{
              color:     COLORS.primary,
              writingMode: "vertical-rl",
              transform:   "rotate(180deg)",
            }}
          >
            AI Tutor
          </span>
          {messages.length > 0 && (
            <span
              className="size-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: COLORS.primary }}
            >
              {messages.filter((m) => m.role === "model").length}
            </span>
          )}
        </div>
      )}

      {/* ── Expanded panel ───────────────────────────────────────────────── */}
      {open && (
        <>
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b shrink-0"
            style={{ borderColor: COLORS.border, background: "#ffffff" }}
          >
            <div
              className="size-10 rounded-md flex items-center justify-center shrink-0"
              style={{ background: COLORS.primaryLight }}
            >
              <Bot className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-xl font-semibold truncate" style={{ color: COLORS.text }}>
                AI Tutor
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>
                Always online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div
                  className="size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: COLORS.primaryLight }}
                >
                  <Bot className="size-4" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                </div>
                <div
                  className="px-4 py-3 text-sm leading-relaxed"
                  style={{ background: "#ffffff", color: COLORS.text, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", borderRadius: "0 18px 18px 18px" }}
                >
                  Hello! I'm your AI study assistant for <strong>{subtopicTitle}</strong>. Ask me anything — I'll answer based on the course content.
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className="size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={msg.role === "user" ? { background: COLORS.primary } : { background: COLORS.primaryLight }}
                >
                  {msg.role === "user"
                    ? <span className="text-[10px] font-bold text-white">You</span>
                    : <Bot className="size-4" style={{ color: COLORS.primary }} strokeWidth={1.8} />}
                </div>
                <div
                  className="max-w-[78%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? { background: COLORS.primary, color: "#ffffff", borderRadius: "18px 0 18px 18px" }
                      : { background: "#ffffff", color: COLORS.text, borderRadius: "0 18px 18px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div
                  className="size-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: COLORS.primaryLight }}
                >
                  <Bot className="size-4" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                </div>
                <div
                  className="px-4 py-3 flex items-center gap-1.5"
                  style={{ background: "#ffffff", borderRadius: "0 18px 18px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 rounded-full animate-bounce"
                      style={{ background: COLORS.primary, animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="shrink-0 px-4 py-4 border-t"
            style={{ borderColor: COLORS.border, background: "#ffffff" }}
          >
            <div
              className="flex items-end gap-2 rounded-md border p-2"
              style={{ borderColor: COLORS.border, background: COLORS.bg }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask a follow-up question…"
                rows={2}
                className="flex-1 bg-transparent border-none resize-none text-sm focus:outline-none placeholder:opacity-50"
                style={{ color: COLORS.text, lineHeight: 1.5 }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || isLoading}
                className="size-9 flex items-center justify-center rounded-md text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                style={{ background: COLORS.primary }}
              >
                {isLoading
                  ? <Loader2 className="size-4 animate-spin" />
                  : <Send className="size-4" strokeWidth={2} />}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={isLoading}
                  className="text-[10px] font-bold px-3 py-1.5 rounded border transition-colors hover:border-[#c2652a] hover:text-[#c2652a] disabled:opacity-40"
                  style={{ borderColor: COLORS.border, color: COLORS.textMuted }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
