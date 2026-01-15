'use client';

import { InvoiceCalculation } from '@/lib/validations/invoice';

interface PrintableInvoiceProps {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicleInfo: {
    year?: number;
    make?: string;
    model?: string;
    vin?: string;
    odometer?: number;
  };
  calculation: InvoiceCalculation;
  packageName?: string;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
  dealershipName?: string;
  dealershipAddress?: string;
  dealershipPhone?: string;
  dealershipEmail?: string;
}

export function PrintableInvoice({
  invoiceNumber,
  invoiceDate,
  dueDate,
  customerName,
  customerAddress,
  customerPhone,
  customerEmail,
  vehicleInfo,
  calculation,
  packageName,
  lineItems = [],
  dealershipName = 'Adaptus DMS',
  dealershipAddress = '123 Business Street, City, State 12345',
  dealershipPhone = '(555) 123-4567',
  dealershipEmail = 'info@adaptusdms.com',
}: PrintableInvoiceProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="hidden print:block print:p-8 print:bg-white" id="printable-invoice">
      <style jsx global>{`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          body * {
            visibility: hidden;
          }
          
          #printable-invoice,
          #printable-invoice * {
            visibility: visible;
          }
          
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          button, .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white p-8">
        {/* Letterhead Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{dealershipName}</h1>
              <div className="text-sm text-slate-600 space-y-1">
                <p>{dealershipAddress}</p>
                <p>Phone: {dealershipPhone}</p>
                <p>Email: {dealershipEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-800 mb-2">INVOICE</div>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Invoice #:</span> {invoiceNumber}</p>
                <p><span className="font-medium">Date:</span> {invoiceDate.toLocaleDateString()}</p>
                <p><span className="font-medium">Due Date:</span> {dueDate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1">
            Bill To:
          </h2>
          <div className="text-sm space-y-1">
            <p className="font-semibold">{customerName}</p>
            {customerAddress && <p>{customerAddress}</p>}
            {customerPhone && <p>Phone: {customerPhone}</p>}
            {customerEmail && <p>Email: {customerEmail}</p>}
          </div>
        </div>

        {/* Vehicle Details Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1">
            Vehicle Information:
          </h2>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <tbody>
              {(vehicleInfo.year || vehicleInfo.make || vehicleInfo.model) && (
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50 w-1/4">Vehicle</td>
                  <td className="border border-slate-300 p-2">
                    {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                  </td>
                </tr>
              )}
              {vehicleInfo.vin && (
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">VIN</td>
                  <td className="border border-slate-300 p-2 font-mono">{vehicleInfo.vin}</td>
                </tr>
              )}
              {vehicleInfo.odometer && (
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50">Odometer</td>
                  <td className="border border-slate-300 p-2">{vehicleInfo.odometer.toLocaleString()} miles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Line Items Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1">
            Items & Services:
          </h2>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-left font-semibold">Description</th>
                <th className="border border-slate-300 p-2 text-center font-semibold w-20">Qty</th>
                <th className="border border-slate-300 p-2 text-right font-semibold w-32">Unit Price</th>
                <th className="border border-slate-300 p-2 text-right font-semibold w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index}>
                  <td className="border border-slate-300 p-2">{item.description}</td>
                  <td className="border border-slate-300 p-2 text-center">{item.quantity}</td>
                  <td className="border border-slate-300 p-2 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="border border-slate-300 p-2 text-right font-medium">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              {packageName && (
                <tr>
                  <td className="border border-slate-300 p-2">{packageName} Package</td>
                  <td className="border border-slate-300 p-2 text-center">1</td>
                  <td className="border border-slate-300 p-2 text-right">-</td>
                  <td className="border border-slate-300 p-2 text-right">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="mb-6">
          <div className="flex justify-end">
            <div className="w-80 border border-slate-300">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="p-2 font-semibold text-right border-b border-slate-300">Subtotal:</td>
                    <td className="p-2 text-right border-b border-slate-300">{formatCurrency(calculation.subtotal)}</td>
                  </tr>
                  {calculation.gst > 0 && (
                    <tr>
                      <td className="p-2 text-right border-b border-slate-300">GST (5%):</td>
                      <td className="p-2 text-right border-b border-slate-300">{formatCurrency(calculation.gst)}</td>
                    </tr>
                  )}
                  {calculation.pst > 0 && (
                    <tr>
                      <td className="p-2 text-right border-b border-slate-300">PST (7%):</td>
                      <td className="p-2 text-right border-b border-slate-300">{formatCurrency(calculation.pst)}</td>
                    </tr>
                  )}
                  {calculation.taxAmount > 0 && calculation.gst === 0 && (
                    <tr>
                      <td className="p-2 text-right border-b border-slate-300">HST (13%):</td>
                      <td className="p-2 text-right border-b border-slate-300">{formatCurrency(calculation.taxAmount)}</td>
                    </tr>
                  )}
                  <tr className="bg-slate-100">
                    <td className="p-3 font-bold text-lg text-right">Total Due:</td>
                    <td className="p-3 font-bold text-lg text-right">{formatCurrency(calculation.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Signature Lines */}
        <div className="mt-12 pt-6 border-t border-slate-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold mb-1 border-b border-slate-400 pb-1">Buyer Signature</p>
              <p className="text-xs text-slate-500 mt-8">Date: _______________</p>
            </div>
            <div>
              <p className="font-semibold mb-1 border-b border-slate-400 pb-1">Seller Signature</p>
              <p className="text-xs text-slate-500 mt-8">Date: _______________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-center text-slate-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">This is a computer-generated invoice. No signature required for electronic transactions.</p>
        </div>
      </div>
    </div>
  );
}
