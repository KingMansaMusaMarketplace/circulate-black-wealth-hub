import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface ExportData {
  referrals?: any[];
  commissions?: any[];
  payments?: any[];
}

interface ExportOptions {
  startDate?: Date;
  endDate?: Date;
  agentName?: string;
  agentCode?: string;
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (
  data: any[],
  filename: string,
  columns: { key: string; label: string }[]
) => {
  // Create CSV header
  const header = columns.map(col => col.label).join(',');
  
  // Create CSV rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      // Escape values that contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',');
  });
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

/**
 * Export referrals to CSV
 */
export const exportReferralsToCSV = (referrals: any[], options?: ExportOptions) => {
  const columns = [
    { key: 'referral_date', label: 'Date' },
    { key: 'business_name', label: 'Business Name' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'subscription_amount', label: 'Subscription Amount' },
    { key: 'status', label: 'Status' },
  ];

  const formattedData = referrals.map(ref => ({
    referral_date: format(new Date(ref.referral_date), 'MM/dd/yyyy'),
    business_name: ref.businesses?.business_name || 'N/A',
    city: ref.businesses?.city || 'N/A',
    state: ref.businesses?.state || 'N/A',
    subscription_amount: `$${parseFloat(ref.subscription_amount || '0').toFixed(2)}`,
    status: ref.subscription_status || 'Pending',
  }));

  exportToCSV(formattedData, 'referrals_report', columns);
};

/**
 * Export commissions to CSV
 */
