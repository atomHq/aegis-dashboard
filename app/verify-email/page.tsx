"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth, ApiError } from "@/lib/auth-context";
import { Shield, Loader2, Mail, RotateCw } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyEmail, resendVerification } = useAuth();

  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmitCode = useCallback(
    async (code: string) => {
      if (!email) {
        toast.error("Email is required. Please sign up first.");
        return;
      }
      setIsSubmitting(true);
      setError("");
      try {
        await verifyEmail({ email, code });
        toast.success("Email verified! You can now log in.");
        router.push("/login");
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Verification failed. Please try again.");
        }
        // Clear digits and refocus
        setDigits(["", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, verifyEmail, router]
  );

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (value && index === 4) {
      const code = newDigits.join("");
      if (code.length === 5) {
        handleSubmitCode(code);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 5; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    if (pasted.length === 5) {
      handleSubmitCode(pasted);
    } else {
      inputRefs.current[Math.min(pasted.length, 4)]?.focus();
    }
  }

  async function handleResend() {
    if (cooldown > 0 || !email) return;
    setIsResending(true);
    try {
      await resendVerification(email);
      toast.success("Verification code resent!");
      setCooldown(60);
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card-static p-8 max-w-md w-full text-center animate-fade-in">
          <Mail className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">No email provided</h1>
          <p className="text-text-secondary text-sm mb-6">
            Please sign up first to receive a verification code.
          </p>
          <Link href="/signup" className="btn-primary">
            Go to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-accent-start/8 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent-end/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Aegis</span>
          </Link>
          <h1 id="verify-heading" className="text-2xl font-bold text-text-primary">
            Verify your email
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            We sent a 5-digit code to{" "}
            <span className="text-text-primary font-medium">{email}</span>
          </p>
        </div>

        {/* OTP Card */}
        <div className="glass-card-static p-8">
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                id={`verify-digit-${i}`}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`w-14 h-16 text-center text-2xl font-bold input-field ${
                  error ? "error" : digit ? "border-accent-start/50" : ""
                }`}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isSubmitting}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {error && (
            <p id="verify-error" className="text-error text-sm text-center mb-4">
              {error}
            </p>
          )}

          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 text-text-secondary text-sm mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            <p className="text-text-secondary text-sm mb-2">
              Didn&apos;t receive a code?
            </p>
            <button
              id="verify-resend"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="btn-ghost text-accent-start disabled:text-text-tertiary"
            >
              {isResending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCw className="w-4 h-4" />
              )}
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text-secondary mt-6">
          Wrong email?{" "}
          <Link
            href="/signup"
            id="verify-signup-link"
            className="text-accent-start hover:text-accent-end transition-colors font-medium"
          >
            Sign up again
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-start" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
