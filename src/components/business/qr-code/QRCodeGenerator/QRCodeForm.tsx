
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeTypeField } from './form/QRCodeTypeField';
import { DiscountField } from './form/DiscountField';
import { PointsField } from './form/PointsField';
import { ScanLimitField } from './form/ScanLimitField';
import { ExpirationDateField } from './form/ExpirationDateField';
import { ActiveStatusField } from './form/ActiveStatusField';
import { SubmitButton } from './form/SubmitButton';
import { FormValues } from './form/types';

const qrCodeSchema = z.object({
  codeType: z.enum(['discount', 'loyalty', 'checkin']),
  discountPercentage: z.number().min(1).max(100).optional(),
  pointsValue: z.number().min(1).max(1000).optional(),
  scanLimit: z.number().min(1).optional(),
  expirationDate: z.string().optional(),
  isActive: z.boolean().default(true)
});

interface QRCodeFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<FormValues>;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  initialValues 
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      codeType: 'loyalty',
      isActive: true,
      ...initialValues
    }
  });

  const codeType = form.watch('codeType');

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <QRCodeTypeField />
            
            {codeType === 'discount' && <DiscountField />}
            {codeType === 'loyalty' && <PointsField />}
            
            <ScanLimitField />
            <ExpirationDateField />
            <ActiveStatusField />
            
            <SubmitButton isLoading={isLoading} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QRCodeForm;
