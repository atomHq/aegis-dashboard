import Link from "next/link";
import {
  Archive,
  BookOpen,
  Boxes,
  Braces,
  Clock3,
  FileClock,
  GitBranch,
  History,
  KeyRound,
  LockKeyhole,
  Logs,
  Package,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AegisLogo } from "@/components/ui/aegis-logo";

const docNav = [
  {
    title: "Get Started",
    items: [
      ["Sign up for Aegis", "#sign-up"],
      ["Create a project and generate keys", "#create-project-keys"],
    ],
  },
  {
    title: "Core Concepts",
    items: [
      ["Secrets in Aegis", "#concept-secrets"],
      ["Projects in Aegis", "#concept-projects"],
      ["API keys and scopes", "#concept-api-keys"],
      ["How Aegis encrypts secrets", "#concept-encryption"],
    ],
  },
  {
    title: "Guides",
    items: [
      ["Store and retrieve secrets", "#guide-store-retrieve"],
      ["Manage secret versions", "#guide-versions"],
      ["Query audit logs", "#guide-audit-logs"],
      ["Rate limits and best practices", "#guide-rate-limits"],
    ],
  },
  {
    title: "API Reference",
    items: [
      ["Projects", "#api-projects"],
      ["Secrets", "#api-secrets"],
      ["Audit logs", "#api-audit-logs"],
    ],
  },
];

const sdkSnippets = [
  {
    name: "Node.js",
    install: "npm install @aegis/sdk",
    code: `import { AegisClient } from "@aegis/sdk";

const aegis = new AegisClient({
  apiKey: process.env.AEGIS_API_KEY,
  baseUrl: process.env.AEGIS_BASE_URL,
});

await aegis.putSecret(projectId, {
  key: "DATABASE_URL",
  value: "postgres://prod.example/db",
});

const secret = await aegis.getSecret(projectId, "DATABASE_URL");
const secrets = await aegis.bulkGetSecrets(projectId, [
  "DATABASE_URL",
  "STRIPE_SECRET_KEY",
]);`,
  },
  {
    name: "Python",
    install: "pip install git+https://github.com/atomHq/aegis-python.git",
    code: `from aegis_sdk import AegisClient

aegis = AegisClient(
    api_key=os.environ["AEGIS_API_KEY"],
    base_url=os.environ.get("AEGIS_BASE_URL"),
)

aegis.put_secret(project_id, {
    "key": "DATABASE_URL",
    "value": "postgres://prod.example/db",
})

secret = aegis.get_secret(project_id, "DATABASE_URL")
secrets = aegis.bulk_get_secrets(project_id, [
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
])`,
  },
  {
    name: "Go",
    install: "go get github.com/oluwasemilore/aegis-go",
    code: `client := aegis.NewClient(
    os.Getenv("AEGIS_API_KEY"),
    aegis.WithBaseURL(os.Getenv("AEGIS_BASE_URL")),
)

_, err := client.PutSecret(ctx, projectID, aegis.PutSecretInput{
    Key: "DATABASE_URL",
    Value: "postgres://prod.example/db",
})
if err != nil {
    return err
}

secret, err := client.GetSecret(ctx, projectID, "DATABASE_URL")
if err != nil {
    return err
}

secrets, err := client.BulkGetSecrets(ctx, projectID, []string{
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
})`,
  },
];

const scopes = [
  ["secrets:read", "List secret keys, read secret values, and inspect versions."],
  ["secrets:write", "Create, update, bulk write, and import secrets."],
  ["secrets:admin", "Delete secrets."],
  ["projects:manage", "Create, update, and delete projects."],
  ["audit:read", "Query audit logs for your tenant."],
];

