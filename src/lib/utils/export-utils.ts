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
