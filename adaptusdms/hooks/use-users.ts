import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { UserFormData } from '@/lib/validations/user';

function getSupabase() {
  return createClient();
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: UserFormData) => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...user,
          start_date: user.start_date.toISOString().split('T')[0],
        });
      
      if (error) throw error;
      return data;
    },
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      const previousUsers = queryClient.getQueryData(['users']) || [];
      queryClient.setQueryData(['users'], (old: any) => [newUser, ...old]);
      
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, user }: { id: string; user: Partial<UserFormData> }) => {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .update({
          ...user,
          start_date: user.start_date?.toISOString().split('T')[0],
        })
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, user }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old: any) => 
        old.map((u: any) => u.id === id ? { ...u, ...user } : u)
      );
      
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old: any) => 
        old.filter((u: any) => u.id !== id)
      );
      
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}
