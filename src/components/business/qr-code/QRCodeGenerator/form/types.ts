
export interface FormValues {
  codeType: 'discount' | 'loyalty' | 'checkin';
  discountPercentage?: number;
  pointsValue?: number;
  scanLimit?: number;
  expirationDate?: string;
  isActive: boolean;
}
