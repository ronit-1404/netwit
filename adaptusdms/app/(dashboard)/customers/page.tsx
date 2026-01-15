"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, AlertTriangle, Phone, Mail } from "lucide-react";
import { CustomerForm } from "@/components/customers/customer-form";
import type { Customer, CustomerFormData } from "@/types/customers";

// Mock data - Replace with actual data from Supabase
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "555-0100",
    email: "john@example.com",
    address: "123 Main St",
    city: "Toronto",
    province: "ON",
    postal_code: "M5H 2N2",
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    duplicate_name: false,
    duplicate_phone: false,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "555-0200",
    email: "jdoe@example.com",
    address: null,
    city: null,
    province: null,
    postal_code: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    duplicate_name: true,
    duplicate_phone: false,
  },
  {
    id: "3",
    name: "Jane Smith",
    phone: "555-0100",
    email: "jane@example.com",
    address: null,
    city: null,
    province: null,
    postal_code: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    duplicate_name: false,
    duplicate_phone: true,
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState<Customer[]>(mockCustomers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCustomer = async (data: CustomerFormData) => {
    // TODO: Integrate with Supabase
    console.log("Adding customer:", data);
    // Check for duplicates by name and phone
    setIsAddDialogOpen(false);
  };

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex-1 space-y-6 p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Customers
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage customer database and detect duplicates
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.phone || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.email || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.city && customer.province
                        ? `${customer.city}, ${customer.province}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {customer.duplicate_name && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                            Name
                          </span>
                        )}
                        {customer.duplicate_phone && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Phone
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {customer.duplicate_name || customer.duplicate_phone ? (
                        <Button variant="outline" size="sm" className="ml-2">
                          Merge
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleAddCustomer}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
