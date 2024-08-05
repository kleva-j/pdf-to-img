'use server';

import { revalidatePath } from 'next/cache';

import { getErrorMessage } from '@/lib/handle-error';

import { fileSchema } from '@/constant/data';

export async function uploadFiles(_: unknown, formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file) return { message: 'No file provided', status: 'error' };

    const parse = fileSchema.safeParse(file);

    if (!parse.success) {
      return { message: getErrorMessage(parse.error), status: 'error' };
    }

    revalidatePath('/');
    return { message: 'File uploaded successfully', url: '' };
  } catch (e) {
    return { message: 'Error uploading file(s)', status: 'error' };
  }
}
