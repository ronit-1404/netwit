'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TestDrivesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Test Drives
          </h1>
          <p className="text-muted-foreground text-lg">
            Schedule and manage customer test drives
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Test Drive
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <p>Test drive scheduling coming soon</p>
            <p className="text-sm mt-2">This feature will allow you to schedule test drives with license verification</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
