import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { LeadFormData } from '@/lib/validations/lead';

function getSupabase() {
  return createClient();
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          customer:customers(id, name, phone, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lead: LeadFormData) => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('leads')
        .insert(lead);
      
      if (error) throw error;
      return data;
    },
    onMutate: async (newLead) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      
      const previousLeads = queryClient.getQueryData(['leads']) || [];
      queryClient.setQueryData(['leads'], (old: any) => [newLead, ...old]);
      
      return { previousLeads };
    },
    onError: (err, newLead, context) => {
      queryClient.setQueryData(['leads'], context?.previousLeads);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      
      const previousLeads = queryClient.getQueryData(['leads']);
      queryClient.setQueryData(['leads'], (old: any) => 
        old.filter((lead: any) => lead.id !== id)
      );
      
      return { previousLeads };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['leads'], context?.previousLeads);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
}
