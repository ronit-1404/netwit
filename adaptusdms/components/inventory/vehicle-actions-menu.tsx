'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FacebookPostButton } from './facebook-post-button';

export function VehicleActionsMenu({ vehicleId }: { vehicleId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <div className="px-2 py-1.5">
          <FacebookPostButton vehicleId={vehicleId} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
