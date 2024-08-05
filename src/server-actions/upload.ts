'use server';

import { revalidatePath } from 'next/cache';
import { UploadThingError } from 'uploadthing/server';

import { getErrorMessage } from '@/lib/handle-error';

import { fileSchema } from '@/constant/data';
import { utapi } from '@/server/uploadthing';

const { log } = console;

export async function uploadFiles(_: unknown, formData: FormData) {
  try {
    const file = formData.get('file') as File;

    log({ file, entries: Array.from(formData.values()) });

    if (!file) return { message: 'No file provided', status: 'error' }; // Check for null

    const parse = fileSchema.safeParse(file);

    log({ data: parse.data, file });

    if (!parse.success) {
      return { message: getErrorMessage(parse.error), status: 'error' };
    }

    const { data, error } = await utapi.uploadFiles(file);

    if (error) throw new UploadThingError(error);

    revalidatePath('/');
    return { message: 'File uploaded successfully', url: data.url };
  } catch (e) {
    return { message: 'Error uploading file(s)', status: 'error' };
  }
}
