import { NextResponse } from 'next/server';

import { getErrorMessage } from '@/lib/handle-error';

import { fileSchema } from '@/constant/data';
import { backendClient } from '@/server/edgestore';

export type UploadFileResponseType = {
  message: string;
  status: string;
  data?: UploadFileType;
};

export type UploadFileType = {
  url: string;
  size: number;
  metadata: Record<string, never>;
  path: Record<string, never>;
  pathOrder: string[];
};

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get('file') as File;

  if (!file) return { message: 'No file provided', status: 'error' };

  const parse = fileSchema.safeParse(file);

  if (!parse.success)
    return { message: getErrorMessage(parse.error), status: 'error' };

  try {
    const blob = new Blob([parse.data], { type: file.type });
    const extension = file.name.split('.').pop() as string;

    const res = await backendClient.publicFiles.upload({
      content: { blob, extension },
      options: { temporary: true },
    });

    return NextResponse.json<UploadFileResponseType>({
      status: 'success',
      data: res,
      message: 'File uploaded successfully',
    });
  } catch (e) {
    return NextResponse.json<UploadFileResponseType>(
      {
        status: 'error',
        message: (e as Error).message,
      },
      { status: 500 }
    );
  }
}
