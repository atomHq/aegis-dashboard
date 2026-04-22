"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useApiKeys, useRevokeApiKey } from "@/hooks/use-api-keys";
import { CreateKeyModal } from "@/components/api-keys/create-key-modal";
import { KeyRevealModal } from "@/components/api-keys/key-reveal-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import type { CreateAPIKeyResponse } from "@/lib/types";
import {
  Plus,
  KeyRound,
  Trash2,
  Circle,
} from "lucide-react";

export default function ApiKeysPage() {
  const { data: apiKeys, isLoading } = useApiKeys();
  const revokeKey = useRevokeApiKey();

  const [showCreate, setShowCreate] = useState(false);
  const [revealData, setRevealData] = useState<CreateAPIKeyResponse | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<{ id: string; name: string } | null>(null);

  function handleKeyCreated(response: CreateAPIKeyResponse) {
    setRevealData(response);
    setShowReveal(true);
  }

  async function handleRevoke() {
    if (!revokeTarget) return;
    try {
      await revokeKey.mutateAsync(revokeTarget.id);
      toast.success(`API key "${revokeTarget.name}" revoked.`);
      setRevokeTarget(null);
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to revoke key.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 id="api-keys-title" className="text-2xl font-bold text-text-primary">
            API Keys
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage keys for programmatic access to your secrets.
          </p>
        </div>
        <button
          id="api-keys-create"
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="glass-card-static overflow-hidden">
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-4 w-20" />
                <div className="flex-1" />
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!apiKeys || apiKeys.length === 0) && (
        <div className="glass-card-static p-12 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-bg-subtle flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-accent-start" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No API keys yet
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            Create an API key to start managing secrets programmatically via curl,
            SDKs, or CI/CD pipelines.
          </p>
          <button
            id="api-keys-create-empty"
            onClick={() => setShowCreate(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create First Key
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && apiKeys && apiKeys.length > 0 && (
        <div className="glass-card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Key Prefix
                  </th>
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Scopes
                  </th>
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Last Used
                  </th>
                  <th className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Created
                  </th>
                  <th className="text-right text-xs font-medium text-text-tertiary uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    id={`key-row-${key.id}`}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary">
                        {key.name}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-sm text-accent-start font-mono bg-accent-start/5 px-2 py-0.5 rounded">
                        {key.key_prefix}
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.slice(0, 2).map((scope) => (
                          <span
                            key={scope}
                            className="badge badge-neutral font-mono text-[0.65rem]"
                          >
                            {scope}
                          </span>
                        ))}
                        {key.scopes.length > 2 && (
                          <span className="badge badge-neutral text-[0.65rem]">
                            +{key.scopes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Circle
                          className={`w-2 h-2 fill-current ${
                            key.is_active ? "text-success" : "text-error"
                          }`}
                        />
                        <span className={key.is_active ? "text-success" : "text-error"}>
                          {key.is_active ? "Active" : "Revoked"}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {key.last_used_at
                        ? formatRelativeTime(key.last_used_at)
                        : "Never"}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {formatDate(key.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {key.is_active && (
                        <button
                          id={`revoke-key-${key.id}`}
                          onClick={() =>
                            setRevokeTarget({ id: key.id, name: key.name })
                          }
                          className="btn-ghost btn-sm text-error hover:bg-error/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateKeyModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onKeyCreated={handleKeyCreated}
      />

      <KeyRevealModal
        isOpen={showReveal}
        onClose={() => {
          setShowReveal(false);
          setRevealData(null);
        }}
        keyData={revealData}
      />

      <ConfirmDialog
        id="revoke-key-dialog"
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevoke}
        title="Revoke API Key"
        description={`Are you sure you want to revoke "${revokeTarget?.name}"? This action cannot be undone. Any services using this key will lose access immediately.`}
        confirmLabel="Revoke Key"
        isLoading={revokeKey.isPending}
        variant="danger"
      />
    </div>
  );
}
