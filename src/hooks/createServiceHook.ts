import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface BaseServiceOptions {
  endpoint: string;
  queryKey: string;
  defaultParams?: Record<string, any>;
}

export function createServiceHook<T>({ endpoint, queryKey, defaultParams }: BaseServiceOptions) {
  // This hook, when called, returns a set of hooks for that specific service
  return function useService() {
    const queryClient = useQueryClient();

    const useList = (params?: Record<string, any>) =>
      useQuery({
        queryKey: [queryKey, params],
        queryFn: async () => {
          const finalParams = { ...defaultParams, ...params };
          const { data } = await api.get(endpoint, { params: finalParams });
          return data;
        },
      });

    const useOne = (id: string | number, params?: Record<string, any>) =>
      useQuery({
        queryKey: [queryKey, id, params],
        enabled: !!id,
        queryFn: async () => {
          const finalParams = { ...defaultParams, ...params };
          const { data } = await api.get(`${endpoint}/${id}`, { params: finalParams });
          return data;
        },
      });

    const useCreate = () =>
      useMutation({
        mutationFn: async (payload: Partial<T>) => {
          // Strapi typically expects { data: ... }
          const { data } = await api.post(endpoint, { data: payload });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
      });

    const useUpdate = () =>
      useMutation({
        mutationFn: async ({ id, ...payload }: { id: string | number } & Partial<T>) => {
          const { data } = await api.put(`${endpoint}/${id}`, { data: payload });
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
      });

    const useDelete = () =>
      useMutation({
        mutationFn: async (id: string | number) => {
          await api.delete(`${endpoint}/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
      });

    return {
      useList,
      useOne,
      useCreate,
      useUpdate,
      useDelete,
    };
  };
}
