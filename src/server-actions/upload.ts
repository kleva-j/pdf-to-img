'use server';

import { revalidatePath } from 'next/cache';

// import { writeFile } from 'node:fs/promises';
import { fileSchema } from '@/constant/data';

export async function uploadFiles(_: unknown, formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file) return { message: 'No file provided', status: 'error' }; // Check for null

    const parse = fileSchema.safeParse({ file });

    if (!parse.success) return { message: 'Failed to upload file(s)' };

    // const buffer = await file.arrayBuffer();

    // const fileBuffer = Buffer.from(buffer);

    // await writeFile(file.name, fileBuffer);

    revalidatePath('/');
    return { message: 'File uploaded successfully', status: 'success' };
  } catch (e) {
    return { message: 'Error uploading file(s)', status: 'error' };
  }
}
