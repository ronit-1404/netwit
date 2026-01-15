import { useState, useMemo } from 'react';
import { calculateInvoiceTotal, Province, PROVINCE_TAX_RATES } from '@/lib/calculators/tax-engine';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceCalculation {
  subtotal: number;
  gst: number;
  pst: number;
  hst: number;
  taxAmount: number;
  grandTotal: number;
  taxBreakdown?: string;
}

export function useInvoiceCalculator() {
  const [basePrice, setBasePrice] = useState<number>(0);
  const [packageFee, setPackageFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [province, setProvince] = useState<Province>('ON');

  const calculateTotal = useMemo((): InvoiceCalculation => {
    // Convert line items to the format expected by calculateInvoiceTotal
    const formattedLineItems = lineItems.map(item => ({
      quantity: item.quantity,
      unitPrice: item.unit_price,
    }));
    
    // Use the enhanced tax engine
    const result = calculateInvoiceTotal({
      baseAmount: basePrice + packageFee,
      lineItems: formattedLineItems,
      discount,
      province,
    });
    
    return {
      subtotal: result.subtotal,
      gst: result.gst,
      pst: result.pst,
      hst: result.hst,
      taxAmount: result.taxAmount,
      grandTotal: result.grandTotal,
      taxBreakdown: result.taxBreakdown,
    };
  }, [basePrice, packageFee, discount, lineItems, province]);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  return {
    basePrice,
    setBasePrice,
    packageFee,
    setPackageFee,
    discount,
    setDiscount,
    lineItems,
    addLineItem,
    updateLineItem,
    removeLineItem,
    province,
    setProvince,
    provinceOptions: Object.entries(PROVINCE_TAX_RATES).map(([code, data]) => ({
      value: code as Province,
      label: data.name,
      rate: data.total,
    })),
    calculation: calculateTotal,
  };
}
