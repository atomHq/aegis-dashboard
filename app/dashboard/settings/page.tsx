"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useTenant, useUpdateTenant } from "@/hooks/use-tenant";
import { formatDate } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import {
  Building2,
  Save,
  Loader2,
  Shield,
  Zap,
  Database,
  Gauge,
} from "lucide-react";

export default function SettingsPage() {
  const { tenant: authTenant } = useAuth();
  const { data: tenant, isLoading } = useTenant();
  const updateTenant = useUpdateTenant();

  const [name, setName] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const currentTenant = tenant || authTenant;

  useEffect(() => {
    if (currentTenant) {
      setName(currentTenant.name);
    }
  }, [currentTenant]);

  async function handleSave() {
    if (!name.trim() || name.length < 2) {
      toast.error("Organization name must be at least 2 characters.");
      return;
    }
    try {
      await updateTenant.mutateAsync({ name });
      toast.success("Organization updated!");
      setIsDirty(false);
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to update organization.");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-40" />
        <div className="glass-card-static p-6 space-y-4">
          <div className="skeleton h-6 w-64" />
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!currentTenant) return null;

  const planLimits = {
    free: { secrets: 100, projects: 5, rate: 60 },
    pro: { secrets: 10000, projects: 50, rate: 300 },
    enterprise: { secrets: "Unlimited", projects: "Unlimited", rate: "Custom" },
  };

  const limits = planLimits[currentTenant.plan] || planLimits.free;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 id="settings-title" className="text-2xl font-bold text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage your organization settings and plan.
        </p>
      </div>

      {/* Organization Settings */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-accent-start/10 flex items-center justify-center">
            <Building2 className="w-4.5 h-4.5 text-accent-start" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            Organization
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="settings-org-name" className="block text-sm font-medium text-text-secondary mb-1.5">
              Organization Name
            </label>
            <input
              id="settings-org-name"
              type="text"
              className="input-field max-w-md"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Organization Slug
            </label>
            <div className="flex items-center gap-2">
              <code className="text-sm text-text-tertiary font-mono bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.06]">
                {currentTenant.slug}
              </code>
              <span className="text-xs text-text-tertiary">(cannot be changed)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-tertiary mb-1">Tenant ID</p>
              <code className="text-xs text-text-secondary font-mono break-all">
                {currentTenant.id}
              </code>
            </div>
            <div>
              <p className="text-sm text-text-tertiary mb-1">Created</p>
              <p className="text-sm text-text-primary">
                {formatDate(currentTenant.created_at)}
              </p>
            </div>
          </div>

          {isDirty && (
            <button
              id="settings-save"
              onClick={handleSave}
              disabled={updateTenant.isPending}
              className="btn-primary"
            >
              {updateTenant.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Plan Details */}
      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-end/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-accent-end" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Plan Details
              </h2>
              <p className="text-xs text-text-secondary">
                Current plan and resource limits
              </p>
            </div>
          </div>
          <span className={`badge ${
            currentTenant.plan === "enterprise"
              ? "badge-accent"
              : currentTenant.plan === "pro"
              ? "badge-success"
              : "badge-neutral"
          } text-sm px-4 py-1`}>
            {currentTenant.plan.charAt(0).toUpperCase() + currentTenant.plan.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-text-tertiary" />
              <p className="text-sm text-text-secondary">Max Secrets</p>
            </div>
            <p className="text-xl font-bold text-text-primary">
              {typeof limits.secrets === "number"
                ? limits.secrets.toLocaleString()
                : limits.secrets}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-text-tertiary" />
              <p className="text-sm text-text-secondary">Max Projects</p>
            </div>
            <p className="text-xl font-bold text-text-primary">
              {typeof limits.projects === "number"
                ? limits.projects
                : limits.projects}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-text-tertiary" />
              <p className="text-sm text-text-secondary">Rate Limit</p>
            </div>
            <p className="text-xl font-bold text-text-primary">
              {typeof limits.rate === "number"
                ? `${limits.rate}/min`
                : limits.rate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
