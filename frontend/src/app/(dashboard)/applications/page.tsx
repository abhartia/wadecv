"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Briefcase, FileText, Download, Mail, ExternalLink, ChevronDown, Edit3 } from "lucide-react";

interface Job {
  id: string;
  cv_id: string;
  job_url: string | null;
  job_description: string;
  company_name: string | null;
  job_title: string | null;
  application_status: string;
  applied_at: string | null;
  created_at: string;
   fit_score: number | null;
}

const STATUSES = [
  { value: "generated", label: "Generated" },
  { value: "cv_accepted", label: "CV Accepted" },
  { value: "cv_rejected", label: "CV Rejected" },
];

const statusColors: Record<string, string> = {
  generated: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  cv_accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  cv_rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const getStatusLabel = (status: string) =>
  STATUSES.find((s) => s.value === status)?.label ?? status;

export default function ApplicationsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [coverLetterLoading, setCoverLetterLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.listJobs(token, filter === "all" ? undefined : filter)
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [token, filter]);

  const updateStatus = async (jobId: string, newStatus: string) => {
    if (!token) return;

    // Optimistically update in the UI so it feels responsive
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, application_status: newStatus } : j)),
    );

    try {
      await api.updateJob(jobId, { application_status: newStatus }, token);
      toast.success("Status updated");
    } catch {
      // If the API call fails, reload the jobs from the server on next filter change
      toast.error("Failed to update status");
      setFilter("all");
    }
  };

  const handleGenerateCoverLetter = async (jobId: string) => {
    if (!token) return;
    setCoverLetterLoading(jobId);
    try {
      await api.generateCoverLetter(jobId, token);
      toast.success("Cover letter generated!");
    } catch (err: unknown) {
      const message = (err as Error).message;
      if (message.includes("already exists")) {
        toast.info("Cover letter already exists for this job.");
      } else {
        toast.error(message || "Failed to generate cover letter");
      }
    } finally {
      setCoverLetterLoading(null);
    }
  };

  const handleDownloadCoverLetter = async (jobId: string, format: "docx" | "pdf") => {
    if (!token) return;
    try {
      const response = await api.downloadCoverLetter(jobId, token, format);
      const contentType = response.headers.get("content-type") || "";
      const expected = format === "pdf" ? "application/pdf" : "officedocument.wordprocessingml.document";
      if (!response.ok || !contentType.includes(expected)) {
        let message = "Cover letter not found. Generate one first.";
        try {
          const errorData = await response.json();
          message = (errorData as { detail?: string }).detail || message;
        } catch {
          // ignore JSON parse errors and use default message
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
          // ignore JSON parse errors and use default message
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
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDownloadCV = async (cvId: string, format: "docx" | "pdf") => {
    if (!token) return;
    try {
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
          // ignore body read errors and use default message
        }
        toast.error(message);
        return;
      }
      const blob = await response.blob();
      // eslint-disable-next-line no-console
      console.log("Downloaded CV blob", { size: blob.size, type: blob.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("content-disposition") || "";
      const match = /filename="?([^"]+)"?/i.exec(disposition);
      a.download = match?.[1] ?? `Tailored_CV.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">Track and manage your job applications</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No applications yet</h3>
            <p className="text-muted-foreground">
              Applications are created automatically when you generate a tailored CV.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="px-4 pb-4 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Fit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {job.job_title || "Untitled Position"}
                        {job.job_url && (
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{job.company_name || "—"}</TableCell>
                    <TableCell>
                      {job.fit_score != null ? (
                        <Badge
                          variant="outline"
                          className={
                            job.fit_score >= 70
                              ? "border-emerald-500 text-emerald-600 dark:text-emerald-300"
                              : job.fit_score >= 40
                                ? "border-amber-500 text-amber-600 dark:text-amber-300"
                                : "border-red-500 text-red-600 dark:text-red-300"
                          }
                        >
                          {job.fit_score}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            <Badge
                              variant="secondary"
                              className={statusColors[job.application_status] || ""}
                            >
                              {getStatusLabel(job.application_status)}
                            </Badge>
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {STATUSES.map((s) => (
                            <DropdownMenuItem
                              key={s.value}
                              onClick={() => updateStatus(job.id, s.value)}
                            >
                              {s.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(job.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/tailor?job=${job.id}`} prefetch={false}>
                          <Button variant="ghost" size="icon" title="Edit CV">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" title="Download CV">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadCV(job.cv_id, "docx")}>
                              Download CV as DOCX
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadCV(job.cv_id, "pdf")}>
                              Download CV as PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Generate Cover Letter"
                          disabled={coverLetterLoading === job.id}
                          onClick={() => handleGenerateCoverLetter(job.id)}
                        >
                          {coverLetterLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" title="Download Cover Letter">
                              <Download className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownloadCoverLetter(job.id, "docx")}>
                              Download Cover Letter as DOCX
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadCoverLetter(job.id, "pdf")}>
                              Download Cover Letter as PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
