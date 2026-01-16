'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceFormData, invoiceSchema } from '@/lib/validations/invoice';
import { useInvoiceCalculator } from '@/hooks/use-invoice-calculator';
import { InvoicePreview } from '@/components/invoices/invoice-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLeads } from '@/hooks/use-leads';
import { useVehicles } from '@/hooks/use-vehicles';
import { useCreateInvoice } from '@/hooks/use-invoices';
import { toast } from 'react-hot-toast';

export default function NewInvoicePage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  const { data: leads } = useLeads();
  const { data: vehicles } = useVehicles();
  const createInvoice = useCreateInvoice();
  
  const calculator = useInvoiceCalculator();
  
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'Pending',
      tax_rate: 13,
    }
  });

  const invoiceDate = form.watch('invoice_date');
  const dueDate = form.watch('due_date');
  const packageName = form.watch('package_name');

  // Update base price when vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      const retailPrice = parseFloat(selectedVehicle.retail_price?.toString() || '0') || 0;
      calculator.setBasePrice(retailPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle]);

  const handleSubmit = async (data: InvoiceFormData) => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    const invoiceData = {
      ...data,
      customer_id: selectedCustomer.id,
      vehicle_id: selectedVehicle?.id,
      payment_amount: calculator.calculation.subtotal,
      tax_amount: calculator.calculation.taxAmount,
      total: calculator.calculation.grandTotal,
      line_items: calculator.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.quantity * item.unit_price,
      })),
    };

    createInvoice.mutate(invoiceData, {
      onSuccess: () => {
        toast.success('Invoice created successfully');
        // Navigate back or reset form
      },
      onError: () => {
        toast.error('Failed to create invoice');
      }
    });
  };

  const activeVehicles = vehicles?.filter(v => v.status === 'Active') || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <p className="text-slate-500 mt-1">Generate a professional invoice for your customer</p>
      </div>

      <Form {...form}>
        <div onSubmit={form.handleSubmit(handleSubmit) as any}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="invoice_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="INV-0001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="invoice_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full justify-start">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full justify-start">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer & Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Customer</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedCustomer?.id || ''}
                      onChange={(e) => {
                        const customer = leads?.find(l => l.id === e.target.value);
                        setSelectedCustomer(customer);
                      }}
                    >
                      <option value="">Select a customer</option>
                      {leads?.map(lead => (
                        <option key={lead.id} value={lead.id}>
                          {lead.full_name} - {lead.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Vehicle</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedVehicle?.id || ''}
                      onChange={(e) => {
                        const vehicle = activeVehicles.find(v => v.id === e.target.value);
                        setSelectedVehicle(vehicle);
                        if (vehicle) {
                          const retailPrice = parseFloat(vehicle.retail_price?.toString() || '0') || 0;
                          calculator.setBasePrice(retailPrice);
                        }
                      }}
                    >
                      <option value="">Select a vehicle</option>
                      {activeVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin?.slice(-6)}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Base Price (Vehicle Retail)</label>
                    <Input
                      type="number"
                      value={calculator.basePrice}
                      onChange={(e) => calculator.setBasePrice(parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Package Name</label>
                    <Input
                      value={packageName || ''}
                      onChange={(e) => form.setValue('package_name', e.target.value)}
                      placeholder="e.g., Libra Package"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Package Fee</label>
                    <Input
                      type="number"
                      value={calculator.packageFee}
                      onChange={(e) => calculator.setPackageFee(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="599.00"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Discount</label>
                    <Input
                      type="number"
                      value={calculator.discount}
                      onChange={(e) => calculator.setDiscount(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calculator.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => calculator.updateLineItem(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => calculator.updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.unit_price}
                          onChange={(e) => calculator.updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => calculator.removeLineItem(index)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={calculator.addLineItem}
                    className="w-full"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Line Item
                  </Button>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={createInvoice.isPending}>
                {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>

            {/* Right Column - Preview */}
            <div>
              <InvoicePreview
                customerName={selectedCustomer?.full_name}
                customerAddress={selectedCustomer?.address}
                vehicleInfo={selectedVehicle ? {
                  year: selectedVehicle.year,
                  make: selectedVehicle.make,
                  model: selectedVehicle.model,
                  vin: selectedVehicle.vin,
                  odometer: selectedVehicle.odometer,
                } : undefined}
                calculation={calculator.calculation}
                packageName={packageName}
                lineItems={calculator.lineItems.map(item => ({
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  amount: item.quantity * item.unit_price,
                }))}
                invoiceDate={invoiceDate}
                dueDate={dueDate}
                invoiceNumber={form.watch('invoice_number')}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
