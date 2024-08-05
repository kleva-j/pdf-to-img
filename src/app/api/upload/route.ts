import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { UploadThingError } from 'uploadthing/server';

import { utapi } from '@/server/uploadthing';

const { error: logError } = console;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File;

    const { data, error } = await utapi.uploadFiles(file);

    if (error) throw new UploadThingError(error);

    revalidatePath('/');

    return NextResponse.json({ status: 'success', data });
  } catch (e) {
    logError(e);
    return NextResponse.json({ status: 'fail', error: e });
  }
}
