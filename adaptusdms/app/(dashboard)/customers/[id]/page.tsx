"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, Calendar, AlertTriangle, User } from "lucide-react";

// Mock data - Replace with actual Supabase query
const getCustomerById = (id: string) => {
  return {
    id,
    name: "John Doe",
    phone: "555-0100",
    email: "john@example.com",
    address: "123 Main St",
    city: "Toronto",
    province: "ON",
    postal_code: "M5H 2N2",
    notes: "Preferred contact time: Weekday afternoons. Interested in SUVs and sedans.",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updated_at: new Date().toISOString(),
    duplicate_name: false,
    duplicate_phone: false,
    // Additional related data
    total_purchases: 2,
    total_spent: 65000,
    active_leads: 1,
    test_drives: 3,
  };
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customer = getCustomerById(params.id as string);

  const hasDuplicates = customer.duplicate_name || customer.duplicate_phone;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 md:pt-12 animate-in fade-in duration-500">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {customer.name}
              </h1>
              {hasDuplicates && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Potential Duplicate
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Customer ID: {customer.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline">Edit Customer</Button>
          <Button>Create Lead</Button>
        </div>
      </div>

      {/* Duplicate Warning */}
      {hasDuplicates && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900">Potential Duplicate Detected</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  {customer.duplicate_name && "Similar name found in database. "}
                  {customer.duplicate_phone && "Phone number matches another customer. "}
                  Review and merge if this is the same person.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Review Duplicates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <p className="text-base font-medium">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <a href={`tel:${customer.phone}`} className="text-base text-primary hover:underline">
                {customer.phone}
              </a>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <a href={`mailto:${customer.email}`} className="text-base text-primary hover:underline">
                {customer.email}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.address ? (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                  <p className="text-base">{customer.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-base">{customer.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Province</label>
                    <p className="text-base">{customer.province}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                  <p className="text-base">{customer.postal_code}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No address information available</p>
            )}
          </CardContent>
        </Card>

        {/* Customer Statistics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Customer Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{customer.total_purchases}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Purchases</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">${customer.total_spent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{customer.active_leads}</p>
                <p className="text-sm text-muted-foreground mt-1">Active Leads</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">{customer.test_drives}</p>
                <p className="text-sm text-muted-foreground mt-1">Test Drives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.notes ? (
              <p className="text-base whitespace-pre-wrap">{customer.notes}</p>
            ) : (
              <p className="text-muted-foreground text-sm">No notes available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 border-l-2 border-primary pl-4 pb-4">
              <div className="flex-1">
                <p className="text-sm font-medium">Customer Profile Created</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(customer.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-4 border-l-2 border-muted pl-4 pb-4">
              <div className="flex-1">
                <p className="text-sm font-medium">Profile Updated</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(customer.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="text-center py-4 text-muted-foreground text-sm">
              Purchase history, leads, and test drives will appear here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
