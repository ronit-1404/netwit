import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { VehicleFormData } from '@/lib/validations/vehicle';

function getSupabase() {
  return createClient();
}

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicle: VehicleFormData) => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicle);
      
      if (error) throw error;
      return data;
    },
    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      
      const previousVehicles = queryClient.getQueryData(['vehicles']) || [];
      queryClient.setQueryData(['vehicles'], (old: any) => [newVehicle, ...old]);
      
      return { previousVehicles };
    },
    onError: (err, newVehicle, context) => {
      queryClient.setQueryData(['vehicles'], context?.previousVehicles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, vehicle }: { id: string; vehicle: Partial<VehicleFormData> }) => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicle)
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, vehicle }) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      
      const previousVehicles = queryClient.getQueryData(['vehicles']);
      queryClient.setQueryData(['vehicles'], (old: any) => 
        old.map((v: any) => v.id === id ? { ...v, ...vehicle } : v)
      );
      
      return { previousVehicles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['vehicles'], context?.previousVehicles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['vehicles'] });
      
      const previousVehicles = queryClient.getQueryData(['vehicles']);
      queryClient.setQueryData(['vehicles'], (old: any) => 
        old.filter((v: any) => v.id !== id)
      );
      
      return { previousVehicles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['vehicles'], context?.previousVehicles);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}
