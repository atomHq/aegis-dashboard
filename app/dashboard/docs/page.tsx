import { BookOpen, Braces, KeyRound, Logs, Package, ShieldCheck } from "lucide-react";

const installSnippets = [
  {
    label: "Go",
    command: "go get github.com/oluwasemilore/aegis-go",
  },
  {
    label: "Node",
    command: "npm install @aegis/sdk",
  },
  {
    label: "Python",
    command: "pip install aegis-sdk",
  },
];

const scopes = [
  ["secrets:read", "Read secrets, list secret keys, and inspect versions."],
  ["secrets:write", "Create or update individual and bulk secrets."],
  ["secrets:admin", "Delete secrets."],
  ["projects:manage", "Create, update, and delete projects."],
  ["audit:read", "Query audit logs."],
  ["api_keys:manage", "Reserved for admin bootstrap keys."],
];

const examples = [
  {
    label: "Go",
    code: `client := aegis.NewClient(os.Getenv("AEGIS_API_KEY"), aegis.WithBaseURL("http://localhost:8080"))

secret, err := client.GetSecret(ctx, projectID, "DATABASE_URL")
if err != nil {
    return err
}
fmt.Println(secret.Value)`,
  },
  {
    label: "Node",
    code: `const aegis = new AegisClient({
  apiKey: process.env.AEGIS_API_KEY,
  baseUrl: process.env.AEGIS_BASE_URL ?? "http://localhost:8080",
});

const secret = await aegis.getSecret(projectId, "DATABASE_URL");
console.log(secret.value);`,
  },
  {
    label: "Python",
    code: `aegis = AegisClient(
    api_key=os.environ["AEGIS_API_KEY"],
    base_url=os.environ.get("AEGIS_BASE_URL", "http://localhost:8080"),
)

secret = aegis.get_secret(project_id, "DATABASE_URL")
print(secret["value"])`,
  },
];

const endpoints = [
  ["GET", "/api/v1/projects", "List projects"],
  ["POST", "/api/v1/projects", "Create a project"],
  ["PUT", "/api/v1/projects/{id}/secrets", "Store a secret"],
  ["GET", "/api/v1/projects/{id}/secrets/{key}", "Read a secret"],
  ["POST", "/api/v1/projects/{id}/secrets/bulk", "Read secrets in bulk"],
  ["GET", "/api/v1/audit-logs", "Query audit logs"],
];

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">SDK Documentation</h1>
          <p className="text-sm text-text-secondary mt-1">
            Use API keys to connect applications to Aegis projects, secrets, and audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="glass-card-static p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-accent-start" />
            <h2 className="text-lg font-semibold text-text-primary">Install SDKs</h2>
          </div>
          <div className="space-y-3">
            {installSnippets.map((snippet) => (
              <div key={snippet.label}>
                <p className="text-xs font-medium text-text-tertiary mb-1">{snippet.label}</p>
                <pre className="overflow-x-auto rounded-lg border border-white/[0.06] bg-bg-tertiary p-3 text-sm text-text-primary">
                  <code>{snippet.command}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-accent-end" />
            <h2 className="text-lg font-semibold text-text-primary">Authentication</h2>
          </div>
          <p className="text-sm text-text-secondary">
            Programmatic routes use a bearer API key:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-white/[0.06] bg-bg-tertiary p-3 mt-3 text-sm text-text-primary">
            <code>Authorization: Bearer aegis_sk_live_...</code>
          </pre>
          <p className="text-xs text-text-tertiary mt-3">
            Dashboard API key management uses your JWT session. Newly created API keys are shown once.
          </p>
        </section>
      </div>

      <section className="glass-card-static p-5">
        <div className="flex items-center gap-2 mb-4">
          <Braces className="w-5 h-5 text-accent-start" />
          <h2 className="text-lg font-semibold text-text-primary">Read a Secret</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {examples.map((example) => (
            <div key={example.label}>
              <p className="text-xs font-medium text-text-tertiary mb-1">{example.label}</p>
              <pre className="h-full overflow-x-auto rounded-lg border border-white/[0.06] bg-bg-tertiary p-3 text-sm text-text-primary">
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-accent-start" />
            <h2 className="text-lg font-semibold text-text-primary">Scopes</h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {scopes.map(([scope, description]) => (
              <div key={scope} className="py-3 first:pt-0 last:pb-0">
                <code className="text-sm text-text-primary">{scope}</code>
                <p className="text-sm text-text-secondary mt-1">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-4">
            <Logs className="w-5 h-5 text-accent-end" />
            <h2 className="text-lg font-semibold text-text-primary">API Key Routes</h2>
          </div>
          <div className="space-y-2">
            {endpoints.map(([method, path, description]) => (
              <div
                key={`${method}-${path}`}
                className="grid grid-cols-[64px_1fr] gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <span className="text-xs font-semibold text-accent-start">{method}</span>
                <div className="min-w-0">
                  <code className="block truncate text-sm text-text-primary">{path}</code>
                  <p className="text-xs text-text-secondary mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