const apiSections = [
  {
    id: "api-projects",
    title: "Projects",
    routes: [
      ["GET", "/api/v1/projects", "List projects", "API key", "Any active API key"],
      ["POST", "/api/v1/projects", "Create a project", "API key", "projects:manage"],
      ["GET", "/api/v1/projects/{id}", "Get one project", "API key", "Any active API key"],
      ["PATCH", "/api/v1/projects/{id}", "Update a project", "API key", "projects:manage"],
      ["DELETE", "/api/v1/projects/{id}", "Delete a project", "API key", "projects:manage"],
    ],
  },
  {
    id: "api-secrets",
    title: "Secrets",
    routes: [
      ["GET", "/api/v1/projects/{id}/secrets", "List secret keys", "API key", "secrets:read"],
      ["PUT", "/api/v1/projects/{id}/secrets", "Store a secret", "API key", "secrets:write"],
      ["PUT", "/api/v1/projects/{id}/secrets/bulk", "Store secrets in bulk", "API key", "secrets:write"],
      ["POST", "/api/v1/projects/{id}/secrets/bulk", "Retrieve secrets in bulk", "API key", "secrets:read"],
      ["POST", "/api/v1/projects/{id}/secrets/import", "Import env or JSON secrets", "API key", "secrets:write"],
      ["GET", "/api/v1/projects/{id}/secrets/{key}", "Retrieve a secret", "API key", "secrets:read"],
      ["DELETE", "/api/v1/projects/{id}/secrets/{key}", "Delete a secret", "API key", "secrets:admin"],
      ["GET", "/api/v1/projects/{id}/secrets/{key}/versions", "List versions", "API key", "secrets:read"],
      ["GET", "/api/v1/projects/{id}/secrets/{key}/versions/{version}", "Retrieve a version", "API key", "secrets:read"],
    ],
  },
  {
    id: "api-audit-logs",
    title: "Audit Logs",
    routes: [
      ["GET", "/api/v1/audit-logs", "Query audit logs", "API key", "audit:read"],
    ],
  },
];

const codeClass =
  "overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-4 text-sm leading-relaxed text-text-secondary";

