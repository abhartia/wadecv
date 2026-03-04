"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, User, Lock, Trash2, AlertTriangle, Shield, FileText, Upload, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, token, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newSetPassword, setNewSetPassword] = useState("");
  const [profileAdditionalInfo, setProfileAdditionalInfo] = useState(user?.additional_info || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword, token);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newSetPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.setPassword(newSetPassword, token);
      toast.success("Password set successfully");
      setNewSetPassword("");
      await refreshUser();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to set password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    setDeleteLoading(true);
    try {
      await api.deleteAccount(token);
      toast.success("Account deleted. We're sorry to see you go.");
      logout();
      router.push("/");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label>Account Created</Label>
            <Input value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""} disabled />
          </div>
        </CardContent>
      </Card>

      {/* CV Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Your CV Profile
          </CardTitle>
          <CardDescription>
            Your saved CV and additional information used to generate tailored CVs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Base CV</Label>
            {user?.has_profile ? (
              <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">CV uploaded</span>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {user.base_cv_content?.slice(0, 200)}...
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed text-sm text-muted-foreground text-center">
                No CV uploaded yet
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f || !token) return;
                  setUploadLoading(true);
                  try {
                    await api.uploadProfile(f, token);
                    await refreshUser();
                    toast.success("CV profile updated!");
                  } catch (err: unknown) {
                    toast.error((err as Error).message || "Upload failed");
                  } finally {
                    setUploadLoading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
              >
                {uploadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {user?.has_profile ? "Re-upload CV" : "Upload CV"}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="profile-info">Additional Information</Label>
            <Textarea
              id="profile-info"
              placeholder="Skills, achievements, certifications, or other details not in your CV..."
              rows={4}
              value={profileAdditionalInfo}
              onChange={(e) => setProfileAdditionalInfo(e.target.value)}
            />
            <Button
              size="sm"
              disabled={profileLoading}
              onClick={async () => {
                if (!token) return;
                setProfileLoading(true);
                try {
                  await api.updateProfile({ additional_info: profileAdditionalInfo }, token);
                  await refreshUser();
                  toast.success("Additional info saved!");
                } catch (err: unknown) {
                  toast.error((err as Error).message || "Failed to save");
                } finally {
                  setProfileLoading(false);
                }
              }}
            >
              {profileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Additional Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Password
          </CardTitle>
          <CardDescription>
            {user?.has_password
              ? "Change the password you use to sign in."
              : "You currently sign in with email links. Set a password if you'd like to sign in with email + password as well."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.has_password ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="set-password">Create password</Label>
                <Input
                  id="set-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={newSetPassword}
                  onChange={(e) => setNewSetPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  You can still sign in with magic links after adding a password.
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set Password
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Data & Privacy
          </CardTitle>
          <CardDescription>
            Manage your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your data is stored securely on Azure servers. You can request deletion of all your data at any time.
          </p>
          <Separator />
          <div className="flex items-start gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-destructive">Danger Zone</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data including CVs, cover letters, and application history. This action cannot be undone.
              </p>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mt-3">
                    <Trash2 className="mr-2 h-4 w-4" />Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your account and all associated data. Your remaining credits will be forfeited. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
                      {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Yes, delete my account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
