"use client";

/**
 * Structured CV data used for rendering previews and exports.
 *
 * Critical invariants:
 * - The `experience` array should include the candidate's full relevant work history
 *   (no roles silently dropped by generation or layout steps).
 * - Each experience entry should have a clear `start_date` and an `end_date` (or a
 *   well-formed "Present" value) so recruiters and ATS can infer total years of
 *   experience and spot any genuine career gaps from the visible CV alone.
 */
export interface CVPreviewData {
  personal_info?: {
    full_name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  professional_summary?: string;
  experience?: Array<{
    job_title?: string;
    company?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    details?: string;
  }>;
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
    certifications?: string[];
  };
  interests?: string[] | string;
}

function clean(text: unknown): string {
  if (text == null) return "";
  if (Array.isArray(text)) return text.map(String).filter(Boolean).join(", ");
  return String(text).trim();
}

interface CvPreviewProps {
  data: CVPreviewData | Record<string, unknown>;
  pageLimit?: 1 | 2;
}

export function CvPreview({ data }: CvPreviewProps) {
  const cv = data as CVPreviewData;

  const computeTotalYearsExperience = (): number | null => {
    if (!cv.experience || cv.experience.length === 0) return null;

    const parseYearMonth = (value?: string) => {
      if (!value) return null;
      const trimmed = value.trim();
      if (!trimmed) return null;
      const lower = trimmed.toLowerCase();
      if (lower.includes("present")) {
        const now = new Date();
        return now.getFullYear() * 12 + (now.getMonth() + 1);
      }
      const [yearStr, monthStr] = trimmed.split(/[-/]/);
      const year = Number.parseInt(yearStr || "", 10);
      const month = monthStr ? Number.parseInt(monthStr, 10) : 1;
      if (!Number.isFinite(year)) return null;
      return year * 12 + (Number.isFinite(month) ? month : 1);
    };

    let minStart: number | null = null;
    let maxEnd: number | null = null;

    for (const exp of cv.experience) {
      const startScore = parseYearMonth(exp.start_date);
      const endScore = parseYearMonth(exp.end_date) ?? startScore;
      if (startScore != null) {
        minStart = minStart == null ? startScore : Math.min(minStart, startScore);
      }
      if (endScore != null) {
        maxEnd = maxEnd == null ? endScore : Math.max(maxEnd, endScore);
      }
    }

    if (minStart == null || maxEnd == null || maxEnd < minStart) return null;

    const months = maxEnd - minStart + 1;
    const years = months / 12;
    return Math.round(years);
  };

  const totalYears = computeTotalYearsExperience();

  const contactKeys = ["email", "phone", "location", "linkedin", "website"] as const;
  const contactParts = contactKeys
    .map((k) => cv.personal_info?.[k])
    .filter(Boolean)
    .map(clean);

  return (
    <div
      className="mx-auto max-w-[210mm] rounded-md border bg-white px-6 py-8 text-slate-800 shadow-sm print:shadow-none print:border-0"
      style={{ fontFamily: "Calibri, Helvetica, sans-serif" }}
    >
      {/* Name */}
      {cv.personal_info?.full_name && (
        <div className="mb-1">
          <h1 className="text-center text-3xl font-bold tracking-tight text-[#1E293B]">
            {clean(cv.personal_info.full_name)}
          </h1>
          {totalYears != null && totalYears > 0 && (
            <p className="mt-0.5 text-center text-xs font-medium uppercase tracking-wide text-[#475569]">
              {totalYears} years of experience
            </p>
          )}
        </div>
      )}

      {/* Contact */}
      {contactParts.length > 0 && (
        <p className="text-center text-sm text-[#64748B] mb-4">
          {contactParts.join("   |   ")}
        </p>
      )}

      {/* Horizontal rule */}
      <hr className="border-t border-slate-200 mb-6" />

      {/* Professional Summary - no header, summary only */}
      {cv.professional_summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed mb-0">
            {clean(cv.professional_summary)}
          </p>
        </section>
      )}

      {/* Experience */}
      {(cv.experience?.length ?? 0) > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#1E293B] mb-3 mt-4">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {cv.experience!.map((exp, i) => (
              <div key={i}>
                <p className="text-sm font-bold text-[#1E293B] mb-0.5">
                  {clean(exp.job_title)}
                  {exp.company ? `   |   ${clean(exp.company)}` : ""}
                </p>
                {(exp.location || exp.start_date || exp.end_date) && (
                  <p className="text-xs italic text-[#64748B] mb-2 -mt-0.5">
                    {[exp.location, [exp.start_date, exp.end_date].filter(Boolean).join(" – ")]
                      .filter(Boolean)
                      .join("   |   ")}
                  </p>
                )}
                <ul className="list-disc pl-5 space-y-1 text-sm mb-2">
                  {(exp.bullets || []).filter(Boolean).map((b, bi) => (
                    <li key={bi}>{clean(b)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {(cv.education?.length ?? 0) > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#1E293B] mb-3 mt-4">
            Education
          </h2>
          <div className="space-y-3">
            {cv.education!.map((edu, i) => (
              <div key={i}>
                <p className="text-sm font-bold text-[#1E293B] mb-0.5">
                  {clean(edu.degree)}
                  {edu.institution ? `   |   ${clean(edu.institution)}` : ""}
                </p>
                {(edu.start_date || edu.end_date) && (
                  <p className="text-xs italic text-[#64748B] mb-1">
                    {[edu.start_date, edu.end_date].filter(Boolean).join(" – ")}
                  </p>
                )}
                {edu.details && (
                  <p className="text-sm mb-0">{clean(edu.details)}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cv.skills &&
        (["technical", "soft", "languages", "certifications"] as const).some(
          (k) => (cv.skills![k]?.length ?? 0) > 0
        ) && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wide text-[#1E293B] mb-2 mt-4">
              Skills
            </h2>
            <div className="text-sm space-y-1">
              {(
                [
                  ["technical", "Technical"],
                  ["soft", "Soft Skills"],
                  ["languages", "Languages"],
                  ["certifications", "Certifications"],
                ] as const
              ).map(([key, label]) => {
                const items = cv.skills![key];
                const list = Array.isArray(items) ? items : items ? [items] : [];
                if (list.length === 0) return null;
                return (
                  <p key={key} className="mb-0">
                    <span className="font-bold">{label}: </span>
                    {list.map(clean).join(", ")}
                  </p>
                );
              })}
            </div>
          </section>
        )}

      {/* Interests */}
      {cv.interests != null && (Array.isArray(cv.interests) ? cv.interests.length > 0 : String(cv.interests).trim() !== "") && (
        <section className="mb-0">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#1E293B] mb-2 mt-4">
            Interests
          </h2>
          <p className="text-sm mb-0">
            {Array.isArray(cv.interests)
              ? cv.interests.map(clean).join(", ")
              : clean(cv.interests)}
          </p>
        </section>
      )}
    </div>
  );
}
