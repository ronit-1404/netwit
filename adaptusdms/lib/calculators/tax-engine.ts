// Enhanced Tax Engine with Provincial Support
// Canadian Provincial Tax Rates (2026)

export const PROVINCE_TAX_RATES = {
  AB: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Alberta' },
  BC: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'British Columbia' },
  MB: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'Manitoba' },
  NB: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'New Brunswick' },
  NL: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'Newfoundland and Labrador' },
  NS: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'Nova Scotia' },
  ON: { gst: 0, pst: 0, hst: 0.13, total: 0.13, name: 'Ontario' },
  PE: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'Prince Edward Island' },
  QC: { gst: 0.05, pst: 0.09975, hst: 0, total: 0.14975, name: 'Quebec' },
  SK: { gst: 0.05, pst: 0.06, hst: 0, total: 0.11, name: 'Saskatchewan' },
  NT: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Northwest Territories' },
  NU: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Nunavut' },
  YT: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Yukon' },
} as const;

export type Province = keyof typeof PROVINCE_TAX_RATES;

// Legacy tax rates for backward compatibility
export const TAX_RATES = {
  gst: 0.05,
  pst: 0.07,
  hst: 0.13,
};

export interface TaxCalculation {
  subtotal: number;
  gst: number;
  pst: number;
  hst: number;
  taxAmount: number;
  grandTotal: number;
  province?: Province;
  taxBreakdown?: string;
}

/**
 * Calculate taxes based on province
 * @param subtotal - The pre-tax amount
 * @param province - Two-letter province code (e.g., 'ON', 'BC')
 * @returns Tax calculation breakdown
 */
export function calculateTaxByProvince(
  subtotal: number,
  province: Province = 'ON'
): TaxCalculation {
  const rates = PROVINCE_TAX_RATES[province];
  
  let gst = 0;
  let pst = 0;
  let hst = 0;
  
  if (rates.hst > 0) {
    // HST provinces (ON, NB, NL, NS, PE)
    hst = subtotal * rates.hst;
  } else {
    // GST + PST provinces (BC, MB, QC, SK) or GST only (AB, territories)
    gst = subtotal * rates.gst;
    pst = subtotal * rates.pst;
  }
  
  const taxAmount = gst + pst + hst;
  const grandTotal = subtotal + taxAmount;
  
  const taxBreakdown = rates.hst > 0
    ? `HST ${(rates.hst * 100).toFixed(2)}%`
    : rates.pst > 0
    ? `GST ${(rates.gst * 100).toFixed(2)}% + PST ${(rates.pst * 100).toFixed(2)}%`
    : `GST ${(rates.gst * 100).toFixed(2)}%`;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    pst: Math.round(pst * 100) / 100,
    hst: Math.round(hst * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    province,
    taxBreakdown,
  };
}

/**
 * Calculate vehicle profit margin
 * @param purchasePrice - What we paid for the vehicle
 * @param retailPrice - What we're selling it for
 * @param extraCosts - Additional costs (reconditioning, transport, etc.)
 * @param taxes - Taxes paid on purchase
 * @returns Profit calculation
 */
export function calculateVehicleProfit(
  purchasePrice: number,
  retailPrice: number,
  extraCosts: number = 0,
  taxes: number = 0
) {
  const totalCost = purchasePrice + extraCosts + taxes;
  const grossProfit = retailPrice - totalCost;
  const profitMargin = totalCost > 0 ? (grossProfit / retailPrice) * 100 : 0;
  
  return {
    totalCost: Math.round(totalCost * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    retailPrice: Math.round(retailPrice * 100) / 100,
  };
}

/**
 * Calculate financing payment
 * @param principal - Loan amount
 * @param interestRate - Annual interest rate (e.g., 5.99 for 5.99%)
 * @param termMonths - Loan term in months
 * @param downPayment - Down payment amount
 * @param frequency - Payment frequency ('monthly', 'bi-weekly', 'weekly')
 * @returns Payment calculation
 */
export function calculateFinancing(params: {
  principal: number;
  interestRate: number;
  termMonths: number;
  downPayment?: number;
  frequency?: 'monthly' | 'bi-weekly' | 'weekly';
}) {
  const {
    principal,
    interestRate,
    termMonths,
    downPayment = 0,
    frequency = 'monthly',
  } = params;
  
  const loanAmount = principal - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  
  if (monthlyRate === 0) {
    // No interest - simple division
    const monthlyPayment = loanAmount / termMonths;
    return {
      loanAmount: Math.round(loanAmount * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayments: Math.round(loanAmount * 100) / 100,
      totalInterest: 0,
      downPayment: Math.round(downPayment * 100) / 100,
    };
  }
  
  // Calculate monthly payment using amortization formula
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  const totalPayments = monthlyPayment * termMonths;
  const totalInterest = totalPayments - loanAmount;
  
  // Adjust for payment frequency
  let payment = monthlyPayment;
  let paymentsPerYear = 12;
  
  if (frequency === 'bi-weekly') {
    payment = (monthlyPayment * 12) / 26;
    paymentsPerYear = 26;
  } else if (frequency === 'weekly') {
    payment = (monthlyPayment * 12) / 52;
    paymentsPerYear = 52;
  }
  
  return {
    loanAmount: Math.round(loanAmount * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    payment: Math.round(payment * 100) / 100,
    frequency,
    totalPayments: Math.round(totalPayments * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    downPayment: Math.round(downPayment * 100) / 100,
    paymentsPerYear,
  };
}

/**
 * Generate amortization schedule
 * @param principal - Loan amount
 * @param interestRate - Annual interest rate
 * @param termMonths - Loan term in months
 * @returns Array of payment details for each month
 */
export function generateAmortizationSchedule(
  principal: number,
  interestRate: number,
  termMonths: number
) {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  let balance = principal;
  const schedule = [];
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    schedule.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100,
    });
  }
  
  return schedule;
}

/**
 * Calculate invoice totals with line items
 */
export function calculateInvoiceTotal(params: {
  baseAmount: number;
  lineItems?: Array<{ quantity: number; unitPrice: number }>;
  discount?: number;
  province?: Province;
}) {
  const { baseAmount, lineItems = [], discount = 0, province = 'ON' } = params;
  
  // Calculate line items total
  const lineItemsTotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  
  const subtotal = baseAmount + lineItemsTotal - discount;
  const taxCalc = calculateTaxByProvince(subtotal, province);
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    lineItemsTotal: Math.round(lineItemsTotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    ...taxCalc,
  };
}
