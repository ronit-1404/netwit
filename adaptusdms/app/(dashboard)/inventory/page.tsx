"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleForm } from "@/components/inventory/vehicle-form";
import { VehicleActionsMenu } from "@/components/inventory/vehicle-actions-menu";
import { Plus, Search, Car, DollarSign, TrendingUp, Package, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { VehicleFormData } from "@/types/inventory";

// Mock data - Replace with actual data from Supabase
const mockVehicles = [
  {
    id: "1",
    vin: "1HGBH41JXMN109186",
    year: 2023,
    make: "Honda",
    model: "Civic",
    trim: "EX",
    stockNumber: "H001",
    status: "Active",
    purchasePrice: 25000,
    retailPrice: 32000,
    extraCosts: 500,
    taxes: 4160,
    condition: "New",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-500/10 text-green-600 border-green-500/20",
  Inactive: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  Sold: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Coming Soon": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const statusData = [
  { name: "Active", value: 15, color: "#22c55e" },
  { name: "Coming Soon", value: 5, color: "#eab308" },
  { name: "Sold", value: 30, color: "#3b82f6" },
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicles] = useState(mockVehicles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleAddVehicle = async (data: VehicleFormData) => {
    // TODO: Integrate with Supabase
    console.log("Adding vehicle:", data);
    setIsAddDialogOpen(false);
    // Refresh vehicles list
  };

  // Calculate stats
  const totalInventory = vehicles.length;
  const totalPurchaseValue = vehicles.reduce(
    (sum, v) => sum + v.purchasePrice + v.extraCosts + v.taxes,
    0
  );
  const totalRetailValue = vehicles.reduce((sum, v) => sum + v.retailPrice, 0);
  const totalProfit = totalRetailValue - totalPurchaseValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Enhanced Header with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent p-6 md:p-8 border border-border/50 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent)]" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-md">
              <Car className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
                Vehicle Inventory
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg mt-1">
                {totalInventory} vehicles • {formatCurrency(totalRetailValue)} total value
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size="lg" 
            className="w-full md:w-auto bg-gradient-primary hover:opacity-90 shadow-lg hover-lift"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Grid - Enhanced & Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover-lift border-gradient animate-in slide-up">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Total Inventory</p>
                <p className="text-2xl font-bold mt-1">{totalInventory}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-gradient animate-in slide-up" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Retail Value</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalRetailValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-gradient animate-in slide-up" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Est. Profit</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-gradient animate-in slide-up" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Avg. Value</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(totalRetailValue / totalInventory || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <VehicleForm
            onSubmit={handleAddVehicle}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Inventory
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInventory}</div>
            <p className="text-xs text-muted-foreground mt-1">Active vehicles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Purchase Value
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalPurchaseValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total purchase cost</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 animate-in slide-in-from-bottom delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Retail Value
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalRetailValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total retail price</p>
          </CardContent>
        </Card>

        {/* Inventory Status Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="40%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VIN, Stock #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Makes</option>
              <option value="Honda">Honda</option>
              <option value="Toyota">Toyota</option>
              <option value="Ford">Ford</option>
            </select>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Models</option>
              <option value="Civic">Civic</option>
              <option value="Accord">Accord</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Stock #</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchase</TableHead>
                <TableHead>Retail</TableHead>
                <TableHead>Gross Profit</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => {
                const grandTotal = vehicle.purchasePrice + vehicle.extraCosts + vehicle.taxes;
                const grossProfit = vehicle.retailPrice - grandTotal;
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="h-16 w-24 rounded bg-muted"></div>
                    </TableCell>
                    <TableCell className="font-medium">{vehicle.stockNumber}</TableCell>
                    <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[vehicle.status as keyof typeof statusColors] ||
                          statusColors.Inactive
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </TableCell>
                    <TableCell>${grandTotal.toLocaleString()}</TableCell>
                    <TableCell>${vehicle.retailPrice.toLocaleString()}</TableCell>
                    <TableCell
                      className={grossProfit >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      ${grossProfit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Switch defaultChecked={vehicle.status === "Active"} />
                    </TableCell>
                    <TableCell>
                      <VehicleActionsMenu vehicleId={vehicle.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
