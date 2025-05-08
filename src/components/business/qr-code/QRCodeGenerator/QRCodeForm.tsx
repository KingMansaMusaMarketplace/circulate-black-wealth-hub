
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { 
  QRCodeTypeField,
  PointsField,
  DiscountField,
  ScanLimitField,
  ExpirationDateField,
  ActiveStatusField,
  SubmitButton,
  FormValues
} from './form';

const formSchema = z.object({
  codeType: z.string().min(1, "QR code type is required"),
  discountPercentage: z.number().int().min(0).max(100).optional(),
  pointsValue: z.number().int().min(0).optional(),
  scanLimit: z.number().int().min(0).optional(),
  expirationDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

interface QRCodeFormProps {
  onSubmit: (values: FormValues) => void;
  initialValues?: Partial<FormValues>;
  isLoading?: boolean;
}

export const QRCodeForm: React.FC<QRCodeFormProps> = ({
  onSubmit,
  initialValues,
  isLoading = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeType: initialValues?.codeType || 'points',
      discountPercentage: initialValues?.discountPercentage || 0,
      pointsValue: initialValues?.pointsValue || 10,
      scanLimit: initialValues?.scanLimit,
      expirationDate: initialValues?.expirationDate,
      isActive: initialValues?.isActive ?? true,
    },
  });

  const codeType = form.watch('codeType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <QRCodeTypeField control={form.control} />

        {(codeType === 'points' || codeType === 'combo') && (
          <PointsField control={form.control} />
        )}

        {(codeType === 'discount' || codeType === 'combo') && (
          <DiscountField control={form.control} />
        )}

        <ScanLimitField control={form.control} />
        <ExpirationDateField control={form.control} />
        <ActiveStatusField control={form.control} />
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default QRCodeForm;
