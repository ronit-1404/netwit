"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, type VehicleFormData } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useState } from "react";

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<VehicleFormData>;
}

export function VehicleForm({
  onSubmit,
  onCancel,
  initialData,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      status: "Active",
      condition: "New",
      odometer: 0,
      extra_costs: 0,
      taxes: 0,
      image_gallery: [],
    },
  });

  const purchasePrice = watch("purchase_price") || 0;
  const retailPrice = watch("retail_price") || 0;
  const extraCosts = watch("extra_costs") || 0;
  const taxes = watch("taxes") || 0;

  // Calculate financial metrics
  const grandTotalValue = purchasePrice + extraCosts + taxes;
  const grossProfit = retailPrice - grandTotalValue;
  const estimatedIncome = retailPrice - grandTotalValue;

  const onFormSubmit = async (data: VehicleFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>Enter the vehicle details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN *</Label>
              <Input
                id="vin"
                {...register("vin")}
                placeholder="1HGBH41JXMN109186"
                maxLength={17}
              />
              {errors.vin && (
                <p className="text-sm text-destructive">{errors.vin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_number">Stock Number</Label>
              <Input
                id="stock_number"
                {...register("stock_number")}
                placeholder="H001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                {...register("year", { valueAsNumber: true })}
                min={1900}
                max={new Date().getFullYear() + 1}
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input id="make" {...register("make")} placeholder="Honda" />
              {errors.make && (
                <p className="text-sm text-destructive">{errors.make.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input id="model" {...register("model")} placeholder="Civic" />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim">Trim</Label>
              <Input id="trim" {...register("trim")} placeholder="EX" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer</Label>
              <Input
                id="odometer"
                type="number"
                {...register("odometer", { valueAsNumber: true })}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <Select
                    id="condition"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                  </Select>
                )}
              />
              {errors.condition && (
                <p className="text-sm text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    id="status"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Sold">Sold</option>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
          <CardDescription>Enter purchase and retail pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Purchase Price *</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                {...register("purchase_price", { valueAsNumber: true })}
                min={0}
              />
              {errors.purchase_price && (
                <p className="text-sm text-destructive">
                  {errors.purchase_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="retail_price">Retail Price *</Label>
              <Input
                id="retail_price"
                type="number"
                step="0.01"
                {...register("retail_price", { valueAsNumber: true })}
                min={0}
              />
              {errors.retail_price && (
                <p className="text-sm text-destructive">
                  {errors.retail_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra_costs">Extra Costs</Label>
              <Input
                id="extra_costs"
                type="number"
                step="0.01"
                {...register("extra_costs", { valueAsNumber: true })}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxes">Taxes</Label>
              <Input
                id="taxes"
                type="number"
                step="0.01"
                {...register("taxes", { valueAsNumber: true })}
                min={0}
              />
            </div>
          </div>

          {/* Financial Calculations Display */}
          <div className="mt-6 rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-3 font-semibold">Financial Summary</h4>
            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Grand Total Value</p>
                <p className="text-lg font-semibold">
                  ${grandTotalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Purchase + Extra Costs + Taxes
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gross Profit</p>
                <p
                  className={`text-lg font-semibold ${
                    grossProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${grossProfit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Retail - Grand Total
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Income</p>
                <p
                  className={`text-lg font-semibold ${
                    estimatedIncome >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${estimatedIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Retail - Grand Total
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Vehicle"}
        </Button>
      </div>
    </form>
  );
}
