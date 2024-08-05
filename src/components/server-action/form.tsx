import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { cn } from '@/lib/utils';

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
} from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';

import { MAX_UPLOAD_SIZE } from '@/constant/data';
import { uploadFiles } from '@/server-actions/upload';

const formState = { message: '', status: '', data: null };

export function FormActions() {
  const [files, setFiles] = useState<File[]>([]);
  const { pending } = useFormStatus();

  const [state, formAction] = useFormState(uploadFiles, formState);

  const { message, status } = state;

  return (
    <form action={formAction}>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        opts={{ maxSize: MAX_UPLOAD_SIZE, accept: { 'application/pdf': [] } }}
        className='flex flex-col gap-4'
      >
        <FileUploaderTrigger />
        <FileUploaderContent className='flex flex-col gap-2'>
          <span className='inline-block text-sm font-medium text-slate-600'>
            Preview below.
          </span>
          {message && (
            <p
              className={cn('text-sm text-slate-500', {
                'text-red-500': status === 'error',
              })}
            >
              {message}
            </p>
          )}
          {files.map((file, index) => (
            <FileUploaderItem key={file.name} file={file} index={index} />
          ))}
        </FileUploaderContent>
        <Button
          type='submit'
          disabled={pending || files.length === 0}
          className='w-fit'
        >
          {pending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {pending ? 'uploading...' : 'Upload'}
        </Button>
      </FileUploader>
    </form>
  );
}
