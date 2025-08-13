import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

// Generic hook for fetching all items of a given type
export function useGetAll<T>(key: string) {
  return useQuery<T[]>({
    queryKey: [key],
    queryFn: async () => {
      const response = await api.get(`/${key}`);
      return response.data;
    },
  });
}

// Generic hook for fetching a single item by ID
export function useGetById<T>(key: string, id: number) {
  return useQuery<T>({
    queryKey: [key, id],
    queryFn: async () => {
      const response = await api.get(`/${key}/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run if id is truthy
  });
}

// Generic hook for creating an item
export function useCreate<T>(key: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: T) => {
      const response = await api.post(`/${key}`, newItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}

// Generic hook for updating an item
export function useUpdate<T>(key: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedItem }: { id: number; updatedItem: T }) => {
      const response = await api.patch(`/${key}/${id}`, updatedItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}

// Generic hook for deleting an item
export function useDelete(key: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/${key}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}
