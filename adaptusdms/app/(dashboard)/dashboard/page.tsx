import { KPIGrid } from '@/components/dashboard/kpi-grid';
import { ChartsContainer } from '@/components/dashboard/charts-container';
import { RecentLeads } from '@/components/crm/recent-leads';
// import { AnalystChat } from '@/components/ai/analyst-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getDashboardStats,
  getInventoryStats,
  getRevenueData,
  getRecentLeads
} from '@/lib/actions/dashboard-stats';
import { LayoutDashboard, TrendingUp, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const [stats, inventoryStats, revenueData, recentLeads] = await Promise.all([
    getDashboardStats(),
    getInventoryStats(),
    getRevenueData(),
    getRecentLeads(5)
  ]);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Dramatic Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent p-6 border border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent)]" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight gradient-text">
                Dashboard
              </h1>
              <Badge className="bg-gradient-primary text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg flex items-center gap-2 mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Welcome to Adaptus DMS - Real-time dealership overview
            </p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <KPIGrid stats={stats} />

      {/* Charts and Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartsContainer
            inventoryStats={inventoryStats}
            revenueData={revenueData}
          />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentLeads leads={recentLeads} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Chat Widget - Temporarily disabled until tool API is fixed */}
      {/* <AnalystChat /> */}
    </div>
  );
}
