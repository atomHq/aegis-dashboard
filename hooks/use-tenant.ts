"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Tenant, UpdateTenantRequest } from "@/lib/types";

export function useTenant() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tenant", user?.tenant_id],
    queryFn: () => api.get<Tenant>(`/api/v1/tenants/${user!.tenant_id}`),
    enabled: !!user?.tenant_id,
  });
}

export function useUpdateTenant() {
  const { user, setTenantData } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTenantRequest) =>
      api.patch<Tenant>(`/api/v1/tenants/${user!.tenant_id}`, data),
    onSuccess: (tenant) => {
      setTenantData(tenant);
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
}
