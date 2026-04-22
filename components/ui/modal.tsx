"use client";

import { useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  preventClose?: boolean;
}

export function Modal({
  id,
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  preventClose = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!preventClose) onClose();
  }, [onClose, preventClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        id={id}
        className={cn(
          "relative z-10 w-full max-w-lg glass-card-static p-6 animate-scale-in max-h-[90vh] overflow-y-auto",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 id={`${id}-title`} className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            )}
          </div>
          {!preventClose && (
            <button
              id={`${id}-close`}
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-white/[0.04] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
