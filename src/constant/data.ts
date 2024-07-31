import { zodResolver } from '@hookform/resolvers/zod';
import { icons } from 'lucide-react';
import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

export const fileSchema = z
  .any()
  .refine((file) => !file || (!!file && file.size <= MAX_UPLOAD_SIZE), {
    message: 'The File must be a maximum of 5MB.',
  })
  .refine(
    (file) => !file || (!!file && ACCEPTED_FILE_TYPES.includes(file.type)),
    'Only pdfs are allowed.'
  );

export const formSchema = z.object({ file: z.array(fileSchema) });

export type Schema = z.infer<typeof formSchema>;
export const formResolver = zodResolver(formSchema);

export type status = 'success' | 'error';
type alertType = {
  variant: 'default' | 'success' | 'info' | 'destructive';
  title: string;
  description: string;
  icon: keyof typeof icons;
};

export const alertMap: Record<status, alertType> = {
  success: {
    variant: 'info',
    icon: 'CircleCheck',
    title: 'Success!',
    description: 'Your files have been uploaded successfully.',
  },
  error: {
    title: 'Error!',
    icon: 'TriangleAlert',
    variant: 'destructive',
    description: 'There was an error uploading your files.',
  },
};
