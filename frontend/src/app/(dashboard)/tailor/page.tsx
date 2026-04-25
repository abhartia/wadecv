"use client";

import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  api,
  ApiError,
  StreamingNotAvailableError,
  CVGenerationProgressEvent,
  CVGenerationStage,
} from "@/lib/api";
import {
  trackCvDownload,
  trackCvImportFailure,
  trackCvImportStarted,
  trackCvImportSuccess,
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
import {
  Upload,
  FileText,
  Briefcase,
  Wand2,
  Edit3,
  Download,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Link2,
  Globe,
  Coins,
  UserCheck,
  Settings,
  Target,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Mail,
  ChevronDown,
  Eye,
  Send,
} from "lucide-react";
import { CVEditor } from "@/components/cv-editor/cv-editor";
import { CvPreview } from "@/components/cv-preview/cv-preview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  extractAddressApiMailExtractAddressPost,
  sendMailApiMailSendPost,
} from "@/gen/hey-api/sdk.gen";
import { client } from "@/gen/hey-api/client.gen";
import type { BodySendMailApiMailSendPost } from "@/gen/hey-api/types.gen";

// Mirror of backend `AddressSchema` (app/schemas/physical_mail.py). The Mail /send
// endpoint takes JSON-stringified address fields via multipart form, so the type
// isn't reachable from the generated client — we keep it in lockstep here.
type AddressSchema = {
  name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

type FitAnalysis = { fit_score: number; strengths: string[]; gaps: string[] };
type Step =
  | "upload"
  | "enhance"
  | "job"
  | "fit"
  | "generate"
  | "edit"
  | "cover_letter"
  | "download"
  | "mail";

const ALL_STEPS: Step[] = [
  "upload",
  "enhance",
  "job",
  "fit",
  "generate",
  "edit",
  "cover_letter",
  "download",
  "mail",
];
const PROFILE_STEPS: Step[] = [
  "job",
  "fit",
  "generate",
  "edit",
  "cover_letter",
  "download",
  "mail",
];

const STEP_LABELS: Record<Step, string> = {
  upload: "Upload CV",
  enhance: "Add Info",
  job: "Job Details",
  generate: "Generate",
  fit: "Fit Analysis",
  edit: "Edit",
  cover_letter: "Cover Letter",
  download: "Download",
  mail: "Send Mail",
};
const STEP_ICONS: Record<Step, React.ElementType> = {
  upload: Upload,
  enhance: Edit3,
  job: Briefcase,
  generate: Wand2,
  fit: Target,
  edit: FileText,
  cover_letter: Mail,
  download: Download,
  mail: Send,
};

const EMPTY_ADDRESS: AddressSchema = {
  name: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

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
  first_pass_generation: "Generating tailored CV (first pass)",
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

function AddressForm({
  label,
  address,
  onChange,
}: {
  label: string;
  address: AddressSchema;
  onChange: (a: AddressSchema) => void;
}) {
  const update = (field: keyof AddressSchema, value: string) =>
    onChange({ ...address, [field]: value });
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm">{label}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Name</Label>
          <Input
            value={address.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Company or recipient name"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Address Line 1</Label>
          <Input
            value={address.address_line1}
            onChange={(e) => update("address_line1", e.target.value)}
            placeholder="123 Main St"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Address Line 2</Label>
          <Input
            value={address.address_line2 ?? ""}
            onChange={(e) => update("address_line2", e.target.value)}
            placeholder="Suite, floor, etc."
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">City</Label>
          <Input
            value={address.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">State</Label>
          <Select value={address.state} onValueChange={(v) => update("state", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">ZIP Code</Label>
          <Input
            value={address.zip}
            onChange={(e) => update("zip", e.target.value)}
            placeholder="12345"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Country</Label>
          <Input value="US" disabled className="opacity-70" />
        </div>
      </div>
    </div>
  );
}

function PdfPreviewPanel({
  label,
  pdfUrl,
  loading,
  customFile,
  onUpload,
  onReset,
}: {
  label: string;
  pdfUrl: string | null;
  loading: boolean;
  customFile: File | null;
  onUpload: (file: File) => void;
  onReset: () => void;
}) {
  const fileInputId = `pdf-upload-${label.replace(/\s/g, "-")}`;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{label}</h4>
        <div className="flex items-center gap-2">
          {customFile ? (
            <>
              <Badge variant="secondary" className="text-xs">
                Custom: {customFile.name}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RefreshCw className="mr-1 h-3 w-3" />
                Reset to generated
              </Button>
            </>
          ) : (
            <>
              <input
                id={fileInputId}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                  e.target.value = "";
                }}
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor={fileInputId} className="cursor-pointer">
                  <Upload className="mr-1 h-3 w-3" />
                  Replace with your own PDF
                </label>
              </Button>
            </>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[400px] border rounded-md bg-muted/30">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : pdfUrl ? (
        <iframe src={pdfUrl} className="w-full h-[500px] border rounded-md" title={label} />
      ) : (
        <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/30 text-muted-foreground text-sm">
          PDF preview unavailable
        </div>
      )}
    </div>
  );
}

function MailStep({
  jobId,
  cvId,
  token,
  user,
  coverLetterGenerated,
  mailContentType,
  setMailContentType,
  toAddress,
  setToAddress,
  fromAddress,
  setFromAddress,
  saveReturnAddress,
  setSaveReturnAddress,
  addressExtracted,
  setAddressExtracted,
  addressLoading,
  setAddressLoading,
  mailSending,
  setMailSending,
  mailSent,
  setMailSent,
  refreshUser,
}: {
  jobId: string;
  cvId: string;
  token: string | null;
  user: { credits: number; mailing_address?: Record<string, string> | null } | null;
  coverLetterGenerated: boolean;
  mailContentType: BodySendMailApiMailSendPost["content_type"];
  setMailContentType: (v: BodySendMailApiMailSendPost["content_type"]) => void;
  toAddress: AddressSchema;
  setToAddress: (a: AddressSchema) => void;
  fromAddress: AddressSchema;
  setFromAddress: (a: AddressSchema) => void;
  saveReturnAddress: boolean;
  setSaveReturnAddress: (v: boolean) => void;
  addressExtracted: boolean;
  setAddressExtracted: (v: boolean) => void;
  addressLoading: boolean;
  setAddressLoading: (v: boolean) => void;
  mailSending: boolean;
  setMailSending: (v: boolean) => void;
  mailSent: boolean;
  setMailSent: (v: boolean) => void;
  refreshUser: () => Promise<void>;
}) {
  const credits = user?.credits ?? 0;
  const MAIL_COST = 5;

  // PDF preview state
  const [cvPdfUrl, setCvPdfUrl] = useState<string | null>(null);
  const [clPdfUrl, setClPdfUrl] = useState<string | null>(null);
  const [cvPdfLoading, setCvPdfLoading] = useState(false);
  const [clPdfLoading, setClPdfLoading] = useState(false);
  const [customCvFile, setCustomCvFile] = useState<File | null>(null);
  const [customClFile, setCustomClFile] = useState<File | null>(null);
  // Keep generated blob URLs to restore on reset
  const [generatedCvPdfUrl, setGeneratedCvPdfUrl] = useState<string | null>(null);
  const [generatedClPdfUrl, setGeneratedClPdfUrl] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch generated CV PDF preview
  useEffect(() => {
    if (!token || !cvId || generatedCvPdfUrl) return;
    setCvPdfLoading(true);
    fetch(`${API_URL}/api/cv/${cvId}/download?format=pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setGeneratedCvPdfUrl(url);
          if (!customCvFile) setCvPdfUrl(url);
        }
      })
      .catch(() => {})
      .finally(() => setCvPdfLoading(false));
  }, [token, cvId, API_URL, generatedCvPdfUrl, customCvFile]);

  // Fetch generated cover letter PDF preview
  useEffect(() => {
    if (!token || !jobId || !coverLetterGenerated || generatedClPdfUrl) return;
    setClPdfLoading(true);
    fetch(`${API_URL}/api/cover-letter/${jobId}/download?format=pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setGeneratedClPdfUrl(url);
          if (!customClFile) setClPdfUrl(url);
        }
      })
      .catch(() => {})
      .finally(() => setClPdfLoading(false));
  }, [token, jobId, coverLetterGenerated, API_URL, generatedClPdfUrl, customClFile]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (generatedCvPdfUrl) URL.revokeObjectURL(generatedCvPdfUrl);
      if (generatedClPdfUrl) URL.revokeObjectURL(generatedClPdfUrl);
    };
  }, [generatedCvPdfUrl, generatedClPdfUrl]);

  const handleCvUpload = (file: File) => {
    setCustomCvFile(file);
    const url = URL.createObjectURL(file);
    setCvPdfUrl(url);
  };

  const handleCvReset = () => {
    if (customCvFile && cvPdfUrl && cvPdfUrl !== generatedCvPdfUrl) {
      URL.revokeObjectURL(cvPdfUrl);
    }
    setCustomCvFile(null);
    setCvPdfUrl(generatedCvPdfUrl);
  };

  const handleClUpload = (file: File) => {
    setCustomClFile(file);
    const url = URL.createObjectURL(file);
    setClPdfUrl(url);
  };

  const handleClReset = () => {
    if (customClFile && clPdfUrl && clPdfUrl !== generatedClPdfUrl) {
      URL.revokeObjectURL(clPdfUrl);
    }
    setCustomClFile(null);
    setClPdfUrl(generatedClPdfUrl);
  };

  // Extract address on first render
  useEffect(() => {
    if (addressExtracted || addressLoading || !token || !jobId) return;
    setAddressLoading(true);
    client.setConfig({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
    extractAddressApiMailExtractAddressPost({
      body: { job_id: jobId },
    })
      .then((res) => {
        if (res.data?.found) {
          setToAddress({
            name: res.data.name ?? "",
            address_line1: res.data.address_line1 ?? "",
            address_line2: res.data.address_line2 ?? "",
            city: res.data.city ?? "",
            state: res.data.state ?? "",
            zip: res.data.zip ?? "",
            country: res.data.country ?? "US",
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setAddressExtracted(true);
        setAddressLoading(false);
      });
  }, [
    addressExtracted,
    addressLoading,
    token,
    jobId,
    setAddressLoading,
    setAddressExtracted,
    setToAddress,
  ]);

  // Pre-fill return address from profile
  useEffect(() => {
    if (user?.mailing_address && !fromAddress.address_line1) {
      const saved = user.mailing_address;
      setFromAddress({
        name: saved.name ?? "",
        address_line1: saved.address_line1 ?? "",
        address_line2: saved.address_line2 ?? "",
        city: saved.city ?? "",
        state: saved.state ?? "",
        zip: saved.zip ?? "",
        country: saved.country ?? "US",
      });
    }
  }, [user?.mailing_address, fromAddress.address_line1, setFromAddress]);

  const isToValid =
    toAddress.name && toAddress.address_line1 && toAddress.city && toAddress.state && toAddress.zip;
  const isFromValid =
    fromAddress.name &&
    fromAddress.address_line1 &&
    fromAddress.city &&
    fromAddress.state &&
    fromAddress.zip;
  const canSend = isToValid && isFromValid && credits >= MAIL_COST && !mailSending && !mailSent;

  const handleSend = async () => {
    if (!token || !canSend) return;
    setMailSending(true);
    try {
      client.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await sendMailApiMailSendPost({
        body: {
          job_id: jobId,
          content_type: mailContentType,
          to_address: JSON.stringify(toAddress),
          from_address: JSON.stringify(fromAddress),
          save_return_address: saveReturnAddress,
          ...(customCvFile ? { custom_cv_pdf: customCvFile } : {}),
          ...(customClFile ? { custom_cover_letter_pdf: customClFile } : {}),
        },
      });
      if (res.error) {
        toast.error((res.error as { detail?: string }).detail || "Failed to send mail");
      } else {
        setMailSent(true);
        toast.success(
          "Physical mail sent! Delivery via USPS First Class typically takes 5\u20137 business days.",
        );
        await refreshUser();
      }
    } catch {
      toast.error("Failed to send physical mail");
    } finally {
      setMailSending(false);
    }
  };

  if (mailSent) {
    return (
      <Card>
        <CardContent className="py-16 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h3 className="text-2xl font-bold">Mail sent!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your physical mail has been submitted for delivery via USPS First Class. It typically
            arrives in 5–7 business days.
          </p>
          <Link href="/applications">
            <Button className="mt-4">View Applications</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const showCvPreview = mailContentType === "cv_only" || mailContentType === "both";
  const showClPreview = mailContentType === "cover_letter_only" || mailContentType === "both";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Physical Mail</CardTitle>
        <CardDescription>
          Mail a physical copy of your CV and/or cover letter to the company. Preview what will be
          sent and optionally replace with your own PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content type selection */}
        <div className="space-y-3">
          <Label className="font-semibold">What to send</Label>
          <div className="flex flex-col gap-2">
            {(
              [
                { value: "cv_only", label: "CV only", needsCL: false },
                { value: "cover_letter_only", label: "Cover letter only", needsCL: true },
                { value: "both", label: "CV and cover letter", needsCL: true },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors ${mailContentType === opt.value ? "border-primary bg-primary/5" : "border-border"} ${opt.needsCL && !coverLetterGenerated ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="mailContentType"
                  value={opt.value}
                  checked={mailContentType === opt.value}
                  disabled={opt.needsCL && !coverLetterGenerated}
                  onChange={() => setMailContentType(opt.value)}
                  className="accent-primary"
                />
                <span className="text-sm">{opt.label}</span>
                {opt.needsCL && !coverLetterGenerated && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    Generate a cover letter first
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* PDF Previews */}
        <div className={`grid gap-6 ${showCvPreview && showClPreview ? "lg:grid-cols-2" : ""}`}>
          {showClPreview && (
            <PdfPreviewPanel
              label="Cover Letter"
              pdfUrl={clPdfUrl}
              loading={clPdfLoading}
              customFile={customClFile}
              onUpload={handleClUpload}
              onReset={handleClReset}
            />
          )}
          {showCvPreview && (
            <PdfPreviewPanel
              label="CV"
              pdfUrl={cvPdfUrl}
              loading={cvPdfLoading}
              customFile={customCvFile}
              onUpload={handleCvUpload}
              onReset={handleCvReset}
            />
          )}
        </div>

        {/* Company address */}
        {addressLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Extracting company address from job description...
          </div>
        ) : (
          <AddressForm label="Company address (to)" address={toAddress} onChange={setToAddress} />
        )}

        {/* Return address */}
        <AddressForm
          label="Your return address (from)"
          address={fromAddress}
          onChange={setFromAddress}
        />

        {/* Save return address checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={saveReturnAddress}
            onCheckedChange={(v) => setSaveReturnAddress(v === true)}
          />
          <span className="text-sm">Save return address to my profile</span>
        </label>

        {/* Cost and send */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Cost: <strong>{MAIL_COST} credits</strong>
            </span>
            <span className="text-sm text-muted-foreground">(Balance: {credits} credits)</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!canSend}>
                {mailSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : credits < MAIL_COST ? (
                  "Insufficient credits"
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Mail ({MAIL_COST} credits)
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm physical mail</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3 text-sm">
                    <p>You are about to send a physical letter with the following details:</p>
                    <div className="rounded-md border p-3 space-y-1 text-foreground">
                      <p>
                        <strong>Sending:</strong>{" "}
                        {mailContentType === "both"
                          ? "CV and cover letter"
                          : mailContentType === "cv_only"
                            ? "CV only"
                            : "Cover letter only"}
                      </p>
                      <p>
                        <strong>To:</strong> {toAddress.name}, {toAddress.address_line1},{" "}
                        {toAddress.city}, {toAddress.state} {toAddress.zip}
                      </p>
                      <p>
                        <strong>From:</strong> {fromAddress.name}, {fromAddress.address_line1},{" "}
                        {fromAddress.city}, {fromAddress.state} {fromAddress.zip}
                      </p>
                    </div>
                    <p>
                      <strong>Cost:</strong> {MAIL_COST} credits (current balance: {credits})
                    </p>
                    <p className="text-muted-foreground">
                      Sent via USPS First Class. Delivery typically takes 5–7 business days. This
                      action cannot be undone.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSend} disabled={mailSending}>
                  {mailSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Confirm & Send"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function TailorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user, refreshUser } = useAuth();
  const jobParam = searchParams.get("job");
  const hasProfile = user?.has_profile ?? false;
  const [profileFlow] = useState<boolean>(() => hasProfile);
  const steps = profileFlow ? PROFILE_STEPS : ALL_STEPS;

  const [step, setStep] = useState<Step>(() =>
    jobParam ? "edit" : profileFlow ? "job" : "upload",
  );
  const [file, setFile] = useState<File | null>(null);
  const [cvId, setCvId] = useState(searchParams.get("cv") || "");
  const [originalContent, setOriginalContent] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
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
  const [mailContentType, setMailContentType] =
    useState<BodySendMailApiMailSendPost["content_type"]>("cv_only");
  const [toAddress, setToAddress] = useState<AddressSchema>({ ...EMPTY_ADDRESS });
  const [fromAddress, setFromAddress] = useState<AddressSchema>({ ...EMPTY_ADDRESS });
  const [saveReturnAddress, setSaveReturnAddress] = useState(true);
  const [addressExtracted, setAddressExtracted] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [mailSending, setMailSending] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<CVGenerationStage | null>(null);
  const [generationEvents, setGenerationEvents] = useState<
    { id: number; stage: CVGenerationStage; message: string }[]
  >([]);

  const hasFilledGapFeedback = Object.values(gapFeedback).some((v) => v.trim());

  const stepIdx = steps.indexOf(step);
  const progress = ((stepIdx + 1) / steps.length) * 100;

  const goToStep = (target: Step) => {
    // Avoid navigating away while generation is actively in progress
    if (step === "generate" && loading) {
      return;
    }

    switch (target) {
      case "fit": {
        if (!fitAnalysis) {
          toast.error("Fit analysis is not available yet.");
          return;
        }
        break;
      }
      case "edit": {
        if (!cvData) {
          toast.error("Your tailored CV is not ready yet.");
          return;
        }
        break;
      }
      case "cover_letter": {
        if (!jobId) {
          toast.error("Cover letters are available once a job has been created for this CV.");
          return;
        }
        break;
      }
      case "download": {
        if (!cvId) {
          toast.error("Your CV is not ready to download yet.");
          return;
        }
        break;
      }
      case "mail": {
        if (!jobId) {
          toast.error("You need a generated CV before sending mail.");
          return;
        }
        break;
      }
      default:
        break;
    }

    setStep(target);
  };

  const latestGenerationMessage =
    generationEvents.length > 0 ? generationEvents[generationEvents.length - 1]?.message : null;

  const startNewApplication = () => {
    // Clear URL-based job context so we don't immediately reload the old application
    if (searchParams.get("job")) {
      router.push("/tailor");
    }

    // Reset all local state for a fresh flow
    jobLoadedRef.current = null;
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
    setPageLimit(user?.cv_page_limit === 1 || user?.cv_page_limit === 2 ? user.cv_page_limit : 1);
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

  // Track whether the initial load for ?job= has already run so that
  // token refreshes don't snap the user back to the Edit step.
  const jobLoadedRef = useRef<string | null>(null);

  // When opened for an existing application (?job=...), load job, CV and cover letter
  useEffect(() => {
    if (!token || !jobParam) return;
    // Only run once per jobParam value — skip if token refreshed
    if (jobLoadedRef.current === jobParam) return;

    const loadExistingApplication = async () => {
      jobLoadedRef.current = jobParam;
      try {
        const job = await api.getJob(jobParam, token);
        const cv = await api.getCV(job.cv_id, token);

        setCvId(cv.id);
        setJobId(job.id);
        setJobTitle(job.job_title || "");
        setCompanyName(job.company_name || "");
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

        // Choose the correct step based on what data is available:
        // - If a tailored CV exists, go straight to Edit
        // - Else if only fit analysis exists, go to Fit
        // - Otherwise, fall back to the Job setup step
        if (cv.generated_cv_data) {
          setStep("edit");
        } else if (cv.fit_analysis) {
          setStep("fit");
        } else {
          setStep("job");
        }
      } catch (err) {
        toast.error((err as Error).message || "Failed to load application");
      }
    };

    void loadExistingApplication();
  }, [jobParam, token]);

  useEffect(() => {
    if (!token || !jobId) return;

    const loadJobMetadata = async () => {
      try {
        const job = await api.getJob(jobId, token);
        setJobTitle(job.job_title || "");
        setCompanyName(job.company_name || "");
      } catch {
        // Non-critical: editing should still work even if job metadata fails to load
      }
    };

    void loadJobMetadata();
  }, [jobId, token]);

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
      const message =
        "LinkedIn job URLs can't be scraped automatically. Please paste the full job description into the box below.";
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
        const reason =
          result.reason || "We couldn't reliably extract this job description automatically.";
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
      toast.error(
        "LinkedIn job URLs aren't supported for auto-extraction. Please paste the job description instead.",
      );
      return;
    }
    setLoading(true);
    trackCvTailorStarted();
    const payload = {
      cv_id: cvId || undefined,
      job_url: jobUrl || undefined,
      job_description: jobDescription || undefined,
      additional_info: additionalInfo || undefined,
      page_limit: pageLimit,
    };
    try {
      const result = await api.fitCV(payload, token);
      setCvId(result.id);
      if (result.job_id) setJobId(result.job_id);
      setFitAnalysis(result.fit_analysis ?? null);
      setGapFeedback({});
      setStep("fit");
      toast.success("Fit analysis ready. Review your match and share any clarifications.");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 402) {
        toast.error("Insufficient credits. Please purchase more to continue.");
        setStep("job");
      } else {
        toast.error((err as Error).message || "Fit analysis failed");
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
      const expected =
        format === "pdf" ? "application/pdf" : "officedocument.wordprocessingml.document";
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
      if (step === "edit") goToStep("cover_letter");
      toast.success("CV downloaded!");
      trackCvDownload(format);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadLoading(false);
    }
  };

  const runRefinement = async (filled: Record<string, string>) => {
    if (!token || !cvId) return;
    let usedStreaming = false;
    setRefining(true);
    setStep("generate");
    setGenerationProgress(5);
    setGenerationStage("start");
    setGenerationEvents([]);
    try {
      const result = await (async () => {
        if (!token) {
          throw new Error("Not authenticated");
        }
        try {
          return await api.refineCVStream(
            cvId,
            { gap_feedback: filled },
            token,
            (event: CVGenerationProgressEvent) => {
              usedStreaming = true;
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

              if (event.type === "done" && event.result) {
                const final = event.result;
                if (final.job_id) setJobId(final.job_id);
                setCvId(final.id);
                setCvData(final.generated_cv_data);
                setFitAnalysis(final.fit_analysis as FitAnalysis | null);
                setGapFeedback({});
                setCoverLetterContent("");
                setCoverLetterGenerated(false);
                void refreshUser();
                toast.success("CV refined! Review and edit your tailored CV.");
                setStep("edit");
              }
            },
          );
        } catch (err) {
          if (err instanceof ApiError && err.status === 0) {
            // Streaming not available; fall back to non-streaming refine endpoint
            return await api.refineCV(cvId, { gap_feedback: filled }, token);
          }
          throw err;
        }
      })();
      // If streaming events handled the transition already, avoid duplicating work.
      if (!usedStreaming) {
        if (result.job_id) setJobId(result.job_id);
        setCvData(result.generated_cv_data);
        setFitAnalysis(result.fit_analysis ?? null);
        setGapFeedback({});
        setCoverLetterContent("");
        setCoverLetterGenerated(false);
        await refreshUser();
        toast.success("CV refined! Review and edit your tailored CV.");
        setStep("edit");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Refinement failed");
      setStep("fit");
    } finally {
      setRefining(false);
      setGenerationStage(null);
    }
  };

  const handleUpdateFitOnly = async () => {
    if (!token || !cvId) return;
    const filled = Object.fromEntries(Object.entries(gapFeedback).filter(([, v]) => v.trim()));
    if (Object.keys(filled).length === 0) {
      toast.error("Please answer at least one gap question to update your fit analysis.");
      return;
    }
    setRefining(true);
    try {
      const result = await api.refineFitAnalysis(cvId, { gap_feedback: filled }, token);
      setFitAnalysis(result.fit_analysis as FitAnalysis | null);
      setGapFeedback({});
      toast.success("Fit score and analysis updated.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update fit analysis");
    } finally {
      setRefining(false);
    }
  };

  const handleGenerateFromFit = async () => {
    const filled = Object.fromEntries(Object.entries(gapFeedback).filter(([, v]) => v.trim()));
    await runRefinement(filled);
  };

  const handleRegenerateForJob = async () => {
    if (!token || !jobId) return;
    let usedStreaming = false;
    const previousStep = step;
    setLoading(true);
    setStep("generate");
    setGenerationProgress(5);
    setGenerationStage("start");
    setGenerationEvents([]);
    try {
      const result = await (async () => {
        try {
          return await api.generateCVStream(
            { job_id: jobId },
            token,
            (event: CVGenerationProgressEvent) => {
              usedStreaming = true;
              if (typeof event.progress === "number") {
                setGenerationProgress(event.progress);
              }
              if (event.stage && event.stage !== "error") {
                setGenerationStage(event.stage);
              }
              setGenerationEvents((prev) => [
                ...prev,
                { id: prev.length, stage: event.stage, message: event.message },
              ]);

              if (event.type === "done" && event.result) {
                const final = event.result;
                setCvId(final.id);
                setCvData(final.generated_cv_data);
                setFitAnalysis(final.fit_analysis as FitAnalysis | null);
                setGapFeedback({});
                setCoverLetterContent("");
                setCoverLetterGenerated(false);
                void refreshUser();
                toast.success("CV regenerated for this application (no credits used).");
                setStep("edit");
              }
            },
          );
        } catch (err) {
          if (err instanceof StreamingNotAvailableError) {
            return await api.generateCV({ job_id: jobId }, token);
          }
          throw err;
        }
      })();
      if (!usedStreaming) {
        setCvId(result.id);
        setCvData(result.generated_cv_data);
        setFitAnalysis(result.fit_analysis ?? null);
        setGapFeedback({});
        setCoverLetterContent("");
        setCoverLetterGenerated(false);
        await refreshUser();
        toast.success("CV regenerated for this application (no credits used).");
        setStep("edit");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Regeneration failed");
      setStep(previousStep);
    } finally {
      setLoading(false);
      setGenerationStage(null);
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
      const expected =
        format === "pdf" ? "application/pdf" : "officedocument.wordprocessingml.document";
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
        } catch {
          /* use default message */
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

  const goBack = (target: Step) => goToStep(target);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tailor Your CV</h1>
          <p className="text-muted-foreground mt-1">Create a tailored CV for your target job</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Coins className="h-3 w-3" />
            {user?.credits ?? 0} credits
          </Badge>
          <Button variant="outline" size="sm" onClick={startNewApplication}>
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
                <Settings className="h-3 w-3" />
                Update profile
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
              const isTrackerNavigableStep =
                s === "fit" ||
                s === "edit" ||
                s === "cover_letter" ||
                s === "download" ||
                s === "mail";

              let isClickable = false;
              if (isTrackerNavigableStep) {
                if (s === "fit") {
                  isClickable = !!fitAnalysis;
                } else if (s === "edit") {
                  isClickable = !!cvData;
                } else if (s === "cover_letter") {
                  isClickable = !!jobId;
                } else if (s === "download") {
                  isClickable = !!cvId;
                } else if (s === "mail") {
                  isClickable = !!jobId;
                }
              }

              const handleStepClick = () => {
                if (!isClickable) return;
                goToStep(s);
              };

              return (
                <div
                  key={s}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : -1}
                  aria-current={isActive ? "step" : undefined}
                  aria-disabled={!isClickable}
                  onClick={isClickable ? handleStepClick : undefined}
                  onKeyDown={
                    isClickable
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleStepClick();
                          }
                        }
                      : undefined
                  }
                  className={`flex flex-col items-center gap-1 shrink-0 ${
                    isActive
                      ? "text-primary"
                      : isDone
                        ? "text-primary/60"
                        : "text-muted-foreground/40"
                  } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                >
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
            <CardDescription>
              Upload your current CV in PDF or DOCX format (max 10MB). This will be saved to your
              profile for future use.
            </CardDescription>
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
              {file && <p className="mt-3 text-sm font-medium">{file.name}</p>}
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
              Optionally provide extra details not in your CV (skills, achievements, preferences).
              This will be saved to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {originalContent && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm max-h-40 overflow-y-auto">
                <p className="font-medium text-xs text-muted-foreground mb-1">
                  Extracted from your CV:
                </p>
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
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={async () => {
                  if (token && additionalInfo) {
                    try {
                      await api.updateProfile({ additional_info: additionalInfo }, token);
                      await refreshUser();
                    } catch {
                      /* non-critical */
                    }
                  }
                  setStep("job");
                }}
              >
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
            <CardDescription>
              Provide the job you want to tailor your CV for. We&apos;ll run a detailed fit analysis
              first (1 credit), then generate and refine your CV for free.
            </CardDescription>
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
                <Button
                  variant="outline"
                  onClick={handleScrape}
                  disabled={!jobUrl || scraping}
                  className="sm:shrink-0"
                >
                  {scraping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Extract</span>
                </Button>
              </div>
              {scrapeError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    We couldn&apos;t confidently extract this job description automatically. Reason:{" "}
                    {scrapeError} Please paste the full job description into the box below.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or paste directly</span>
              </div>
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
                The AI will keep your CV within the selected length. Your choice is saved for next
                time.
              </p>
            </div>

            <div className="flex justify-between">
              {!profileFlow ? (
                <Button variant="outline" onClick={() => goBack("enhance")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={handleGenerate} disabled={(!jobDescription && !jobUrl) || loading}>
                {step === "job" && loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {step === "job" && loading
                  ? "Running fit analysis..."
                  : "Run Fit Analysis (1 credit)"}
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
                We&apos;re tailoring your CV to this role, analyzing the job description, and
                polishing the layout so it looks sharp. This usually takes under a minute.
              </p>
            </div>
            <div className="space-y-3">
              <Progress value={generationProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{generationStage ? STAGE_LABELS[generationStage] : "Starting"}</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
            </div>
            <div className="border rounded-lg p-3 bg-muted/40 max-h-48 overflow-y-auto text-xs">
              <div className="font-medium mb-1 text-muted-foreground">Live activity</div>
              {generationEvents.length === 0 && (
                <p className="text-muted-foreground">Connecting to the generator...</p>
              )}
              {generationEvents.length > 0 && (
                <ul className="space-y-1">
                  {STAGE_ORDER.map((stage) => {
                    const eventsForStage = generationEvents.filter((e) => e.stage === stage);
                    if (eventsForStage.length === 0) return null;
                    const last = eventsForStage[eventsForStage.length - 1];
                    const isDoneStage = stage === "done";
                    return (
                      <li key={stage} className="flex items-start gap-2">
                        <span
                          className={`mt-1 h-1.5 w-1.5 rounded-full ${
                            isDoneStage ? "bg-green-500" : "bg-primary"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{STAGE_LABELS[stage]}</div>
                          <div className="text-muted-foreground">{last.message}</div>
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
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    strokeWidth="10"
                    className="stroke-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(fitAnalysis.fit_score / 100) * 351.86} 351.86`}
                    className={
                      fitAnalysis.fit_score >= 70
                        ? "stroke-green-500"
                        : fitAnalysis.fit_score >= 40
                          ? "stroke-yellow-500"
                          : "stroke-red-500"
                    }
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
                  Think any of these are wrong? Tell us why and we&apos;ll refine your CV for free
                  and update your memory bank so future CV generations know this about you. You can
                  re-run the fit score and analysis for this job for free whenever you update these
                  answers.
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

          <p className="text-xs text-muted-foreground">
            Answer any gap questions, then use the buttons below. Updating your fit score and
            analysis for this job is free.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={handleUpdateFitOnly}
              disabled={refining || !hasFilledGapFeedback}
            >
              {refining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update fit score and analysis
            </Button>
            <Button onClick={handleGenerateFromFit} disabled={refining}>
              {refining ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Generate CV
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
              <CardDescription>
                Review and fine-tune the generated content before downloading
              </CardDescription>
              {(jobTitle || companyName) && (
                <p className="text-sm text-muted-foreground mt-1">
                  Application for{" "}
                  <span className="font-medium">{jobTitle || "Untitled position"}</span>
                  {" at "}
                  <span className="font-medium">{companyName || "Unknown company"}</span>
                </p>
              )}
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
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={loading}
              className="sm:shrink-0"
            >
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
                Generate a tailored cover letter for this application, or skip if you don&apos;t
                need one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!coverLetterGenerated ? (
                <div className="text-center py-8 space-y-4">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Our AI will draft a professional cover letter based on your tailored CV and the
                    job description.
                  </p>
                  <Button onClick={handleGenerateCoverLetter} disabled={clLoading}>
                    {clLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
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
                          {clDownloadLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-4 w-4" />
                          )}
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
                    <Button
                      variant="ghost"
                      onClick={handleRegenerateCoverLetter}
                      disabled={clLoading}
                    >
                      {clLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => goBack("edit")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
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
              <Button
                variant="outline"
                onClick={() => {
                  setStep("edit");
                }}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit CV
              </Button>
              {jobDescription.trim() && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost">
                      <Eye className="mr-2 h-4 w-4" />
                      View role description
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Role description</DialogTitle>
                      <DialogDescription>
                        Read-only view of the job description used for this tailored CV.
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[55vh] rounded-md border p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                        {jobDescription}
                      </p>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
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
              <Button variant="outline" onClick={() => setStep("mail")}>
                <Send className="mr-2 h-4 w-4" />
                Send Physical Mail
              </Button>
              <Link href="/applications">
                <Button>View Applications</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Mail */}
      {step === "mail" && (
        <MailStep
          jobId={jobId}
          cvId={cvId}
          token={token}
          user={user}
          coverLetterGenerated={coverLetterGenerated}
          mailContentType={mailContentType}
          setMailContentType={setMailContentType}
          toAddress={toAddress}
          setToAddress={setToAddress}
          fromAddress={fromAddress}
          setFromAddress={setFromAddress}
          saveReturnAddress={saveReturnAddress}
          setSaveReturnAddress={setSaveReturnAddress}
          addressExtracted={addressExtracted}
          setAddressExtracted={setAddressExtracted}
          addressLoading={addressLoading}
          setAddressLoading={setAddressLoading}
          mailSending={mailSending}
          setMailSending={setMailSending}
          mailSent={mailSent}
          setMailSent={setMailSent}
          refreshUser={refreshUser}
        />
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
