"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import type { Lead } from "@/types/leads";

// Mock data - Replace with actual data from Supabase
const mockLeads: Lead[] = [
  {
    id: "1",
    customer_id: "1",
    source: "Craigslist",
    status: "In Progress",
    interest_vehicle_id: "1",
    assigned_to: null,
    notes: "Interested in Honda Civic",
    lead_creation_date: new Date().toISOString(),
    last_engagement: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    customer_id: "2",
    source: "Kijiji",
    status: "Qualified",
    interest_vehicle_id: null,
    assigned_to: null,
    notes: null,
    lead_creation_date: new Date().toISOString(),
    last_engagement: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const statusColors = {
  "Not Started": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Qualified": "bg-green-100 text-green-800",
  "Closed": "bg-purple-100 text-purple-800",
  "Lost": "bg-red-100 text-red-800",
};

const sourceData = [
  { name: "Craigslist", value: 15, color: "#3b82f6" },
  { name: "Kijiji", value: 12, color: "#10b981" },
  { name: "Text Us", value: 8, color: "#f59e0b" },
  { name: "Website", value: 20, color: "#8b5cf6" },
  { name: "Referral", value: 5, color: "#ef4444" },
];

export default function LeadsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [leads] = useState<Lead[]>(mockLeads);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = searchTerm === "" || lead.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 md:pt-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and track customer leads
          </p>
        </div>
        <Button size="lg" className="shadow-lg w-full lg:w-auto shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-l-4 border-l-gray-500 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.status === "Not Started").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.status === "In Progress").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.status === "Qualified").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.status === "Closed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((l) => l.status === "Lost").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads by Source Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6">
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </Select>
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="Craigslist">Craigslist</option>
              <option value="Kijiji">Kijiji</option>
              <option value="Text Us">Text Us</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No leads found
              </p>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Lead #{lead.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[lead.status as keyof typeof statusColors] ||
                          statusColors["Not Started"]
                        }`}
                      >
                        {lead.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Source: {lead.source}
                      </span>
                    </div>
                    {lead.notes && (
                      <p className="text-sm text-muted-foreground">{lead.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(lead.lead_creation_date).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
