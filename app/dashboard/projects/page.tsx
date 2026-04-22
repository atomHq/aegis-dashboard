"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/use-projects";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { getEnvironmentColor, formatDate } from "@/lib/utils";
import {
  Plus,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 id="projects-title" className="text-2xl font-bold text-text-primary">
            Projects
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Organize your secrets by environment and application.
          </p>
        </div>
        <button
          id="projects-create"
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card-static p-5">
              <div className="skeleton h-5 w-32 mb-3" />
              <div className="skeleton h-4 w-24 mb-4" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-3 w-20" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!projects || projects.length === 0) && (
        <div className="glass-card-static p-12 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-bg-subtle flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8 text-accent-start" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            No projects yet
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            Projects help you organize secrets by environment. Create your first
            project to get started.
          </p>
          <button
            id="projects-create-empty"
            onClick={() => setShowCreate(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create First Project
          </button>
        </div>
      )}

      {/* Project grid */}
      {!isLoading && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              id={`project-card-${project.id}`}
              className="glass-card p-5 group block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-text-tertiary font-mono mt-0.5">
                    {project.slug}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-start transition-colors flex-shrink-0 mt-1" />
              </div>

              {project.description && (
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-auto">
                <span className={`badge ${getEnvironmentColor(project.environment)}`}>
                  {project.environment}
                </span>
                {!project.is_active && (
                  <span className="badge badge-error">Inactive</span>
                )}
              </div>

              <p className="text-xs text-text-tertiary mt-3">
                Created {formatDate(project.created_at)}
              </p>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
