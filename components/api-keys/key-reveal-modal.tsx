"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { CopyButton } from "@/components/ui/copy-button";
import { AlertTriangle, Check } from "lucide-react";
import type { CreateAPIKeyResponse } from "@/lib/types";

interface KeyRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyData: CreateAPIKeyResponse | null;
}

export function KeyRevealModal({ isOpen, onClose, keyData }: KeyRevealModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  function handleClose() {
    if (acknowledged) {
      onClose();
      setAcknowledged(false);
    }
  }

  if (!keyData) return null;

  return (
    <Modal
      id="key-reveal-modal"
      isOpen={isOpen}
      onClose={handleClose}
      title="API Key Created"
      preventClose={!acknowledged}
    >
      {/* Warning */}
      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3 mb-5">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">
            Store this key securely
          </p>
          <p className="text-xs text-text-secondary mt-1">
            This is the only time you&apos;ll see the full API key. Copy it now and store it
            in a secure location.
          </p>
        </div>
      </div>

      {/* Key display */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          API Key for &ldquo;{keyData.key.name}&rdquo;
        </label>
        <div className="relative">
          <div className="p-3 rounded-lg bg-black/30 border border-white/[0.06] font-mono text-sm text-accent-start break-all pr-12 select-all">
            {keyData.plaintext_key}
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <CopyButton
              id="copy-api-key"
              text={keyData.plaintext_key}
              label="Copy"
            />
          </div>
        </div>
      </div>

      {/* Scopes */}
      <div className="mb-5">
        <p className="text-xs text-text-tertiary mb-1.5">Scopes</p>
        <div className="flex flex-wrap gap-1.5">
          {keyData.key.scopes.map((scope) => (
            <span key={scope} className="badge badge-accent font-mono text-xs">
              {scope}
            </span>
          ))}
        </div>
      </div>

      {/* Acknowledge */}
      <label
        htmlFor="key-acknowledge"
        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all mb-4 ${
          acknowledged
            ? "bg-success/5 border-success/20"
            : "bg-white/[0.02] border-white/[0.06]"
        }`}
      >
        <input
          type="checkbox"
          id="key-acknowledge"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="accent-[var(--success)]"
        />
        <span className="text-sm text-text-secondary">
          I&apos;ve copied and securely stored this API key
        </span>
      </label>

      <button
        id="key-reveal-close"
        onClick={handleClose}
        disabled={!acknowledged}
        className="btn-primary w-full"
      >
        <Check className="w-4 h-4" />
        Done
      </button>
    </Modal>
  );
}
