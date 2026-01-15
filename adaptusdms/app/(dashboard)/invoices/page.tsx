'use client';

import { useState, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PrinterIcon, CheckIcon } from 'lucide-react';
import { useInvoices, useMarkInvoicePaid } from '@/hooks/use-invoices';
import { PrintableInvoice } from '@/components/invoices/printable-invoice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const markPaid = useMarkInvoicePaid();
  const [printingInvoice, setPrintingInvoice] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = (invoice: any) => {
    setPrintingInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleMarkPaid = (invoiceId: string) => {
    markPaid.mutate(
      { invoiceId, createFinancialTransaction: true },
      {
        onSuccess: () => {
          toast.success('Invoice marked as paid and added to financial ledger');
        },
        onError: () => {
          toast.error('Failed to mark invoice as paid');
        }
      }
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'invoice_number',
      header: 'Invoice #',
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.original.invoice_number}</span>
      )
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => {
        const customer = row.original.customer;
        return customer ? (
          <div>
            <div className="font-medium">{customer.full_name}</div>
            <div className="text-sm text-slate-500">{customer.phone}</div>
          </div>
        ) : (
          <span className="text-slate-400">N/A</span>
        );
      }
    },
    {
      accessorKey: 'invoice_date',
      header: 'Date',
      cell: ({ row }) => 
        new Date(row.original.invoice_date).toLocaleDateString()
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.original.total?.toString() || '0');
        return (
          <span className="font-semibold text-green-600">
            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const colors: Record<string, string> = {
          Paid: 'bg-green-100 text-green-800',
          Pending: 'bg-yellow-100 text-yellow-800',
          Overdue: 'bg-red-100 text-red-800',
          Cancelled: 'bg-slate-100 text-slate-800',
        };
        return (
          <Badge className={colors[status] || 'bg-slate-100 text-slate-800'}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handlePrint(invoice)}
              title="Print Invoice"
            >
              <PrinterIcon className="w-4 h-4" />
            </Button>
            {invoice.status !== 'Paid' && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleMarkPaid(invoice.id)}
                title="Mark as Paid"
                className="text-green-600 hover:text-green-700"
              >
                <CheckIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="p-6 mt-2 md:mt-8">
      <PageHeader 
        title="Invoices" 
        action={{ 
          label: 'Create Invoice', 
          onClick: () => window.location.href = '/invoices/new'
        }}
      />
      
      {isLoading ? (
        <div className="text-center py-12">Loading invoices...</div>
      ) : (
        <DataTable
          columns={columns}
          data={invoices || []}
          searchKey="invoice_number"
          emptyState={
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="bg-slate-100 border-2 border-dashed rounded-xl w-full h-48 mb-6" />
                <h3 className="text-xl font-semibold">No invoices found</h3>
                <p className="text-slate-500 mt-2">
                  Create your first invoice to start billing customers
                </p>
                <Link href="/invoices/new">
                  <Button className="mt-4">Create Invoice</Button>
                </Link>
              </div>
            </div>
          }
        />
      )}

      {/* Printable Invoice (hidden until print) */}
      {printingInvoice && (
        <div className="hidden print:block">
          <PrintableInvoice
            invoiceNumber={printingInvoice.invoice_number}
            invoiceDate={new Date(printingInvoice.invoice_date)}
            dueDate={new Date(printingInvoice.due_date)}
            customerName={printingInvoice.customer?.full_name || 'Customer'}
            customerPhone={printingInvoice.customer?.phone}
            customerEmail={printingInvoice.customer?.email}
            vehicleInfo={{}}
            calculation={{
              subtotal: parseFloat(printingInvoice.payment_amount?.toString() || '0'),
              gst: 0,
              pst: 0,
              taxAmount: parseFloat(printingInvoice.tax_amount?.toString() || '0'),
              grandTotal: parseFloat(printingInvoice.total?.toString() || '0'),
            }}
            packageName={printingInvoice.package_name}
          />
        </div>
      )}
    </div>
  );
}
