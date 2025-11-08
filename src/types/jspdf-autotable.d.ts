declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    didDrawPage?: (data: any) => void;
  }

  function autoTable(doc: jsPDF, options: UserOptions): void;

  export default autoTable;
}
