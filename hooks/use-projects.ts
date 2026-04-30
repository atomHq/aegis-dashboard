"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/lib/types";

interface UseProjectsOptions {
  search?: string;
}

export function useProjects(options?: UseProjectsOptions) {
  const search = options?.search?.trim() || "";

  return useQuery({
    queryKey: ["projects", search],
    queryFn: ({ signal }) => {
      const params = new URLSearchParams({ limit: "100" });
      if (search) {
        params.set("search", search);
      }

      return api.get<Project[]>(`/api/v1/auth/projects?${params.toString()}`, {
        signal,
      });
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<Project>(`/api/v1/auth/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      api.post<Project>("/api/v1/auth/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProjectRequest) =>
      api.patch<Project>(`/api/v1/auth/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ message: string }>(`/api/v1/auth/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
