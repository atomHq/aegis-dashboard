"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateProject } from "@/hooks/use-projects";
import { Modal } from "@/components/ui/modal";
import { slugify } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const [slugManual, setSlugManual] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    environment: "development" as "development" | "staging" | "production",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugManual ? prev.slug : slugify(value),
    }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.slug.trim()) newErrors.slug = "Slug is required";
    else if (form.slug.length < 2) newErrors.slug = "Slug must be at least 2 characters";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      newErrors.slug = "Only lowercase letters, numbers, and hyphens";
    if (form.description && form.description.length > 1000)
      newErrors.description = "Description must be under 1000 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createProject.mutateAsync(form);
      toast.success("Project created successfully!");
      onClose();
      setForm({ name: "", slug: "", description: "", environment: "development" });
      setSlugManual(false);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create project.");
      }
    }
  }

  return (
    <Modal
      id="create-project-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Create Project"
      description="Projects organize your secrets by environment."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project-name" className="block text-sm font-medium text-text-secondary mb-1.5">
            Name
          </label>
          <input
            id="project-name"
            type="text"
            className={`input-field ${errors.name ? "error" : ""}`}
            placeholder="My API Secrets"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="project-slug" className="block text-sm font-medium text-text-secondary mb-1.5">
            Slug
          </label>
          <input
            id="project-slug"
            type="text"
            className={`input-field ${errors.slug ? "error" : ""}`}
            placeholder="my-api-secrets"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true);
              setForm((prev) => ({ ...prev, slug: e.target.value }));
              if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
            }}
          />
          {errors.slug && <p className="text-error text-xs mt-1">{errors.slug}</p>}
        </div>

        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-text-secondary mb-1.5">
            Description <span className="text-text-tertiary">(optional)</span>
          </label>
          <textarea
            id="project-description"
            className={`input-field min-h-[80px] resize-none ${errors.description ? "error" : ""}`}
            placeholder="A brief description of this project..."
            value={form.description}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
            }}
          />
          {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="project-environment" className="block text-sm font-medium text-text-secondary mb-1.5">
            Environment
          </label>
          <select
            id="project-environment"
            className="input-field appearance-none cursor-pointer"
            value={form.environment}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                environment: e.target.value as "development" | "staging" | "production",
              }))
            }
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary btn-sm">
            Cancel
          </button>
          <button
            id="project-submit"
            type="submit"
            disabled={createProject.isPending}
            className="btn-primary btn-sm"
          >
            {createProject.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
