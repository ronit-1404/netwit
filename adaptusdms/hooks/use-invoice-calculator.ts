import { useState, useMemo } from 'react';
import { TAX_RATES, InvoiceCalculation } from '@/lib/validations/invoice';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export function useInvoiceCalculator() {
  const [basePrice, setBasePrice] = useState<number>(0);
  const [packageFee, setPackageFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [taxMode, setTaxMode] = useState<'gst+pst' | 'hst'>('gst+pst');

  const calculateTotal = useMemo((): InvoiceCalculation => {
    // Calculate subtotal from base price, package fee, and line items
    const lineItemsTotal = lineItems.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price),
      0
    );
    
    const subtotal = basePrice + packageFee + lineItemsTotal - discount;
    
    // Calculate taxes based on mode
    let gst = 0;
    let pst = 0;
    let taxAmount = 0;
    
    if (taxMode === 'gst+pst') {
      gst = subtotal * TAX_RATES.gst;
      pst = subtotal * TAX_RATES.pst;
      taxAmount = gst + pst;
    } else {
      // HST mode
      taxAmount = subtotal * TAX_RATES.hst;
    }
    
    const grandTotal = subtotal + taxAmount;
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      pst: Math.round(pst * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  }, [basePrice, packageFee, discount, lineItems, taxMode]);

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
    taxMode,
    setTaxMode,
    calculation: calculateTotal,
  };
}
