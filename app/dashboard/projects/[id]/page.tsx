"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProject, useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import { CopyButton } from "@/components/ui/copy-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getEnvironmentColor, formatDate } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  Terminal,
  Check,
  X,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject(projectId);
  const deleteProject = useDeleteProject();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [showDelete, setShowDelete] = useState(false);

  function startEdit() {
    if (project) {
      setEditForm({
        name: project.name,
        description: project.description || "",
      });
      setIsEditing(true);
    }
  }

  async function handleSaveEdit() {
    try {
      await updateProject.mutateAsync({
        name: editForm.name,
        description: editForm.description || undefined,
      });
      toast.success("Project updated!");
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to update project.");
    }
  }

  async function handleDelete() {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted!");
      router.push("/dashboard/projects");
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to delete project.");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-48" />
        <div className="glass-card-static p-6 space-y-4">
          <div className="skeleton h-6 w-64" />
          <div className="skeleton h-4 w-40" />
          <div className="skeleton h-4 w-96" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 animate-fade-in">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Project not found
        </h2>
        <p className="text-text-secondary mb-4">
          This project may have been deleted or you don&apos;t have access.
        </p>
        <button onClick={() => router.push("/dashboard/projects")} className="btn-primary">
          Back to Projects
        </button>
      </div>
    );
  }

  const storeCmd = `curl -X PUT http://localhost:8080/api/v1/projects/${project.id}/secrets \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "DATABASE_URL", "value": "postgres://user:pass@host:5432/db"}'`;

  const getCmd = `curl http://localhost:8080/api/v1/projects/${project.id}/secrets/DATABASE_URL \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const listCmd = `curl http://localhost:8080/api/v1/projects/${project.id}/secrets \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button
        id="project-back"
        onClick={() => router.push("/dashboard/projects")}
        className="btn-ghost text-text-secondary"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Project header */}
      <div className="glass-card-static p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  id="project-edit-name"
                  type="text"
                  className="input-field text-lg font-semibold"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <textarea
                  id="project-edit-description"
                  className="input-field min-h-[60px] resize-none text-sm"
                  placeholder="Description (optional)"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
                <div className="flex gap-2">
                  <button
                    id="project-save-edit"
                    onClick={handleSaveEdit}
                    disabled={updateProject.isPending}
                    className="btn-primary btn-sm"
                  >
                    {updateProject.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Save
                  </button>
                  <button
                    id="project-cancel-edit"
                    onClick={() => setIsEditing(false)}
                    className="btn-ghost btn-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <h1 id="project-detail-title" className="text-2xl font-bold text-text-primary">
                    {project.name}
                  </h1>
                  <span className={`badge ${getEnvironmentColor(project.environment)}`}>
                    {project.environment}
                  </span>
                  {!project.is_active && (
                    <span className="badge badge-error">Inactive</span>
                  )}
                </div>
                <p className="text-sm text-text-tertiary font-mono mb-2">
                  {project.slug}
                </p>
                {project.description && (
                  <p className="text-sm text-text-secondary">{project.description}</p>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <button id="project-edit" onClick={startEdit} className="btn-secondary btn-sm">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                id="project-delete"
                onClick={() => setShowDelete(true)}
                className="btn-danger btn-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
          <div>
            <p className="text-xs text-text-tertiary mb-1">Project ID</p>
            <div className="flex items-center gap-1">
              <p className="text-sm text-text-secondary font-mono truncate">
                {project.id.slice(0, 8)}...
              </p>
              <CopyButton id="copy-project-id" text={project.id} />
            </div>
          </div>
          <div>
            <p className="text-xs text-text-tertiary mb-1">Environment</p>
            <p className="text-sm text-text-primary capitalize">{project.environment}</p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary mb-1">Created</p>
            <p className="text-sm text-text-primary">{formatDate(project.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary mb-1">Updated</p>
            <p className="text-sm text-text-primary">{formatDate(project.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-accent-start/10 flex items-center justify-center">
            <Terminal className="w-4.5 h-4.5 text-accent-start" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Integration Guide
            </h2>
            <p className="text-xs text-text-secondary">
              Use your API key to manage secrets for this project
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-warning/5 border border-warning/15 mb-5">
          <p className="text-sm text-warning">
            <strong>Note:</strong> Secrets require API key authentication (not dashboard JWT).
            Generate an API key from the{" "}
            <a href="/dashboard/api-keys" className="underline hover:text-warning/80">
              API Keys page
            </a>{" "}
            with <code className="text-xs bg-white/5 px-1 py-0.5 rounded">secrets:read</code> and/or{" "}
            <code className="text-xs bg-white/5 px-1 py-0.5 rounded">secrets:write</code> scopes.
          </p>
        </div>

        <div className="space-y-5">
          {/* Store secret */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-primary">Store a secret</h3>
              <CopyButton id="copy-store-cmd" text={storeCmd} label="Copy" />
            </div>
            <pre className="p-4 rounded-lg bg-black/30 border border-white/[0.06] text-sm text-text-secondary overflow-x-auto font-mono leading-relaxed">
              {storeCmd}
            </pre>
          </div>

          {/* Get secret */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-primary">Retrieve a secret</h3>
              <CopyButton id="copy-get-cmd" text={getCmd} label="Copy" />
            </div>
            <pre className="p-4 rounded-lg bg-black/30 border border-white/[0.06] text-sm text-text-secondary overflow-x-auto font-mono leading-relaxed">
              {getCmd}
            </pre>
          </div>

          {/* List secrets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-primary">List secret keys</h3>
              <CopyButton id="copy-list-cmd" text={listCmd} label="Copy" />
            </div>
            <pre className="p-4 rounded-lg bg-black/30 border border-white/[0.06] text-sm text-text-secondary overflow-x-auto font-mono leading-relaxed">
              {listCmd}
            </pre>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        id="delete-project-dialog"
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone and all secrets in this project will become inaccessible.`}
        confirmLabel="Delete Project"
        isLoading={deleteProject.isPending}
        variant="danger"
      />
    </div>
  );
}
