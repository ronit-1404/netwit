'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, UserPlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const roleColors = {
  Admin: 'bg-red-100 text-red-800',
  Manager: 'bg-blue-100 text-blue-800',
  Staff: 'bg-slate-100 text-slate-800',
};

export function UsersTable({ data, onEdit, onDelete }: {
  data: any[];
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
}) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback>
            {row.original.full_name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )
    },
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.full_name}</div>
          <div className="text-sm text-slate-500">{row.original.email}</div>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge className={roleColors[row.original.role as keyof typeof roleColors]}>
          {row.original.role}
        </Badge>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || <span className="text-slate-400">-</span>
    },
    {
      accessorKey: 'start_date',
      header: 'Start Date',
      cell: ({ row }) => 
        new Date(row.original.start_date).toLocaleDateString()
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => onEdit(row.original)}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="destructive"
            onClick={() => onDelete(row.original.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="full_name"
      emptyState={
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="bg-slate-100 border-2 border-dashed rounded-xl w-full h-48 mb-6 flex items-center justify-center">
              <UserPlusIcon className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold">No staff members found</h3>
            <p className="text-slate-500 mt-2">
              Add your first staff member to start managing your team
            </p>
          </div>
        </div>
      }
    />
  );
}
