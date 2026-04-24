"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth, ApiError } from "@/lib/auth-context";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { AegisLogo } from "@/components/ui/aegis-logo";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // Show session expired toast (once) and clean up the URL
  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast.error("Session expired. Please log in again.");
      // Remove the query param so it doesn't re-fire
      const url = new URL(window.location.href);
      url.searchParams.delete("expired");
      window.history.replaceState({}, "", url.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setUnverifiedEmail(null);
    try {
      await login(form);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        // Detect "email not verified" scenario
        if (
          err.message.toLowerCase().includes("not verified") ||
          err.message.toLowerCase().includes("email not verified")
        ) {
          setUnverifiedEmail(form.email);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setUnverifiedEmail(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent-start/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-end/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <AegisLogo iconSize={36} textClass="text-xl" />
          </Link>
          <h1 id="login-heading" className="text-2xl font-bold text-text-primary">
            Welcome back
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Log in to your Aegis dashboard
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card-static p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Unverified email banner */}
            {unverifiedEmail && (
              <div id="login-unverified-banner" className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
                <p className="text-warning font-medium mb-1">Email not verified</p>
                <p className="text-text-secondary">
                  Please verify your email first.{" "}
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="text-accent-start hover:text-accent-end font-medium underline"
                  >
                    Go to verification
                  </Link>
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                className={`input-field ${errors.email ? "error" : ""}`}
                placeholder="jane@company.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`input-field pr-10 ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="login-toggle-password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-6"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            id="login-signup-link"
            className="text-accent-start hover:text-accent-end transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-start" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
