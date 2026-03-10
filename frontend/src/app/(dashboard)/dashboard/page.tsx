"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Plus, Briefcase, ArrowRight, Loader2, Sparkles, Upload, Check, X } from "lucide-react";

interface CVItem {
  id: string;
  original_filename: string;
  status: string;
  created_at: string;
  job_title: string | null;
  company_name: string | null;
}

interface JobItem {
  id: string;
  cv_id: string;
  job_title: string | null;
  company_name: string | null;
  application_status: string;
  created_at: string;
  fit_score: number | null;
}

const statusColors: Record<string, string> = {
  generated: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  applied: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  interviewing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  offered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  cv_rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  cv_accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "generated":
      return "Generated";
    case "cv_accepted":
      return "CV Accepted";
    case "cv_rejected":
      return "CV Rejected";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const decidedJobs = jobs.filter((job) =>
    ["accepted", "rejected", "cv_accepted", "cv_rejected"].includes(job.application_status),
  );
  const acceptedJobs = decidedJobs.filter(
    (job) =>
      job.application_status === "accepted" || job.application_status === "cv_accepted",
  );
  const successRate =
    decidedJobs.length === 0 ? null : Math.round((acceptedJobs.length / decidedJobs.length) * 100);

  useEffect(() => {
    if (!token) return;
    api
      .listJobs(token)
      .then((jobsData) => {
        setJobs(jobsData);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdateApplicationStatus = async (
    jobId: string,
    status: "cv_accepted" | "cv_rejected",
  ) => {
    if (!token) return;
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, application_status: status } : job
      )
    );
    try {
      await api.updateJob(jobId, { application_status: status }, token);
    } catch {
      // Ignore errors; status will refresh on next load.
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s an overview of your activity.</p>
        </div>
        <Link href="/tailor" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" />Tailor New CV</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-0">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credits Available</p>
                <p className="text-3xl font-bold">{user?.credits ?? 0}</p>
              </div>
              <Coins className="h-10 w-10 text-primary/20" />
            </div>
            <Link href="/billing" className="text-sm text-primary hover:underline mt-2 inline-block">
              Buy more credits <ArrowRight className="inline h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-3xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="h-10 w-10 text-primary/20" />
            </div>
            <Link href="/applications" className="text-sm text-primary hover:underline mt-2 inline-block">
              View all <ArrowRight className="inline h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">% Success</p>
                <p className="text-3xl font-bold">
                  {successRate === null ? "N/A" : `${successRate}%`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on CV Accepted vs CV Rejected applications
                </p>
              </div>
              <Check className="h-10 w-10 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {!user?.has_profile && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Set up your profile to get started</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Upload your CV once and we&apos;ll remember it. Then you can generate tailored CVs just by adding a job description.
                </p>
              </div>
              <Link href="/tailor">
                <Button className="gap-2 shrink-0">
                  <Upload className="h-4 w-4" />Set Up Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Applications */}
      <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No applications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => {
                  const isAccepted =
                    job.application_status === "cv_accepted" ||
                    job.application_status === "accepted";
                  const isRejected =
                    job.application_status === "cv_rejected" ||
                    job.application_status === "rejected";
                  return (
                    <div
                      key={job.id}
                      className="flex flex-col gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors sm:flex-row sm:items-center sm:justify-between"
                    >
                      <Link href={`/tailor?job=${job.id}`} className="min-w-0 flex-1">
                        <div>
                          <p className="font-medium truncate">
                            {job.job_title || "Untitled Position"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {job.company_name || "Unknown Company"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(job.created_at).toLocaleString()}
                          </p>
                        </div>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 shrink-0 sm:ml-4">
                        <div className="flex flex-col items-start sm:items-end gap-1">
                          {job.fit_score != null && (
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
                              {job.fit_score}% fit
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className={statusColors[job.application_status] || ""}
                          >
                            {getStatusLabel(job.application_status)}
                          </Badge>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={`min-h-[44px] min-w-[44px] ${isAccepted ? "opacity-100" : "opacity-60"}`}
                            disabled={isAccepted}
                            onClick={() =>
                              handleUpdateApplicationStatus(job.id, "cv_accepted")
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={`min-h-[44px] min-w-[44px] ${isRejected ? "opacity-100" : "opacity-60"}`}
                            disabled={isRejected}
                            onClick={() =>
                              handleUpdateApplicationStatus(job.id, "cv_rejected")
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
