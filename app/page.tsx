"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Building2,
  FileText,
  KeyRound,
  BarChart3,
  Zap,
  ArrowRight,
  Check,
  Terminal,
  Layers,
  ChevronRight,
} from "lucide-react";
import { AegisLogo, AegisLogoIcon } from "@/components/ui/aegis-logo";

/* ─── Intersection Observer Hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("animate-slide-up"); el.style.opacity = "1"; obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useReveal();
  return <section ref={ref} id={id} className={`opacity-0 ${className}`}>{children}</section>;
}

/* ─── Feature data ─── */
const features = [
  { icon: Lock, title: "Envelope Encryption", desc: "AES-256-GCM with unique data keys per secret. Master → KEK → DEK layered architecture.", color: "text-blue-400" },
  { icon: Building2, title: "Multi-Tenant Isolation", desc: "Complete data isolation between tenants. Each organization's secrets are cryptographically separated.", color: "text-emerald-400" },
  { icon: FileText, title: "Versioned Secrets", desc: "Full version history for every secret. Roll back to any previous version instantly.", color: "text-amber-400" },
  { icon: KeyRound, title: "Scoped API Keys", desc: "Fine-grained RBAC with 6 permission scopes. Limit keys to specific projects.", color: "text-violet-400" },
  { icon: BarChart3, title: "Immutable Audit Trail", desc: "Every read, write, and delete is logged. Query by action, actor, resource, or time range.", color: "text-rose-400" },
  { icon: Zap, title: "Per-Tenant Rate Limiting", desc: "Configurable rate limits per plan tier. Protect your infrastructure from abuse.", color: "text-cyan-400" },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your organization in seconds. Get a default project and start immediately." },
  { num: "02", title: "Create Project", desc: "Organize secrets by environment — development, staging, or production." },
  { num: "03", title: "Store Secrets", desc: "Use API keys with curl, SDKs, or CI/CD pipelines to manage encrypted secrets." },
];

const tiers = [
  { name: "Free", price: "$0", period: "forever", features: ["100 secrets", "5 projects", "60 req/min", "Community support", "Audit logs"], cta: "Get Started Free", highlighted: false },
  { name: "Pro", price: "$10", period: "/month", features: ["10,000 secrets", "50 projects", "300 req/min", "Priority support", "Advanced audit", "Team management"], cta: "Start Pro Trial", highlighted: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited secrets", "Unlimited projects", "Custom rate limits", "24/7 support", "SSO / SAML", "Dedicated infra", "SLA guarantee"], cta: "Contact Sales", highlighted: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ─── NAV ─── */}
      <nav id="landing-nav" className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/[0.06] bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <AegisLogo iconSize={30} textClass="text-lg" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
            <Link href="/docs" className="hover:text-text-primary transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" id="landing-login" className="btn-ghost text-sm">Log In</Link>
            <Link href="/signup" id="landing-cta-nav" className="btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <header className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent-start/8 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent-end/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-60 left-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "5s" }} />

        <div className="relative max-w-4xl mx-auto text-center px-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-text-secondary mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Now in General Availability
          </div>
          <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Secure Your Secrets.{" "}
            <span className="gradient-text">Scale With Confidence.</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Production-ready, multi-tenant secrets management with envelope encryption,
            scoped API keys, and an immutable audit trail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" id="hero-cta" className="btn-primary btn-lg px-8">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="btn-secondary btn-lg px-8">
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* ─── FEATURES ─── */}
      <Section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-start uppercase tracking-wider mb-3">Enterprise-Grade Security</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Everything you need to manage secrets</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 group">
                <div className={`w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── HOW IT WORKS ─── */}
      <Section className="py-20 lg:py-28 bg-bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-start uppercase tracking-wider mb-3">Simple Workflow</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-5 text-2xl font-bold text-white">{s.num}</div>
                {i < 2 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent-start/30 to-transparent" />}
                <h3 className="text-lg font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── ARCHITECTURE ─── */}
      <Section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-start uppercase tracking-wider mb-3">Security Architecture</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Layered Envelope Encryption</h2>
          </div>
          <div className="glass-card-static p-8 lg:p-10">
            <div className="flex flex-col items-center gap-4">
              {[
                { label: "Master Key", sublabel: "Root of trust · Managed by platform", color: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/20", icon: Shield },
                { label: "Key Encryption Key (KEK)", sublabel: "Per-tenant · Encrypts DEKs", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", icon: Layers },
                { label: "Data Encryption Key (DEK)", sublabel: "Per-secret · Unique per value", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", icon: KeyRound },
                { label: "Encrypted Secret Value", sublabel: "AES-256-GCM · Stored at rest", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", icon: Lock },
              ].map((layer, i) => (
                <div key={layer.label} className="w-full max-w-lg">
                  {i > 0 && (
                    <div className="flex justify-center my-1">
                      <ChevronRight className="w-5 h-5 text-text-tertiary rotate-90" />
                    </div>
                  )}
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${layer.color} border ${layer.border} flex items-center gap-4`}>
                    <layer.icon className="w-6 h-6 text-text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{layer.label}</p>
                      <p className="text-xs text-text-tertiary">{layer.sublabel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── CODE EXAMPLE ─── */}
      <Section className="py-20 lg:py-28 bg-bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-start uppercase tracking-wider mb-3">Developer Experience</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Simple, powerful API</h2>
          </div>
          <div className="glass-card-static overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex items-center gap-1.5 ml-3 text-xs text-text-tertiary">
                <Terminal className="w-3.5 h-3.5" />
                terminal
              </div>
            </div>
            <pre className="p-6 text-sm font-mono text-text-secondary leading-relaxed overflow-x-auto">
              <code>{`# Store a secret
$ curl -X PUT http://localhost:8080/api/v1/projects/{id}/secrets \\
    -H "Authorization: Bearer aegis_sk_liv_xxx" \\
    -H "Content-Type: application/json" \\
    -d '{"key": "DATABASE_URL", "value": "postgres://..."}'

{
  "status": "success",
  "data": {
    "id": "a1b2c3d4-...",
    "key": "DATABASE_URL",
    "version": 1,
    "created_at": "2026-04-21T00:00:00Z"
  }
}

# Retrieve it
$ curl http://localhost:8080/api/v1/projects/{id}/secrets/DATABASE_URL \\
    -H "Authorization: Bearer aegis_sk_liv_xxx"

{
  "status": "success",
  "data": {
    "key": "DATABASE_URL",
    "value": "postgres://...",
    "version": 1
  }
}`}</code>
            </pre>
          </div>
        </div>
      </Section>

      {/* ─── PRICING ─── */}
      <Section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-accent-start uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Start free, scale as you grow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-7 border transition-all flex flex-col ${
                  tier.highlighted
                    ? "bg-accent-start/5 border-accent-start/20 shadow-lg shadow-accent-start/5"
                    : "glass-card-static"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-text-primary mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-extrabold text-text-primary">{tier.price}</span>
                  {tier.period && <span className="text-sm text-text-tertiary">{tier.period}</span>}
                </div>
                <ul className="space-y-3 mb-7 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`w-full block text-center mt-auto ${tier.highlighted ? "btn-primary" : "btn-secondary"}`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CTA BANNER ─── */}
      <Section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="glass-card-static p-12 gradient-border">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Ready to secure your secrets?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Join developers and teams who trust Aegis for production-grade secrets management.
            </p>
            <Link href="/signup" className="btn-primary btn-lg px-10">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AegisLogo iconSize={22} textClass="text-sm font-semibold" />
          </div>
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} Aegis. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
            <Link href="/docs" className="hover:text-text-secondary transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
