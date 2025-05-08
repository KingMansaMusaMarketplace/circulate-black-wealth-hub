
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  codeType: z.string().min(1, "QR code type is required"),
  discountPercentage: z.number().int().min(0).max(100).optional(),
  pointsValue: z.number().int().min(0).optional(),
  scanLimit: z.number().int().min(0).optional(),
  expirationDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

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
        <FormField
          control={form.control}
          name="codeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a QR code type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="points">Loyalty Points</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="combo">Points + Discount</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of QR code you want to generate.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(codeType === 'points' || codeType === 'combo') && (
          <FormField
            control={form.control}
            name="pointsValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Number of loyalty points awarded when this QR code is scanned.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(codeType === 'discount' || codeType === 'combo') && (
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Discount percentage applied when this QR code is scanned.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="scanLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scan Limit (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Maximum number of times this QR code can be scanned. Leave empty for unlimited.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Date when this QR code expires. Leave empty for no expiration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Make this QR code active or inactive.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate QR Code"}
        </Button>
      </form>
    </Form>
  );
};

export default QRCodeForm;
