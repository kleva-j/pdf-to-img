import { zodResolver } from '@hookform/resolvers/zod';
import { icons } from 'lucide-react';
import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

export const fileSchema = z
  .custom<FileList>()
  .transform((file) => file.length > 0 && file.item(0))
  .refine((file) => !file || (!!file && file.size <= MAX_UPLOAD_SIZE), {
    message: 'The File must be a maximum of 3MB.',
  })
  .refine(
    (file) => !file || (!!file && ACCEPTED_FILE_TYPES.includes(file.type)),
    { message: 'Only pdfs are allowed.' }
  );

export type Schema = z.infer<typeof fileSchema>;
export const formResolver = zodResolver(fileSchema);

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
