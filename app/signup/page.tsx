"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth, ApiError } from "@/lib/auth-context";
import { slugify, getPasswordStrength } from "@/lib/utils";
import { useMemo } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { AegisLogo } from "@/components/ui/aegis-logo";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    org_name: "",
  });

  // Auto-derive slug from org name
  const orgSlug = useMemo(() => slugify(form.org_name), [form.org_name]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);



  const passwordStrength = getPasswordStrength(form.password);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (form.password.length > 128)
      newErrors.password = "Password must be at most 128 characters";
    if (!form.org_name.trim()) newErrors.org_name = "Organization name is required";
    else if (form.org_name.length < 2)
      newErrors.org_name = "Organization name must be at least 2 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup({ ...form, org_slug: orgSlug });
      toast.success("Account created! Check your email for the verification code.");
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.message.toLowerCase().includes("email")) {
          setErrors({ email: err.message });
        } else if (err.message.toLowerCase().includes("slug")) {
          setErrors({ org_name: err.message });
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-start/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-end/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <AegisLogo iconSize={36} textClass="text-xl" />
          </Link>
          <h1 id="signup-heading" className="text-2xl font-bold text-text-primary">
            Create your account
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Start securing your secrets in minutes
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card-static p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-first-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                  First name
                </label>
                <input
                  id="signup-first-name"
                  type="text"
                  className={`input-field ${errors.first_name ? "error" : ""}`}
                  placeholder="Jane"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  autoComplete="given-name"
                />
                {errors.first_name && (
                  <p className="text-error text-xs mt-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="signup-last-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Last name
                </label>
                <input
                  id="signup-last-name"
                  type="text"
                  className={`input-field ${errors.last_name ? "error" : ""}`}
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  autoComplete="family-name"
                />
                {errors.last_name && (
                  <p className="text-error text-xs mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  className={`input-field pr-10 ${errors.password ? "error" : ""}`}
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  id="signup-toggle-password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password}</p>
              )}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{
                          backgroundColor:
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Org name */}
            <div>
              <label htmlFor="signup-org-name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Organization name
              </label>
              <input
                id="signup-org-name"
                type="text"
                className={`input-field ${errors.org_name ? "error" : ""}`}
                placeholder="Acme Inc"
                value={form.org_name}
                onChange={(e) => handleChange("org_name", e.target.value)}
              />
              {errors.org_name && (
                <p className="text-error text-xs mt-1">{errors.org_name}</p>
              )}
            </div>


            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-6"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            id="signup-login-link"
            className="text-accent-start hover:text-accent-end transition-colors font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
