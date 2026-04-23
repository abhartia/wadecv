"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, User, Briefcase, GraduationCap, Wrench, Heart } from "lucide-react";
import { trackCvSectionEdited } from "@/lib/analytics/events";

interface CVData {
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
  interests?: string[];
}

interface CVEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function CVEditor({ data, onChange }: CVEditorProps) {
  const cv = data as unknown as CVData;
  const syncKey = useMemo(
    () => JSON.stringify({ s: cv.skills, i: cv.interests }),
    [cv.skills, cv.interests],
  );
  return <CVEditorInner key={syncKey} data={data} onChange={onChange} />;
}

function CVEditorInner({ data, onChange }: CVEditorProps) {
  const cv = data as unknown as CVData;

  const [skillsInput, setSkillsInput] = useState<
    Record<"technical" | "soft" | "languages" | "certifications", string>
  >({
    technical: (cv.skills?.technical || []).join(", "),
    soft: (cv.skills?.soft || []).join(", "),
    languages: (cv.skills?.languages || []).join(", "),
    certifications: (cv.skills?.certifications || []).join(", "),
  });

  const [interestsInput, setInterestsInput] = useState<string>((cv.interests || []).join(", "));

  // No useEffect: when cv.skills/cv.interests change, parent remounts us via key so state re-initializes above.

  const update = (path: string[], value: unknown) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] === undefined) {
        current[path[i]] = typeof path[i + 1] === "number" ? [] : {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(newData);
    const section = path[0];
    if (typeof section === "string") {
      trackCvSectionEdited(section);
    }
  };

  const addExperience = () => {
    const existing = [...(cv.experience || [])];
    const next = {
      job_title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      bullets: [""],
    };
    // New entries are appended, but we will render experience in reverse-chronological
    // order when mapping below so earlier roles remain visible and scannable.
    update(["experience"], [...existing, next]);
  };

  const removeExperience = (idx: number) => {
    const exp = [...(cv.experience || [])];
    exp.splice(idx, 1);
    update(["experience"], exp);
  };

  const addBullet = (expIdx: number) => {
    const exp = JSON.parse(JSON.stringify(cv.experience || []));
    exp[expIdx].bullets = [...(exp[expIdx].bullets || []), ""];
    update(["experience"], exp);
  };

  const removeBullet = (expIdx: number, bulletIdx: number) => {
    const exp = JSON.parse(JSON.stringify(cv.experience || []));
    exp[expIdx].bullets.splice(bulletIdx, 1);
    update(["experience"], exp);
  };

  const addEducation = () => {
    const edu = [
      ...(cv.education || []),
      { degree: "", institution: "", location: "", start_date: "", end_date: "", details: "" },
    ];
    update(["education"], edu);
  };

  const removeEducation = (idx: number) => {
    const edu = [...(cv.education || [])];
    edu.splice(idx, 1);
    update(["education"], edu);
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={cv.personal_info?.full_name || ""}
                onChange={(e) => update(["personal_info", "full_name"], e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={cv.personal_info?.email || ""}
                onChange={(e) => update(["personal_info", "email"], e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={cv.personal_info?.phone || ""}
                onChange={(e) => update(["personal_info", "phone"], e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={cv.personal_info?.location || ""}
                onChange={(e) => update(["personal_info", "location"], e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input
                value={cv.personal_info?.linkedin || ""}
                onChange={(e) => update(["personal_info", "linkedin"], e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={cv.personal_info?.website || ""}
                onChange={(e) => update(["personal_info", "website"], e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            value={cv.professional_summary || ""}
            onChange={(e) => update(["professional_summary"], e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5" /> Experience
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addExperience}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Include your full relevant work history with clear start and end dates for each role so
            recruiters and ATS can see your total years of experience.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {(cv.experience || [])
            .map((exp, i) => ({ exp, index: i }))
            .sort((a, b) => {
              const parseYearMonth = (value?: string) => {
                if (!value) return null;
                const trimmed = value.trim();
                if (!trimmed) return null;
                // Try to parse formats like YYYY-MM or YYYY
                const [yearStr, monthStr] = trimmed.split(/[-/]/);
                const year = Number.parseInt(yearStr || "", 10);
                const month = monthStr ? Number.parseInt(monthStr, 10) : 1;
                if (!Number.isFinite(year)) return null;
                return year * 12 + (Number.isFinite(month) ? month : 1);
              };
              const score = (item: {
                exp: NonNullable<CVData["experience"]>[number];
                index: number;
              }) => {
                const endScore =
                  item.exp.end_date && item.exp.end_date.toLowerCase().includes("present")
                    ? Number.POSITIVE_INFINITY
                    : (parseYearMonth(item.exp.end_date) ?? parseYearMonth(item.exp.start_date));
                // Fallback to index order if no dates
                return endScore ?? item.index;
              };
              return score(b) - score(a);
            })
            .map(({ exp, index: i }) => (
              <div key={i} className="space-y-4">
                {i > 0 && <Separator />}
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={exp.job_title || ""}
                        onChange={(e) =>
                          update(["experience", String(i), "job_title"], e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company || ""}
                        onChange={(e) =>
                          update(["experience", String(i), "company"], e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={exp.location || ""}
                        onChange={(e) =>
                          update(["experience", String(i), "location"], e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <div className="space-y-2 flex-1">
                          <Label>
                            Start Date <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            placeholder="YYYY-MM (required)"
                            value={exp.start_date || ""}
                            onChange={(e) =>
                              update(["experience", String(i), "start_date"], e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2 flex-1">
                          <Label>End Date</Label>
                          <Input
                            placeholder="YYYY-MM or Present"
                            value={exp.end_date || ""}
                            onChange={(e) =>
                              update(["experience", String(i), "end_date"], e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use a consistent format (e.g. 2019-06) and the word Present for your current
                        role so your total experience is clear.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-destructive"
                    onClick={() => removeExperience(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Bullet Points</Label>
                    <Button variant="ghost" size="sm" onClick={() => addBullet(i)}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add bullet
                    </Button>
                  </div>
                  {(exp.bullets || []).map((bullet, bi) => (
                    <div key={bi} className="flex gap-2">
                      <Textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => {
                          const newExp = JSON.parse(JSON.stringify(cv.experience));
                          newExp[i].bullets[bi] = e.target.value;
                          update(["experience"], newExp);
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive shrink-0"
                        onClick={() => removeBullet(i, bi)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5" /> Education
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {(cv.education || []).map((edu, i) => (
            <div key={i} className="space-y-4">
              {i > 0 && <Separator />}
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree || ""}
                      onChange={(e) => update(["education", String(i), "degree"], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution || ""}
                      onChange={(e) =>
                        update(["education", String(i), "institution"], e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="space-y-2 flex-1">
                      <Label>Start Date</Label>
                      <Input
                        value={edu.start_date || ""}
                        onChange={(e) =>
                          update(["education", String(i), "start_date"], e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>End Date</Label>
                      <Input
                        value={edu.end_date || ""}
                        onChange={(e) =>
                          update(["education", String(i), "end_date"], e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Details</Label>
                    <Input
                      value={edu.details || ""}
                      onChange={(e) => update(["education", String(i), "details"], e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-destructive"
                  onClick={() => removeEducation(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5" /> Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(["technical", "soft", "languages", "certifications"] as const).map((category) => (
            <div key={category} className="space-y-2">
              <Label className="capitalize">{category === "soft" ? "Soft Skills" : category}</Label>
              <Textarea
                rows={2}
                placeholder={`Comma-separated ${category} skills...`}
                value={skillsInput[category] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSkillsInput((prev) => ({ ...prev, [category]: value }));
                  const items = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  update(["skills", category], items);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5" /> Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={2}
            placeholder="Comma-separated interests, e.g. Running, open-source, photography"
            value={interestsInput}
            onChange={(e) => {
              const value = e.target.value;
              setInterestsInput(value);
              const items = value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              update(["interests"], items.length ? items : []);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