function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/[0.06] pt-10">
      <p className="text-sm font-semibold text-accent-start">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-50 h-14 border-b border-white/[0.06] bg-bg-primary/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <AegisLogo iconSize={26} textClass="text-lg" />
          </Link>
          <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] p-1 text-sm text-text-secondary md:flex">
            <a href="#get-started" className="rounded-full bg-white/[0.07] px-4 py-1.5 text-text-primary">
              Documentation
            </a>
            <a href="#api-reference" className="rounded-full px-4 py-1.5 hover:text-text-primary">
              API Reference
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost btn-sm hidden sm:inline-flex">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
        <aside className="hidden h-[calc(100vh-56px)] overflow-y-auto border-r border-white/[0.06] px-5 py-8 lg:sticky lg:top-14 lg:block">
          <nav className="space-y-8">
            {docNav.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {group.title}
                </p>
                <div className="space-y-2">
                  {group.items.map(([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      className="block text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 px-5 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <section id="get-started" className="scroll-mt-24">
              <p className="text-sm font-semibold text-accent-start">Get Started</p>
              <h1 className="mt-3 text-4xl font-bold tracking-normal text-text-primary sm:text-5xl">
                Aegis Documentation
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
                Aegis is a production-ready secrets management platform for storing,
                retrieving, versioning, and auditing application secrets with scoped
                API keys and AES-256-GCM envelope encryption.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  [ShieldCheck, "API-key first", "Server-to-server routes use bearer API keys with narrow scopes."],
                  [History, "Versioned secrets", "Every write creates a new version while preserving retrieval history."],
                  [Logs, "Immutable audit trail", "Reads, writes, deletes, imports, and audit queries are logged."],
                  [Package, "SDKs included", "Use the REST API directly or start with Node.js, Python, and Go SDKs."],
                ].map(([Icon, title, body]) => (
                  <div key={title as string} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-5">
                    <Icon className="h-5 w-5 text-accent-start" />
                    <h3 className="mt-4 font-semibold text-text-primary">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{body as string}</p>
                  </div>
                ))}
              </div>
            </section>

            <SectionHeading id="sign-up" eyebrow="Get Started" title="1. Sign up for Aegis">
              <p className="mt-4 leading-7 text-text-secondary">
                Create your account from the public <Link href="/signup" className="text-accent-start hover:text-accent-end">sign up page</Link>.
                Aegis creates your user, organization, default project, and an initial
                admin API key during onboarding. After signing up, verify your email and
                save the API key somewhere secure because plaintext keys are shown once.
              </p>
            </SectionHeading>

            <SectionHeading id="create-project-keys" eyebrow="Get Started" title="2. Create a project and generate keys">
              <div className="mt-4 space-y-4 leading-7 text-text-secondary">
                <p>
                  Use projects to separate environments such as development, staging,
                  and production. You can create projects in the dashboard, then create
                  API keys with only the scopes your application needs.
                </p>
                <pre className={codeClass}>
                  <code>{`Authorization: Bearer aegis_sk_live_...
Content-Type: application/json`}</code>
                </pre>
              </div>
            </SectionHeading>

            <SectionHeading id="sdks" eyebrow="SDKs" title="Available SDKs">
              <div className="mt-5 grid gap-4">
                {sdkSnippets.map((sdk) => (
                  <article key={sdk.name} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-5">
                    <div className="flex items-center gap-3">
                      <Boxes className="h-5 w-5 text-accent-start" />
                      <h3 className="font-semibold text-text-primary">{sdk.name}</h3>
                    </div>
                    <pre className={`${codeClass} mt-4`}>
                      <code>{sdk.install}</code>
                    </pre>
                    <pre className={`${codeClass} mt-3`}>
                      <code>{sdk.code}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </SectionHeading>

            <SectionHeading id="concept-secrets" eyebrow="Core Concepts" title="Secrets in Aegis">
              <p className="mt-4 leading-7 text-text-secondary">
                A secret is a named sensitive value inside a project, such as
                <code className="mx-1 rounded bg-white/[0.06] px-1.5 py-0.5 text-sm">DATABASE_URL</code>
                or an API token. Reads return the latest active value by default, while
                version endpoints let you inspect previous values.
              </p>
            </SectionHeading>

            <SectionHeading id="concept-projects" eyebrow="Core Concepts" title="Projects in Aegis">
              <p className="mt-4 leading-7 text-text-secondary">
                Projects group secrets by application, service, or environment. API keys
                can be scoped to projects, so a CI key for one service does not need access
                to every secret in the organization.
              </p>
            </SectionHeading>

            <SectionHeading id="concept-api-keys" eyebrow="Core Concepts" title="API Keys and Scopes in Aegis">
              <p className="mt-4 leading-7 text-text-secondary">
                API keys authenticate programmatic requests with
                <code className="mx-1 rounded bg-white/[0.06] px-1.5 py-0.5 text-sm">Authorization: Bearer</code>.
                Give each key the smallest set of scopes required for its workload.
              </p>
              <div className="mt-5 divide-y divide-white/[0.06] rounded-lg border border-white/[0.08] bg-white/[0.03]">
                {scopes.map(([scope, description]) => (
                  <div key={scope} className="grid gap-2 p-4 sm:grid-cols-[180px_1fr]">
                    <code className="text-sm text-accent-start">{scope}</code>
                    <p className="text-sm text-text-secondary">{description}</p>
                  </div>
                ))}
              </div>
            </SectionHeading>

            <SectionHeading id="concept-encryption" eyebrow="Core Concepts" title="How Aegis Encrypts Your Secrets">
              <div className="mt-5 grid gap-3">
                {[
                  [LockKeyhole, "Secret value", "Your plaintext value is accepted only long enough to encrypt it."],
                  [KeyRound, "Per-secret DEK", "A unique data encryption key encrypts each secret value."],
                  [ShieldCheck, "Per-tenant KEK", "The data key is wrapped by tenant-specific key material."],
                  [Archive, "Encrypted storage", "Only encrypted values, nonces, metadata, and key hashes are persisted."],
                ].map(([Icon, title, body]) => (
                  <div key={title as string} className="flex gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                    <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-accent-start" />
                    <div>
                      <h3 className="font-semibold text-text-primary">{title as string}</h3>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">{body as string}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionHeading>

            <SectionHeading id="guide-store-retrieve" eyebrow="Guides" title="Store and Retrieve Secrets with Aegis">
              <div className="mt-5 space-y-4">
                <pre className={codeClass}>
                  <code>{`curl -X PUT "$AEGIS_BASE_URL/api/v1/projects/$PROJECT_ID/secrets" \\
  -H "Authorization: Bearer $AEGIS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"key":"DATABASE_URL","value":"postgres://prod.example/db"}'`}</code>
                </pre>
                <pre className={codeClass}>
                  <code>{`curl "$AEGIS_BASE_URL/api/v1/projects/$PROJECT_ID/secrets/DATABASE_URL" \\
  -H "Authorization: Bearer $AEGIS_API_KEY"`}</code>
                </pre>
              </div>
            </SectionHeading>

            <SectionHeading id="guide-versions" eyebrow="Guides" title="Manage Secret Versions in Aegis">
              <p className="mt-4 leading-7 text-text-secondary">
                Updating a secret creates a new version. List versions before a rollout,
                fetch a previous value during incident response, and rotate keys by writing
                a fresh value under the same secret name.
              </p>
              <pre className={`${codeClass} mt-5`}>
                <code>{`curl "$AEGIS_BASE_URL/api/v1/projects/$PROJECT_ID/secrets/DATABASE_URL/versions" \\
  -H "Authorization: Bearer $AEGIS_API_KEY"`}</code>
              </pre>
            </SectionHeading>

            <SectionHeading id="guide-audit-logs" eyebrow="Guides" title="Query Audit Logs in Aegis">
              <p className="mt-4 leading-7 text-text-secondary">
                Use audit logs to answer who accessed or changed a resource and when. API
                keys need the
                <code className="mx-1 rounded bg-white/[0.06] px-1.5 py-0.5 text-sm">audit:read</code>
                scope to query logs.
              </p>
              <pre className={`${codeClass} mt-5`}>
                <code>{`curl "$AEGIS_BASE_URL/api/v1/audit-logs?action=secret.read&limit=50" \\
  -H "Authorization: Bearer $AEGIS_API_KEY"`}</code>
              </pre>
            </SectionHeading>

            <SectionHeading id="guide-rate-limits" eyebrow="Guides" title="Rate Limits and Best Practices in Aegis">
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  [Clock3, "Cache carefully", "Cache non-rotating secrets in memory and refresh on deploy or a short TTL."],
                  [KeyRound, "Use narrow keys", "Issue separate keys per service, environment, and permission set."],
                  [FileClock, "Rotate routinely", "Set expirations for automation keys and rotate after incidents or staff changes."],
                  [Search, "Watch audit trails", "Review unusual read volume, failed auth, and unexpected project activity."],
                ].map(([Icon, title, body]) => (
                  <div key={title as string} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-5">
                    <Icon className="h-5 w-5 text-accent-start" />
                    <h3 className="mt-3 font-semibold text-text-primary">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{body as string}</p>
                  </div>
                ))}
              </div>
            </SectionHeading>

            <section id="api-reference" className="scroll-mt-24 border-t border-white/[0.06] pt-10">
              <p className="text-sm font-semibold text-accent-start">API Reference</p>
              <h2 className="mt-2 text-2xl font-bold text-text-primary">API-key routes only</h2>
              <p className="mt-4 leading-7 text-text-secondary">
                These endpoints are intended for programmatic access and require an Aegis API key.
                Dashboard authentication, signup, login, email verification, and dashboard-only
                key management routes are intentionally omitted.
              </p>
              <div className="mt-6 space-y-8">
                {apiSections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-text-primary">
                      <Braces className="h-5 w-5 text-accent-start" />
                      {section.title}
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-white/[0.08]">
                      {section.routes.map(([method, path, description, auth, scope]) => (
                        <div
                          key={`${method}-${path}`}
                          className="grid gap-3 border-b border-white/[0.06] bg-white/[0.02] p-4 last:border-b-0 md:grid-cols-[84px_minmax(0,1fr)_150px]"
                        >
                          <span className="text-sm font-semibold text-accent-start">{method}</span>
                          <div className="min-w-0">
                            <code className="block break-words text-sm text-text-primary">{path}</code>
                            <p className="mt-1 text-sm text-text-secondary">{description}</p>
                          </div>
                          <div className="text-sm text-text-tertiary">
                            <p>{auth}</p>
                            <code className="text-xs text-text-secondary">{scope}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <aside className="hidden h-[calc(100vh-56px)] overflow-y-auto border-l border-white/[0.06] px-5 py-8 xl:sticky xl:top-14 xl:block">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <BookOpen className="h-4 w-4" />
            On this page
          </div>
          <nav className="space-y-3 text-sm text-text-secondary">
            <a href="#get-started" className="block text-accent-start">Overview</a>
            <a href="#sdks" className="block hover:text-text-primary">SDKs</a>
            <a href="#concept-api-keys" className="block hover:text-text-primary">Scopes</a>
            <a href="#guide-store-retrieve" className="block hover:text-text-primary">Store and retrieve</a>
            <a href="#api-reference" className="block hover:text-text-primary">API reference</a>
          </nav>
          <div className="mt-8 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
            <Sparkles className="h-5 w-5 text-accent-start" />
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Build against the API-key routes here, then use the dashboard only for account,
              project, and key administration.
            </p>
          </div>
          <Link href="/signup" className="btn-primary mt-4 w-full">
            <Rocket className="h-4 w-4" />
            Start building
          </Link>
          <a
            href="https://github.com/atomHq/aegis"
            className="btn-secondary mt-3 w-full"
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </a>
        </aside>
      </div>
    </div>
  );
}
