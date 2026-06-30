"use client";

import type { StructuredResume } from "@/components/resumes/types";

const C = {
  text:    "#1a1917",
  muted:   "#5a5550",
  accent:  "#c2652a",
  rule:    "#e4dcd6",
  bg:      "#ffffff",
};

type Props = { data: StructuredResume };

export function ResumeLivePreview({ data }: Props) {
  const { contact, summary, experience, education, skills, projects, certifications } = data;

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: "#f5ede4", padding: "24px" }}
    >
      {/* A4-ish page */}
      <div
        id="resume-preview-page"
        style={{
          background: C.bg,
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "40px 44px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: "12px",
          lineHeight: "1.55",
          color: C.text,
          boxShadow: "0 4px 32px rgba(26,25,23,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: C.text }}>
            {contact.name || "Your Name"}
          </h1>
          <p style={{ fontSize: "10px", color: C.muted, marginTop: "4px" }}>
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.github]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        </div>

        <Hr />

        {/* Summary */}
        {summary && <Section title="Summary"><p style={{ margin: 0 }}>{summary}</p></Section>}

        {/* Experience */}
        {experience?.length > 0 && (
          <Section title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "12px", color: C.text }}>{exp.title} — {exp.company}</strong>
                  <span style={{ fontSize: "10px", color: C.muted, whiteSpace: "nowrap", marginLeft: "8px" }}>
                    {exp.startDate} – {exp.endDate || "Present"}
                  </span>
                </div>
                <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                  {(exp.bullets || []).map((b, i) => (
                    <li key={i} style={{ marginBottom: "2px", color: C.text }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <Section title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong style={{ fontSize: "12px", color: C.text }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </strong>
                  <span style={{ fontSize: "10px", color: C.muted, marginLeft: "8px" }}>
                    {edu.graduationDate}
                  </span>
                </div>
                <p style={{ margin: "1px 0 0 0", color: C.muted, fontSize: "11px" }}>
                  {edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <Section title="Skills">
            <p style={{ margin: 0 }}>{skills.join(",  ")}</p>
          </Section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <Section title="Projects">
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "8px" }}>
                <strong style={{ fontSize: "12px", color: C.text }}>
                  {proj.name}
                  {proj.url && (
                    <span style={{ color: C.accent, fontWeight: 400, fontSize: "10px", marginLeft: "8px" }}>
                      {proj.url}
                    </span>
                  )}
                </strong>
                {proj.description && <p style={{ margin: "2px 0", color: C.muted }}>{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <p style={{ margin: "2px 0", color: C.muted, fontStyle: "italic", fontSize: "11px" }}>
                    {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <Section title="Certifications">
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {certifications.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p
        style={{
          fontSize: "8.5px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#c2652a",
          margin: "0 0 3px 0",
        }}
      >
        {title}
      </p>
      <div
        style={{
          borderTop: "0.5px solid #e4dcd6",
          paddingTop: "6px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Hr() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "0.5px solid #e4dcd6",
        margin: "12px 0",
      }}
    />
  );
}