export const exportCommissionsToCSV = (commissions: any[], options?: ExportOptions) => {
  const columns = [
    { key: 'due_date', label: 'Due Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'paid_date', label: 'Paid Date' },
    { key: 'business_name', label: 'Business' },
  ];

  const formattedData = commissions.map(comm => ({
    due_date: format(new Date(comm.due_date), 'MM/dd/yyyy'),
    amount: `$${parseFloat(comm.amount).toFixed(2)}`,
    status: comm.status,
    paid_date: comm.paid_date ? format(new Date(comm.paid_date), 'MM/dd/yyyy') : 'Not Paid',
    business_name: comm.referrals?.businesses?.business_name || 'N/A',
  }));

  exportToCSV(formattedData, 'commissions_report', columns);
};

/**
 * Export payments to CSV
 */
export const exportPaymentsToCSV = (payments: any[], options?: ExportOptions) => {
  const columns = [
    { key: 'created_at', label: 'Date' },
    { key: 'batch_number', label: 'Batch' },
    { key: 'amount', label: 'Amount' },
    { key: 'payment_method', label: 'Method' },
    { key: 'status', label: 'Status' },
    { key: 'paid_at', label: 'Paid Date' },
  ];

  const formattedData = payments.map(payment => ({
    created_at: format(new Date(payment.created_at), 'MM/dd/yyyy'),
    batch_number: payment.batch?.batch_number || 'N/A',
    amount: `$${parseFloat(payment.amount).toFixed(2)}`,
    payment_method: payment.payment_method,
    status: payment.status,
    paid_at: payment.paid_at ? format(new Date(payment.paid_at), 'MM/dd/yyyy') : 'Pending',
  }));

  exportToCSV(formattedData, 'payments_report', columns);
};

/**
 * Export comprehensive report to PDF
 */
export const exportToPDF = (data: ExportData, options: ExportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.text('Sales Agent Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Agent: ${options.agentName || 'N/A'}`, 14, 30);
  doc.text(`Referral Code: ${options.agentCode || 'N/A'}`, 14, 36);
  
  if (options.startDate && options.endDate) {
    doc.text(
      `Period: ${format(options.startDate, 'MM/dd/yyyy')} - ${format(options.endDate, 'MM/dd/yyyy')}`,
      14,
      42
    );
  }
  
  doc.text(`Generated: ${format(new Date(), 'MM/dd/yyyy HH:mm')}`, 14, 48);
  
  let yPosition = 58;

  // Referrals Table
  if (data.referrals && data.referrals.length > 0) {
    doc.setFontSize(14);
    doc.text('Referrals', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'Business Name', 'City', 'State', 'Amount', 'Status']],
      body: data.referrals.map(ref => [
        format(new Date(ref.referral_date), 'MM/dd/yyyy'),
        ref.businesses?.business_name || 'N/A',
        ref.businesses?.city || 'N/A',
        ref.businesses?.state || 'N/A',
        `$${parseFloat(ref.subscription_amount || '0').toFixed(2)}`,
        ref.subscription_status || 'Pending',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Commissions Table
  if (data.commissions && data.commissions.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text('Commissions', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Due Date', 'Amount', 'Status', 'Paid Date']],
      body: data.commissions.map(comm => [
        format(new Date(comm.due_date), 'MM/dd/yyyy'),
        `$${parseFloat(comm.amount).toFixed(2)}`,
        comm.status,
        comm.paid_date ? format(new Date(comm.paid_date), 'MM/dd/yyyy') : 'Not Paid',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [46, 204, 113] },
      margin: { top: 10 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Payments Table
  if (data.payments && data.payments.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text('Payments', 14, yPosition);
    yPosition += 6;

    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'Batch', 'Amount', 'Method', 'Status']],
      body: data.payments.map(payment => [
        format(new Date(payment.created_at), 'MM/dd/yyyy'),
        payment.batch?.batch_number || 'N/A',
        `$${parseFloat(payment.amount).toFixed(2)}`,
        payment.payment_method,
        payment.status,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [155, 89, 182] },
      margin: { top: 10 },
    });
  }

  // Summary
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  } else {
    yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + 15;
  }

  doc.setFontSize(14);
  doc.text('Summary', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  
  if (data.referrals) {
    doc.text(`Total Referrals: ${data.referrals.length}`, 14, yPosition);
    yPosition += 6;
  }

  if (data.commissions) {
    const totalCommissions = data.commissions.reduce(
      (sum, c) => sum + parseFloat(c.amount),
      0
    );
    doc.text(`Total Commissions: $${totalCommissions.toFixed(2)}`, 14, yPosition);
    yPosition += 6;
  }

  if (data.payments) {
    const totalPayments = data.payments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );
    doc.text(`Total Payments: $${totalPayments.toFixed(2)}`, 14, yPosition);
  }

  // Save PDF
  doc.save(`sales_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

/**
 * Export expenses to PDF
 */
export const exportExpensesToPDF = (expenses: any[], businessName: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Expenses Report', 14, 20);
  doc.setFontSize(12);
  doc.text(businessName, 14, 28);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);

  const tableData = expenses.map(expense => [
    new Date(expense.expense_date).toLocaleDateString(),
    expense.category,
    expense.description || '-',
    `$${Number(expense.amount).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['Date', 'Category', 'Description', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.text(`Total: $${totalAmount.toFixed(2)}`, 14, finalY + 10);

  doc.save(`expenses-report-${Date.now()}.pdf`);
};

/**
 * Export invoice to PDF
 */
export const exportInvoiceToPDF = (invoice: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.text('INVOICE', 14, 20);
  
  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoice_number}`, 14, 35);
  doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 14, 42);
  doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 14, 49);
  
  // Customer details
  doc.setFontSize(12);
  doc.text('Bill To:', 14, 62);
  doc.setFontSize(10);
  doc.text(invoice.customer_name, 14, 69);
  doc.text(invoice.customer_email, 14, 76);
  
  // Line items
  const lineItems = invoice.line_items || [];
  const tableData = lineItems.map((item: any) => [
    item.description,
    item.quantity.toString(),
    `$${Number(item.unit_price).toFixed(2)}`,
    `$${Number(item.total).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY || 90;
  doc.setFontSize(10);
  
  const rightX = 150;
  let currentY = finalY + 10;
  
  if (invoice.subtotal) {
    doc.text(`Subtotal: $${Number(invoice.subtotal).toFixed(2)}`, rightX, currentY);
    currentY += 7;
  }
  
  if (invoice.tax_rate && invoice.tax_rate > 0) {
    doc.text(`Tax (${invoice.tax_rate}%): $${Number(invoice.tax_amount).toFixed(2)}`, rightX, currentY);
    currentY += 7;
  }
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: $${Number(invoice.total_amount).toFixed(2)}`, rightX, currentY);
  
  if (invoice.notes) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Notes:', 14, currentY + 15);
    doc.text(invoice.notes, 14, currentY + 22, { maxWidth: 180 });
  }

  doc.save(`invoice-${invoice.invoice_number}.pdf`);
};

/**
 * Export P&L Report to PDF
 */
export const exportPLReportToPDF = (plData: any, businessName: string, period: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Profit & Loss Report', 14, 20);
  doc.setFontSize(12);
  doc.text(businessName, 14, 28);
  doc.setFontSize(10);
  doc.text(`Period: ${period}`, 14, 35);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 42);

  // Summary
  doc.setFontSize(12);
  let y = 55;
  doc.text('Summary', 14, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.text(`Total Revenue: $${plData.totalRevenue.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Total Expenses: $${plData.totalExpenses.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Net Profit: $${plData.netProfit.toFixed(2)}`, 20, y);
  y += 7;
  doc.text(`Profit Margin: ${plData.profitMargin.toFixed(2)}%`, 20, y);
  y += 15;

  // Expense breakdown
  if (plData.expensesByCategory && plData.expensesByCategory.length > 0) {
    doc.setFontSize(12);
    doc.text('Expenses by Category', 14, y);
    y += 10;

    const tableData = plData.expensesByCategory.map((cat: any) => [
      cat.name,
      `$${Number(cat.value).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Category', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
    });
  }

  doc.save(`pl-report-${Date.now()}.pdf`);
};

