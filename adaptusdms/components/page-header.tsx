'use client';

import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      {action && (
        <Button onClick={action.onClick} className="bg-teal-600 hover:bg-teal-700">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  )
}
