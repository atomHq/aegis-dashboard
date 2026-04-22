"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatsCard({
  id,
  label,
  value,
  icon: Icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <div
      id={id}
      className={cn("glass-card p-5 group cursor-default", className)}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-text-secondary font-medium">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-accent-start/10 flex items-center justify-center group-hover:bg-accent-start/15 transition-colors">
          <Icon className="w-4.5 h-4.5 text-accent-start" />
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      {description && (
        <p className="text-xs text-text-tertiary mt-1">{description}</p>
      )}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="glass-card-static p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton w-9 h-9 rounded-lg" />
      </div>
      <div className="skeleton h-8 w-16 mb-1" />
      <div className="skeleton h-3 w-24" />
    </div>
  );
}
