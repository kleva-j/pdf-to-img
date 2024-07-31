import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
} from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';

import { uploadFiles } from '@/server-actions/upload';

const formState = { message: '', status: '' };

export function FormActions() {
  const [files, setFiles] = useState<File[]>([]);
  const { pending } = useFormStatus();

  const [, formAction] = useFormState(uploadFiles, formState);

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      opts={{ maxSize: 1024 * 1024 * 5, accept: { 'application/pdf': [] } }}
    >
      <form action={formAction} className='flex flex-col gap-4'>
        <FileUploaderTrigger />
        <FileUploaderContent>
          <span className='mb-4 inline-block text-sm font-medium text-slate-600'>
            Preview below.
          </span>
          {files.map((file, index) => (
            <FileUploaderItem key={file.name} file={file} index={index} />
          ))}
        </FileUploaderContent>
        <Button
          type='submit'
          disabled={pending}
          className='w-20 disabled:opacity-100'
        >
          {pending ? 'uploading...' : 'Upload'}
        </Button>
      </form>
    </FileUploader>
  );
}
