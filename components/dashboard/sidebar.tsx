"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  KeyRound,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AegisLogo, AegisLogoIcon } from "@/components/ui/aegis-logo";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    id: "nav-dashboard",
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: FolderKanban,
    id: "nav-projects",
  },
  {
    href: "/dashboard/api-keys",
    label: "API Keys",
    icon: KeyRound,
    id: "nav-api-keys",
  },
  {
    href: "/docs",
    label: "Docs",
    icon: BookOpen,
    id: "nav-docs",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    id: "nav-settings",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex flex-col border-r transition-all duration-300 ease-in-out",
          "bg-bg-secondary/80 backdrop-blur-xl border-white/[0.06]",
          collapsed ? "w-[68px]" : "w-[240px]",
          "lg:relative lg:z-auto",
          // Mobile: hide when collapsed
          collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center h-16 px-4 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            {collapsed ? (
              <AegisLogoIcon size={28} className="flex-shrink-0" />
            ) : (
              <AegisLogo iconSize={28} textClass="text-lg" />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={item.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-accent-start/10 text-accent-start border border-accent-start/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    active ? "text-accent-start" : ""
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="hidden lg:block p-3 border-t border-white/[0.06]">
          <button
            id="sidebar-toggle"
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-text-tertiary hover:text-text-secondary hover:bg-white/[0.04] transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
