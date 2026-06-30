"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft, BookOpen, Check,
  Code2, Edit3, Layers, Loader2, Save, Zap,
} from "lucide-react";
import { COLORS, CARD_STYLE } from "./constants";
import {
  useGetSubtopicContentQuery,
  useUpdateSubtopicContentMutation,
} from "@/store/api/coursesApi";
import { ChatPanel } from "./ChatPanel";
import type { Course, Difficulty, SubTopic, SubtopicContent, QuizQuestion } from "./types";

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bg: string; icon: React.ElementType }> = {
  Beginner:     { color: "#2d8a4e", bg: "#e8f5e9", icon: BookOpen  },
  Intermediate: { color: COLORS.primary, bg: COLORS.primaryLight, icon: Layers },
  Advanced:     { color: "#b3261e", bg: "#fce4e0", icon: Zap       },
};

// ── Mermaid diagram renderer ───────────────────────────────────────────────────
function MermaidDiagram({ code, title }: { code: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ref.current || !code) return;
    let cancelled = false;

    import("mermaid").then((m) => {
      if (cancelled) return;
      m.default.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      m.default.render(id, code).then(({ svg }) => {
        if (cancelled) return;
        // Mermaid v11 resolves even on syntax errors — it embeds the error in the SVG
        if (/syntax error|mermaid-error|Syntax error/i.test(svg)) {
          setError("invalid syntax");
          return;
        }
        if (ref.current) ref.current.innerHTML = svg;
      }).catch((e) => {
        if (!cancelled) setError(String(e));
      });
    });

    return () => { cancelled = true; };
  }, [code]);

  return (
    <div>
      {title && (
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLORS.textFaint }}>
          {title}
        </p>
      )}
      {error ? (
        <div className="rounded-md border overflow-hidden" style={{ borderColor: COLORS.borderMuted }}>
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ background: COLORS.bgInput, color: COLORS.textFaint }}>
            Diagram source
          </div>
          <pre className="p-4 text-xs overflow-x-auto" style={{ background: "#fafaf9", color: COLORS.textMuted, fontFamily: "var(--font-mono)" }}>
            {code}
          </pre>
        </div>
      ) : (
        <div
          ref={ref}
          className="flex justify-center p-6 rounded-md border overflow-x-auto"
          style={{ borderColor: COLORS.borderMuted, background: "#fafaf9" }}
        />
      )}
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers]   = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function select(qi: number, oi: number) {
    if (revealed[qi]) return;
    setAnswers((a) => ({ ...a, [qi]: oi }));
  }

  function reveal(qi: number) {
    setRevealed((r) => ({ ...r, [qi]: true }));
  }

  const score = questions.filter((q, i) => revealed[i] && answers[i] === q.correct).length;

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const chosen   = answers[qi];
        const isRevealed = revealed[qi];

        return (
          <div key={qi} className="p-6 rounded-md border" style={{ borderColor: COLORS.borderMuted, background: "#fafaf9" }}>
            <p className="text-sm font-bold mb-4" style={{ color: COLORS.text }}>
              {qi + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen  = chosen === oi;
                const isCorrect = q.correct === oi;
                let borderColor: string = COLORS.border;
                let bg:          string = "#ffffff";
                let color:       string = COLORS.text;

                if (isRevealed) {
                  if (isCorrect) { borderColor = "#2d8a4e"; bg = "#e8f5e9"; color = "#2d8a4e"; }
                  else if (isChosen) { borderColor = "#b3261e"; bg = "#fce4e0"; color = "#b3261e"; }
                } else if (isChosen) {
                  borderColor = COLORS.primary; bg = COLORS.primaryLight; color = COLORS.primary;
                }

                return (
                  <button
                    key={oi}
                    onClick={() => select(qi, oi)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded border text-sm text-left transition-all"
                    style={{ borderColor, background: bg, color }}
                  >
                    <span
                      className="size-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold"
                      style={{ borderColor, color }}
                    >
                      {isRevealed && isCorrect ? <Check className="size-3" strokeWidth={3} /> : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!isRevealed && chosen !== undefined && (
              <button
                onClick={() => reveal(qi)}
                className="mt-4 h-8 px-4 rounded text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: COLORS.primary }}
              >
                Check Answer
              </button>
            )}

            {isRevealed && (
              <div className="mt-4 p-3 rounded text-xs" style={{ background: COLORS.bgSurface, color: COLORS.textMuted }}>
                <strong style={{ color: COLORS.text }}>Explanation: </strong>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(revealed).length === questions.length && (
        <div
          className="p-5 rounded-md text-center"
          style={{ background: COLORS.primaryLight, border: `1px solid ${COLORS.border}` }}
        >
          <p className="font-heading text-xl font-semibold mb-1" style={{ color: COLORS.primary }}>
            {score} / {questions.length} correct
          </p>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>
            {score === questions.length ? "Perfect score!" : score >= questions.length * 0.6 ? "Good work!" : "Review the material and try again."}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Code block ─────────────────────────────────────────────────────────────────
function CodeBlock({ language, code, title, explanation }: { language: string; code: string; title: string; explanation: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-md overflow-hidden border" style={{ borderColor: COLORS.borderMuted }}>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: "#2a2826", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <Code2 className="size-4" style={{ color: "#9e8e84" }} strokeWidth={1.8} />
          <span className="text-xs font-bold" style={{ color: "#e4dcd6" }}>{title}</span>
          {language && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: "rgba(255,255,255,0.08)", color: "#9e8e84" }}>
              {language}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className="text-[10px] font-bold uppercase tracking-[0.1em] transition-colors"
          style={{ color: copied ? "#2d8a4e" : "#9e8e84" }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-sm leading-relaxed" style={{ background: "#1e1c1a", color: "#e4dcd6", fontFamily: "var(--font-mono)" }}>
        <code>{code}</code>
      </pre>
      {explanation && (
        <div className="px-5 py-3 text-xs" style={{ background: "#fafaf9", color: COLORS.textMuted, borderTop: `1px solid ${COLORS.borderMuted}` }}>
          {explanation}
        </div>
      )}
    </div>
  );
}

// ── Admin editor ───────────────────────────────────────────────────────────────
function AdminEditor({
  content,
  courseId,
  order,
  onDone,
}: {
  content: SubtopicContent;
  courseId: string;
  order: number;
  onDone: () => void;
}) {
  const [raw, setRaw]       = useState(JSON.stringify(content, null, 2));
  const [error, setError]   = useState("");
  const [updateContent, { isLoading }] = useUpdateSubtopicContentMutation();

  async function save() {
    setError("");
    let parsed: SubtopicContent;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setError("Invalid JSON — please fix syntax errors before saving.");
      return;
    }
    try {
      await updateContent({ courseId, order, content: parsed }).unwrap();
      onDone();
    } catch {
      setError("Save failed. Please try again.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>
          Edit Content JSON
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onDone}
            className="h-8 px-4 rounded text-xs font-bold border transition-colors hover:bg-stone-50"
            style={{ borderColor: COLORS.border, color: COLORS.textMuted }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isLoading}
            className="flex items-center gap-1.5 h-8 px-4 rounded text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: COLORS.primary }}
          >
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" strokeWidth={2} />}
            Save
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs px-3 py-2 rounded" style={{ background: "#fce4e0", color: "#b3261e" }}>
          {error}
        </p>
      )}

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="w-full h-[60vh] p-5 rounded-md border text-xs font-mono resize-y focus:outline-none transition-all"
        style={{
          borderColor: COLORS.border,
          color: COLORS.text,
          background: "#ffffff",
          lineHeight: 1.7,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.primaryGlow}`; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
        spellCheck={false}
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
type Props = {
  course:    Course;
  subtopic:  SubTopic;
  isAdmin:   boolean;
  onBack:    () => void;
};

export function SubtopicContentView({ course, subtopic, isAdmin, onBack }: Props) {
  const [editing, setEditing] = useState(false);
  const cfg = DIFFICULTY_CONFIG[subtopic.difficulty] ?? DIFFICULTY_CONFIG.Intermediate;
  const Icon = cfg.icon;

  const { data, isLoading, isError } = useGetSubtopicContentQuery({
    courseId: course.id,
    order:    subtopic.order,
  });

  const content = data?.content;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin" style={{ color: COLORS.primary }} />
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="flex-1 px-8 py-8">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-medium" style={{ color: COLORS.textMuted }}>
          <ArrowLeft className="size-4" strokeWidth={2} /> Back
        </button>
        <div className="p-10 rounded-md border text-center" style={CARD_STYLE}>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>Content could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* ── Main content column ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-8">

      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: COLORS.textMuted }}
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        <span>Academy</span>
        <span style={{ color: COLORS.textFaint }}>/</span>
        <span style={{ color: COLORS.text }}>{course.topic}</span>
        <span style={{ color: COLORS.textFaint }}>/</span>
        <span style={{ color: COLORS.text }}>{subtopic.title}</span>
      </button>

      {/* Hero */}
      <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-md flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
            <Icon className="size-7" style={{ color: cfg.color }} strokeWidth={1.8} />
          </div>
          <div>
            <span
              className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {subtopic.difficulty}
            </span>
            <h1 className="font-heading text-4xl font-bold leading-tight" style={{ color: COLORS.text }}>
              {subtopic.title}
            </h1>
          </div>
        </div>

        {isAdmin && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 h-10 px-5 rounded text-sm font-bold border transition-colors hover:bg-stone-50 shrink-0"
            style={{ borderColor: COLORS.border, color: COLORS.primary }}
          >
            <Edit3 className="size-4" strokeWidth={2} />
            Edit Content
          </button>
        )}
      </div>

      {/* Admin editor */}
      {editing ? (
        <AdminEditor
          content={content}
          courseId={course.id}
          order={subtopic.order}
          onDone={() => setEditing(false)}
        />
      ) : (
        <div className="space-y-8">
          {/* Overview */}
          {content.overview && (
            <div className="p-6 rounded-md border" style={{ ...CARD_STYLE, borderLeft: `4px solid ${COLORS.primary}`, paddingLeft: "1.5rem" }}>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                {content.overview}
              </p>
            </div>
          )}

          {/* Theory */}
          {content.theory?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Theory</h2>
              </div>
              <div className="bg-white rounded-md p-6 border space-y-6" style={CARD_STYLE}>
                {content.theory.map((t, i) => (
                  <div key={i}>
                    {i > 0 && <hr className="mb-6" style={{ borderColor: COLORS.borderFaint }} />}
                    <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: COLORS.text }}>
                      {t.heading}
                    </h3>
                    <div className="prose-sm text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.body}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Diagrams */}
          {content.diagrams?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Layers className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Diagrams</h2>
              </div>
              <div className="bg-white rounded-md p-6 border space-y-8" style={CARD_STYLE}>
                {content.diagrams.map((d, i) => (
                  <div key={i}>
                    {i > 0 && <hr className="mb-8" style={{ borderColor: COLORS.borderFaint }} />}
                    <p className="text-xs mb-1" style={{ color: COLORS.textMuted }}>{d.description}</p>
                    <MermaidDiagram code={d.mermaid} title={d.title} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Code Examples */}
          {content.code_examples?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Code2 className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Code Examples</h2>
              </div>
              <div className="space-y-5">
                {content.code_examples.map((ex, i) => (
                  <CodeBlock key={i} {...ex} />
                ))}
              </div>
            </section>
          )}

          {/* Key Points */}
          {content.key_points?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Zap className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Key Takeaways</h2>
              </div>
              <div className="bg-white rounded-md p-6 border" style={CARD_STYLE}>
                <ul className="space-y-3">
                  {content.key_points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: COLORS.primaryLight }}
                      >
                        <Check className="size-3" style={{ color: COLORS.primary }} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm" style={{ color: COLORS.textMuted }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Quiz */}
          {content.quiz?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Zap className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.8} />
                <h2 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>Knowledge Check</h2>
              </div>
              <div className="bg-white rounded-md p-6 border" style={CARD_STYLE}>
                <QuizSection questions={content.quiz} />
              </div>
            </section>
          )}
        </div>
      )}
      </div>{/* end scrollable content column */}

      {/* AI tutor sidebar — hidden in edit mode */}
      {!editing && (
        <ChatPanel
          courseId={course.id}
          order={subtopic.order}
          subtopicTitle={subtopic.title}
        />
      )}
    </div>
  );
}
