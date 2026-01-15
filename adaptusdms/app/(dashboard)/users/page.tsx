'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { UsersTable } from '@/components/users/users-table';
import { UserFormDialog } from '@/components/users/user-form-dialog';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';
import { UserFormData } from '@/lib/validations/user';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleAdd = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, user: data },
        {
          onSuccess: () => {
            toast.success('User updated successfully');
            setDialogOpen(false);
          },
          onError: () => {
            toast.error('Failed to update user');
          }
        }
      );
    } else {
      createUser.mutate(data, {
        onSuccess: () => {
          toast.success('User created successfully');
          setDialogOpen(false);
        },
        onError: () => {
          toast.error('Failed to create user');
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(id, {
        onSuccess: () => {
          toast.success('User deleted successfully');
        },
        onError: () => {
          toast.error('Failed to delete user');
        }
      });
    }
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="User Management" 
        action={{ 
          label: 'Add User', 
          onClick: handleAdd
        }}
      />
      
      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />
      
      {isLoading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : (
        <UsersTable 
          data={users || []} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
