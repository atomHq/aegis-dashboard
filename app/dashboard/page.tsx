"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/hooks/use-projects";
import { useApiKeys } from "@/hooks/use-api-keys";
import {
  StatsCard,
  StatsCardSkeleton,
} from "@/components/dashboard/stats-card";
import {
  FolderKanban,
  KeyRound,
  CreditCard,
  Gauge,
  Plus,
  Zap,
  ArrowRight,
  BookOpen,
  Rocket,
} from "lucide-react";

export default function DashboardPage() {
  const { user, tenant } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: apiKeys, isLoading: keysLoading } = useApiKeys();

  const isLoading = projectsLoading || keysLoading;
  const projectCount = projects?.length ?? 0;
  const keyCount = apiKeys?.length ?? 0;
  const isNewUser = projectCount <= 1;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 id="dashboard-title" className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.first_name} 👋
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Here&apos;s an overview of your secrets management platform.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              id="stat-projects"
              label="Total Projects"
              value={projectCount}
              icon={FolderKanban}
              description={
                tenant
                  ? `${projectCount} / ${tenant.max_projects} projects`
                  : undefined
              }
            />
            <StatsCard
              id="stat-api-keys"
              label="API Keys"
              value={keyCount}
              icon={KeyRound}
              description="Active keys"
            />
            <StatsCard
              id="stat-plan"
              label="Current Plan"
              value={tenant?.plan ? tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1) : "—"}
              icon={CreditCard}
              description={
                tenant?.plan === "free" ? "Upgrade for more" : "Premium features enabled"
              }
            />
            <StatsCard
              id="stat-rate-limit"
              label="Rate Limit"
              value={tenant?.rate_limit_per_min ? `${tenant.rate_limit_per_min}/min` : "—"}
              icon={Gauge}
              description="Requests per minute"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/projects"
          id="quick-create-project"
          className="glass-card p-5 flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-start/10 flex items-center justify-center group-hover:bg-accent-start/15 transition-colors">
            <Plus className="w-5 h-5 text-accent-start" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-text-primary">Create Project</p>
            <p className="text-sm text-text-secondary">
              Set up a new environment for your secrets
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-start transition-colors" />
        </Link>

        <Link
          href="/dashboard/api-keys"
          id="quick-create-key"
          className="glass-card p-5 flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-end/10 flex items-center justify-center group-hover:bg-accent-end/15 transition-colors">
            <Zap className="w-5 h-5 text-accent-end" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-text-primary">Generate API Key</p>
            <p className="text-sm text-text-secondary">
              Create a key for programmatic secret access
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-accent-end transition-colors" />
        </Link>
      </div>

      {/* Plan Usage */}
      {tenant && (
        <div className="glass-card-static p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Plan Usage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">Projects</span>
                <span className="text-text-primary font-medium">
                  {projectCount} / {tenant.max_projects}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(
                      (projectCount / tenant.max_projects) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-secondary">Max Secrets</span>
                <span className="text-text-primary font-medium">
                  {tenant.max_secrets.toLocaleString()} allowed
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: "0%" }} />
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                Secret count available via API keys
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started (for new users) */}
      {isNewUser && !isLoading && (
        <div className="glass-card-static p-6 gradient-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                Get Started with Aegis
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                Follow these steps to start managing your secrets securely.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Create a Project</p>
                    <p className="text-xs text-text-secondary">
                      Projects organize your secrets by environment (dev, staging, production).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Generate an API Key</p>
                    <p className="text-xs text-text-secondary">
                      API keys are used to read/write secrets programmatically.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Store Your First Secret</p>
                    <p className="text-xs text-text-secondary">
                      Use your API key with curl or an SDK to store encrypted secrets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
