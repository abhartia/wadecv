"use client";

import { useState, useCallback, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api, ApiError, CVGenerationProgressEvent, CVGenerationStage } from "@/lib/api";
import {
  trackCvDownload,
  trackCvEmailSent,
  trackCvImportFailure,
  trackCvImportStarted,
  trackCvImportSuccess,
  trackCvSectionEdited,
  trackCvTailorApplied,
  trackCvTailorStarted,
  trackDashboardViewed,
  trackFeatureClicked,
  trackJobScrapeFailure,
  trackJobScrapeStarted,
  trackJobScrapeSuccess,
} from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Upload, FileText, Briefcase, Wand2, Edit3, Download, Loader2, ArrowLeft, ArrowRight, Link2, Globe, Coins, UserCheck, Settings, Target, CheckCircle2, AlertTriangle, RefreshCw, Mail, ChevronDown } from "lucide-react";
import { CVEditor } from "@/components/cv-editor/cv-editor";
import { CvPreview } from "@/components/cv-preview/cv-preview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

type FitAnalysis = { fit_score: number; strengths: string[]; gaps: string[] };
type Step = "upload" | "enhance" | "job" | "generate" | "fit" | "edit" | "cover_letter" | "download";

const ALL_STEPS: Step[] = ["upload", "enhance", "job", "generate", "fit", "edit", "cover_letter", "download"];
const PROFILE_STEPS: Step[] = ["job", "generate", "fit", "edit", "cover_letter", "download"];

const STEP_LABELS: Record<Step, string> = {
  upload: "Upload CV", enhance: "Add Info", job: "Job Details",
  generate: "Generate", fit: "Fit Analysis", edit: "Edit",
  cover_letter: "Cover Letter", download: "Download",
};
const STEP_ICONS: Record<Step, React.ElementType> = {
  upload: Upload, enhance: Edit3, job: Briefcase,
  generate: Wand2, fit: Target, edit: FileText,
  cover_letter: Mail, download: Download,
};

const STAGE_ORDER: CVGenerationStage[] = [
  "start",
  "setup",
  "scraping_job",
  "job_metadata",
  "deduct_credit",
  "first_pass_generation",
  "layout_feedback",
  "second_pass_generation",
  "saving",
  "done",
];

const STAGE_LABELS: Record<CVGenerationStage, string> = {
  start: "Starting",
  setup: "Preparing your details",
  scraping_job: "Reading the job URL",
  job_metadata: "Extracting job title & company",
  deduct_credit: "Checking and deducting a credit",
  first_pass_generation: "Generating tailored CV & fit analysis",
  layout_feedback: "Reviewing layout and page length",
  second_pass_generation: "Applying layout tweaks",
  saving: "Saving your CV and job",
  done: "Finished",
  error: "Error",
};

const isLinkedInJobUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("linkedin.com");
  } catch {
    return url.toLowerCase().includes("linkedin.com");
  }
};

function TailorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, refreshUser } = useAuth();
  const jobParam = searchParams.get("job");
  const hasProfile = user?.has_profile ?? false;
  const [profileFlow] = useState<boolean>(() => hasProfile);
  const steps = profileFlow ? PROFILE_STEPS : ALL_STEPS;

  const [step, setStep] = useState<Step>(() => (jobParam ? "edit" : profileFlow ? "job" : "upload"));
  const [file, setFile] = useState<File | null>(null);
  const [cvId, setCvId] = useState(searchParams.get("cv") || "");
  const [originalContent, setOriginalContent] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobId, setJobId] = useState("");
  const [cvData, setCvData] = useState<Record<string, unknown> | null>(null);
  const [fitAnalysis, setFitAnalysis] = useState<FitAnalysis | null>(null);
  const [gapFeedback, setGapFeedback] = useState<Record<string, string>>({});
  const [coverLetterContent, setCoverLetterContent] = useState("");
  const [coverLetterGenerated, setCoverLetterGenerated] = useState(false);
  const [pageLimit, setPageLimit] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [clLoading, setClLoading] = useState(false);
  const [clDownloadLoading, setClDownloadLoading] = useState(false);
  const [clSaving, setClSaving] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<CVGenerationStage | null>(null);
  const [generationEvents, setGenerationEvents] = useState<
    { id: number; stage: CVGenerationStage; message: string }[]
  >([]);

  const stepIdx = steps.indexOf(step);
  const progress = ((stepIdx + 1) / steps.length) * 100;

  const latestGenerationMessage =
    generationEvents.length > 0
      ? generationEvents[generationEvents.length - 1]?.message
      : null;

  const startNewApplication = () => {
    // Clear URL-based job context so we don't immediately reload the old application
    if (searchParams.get("job")) {
      router.push("/tailor");
    }

    // Reset all local state for a fresh flow
    setStep(profileFlow ? "job" : "upload");
    setFile(null);
    setCvId("");
    setOriginalContent("");
    setAdditionalInfo("");
    setJobUrl("");
    setJobDescription("");
    setJobId("");
    setCvData(null);
    setFitAnalysis(null);
    setGapFeedback({});
    setCoverLetterContent("");
    setCoverLetterGenerated(false);
    setPageLimit((user?.cv_page_limit === 1 || user?.cv_page_limit === 2) ? user.cv_page_limit : 1);
    setLoading(false);
    setDownloadLoading(false);
    setRefining(false);
    setScraping(false);
    setClLoading(false);
    setClSaving(false);
    setScrapeError(null);

    trackFeatureClicked("start_new_application");
  };

  useEffect(() => {
    trackDashboardViewed();
    const preferred = user?.cv_page_limit;
    if (preferred === 1 || preferred === 2) setPageLimit(preferred);
  }, [user?.cv_page_limit]);

  // When opened for an existing application (?job=...), load job, CV and cover letter
  useEffect(() => {
    if (!token || !jobParam) return;

    const loadExistingApplication = async () => {
      try {
        const job = await api.getJob(jobParam, token);
        const cv = await api.getCV(job.cv_id, token);

        setCvId(cv.id);
        setJobId(job.id);
        setJobDescription(job.job_description);
        setJobUrl(job.job_url ?? "");
        setCvData(cv.generated_cv_data);
        setFitAnalysis(cv.fit_analysis as FitAnalysis | null);
        if (cv.page_limit === 1 || cv.page_limit === 2) {
          setPageLimit(cv.page_limit);
        }

        // Try to load existing cover letter; ignore 404
        try {
          const existingCl = await api.getCoverLetter(job.id, token);
          setCoverLetterContent(existingCl.content);
          setCoverLetterGenerated(true);
        } catch {
          // no cover letter yet, that's fine
        }

        // Ensure we land on edit step once data is loaded
        setStep("edit");
      } catch (err) {
        toast.error((err as Error).message || "Failed to load application");
      }
    };

    void loadExistingApplication();
  }, [jobParam, token]);

  const handleUpload = useCallback(async () => {
    if (!file || !token) return;
    trackCvImportStarted("upload");
    setLoading(true);
    try {
      const result = await api.uploadCV(file, token);
      setCvId(result.id);
      setOriginalContent(result.original_content);
      await refreshUser();
      setStep("enhance");
      toast.success("CV uploaded successfully!");
      trackCvImportSuccess("upload");
    } catch (err: unknown) {
      trackCvImportFailure("upload", (err as Error).name || "error");
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }, [file, token, refreshUser]);

  const handleScrape = async () => {
    if (!jobUrl || !token) return;
    setScrapeError(null);
    if (isLinkedInJobUrl(jobUrl)) {
      const message = "LinkedIn job URLs can't be scraped automatically. Please paste the full job description into the box below.";
      setScrapeError(message);
      toast.error(message);
      return;
    }
    setScraping(true);
    trackJobScrapeStarted();
    try {
      const result = await api.scrapeJob(jobUrl, token);
      const success = result.success ?? true;
      // Always put the returned job_description into the box (backend sends cleaned when available)
      if (result.job_description) {
        setJobDescription(result.job_description);
      }
      if (success) {
        toast.success("Job description extracted!");
        trackJobScrapeSuccess();
      } else {
        const reason = result.reason || "We couldn't reliably extract this job description automatically.";
        setScrapeError(reason);
        toast.error(reason);
        trackJobScrapeFailure("not_confident");
      }
    } catch {
      toast.error("Could not scrape URL. Please paste the job description manually.");
      trackJobScrapeFailure("network_or_server");
    } finally {
      setScraping(false);
    }
  };

  const handleGenerate = async () => {
    if (!token) return;
    if (!jobDescription && !jobUrl) {
      toast.error("Please provide a job URL or description");
      return;
    }
    if (isLinkedInJobUrl(jobUrl) && !jobDescription) {
      toast.error("LinkedIn job URLs aren't supported for auto-extraction. Please paste the job description instead.");
      return;
    }
    setLoading(true);
    setStep("generate");
    setGenerationProgress(5);
    setGenerationStage("start");
    setGenerationEvents([]);
    trackCvTailorStarted();
    const payload = {
      cv_id: cvId || undefined,
      job_url: jobUrl || undefined,
      job_description: jobDescription || undefined,
      additional_info: additionalInfo || undefined,
      page_limit: pageLimit,
    };
    try {
      const result = await (async () => {
        if (!token) {
          throw new Error("Not authenticated");
        }
        try {
          return await api.generateCVStream(
            payload,
            token,
            (event: CVGenerationProgressEvent) => {
              if (typeof event.progress === "number") {
                setGenerationProgress(event.progress);
              }
              if (event.stage && event.stage !== "error") {
                setGenerationStage(event.stage);
              }
              setGenerationEvents((prev) => [
                ...prev,
                {
                  id: prev.length,
                  stage: event.stage,
                  message: event.message,
                },
              ]);
            },
          );
        } catch (err) {
          if (err instanceof ApiError && err.status === 0) {
            // Streaming not available; fall back to single-response endpoint
            return await api.generateCV(payload, token);
          }
          throw err;
        }
      })();
      setCvId(result.id);
      if (result.job_id) setJobId(result.job_id);
      setCvData(result.generated_cv_data);
      setFitAnalysis(result.fit_analysis ?? null);
      setGapFeedback({});
      setCoverLetterContent("");
      setCoverLetterGenerated(false);
      await refreshUser();
      if (result.fit_analysis) {
        setStep("fit");
        toast.success("CV generated! Review your fit analysis.");
      } else {
        setStep("edit");
        toast.success("CV generated! Review and edit below.");
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 402) {
        toast.error("Insufficient credits. Please purchase more to continue.");
        setStep("job");
      } else {
        toast.error((err as Error).message || "Generation failed");
        setStep("job");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token || !cvData) return;
    setLoading(true);
    try {
      await api.updateCV(cvId, { generated_cv_data: cvData }, token);
      toast.success("Changes saved!");
      trackCvTailorApplied();
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: "docx" | "pdf") => {
    if (!token || !cvId) return;
    setDownloadLoading(true);
    try {
      // Persist current editor state so the downloaded file matches what the user sees
      if (cvData) {
        await api.updateCV(cvId, { generated_cv_data: cvData }, token);
      }
      const response = await api.downloadCV(cvId, token, format);
      const contentType = response.headers.get("content-type") || "";
      const expected = format === "pdf" ? "application/pdf" : "officedocument.wordprocessingml.document";
      if (!response.ok || !contentType.includes(expected)) {
        let message = "Download failed";
        try {
          const errorText = await response.text();
          try {
            const errorData = JSON.parse(errorText);
            message = (errorData as { detail?: string }).detail || message;
          } catch {
            if (errorText) {
              message = errorText.slice(0, 300);
            }
          }
        } catch {
          // fall back to generic message if response body cannot be read
        }
        toast.error(message);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("content-disposition") || "";
      const match = /filename="?([^"]+)"?/i.exec(disposition);
      a.download = match?.[1] ?? `Tailored_CV.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      if (step === "edit") setStep("cover_letter");
      toast.success("CV downloaded!");
      trackCvDownload(format);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!token || !cvId) return;
    const filled = Object.fromEntries(
      Object.entries(gapFeedback).filter(([, v]) => v.trim())
    );
    if (Object.keys(filled).length === 0) {
      toast.error("Please provide feedback on at least one gap");
      return;
    }
    setRefining(true);
    try {
      const result = await api.refineCV(cvId, { gap_feedback: filled }, token);
      if (result.job_id) setJobId(result.job_id);
      setCvData(result.generated_cv_data);
      setFitAnalysis(result.fit_analysis ?? null);
      setGapFeedback({});
      setCoverLetterContent("");
      setCoverLetterGenerated(false);
      await refreshUser();
      toast.success("CV refined! Review the updated analysis below.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Refinement failed");
    } finally {
      setRefining(false);
    }
  };

  const handleRegenerateForJob = async () => {
    if (!token || !jobId) return;
    setLoading(true);
    try {
      const result = await api.generateCV(
        {
          job_id: jobId,
        },
        token,
      );
      setCvId(result.id);
      setCvData(result.generated_cv_data);
      setFitAnalysis(result.fit_analysis ?? null);
      setGapFeedback({});
      setCoverLetterContent("");
      setCoverLetterGenerated(false);
      await refreshUser();
      toast.success("CV regenerated for this application (no credits used).");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Regeneration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!token || !jobId) return;
    setClLoading(true);
    try {
      const result = await api.generateCoverLetter(jobId, token);
      setCoverLetterContent(result.content);
      setCoverLetterGenerated(true);
      toast.success("Cover letter generated!");
    } catch (err: unknown) {
      const message = (err as Error).message;
      if (message.includes("already exists")) {
        try {
          const existing = await api.getCoverLetter(jobId, token);
          setCoverLetterContent(existing.content);
          setCoverLetterGenerated(true);
          toast.info("Cover letter already exists. Loaded for editing.");
        } catch {
          toast.error("Cover letter exists but could not be loaded.");
        }
      } else {
        toast.error(message || "Failed to generate cover letter");
      }
    } finally {
      setClLoading(false);
    }
  };

  const handleSaveCoverLetter = async () => {
    if (!token || !jobId || !coverLetterContent.trim()) return;
    setClSaving(true);
    try {
      await api.updateCoverLetter(jobId, coverLetterContent, token);
      toast.success("Cover letter saved!");
    } catch {
      toast.error("Failed to save cover letter");
    } finally {
      setClSaving(false);
    }
  };

  const handleDownloadCoverLetter = async (format: "docx" | "pdf") => {
    if (!token || !jobId) return;
    setClDownloadLoading(true);
    try {
      // Persist current editor content so the downloaded file matches what the user sees
      if (coverLetterContent.trim()) {
        await api.updateCoverLetter(jobId, coverLetterContent, token);
      }
      const response = await api.downloadCoverLetter(jobId, token, format);
      const contentType = response.headers.get("content-type") || "";
      const expected = format === "pdf" ? "application/pdf" : "officedocument.wordprocessingml.document";
      if (!response.ok || !contentType.includes(expected)) {
        let message = "Cover letter not found. Generate one first.";
        try {
          const errorData = await response.json();
          message = (errorData as { detail?: string }).detail || message;
        } catch {
          // use default
        }
        toast.error(message);
        return;
      }
      if (!response.ok) {
        let message = "Cover letter not found. Generate one first.";
        try {
          const errorData = await response.json();
          message = (errorData as { detail?: string }).detail || message;
        } catch { /* use default message */ }
        toast.error(message);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("content-disposition") || "";
      const match = /filename="?([^"]+)"?/i.exec(disposition);
      a.download = match?.[1] ?? `Cover_Letter.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Cover letter downloaded!");
    } catch {
      toast.error("Download failed");
    } finally {
      setClDownloadLoading(false);
    }
  };

  const handleRegenerateCoverLetter = async () => {
    if (!token || !jobId) return;
    setClLoading(true);
    try {
      await api.deleteCoverLetter(jobId, token);
      const result = await api.generateCoverLetter(jobId, token);
      setCoverLetterContent(result.content);
      setCoverLetterGenerated(true);
      toast.success("Cover letter regenerated!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to regenerate cover letter");
    } finally {
      setClLoading(false);
    }
  };

  const goBack = (target: Step) => setStep(target);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tailor Your CV</h1>
          <p className="text-muted-foreground mt-1">Create a tailored CV for your target job</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Coins className="h-3 w-3" />{user?.credits ?? 0} credits
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewApplication}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Start New
          </Button>
        </div>
      </div>

      {profileFlow && step === "job" && (
        <Alert className="border-primary/30 bg-primary/5">
          <UserCheck className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Using your saved profile. Just add job details to generate a tailored CV.</span>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-1 ml-2">
                <Settings className="h-3 w-3" />Update profile
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress */}
      <div className="space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="overflow-x-auto min-w-0 -mx-1">
          <div className="flex justify-between min-w-max px-1">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[s];
              const isActive = i === stepIdx;
              const isDone = i < stepIdx;
              return (
                <div key={s} className={`flex flex-col items-center gap-1 shrink-0 ${isActive ? "text-primary" : isDone ? "text-primary/60" : "text-muted-foreground/40"}`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">{STEP_LABELS[s]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step: Upload (new users only) */}
      {step === "upload" && !profileFlow && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Existing CV</CardTitle>
            <CardDescription>Upload your current CV in PDF or DOCX format (max 10MB). This will be saved to your profile for future use.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <span className="text-primary font-medium">Click to upload</span>
                <span className="text-muted-foreground"> or drag and drop</span>
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Label>
              {file && (
                <p className="mt-3 text-sm font-medium">{file.name}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={!file || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload & Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Enhance (new users only) */}
      {step === "enhance" && !profileFlow && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Optionally provide extra details not in your CV (skills, achievements, preferences). This will be saved to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {originalContent && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm max-h-40 overflow-y-auto">
                <p className="font-medium text-xs text-muted-foreground mb-1">Extracted from your CV:</p>
                <p className="whitespace-pre-wrap">{originalContent.slice(0, 500)}...</p>
              </div>
            )}
            <Textarea
              placeholder="E.g., I recently completed a cloud architecture certification. I'm particularly skilled at stakeholder management and led a team of 12 in my last role..."
              rows={6}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => goBack("upload")}>
                <ArrowLeft className="mr-2 h-4 w-4" />Back
              </Button>
              <Button onClick={async () => {
                if (token && additionalInfo) {
                  try {
                    await api.updateProfile({ additional_info: additionalInfo }, token);
                    await refreshUser();
                  } catch { /* non-critical */ }
                }
                setStep("job");
              }}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Job */}
      {step === "job" && (
        <Card>
          <CardHeader>
            <CardTitle>Target Job</CardTitle>
            <CardDescription>Provide the job you want to tailor your CV for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Job URL
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="https://company.com/careers/role"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="min-w-0"
                />
                <Button variant="outline" onClick={handleScrape} disabled={!jobUrl || scraping} className="sm:shrink-0">
                  {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Extract</span>
                </Button>
              </div>
              {scrapeError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    We couldn&apos;t confidently extract this job description automatically. Reason: {scrapeError} Please paste the full job description into the box below.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or paste directly</span></div>
            </div>

            <div className="space-y-3">
              <Label>Job Description</Label>
              <Textarea
                placeholder="Paste the full job description here..."
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>CV length</Label>
              <Select
                value={String(pageLimit)}
                onValueChange={(v) => setPageLimit(v === "1" ? 1 : 2)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 page</SelectItem>
                  <SelectItem value="2">2 pages</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The AI will keep your CV within the selected length. Your choice is saved for next time.
              </p>
            </div>

            <div className="flex justify-between">
              {!profileFlow ? (
                <Button variant="outline" onClick={() => goBack("enhance")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />Back
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={handleGenerate} disabled={!jobDescription && !jobUrl}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Tailored CV (1 credit)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Generate (live progress) */}
      {step === "generate" && (
        <Card>
          <CardContent className="py-10 space-y-6">
            <div className="text-center space-y-2">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Generating your tailored CV...</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We&apos;re tailoring your CV to this role, analyzing the job description, and polishing the layout so it looks sharp.
                This usually takes under a minute.
              </p>
            </div>
            <div className="space-y-3">
              <Progress value={generationProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {generationStage ? STAGE_LABELS[generationStage] : "Starting"}
                </span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
            </div>
            <div className="border rounded-lg p-3 bg-muted/40 max-h-48 overflow-y-auto text-xs">
              <div className="font-medium mb-1 text-muted-foreground">
                Live activity
              </div>
              {generationEvents.length === 0 && (
                <p className="text-muted-foreground">
                  Connecting to the generator...
                </p>
              )}
              {generationEvents.length > 0 && (
                <ul className="space-y-1">
                  {STAGE_ORDER.map((stage) => {
                    const eventsForStage = generationEvents.filter((e) => e.stage === stage);
                    if (eventsForStage.length === 0) return null;
                    const last = eventsForStage[eventsForStage.length - 1];
                    const isDoneStage = stage === "done";
                    return (
                      <li
                        key={stage}
                        className="flex items-start gap-2"
                      >
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full ${
                            isDoneStage ? "bg-green-500" : "bg-primary"
                          }`}
                        />
                        <div>
                          <div className="font-medium">
                            {STAGE_LABELS[stage]}
                          </div>
                          <div className="text-muted-foreground">
                            {last.message}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {latestGenerationMessage && generationStage === "error" && (
                <p className="text-red-500">{latestGenerationMessage}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Fit Analysis */}
      {step === "fit" && fitAnalysis && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle>Fit Analysis</CardTitle>
              <CardDescription>How well your profile matches this role</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-2">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" strokeWidth="10" className="stroke-muted" />
                  <circle
                    cx="64" cy="64" r="56" fill="none" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(fitAnalysis.fit_score / 100) * 351.86} 351.86`}
                    className={fitAnalysis.fit_score >= 70 ? "stroke-green-500" : fitAnalysis.fit_score >= 40 ? "stroke-yellow-500" : "stroke-red-500"}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{fitAnalysis.fit_score}%</span>
                </div>
              </div>
            <p className="text-sm text-muted-foreground">
                {fitAnalysis.fit_score >= 70
                  ? "Strong match for this role"
                  : fitAnalysis.fit_score >= 40
                    ? "Moderate match; your feedback can help"
                    : "This role may be a stretch, but let&apos;s see"}
            </p>
            </CardContent>
          </Card>

          {fitAnalysis.strengths.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Why You&apos;re a Good Fit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {fitAnalysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {fitAnalysis.gaps.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Potential Gaps
                </CardTitle>
                <CardDescription>
                  Think any of these are wrong? Tell us why and we&apos;ll refine your CV for free and update your memory bank so future CV generations know this about you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {fitAnalysis.gaps.map((g, i) => (
                    <li key={i} className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                        {g}
                      </div>
                      <Textarea
                        disabled={refining}
                        placeholder="Explain why this doesn't apply to you..."
                        rows={2}
                        className="text-sm"
                        value={gapFeedback[g] || ""}
                        onChange={(e) =>
                          setGapFeedback((prev) => ({ ...prev, [g]: e.target.value }))
                        }
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            {fitAnalysis.gaps.length > 0 ? (
              <Button
                variant="outline"
                onClick={handleRefine}
                disabled={refining || Object.values(gapFeedback).every((v) => !v.trim())}
              >
                {refining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refine CV with Feedback
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={() => setStep("edit")}>
              Continue to Edit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Edit */}
      {step === "edit" && cvData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit Your Tailored CV</CardTitle>
              <CardDescription>Review and fine-tune the generated content before downloading</CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full max-w-xs grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-4">
              <CVEditor data={cvData} onChange={setCvData} />
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <div className="flex justify-center">
                <CvPreview data={cvData} pageLimit={pageLimit} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleSave} disabled={loading} className="sm:shrink-0">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
              {fitAnalysis && (
                <Button variant="outline" onClick={() => setStep("fit")} disabled={loading}>
                  View Fit Analysis
                </Button>
              )}
              {jobId && (
                <Button variant="outline" onClick={handleRegenerateForJob} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate CV
                </Button>
              )}
              <Button onClick={() => setStep("cover_letter")}>
                Continue to Cover Letter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={downloadLoading}>
                    {downloadLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Download className="mr-2 h-4 w-4" />
                    Download
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload("docx")}>
                    Download as DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                    Download as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Step: Cover Letter */}
      {step === "cover_letter" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
              <CardDescription>
                Generate a tailored cover letter for this application, or skip if you don&apos;t need one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!coverLetterGenerated ? (
                <div className="text-center py-8 space-y-4">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Our AI will draft a professional cover letter based on your tailored CV and the job description.
                  </p>
                  <Button onClick={handleGenerateCoverLetter} disabled={clLoading}>
                    {clLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate Cover Letter
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    rows={16}
                    value={coverLetterContent}
                    onChange={(e) => setCoverLetterContent(e.target.value)}
                    className="font-serif text-sm leading-relaxed"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleSaveCoverLetter} disabled={clSaving}>
                      {clSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={clDownloadLoading}>
                          {clDownloadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                          Download Cover Letter
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownloadCoverLetter("docx")}>
                          Download as DOCX
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadCoverLetter("pdf")}>
                          Download as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" onClick={handleRegenerateCoverLetter} disabled={clLoading}>
                      {clLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => goBack("edit")}>
              <ArrowLeft className="mr-2 h-4 w-4" />Back to Edit
            </Button>
            <Button onClick={() => setStep("download")}>
              {coverLetterGenerated ? "Continue" : "Skip"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Download */}
      {step === "download" && (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold">All done!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your tailored CV{coverLetterGenerated ? " and cover letter are" : " is"} ready.
              Download your documents below or track this application.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button variant="outline" onClick={() => { setStep("edit"); }}>
                <Edit3 className="mr-2 h-4 w-4" />Edit CV
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload("docx")}>
                    Download CV as DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                    Download CV as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {coverLetterGenerated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Download Cover Letter
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownloadCoverLetter("docx")}>
                      Download Cover Letter as DOCX
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadCoverLetter("pdf")}>
                      Download Cover Letter as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Link href="/applications">
                <Button>View Applications</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TailorPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />}>
      <TailorContent />
    </Suspense>
  );
}
