"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateApiKey } from "@/hooks/use-api-keys";
import { Modal } from "@/components/ui/modal";
import { ApiError } from "@/lib/api";
import type { Scope, CreateAPIKeyResponse } from "@/lib/types";
import { Loader2, Check } from "lucide-react";

const SCOPE_OPTIONS: { value: Scope; label: string; description: string }[] = [
  { value: "secrets:read", label: "secrets:read", description: "Read secret values" },
  { value: "secrets:write", label: "secrets:write", description: "Create and update secrets" },
  { value: "secrets:admin", label: "secrets:admin", description: "Delete secrets" },
  { value: "projects:manage", label: "projects:manage", description: "Create, update, delete projects" },
  { value: "api_keys:manage", label: "api_keys:manage", description: "Manage API keys" },
  { value: "audit:read", label: "audit:read", description: "View audit logs" },
];

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyCreated: (response: CreateAPIKeyResponse) => void;
}

export function CreateKeyModal({ isOpen, onClose, onKeyCreated }: CreateKeyModalProps) {
  const createKey = useCreateApiKey();
  const [form, setForm] = useState({
    name: "",
    scopes: [] as Scope[],
    expires_at: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleScope(scope: Scope) {
    setForm((prev) => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter((s) => s !== scope)
        : [...prev.scopes, scope],
    }));
    if (errors.scopes) setErrors((prev) => ({ ...prev, scopes: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (form.scopes.length === 0) newErrors.scopes = "Select at least one scope";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await createKey.mutateAsync({
        name: form.name,
        scopes: form.scopes,
        expires_at: form.expires_at || undefined,
      });
      onKeyCreated(response);
      onClose();
      setForm({ name: "", scopes: [], expires_at: "" });
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to create API key.");
    }
  }

  return (
    <Modal
      id="create-key-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Create API Key"
      description="Generate a new key for programmatic access."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="key-name" className="block text-sm font-medium text-text-secondary mb-1.5">
            Key Name
          </label>
          <input
            id="key-name"
            type="text"
            className={`input-field ${errors.name ? "error" : ""}`}
            placeholder="CI/CD Pipeline Key"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Scopes
          </label>
          {errors.scopes && <p className="text-error text-xs mb-2">{errors.scopes}</p>}
          <div className="space-y-2">
            {SCOPE_OPTIONS.map((scope) => {
              const isChecked = form.scopes.includes(scope.value);
              return (
                <label
                  key={scope.value}
                  htmlFor={`scope-${scope.value}`}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? "bg-accent-start/10 border-accent-start/30"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`scope-${scope.value}`}
                    checked={isChecked}
                    onChange={() => toggleScope(scope.value)}
                    className="sr-only"
                  />
                  {/* Custom checkbox */}
                  <div
                    className={`mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded flex items-center justify-center border transition-all duration-200 ${
                      isChecked
                        ? "bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] border-transparent shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                        : "border-white/20 bg-white/[0.04]"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium font-mono text-text-primary">
                      {scope.label}
                    </p>
                    <p className="text-xs text-text-tertiary">{scope.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="key-expires" className="block text-sm font-medium text-text-secondary mb-1.5">
            Expiration Date <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="key-expires"
            type="date"
            className="input-field dark-date-input"
            value={form.expires_at}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, expires_at: e.target.value }))
            }
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary btn-sm">
            Cancel
          </button>
          <button
            id="key-submit"
            type="submit"
            disabled={createKey.isPending}
            className="btn-primary btn-sm"
          >
            {createKey.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Key"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

