"use client";

import { Modal } from "./modal";

interface ConfirmDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  isLoading = false,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Modal id={id} isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-text-secondary mb-6">{description}</p>
      <div className="flex items-center justify-end gap-3">
        <button
          id={`${id}-cancel`}
          onClick={onClose}
          className="btn-secondary btn-sm"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          id={`${id}-confirm`}
          onClick={onConfirm}
          className={variant === "danger" ? "btn-danger btn-sm" : "btn-primary btn-sm"}
          disabled={isLoading}
        >
          {isLoading ? "..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
