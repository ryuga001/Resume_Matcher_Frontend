"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import type {
  StructuredResume,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
} from "@/components/resumes/types";

const COLORS = {
  primary:   "#c2652a",
  text:      "#2a2826",
  textMuted: "#6e6862",
  border:    "#e4dcd6",
  bg:        "#fdfcfb",
  bgSurface: "#f5ede4",
};

type Props = {
  data: StructuredResume;
  onUpdateContact:        (field: string, value: string) => void;
  onUpdateSummary:        (value: string) => void;
  onUpdateExperience:     (entries: ExperienceEntry[]) => void;
  onUpdateEducation:      (entries: EducationEntry[]) => void;
  onUpdateSkills:         (skills: string[]) => void;
  onUpdateProjects:       (entries: ProjectEntry[]) => void;
  onUpdateCertifications: (certs: string[]) => void;
};

type Section = "contact" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications";

function useAccordion(initial: Section = "contact") {
  const [open, setOpen] = useState<Section>(initial);
  return { open, toggle: (s: Section) => setOpen((prev) => (prev === s ? "contact" : s)) };
}

function AccordionItem({
  id, label, open, onToggle, children,
}: { id: Section; label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b" style={{ borderColor: COLORS.border }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: open ? COLORS.primary : COLORS.textMuted }}>
          {label}
        </span>
        {open
          ? <ChevronDown className="size-3.5" style={{ color: COLORS.primary }} />
          : <ChevronRight className="size-3.5" style={{ color: COLORS.textMuted }} />
        }
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Field({
  label, value, onChange, multiline = false, placeholder = "",
}: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "12px",
    padding: "6px 8px",
    borderRadius: "4px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.text,
    outline: "none",
    resize: multiline ? "vertical" : undefined,
    boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <label className="text-[10px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: COLORS.textMuted }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

export function ResumeEditorPanel({
  data,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience,
  onUpdateEducation,
  onUpdateSkills,
  onUpdateProjects,
  onUpdateCertifications,
}: Props) {
  const { open, toggle } = useAccordion("contact");
  const { contact, summary, experience, education, skills, projects, certifications } = data;

  // ── Experience helpers ─────────────────────────────────────────────────────

  const addExp = () => {
    const id = Math.random().toString(36).slice(2, 8);
    onUpdateExperience([{ id, company: "", title: "", startDate: "", endDate: "Present", bullets: [""] }, ...experience]);
  };
  const removeExp = (id: string) => onUpdateExperience(experience.filter((e) => e.id !== id));
  const setExpField = (id: string, field: keyof ExperienceEntry, value: string) =>
    onUpdateExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const setBullet = (expId: string, idx: number, value: string) =>
    onUpdateExperience(experience.map((e) =>
      e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) } : e
    ));
  const addBullet = (expId: string) =>
    onUpdateExperience(experience.map((e) =>
      e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
    ));
  const removeBullet = (expId: string, idx: number) =>
    onUpdateExperience(experience.map((e) =>
      e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e
    ));

  // ── Education helpers ──────────────────────────────────────────────────────

  const addEdu = () => {
    const id = Math.random().toString(36).slice(2, 8);
    onUpdateEducation([...education, { id, institution: "", degree: "", field: "", graduationDate: "", gpa: "" }]);
  };
  const removeEdu = (id: string) => onUpdateEducation(education.filter((e) => e.id !== id));
  const setEduField = (id: string, field: keyof EducationEntry, value: string) =>
    onUpdateEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  // ── Projects helpers ───────────────────────────────────────────────────────

  const addProj = () => {
    const id = Math.random().toString(36).slice(2, 8);
    onUpdateProjects([...projects, { id, name: "", description: "", technologies: [], url: "" }]);
  };
  const removeProj = (id: string) => onUpdateProjects(projects.filter((p) => p.id !== id));
  const setProjField = (id: string, field: keyof ProjectEntry, value: string | string[]) =>
    onUpdateProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const addButton = (onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-bold mt-2 hover:opacity-70 transition-opacity"
      style={{ color: COLORS.primary }}
    >
      <Plus className="size-3" /> Add
    </button>
  );

  const removeButton = (onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="size-5 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
      style={{ color: "#b3261e" }}
    >
      <Trash2 className="size-3" />
    </button>
  );

  const entryHeader = (label: string, onRemove: () => void) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>{label}</span>
      {removeButton(onRemove)}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-white border-r" style={{ borderColor: COLORS.border }}>

      {/* Contact */}
      <AccordionItem id="contact" label="Contact" open={open === "contact"} onToggle={() => toggle("contact")}>
        <Field label="Full Name"  value={contact.name     ?? ""} onChange={(v) => onUpdateContact("name",     v)} />
        <Field label="Email"      value={contact.email    ?? ""} onChange={(v) => onUpdateContact("email",    v)} />
        <Field label="Phone"      value={contact.phone    ?? ""} onChange={(v) => onUpdateContact("phone",    v)} />
        <Field label="Location"   value={contact.location ?? ""} onChange={(v) => onUpdateContact("location", v)} />
        <Field label="LinkedIn"   value={contact.linkedin ?? ""} onChange={(v) => onUpdateContact("linkedin", v)} />
        <Field label="GitHub"     value={contact.github   ?? ""} onChange={(v) => onUpdateContact("github",   v)} />
      </AccordionItem>

      {/* Summary */}
      <AccordionItem id="summary" label="Summary" open={open === "summary"} onToggle={() => toggle("summary")}>
        <Field label="Professional summary" value={summary ?? ""} onChange={onUpdateSummary} multiline placeholder="Write a brief professional summary…" />
      </AccordionItem>

      {/* Experience */}
      <AccordionItem id="experience" label="Experience" open={open === "experience"} onToggle={() => toggle("experience")}>
        {experience.map((exp, idx) => (
          <div key={exp.id} style={{ marginBottom: "16px", padding: "10px", background: "#faf8f6", borderRadius: "4px", border: `1px solid ${COLORS.border}` }}>
            {entryHeader(`Position ${idx + 1}`, () => removeExp(exp.id))}
            <Field label="Job title"   value={exp.title     ?? ""} onChange={(v) => setExpField(exp.id, "title",     v)} />
            <Field label="Company"     value={exp.company   ?? ""} onChange={(v) => setExpField(exp.id, "company",   v)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <Field label="Start date" value={exp.startDate ?? ""} onChange={(v) => setExpField(exp.id, "startDate", v)} />
              <Field label="End date"   value={exp.endDate   ?? ""} onChange={(v) => setExpField(exp.id, "endDate",   v)} placeholder="Present" />
            </div>
            <label className="text-[10px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: COLORS.textMuted }}>Bullets</label>
            {exp.bullets.map((b, bi) => (
              <div key={bi} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                <input
                  type="text"
                  value={b}
                  placeholder={`Achievement ${bi + 1}…`}
                  onChange={(e) => setBullet(exp.id, bi, e.target.value)}
                  style={{ flex: 1, fontSize: "12px", padding: "5px 7px", borderRadius: "4px", border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, outline: "none" }}
                />
                {exp.bullets.length > 1 && removeButton(() => removeBullet(exp.id, bi))}
              </div>
            ))}
            <button type="button" onClick={() => addBullet(exp.id)} className="text-xs mt-1 hover:opacity-70" style={{ color: COLORS.primary }}>+ bullet</button>
          </div>
        ))}
        {addButton(addExp)}
      </AccordionItem>

      {/* Education */}
      <AccordionItem id="education" label="Education" open={open === "education"} onToggle={() => toggle("education")}>
        {education.map((edu, idx) => (
          <div key={edu.id} style={{ marginBottom: "12px", padding: "10px", background: "#faf8f6", borderRadius: "4px", border: `1px solid ${COLORS.border}` }}>
            {entryHeader(`Entry ${idx + 1}`, () => removeEdu(edu.id))}
            <Field label="Institution"  value={edu.institution    ?? ""} onChange={(v) => setEduField(edu.id, "institution",    v)} />
            <Field label="Degree"       value={edu.degree         ?? ""} onChange={(v) => setEduField(edu.id, "degree",         v)} />
            <Field label="Field"        value={edu.field          ?? ""} onChange={(v) => setEduField(edu.id, "field",          v)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <Field label="Grad date"  value={edu.graduationDate ?? ""} onChange={(v) => setEduField(edu.id, "graduationDate", v)} />
              <Field label="GPA"        value={edu.gpa            ?? ""} onChange={(v) => setEduField(edu.id, "gpa",            v)} />
            </div>
          </div>
        ))}
        {addButton(addEdu)}
      </AccordionItem>

      {/* Skills */}
      <AccordionItem id="skills" label="Skills" open={open === "skills"} onToggle={() => toggle("skills")}>
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: COLORS.textMuted }}>
          Comma-separated
        </label>
        <textarea
          rows={4}
          value={skills.join(", ")}
          onChange={(e) =>
            onUpdateSkills(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
          }
          style={{ width: "100%", fontSize: "12px", padding: "6px 8px", borderRadius: "4px", border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, outline: "none", resize: "vertical", boxSizing: "border-box" }}
          placeholder="React, TypeScript, Python…"
        />
      </AccordionItem>

      {/* Projects */}
      <AccordionItem id="projects" label="Projects" open={open === "projects"} onToggle={() => toggle("projects")}>
        {projects.map((proj, idx) => (
          <div key={proj.id} style={{ marginBottom: "12px", padding: "10px", background: "#faf8f6", borderRadius: "4px", border: `1px solid ${COLORS.border}` }}>
            {entryHeader(`Project ${idx + 1}`, () => removeProj(proj.id))}
            <Field label="Name"         value={proj.name        ?? ""} onChange={(v) => setProjField(proj.id, "name",        v)} />
            <Field label="Description"  value={proj.description ?? ""} onChange={(v) => setProjField(proj.id, "description", v)} multiline />
            <Field label="URL"          value={proj.url         ?? ""} onChange={(v) => setProjField(proj.id, "url",         v)} />
            <Field
              label="Technologies (comma-separated)"
              value={(proj.technologies ?? []).join(", ")}
              onChange={(v) => setProjField(proj.id, "technologies", v.split(",").map((s) => s.trim()).filter(Boolean))}
            />
          </div>
        ))}
        {addButton(addProj)}
      </AccordionItem>

      {/* Certifications */}
      <AccordionItem id="certifications" label="Certifications" open={open === "certifications"} onToggle={() => toggle("certifications")}>
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] block mb-1" style={{ color: COLORS.textMuted }}>
          One per line
        </label>
        <textarea
          rows={4}
          value={certifications.join("\n")}
          onChange={(e) => onUpdateCertifications(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          style={{ width: "100%", fontSize: "12px", padding: "6px 8px", borderRadius: "4px", border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, outline: "none", resize: "vertical", boxSizing: "border-box" }}
          placeholder="AWS Solutions Architect&#10;Google Cloud Professional"
        />
      </AccordionItem>
    </div>
  );
}
