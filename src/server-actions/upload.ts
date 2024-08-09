'use server';

import { revalidatePath } from 'next/cache';

import { getErrorMessage } from '@/lib/handle-error';

import { fileSchema } from '@/constant/data';
import { backendClient } from '@/server/edgestore';

const { log } = console;

export async function uploadFiles(_: unknown, formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file) return { message: 'No file provided', status: 'error' };

    const parse = fileSchema.safeParse(file);

    if (!parse.success) {
      return { message: getErrorMessage(parse.error), status: 'error' };
    }

    const blob = new Blob([parse.data], { type: file.type });
    const extension = file.name.split('.').pop() as string;

    const res = await backendClient.publicFiles.upload({
      content: { blob, extension },
      options: { temporary: true },
    });

    revalidatePath('/');

    return {
      message: 'File uploaded successfully',
      data: res,
      status: 'success',
    };
  } catch (e) {
    log(e);
    return { message: 'Error uploading file', status: 'error' };
  }
}
