"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getInitials, getPlanColor } from "@/lib/utils";
import {
  Menu,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { user, tenant, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate breadcrumbs
  function getBreadcrumbs() {
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      let label = seg.charAt(0).toUpperCase() + seg.slice(1);
      label = label.replace(/-/g, " ");

      // If it's a UUID-like segment, show "Details"
      if (/^[0-9a-f]{8}-/.test(seg)) {
        label = "Details";
      }

      crumbs.push({ label, href });
    }
    return crumbs;
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      id="top-bar"
      className="h-16 border-b border-white/[0.06] bg-bg-secondary/60 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 flex-shrink-0"
    >
      {/* Left: menu + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          id="topbar-menu"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? "text-text-primary font-medium"
                    : "text-text-tertiary"
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: org + user */}
      <div className="flex items-center gap-4">
        {/* Org badge */}
        {tenant && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-text-secondary font-medium">
              {tenant.name}
            </span>
            <span className={`badge ${getPlanColor(tenant.plan)}`}>
              {tenant.plan}
            </span>
          </div>
        )}

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="topbar-user-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
              {user ? getInitials(user.first_name, user.last_name) : "??"}
            </div>
          </button>

          {dropdownOpen && (
            <div
              id="topbar-user-dropdown"
              className="absolute right-0 top-full mt-2 w-56 glass-card-static p-1.5 animate-scale-in z-50"
            >
              {/* User info */}
              <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1.5">
                <p className="text-sm font-medium text-text-primary">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-text-tertiary truncate">
                  {user?.email}
                </p>
              </div>

              <button
                id="topbar-profile"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              <button
                id="topbar-logout"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-error hover:bg-error/10 transition-colors"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
