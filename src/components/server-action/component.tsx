import { FileIcon, Loader2, UploadIcon, X as Close } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { showErrorToast } from '@/lib/handle-error';
import { cn, formatBytes } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

import type { UploadFileType } from '@/app/api/upload/route';
import { fileSchema, MAX_UPLOAD_SIZE } from '@/constant/data';
import { uploadFiles } from '@/server-actions/upload';

const formState = { message: '', status: '', data: {} as UploadFileType };

export function Component() {
  const [loading, setLoading] = useState<boolean>(false);
  const [state, formAction] = useFormState(uploadFiles, formState);

  const [tempFile, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const { message, status, data } = state;

  const handleChange = (e: Event | ChangeEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    const { success, data, error } = fileSchema.safeParse(files[0]);
    if (success) {
      setFile(data);
      toast.success(`Accepted File: ${data.name}.`);
    } else showErrorToast(error);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.type = 'text';
      inputRef.current.type = 'file';
    }
  };

  useEffect(() => {
    if (status) {
      setLoading(false);
      setProgress(100);
    }
  }, [status, data]);

  return (
    <form action={formAction} className='flex flex-col gap-4'>
      <Input
        type='file'
        name='file'
        accept='application/pdf'
        placeholder='Select a file'
        multiple={false}
        id='file-upload'
        className='hidden peer'
        onChange={handleChange}
        ref={inputRef}
      />
      <label
        htmlFor='file-upload'
        className='h-30 border-2 border-dashed border-slate-300 dark:border-slate-700 p-3 rounded-md peer-disabled:pointer-events-none peer-disabled:opacity-50 cursor-pointer'
      >
        <div className='flex flex-col items-center justify-center gap-3 sm:px-5'>
          <div className='rounded-full border border-dashed dark:border-slate-700 p-3'>
            <UploadIcon className='size-5 text-slate-600' aria-hidden='true' />
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-base font-medium text-slate-600'>
              Click here to select file(s)
            </p>
            <p className='text-sm text-slate-600/70'>
              You can upload
              {` a file with ${formatBytes(MAX_UPLOAD_SIZE)}`}
            </p>
          </div>
        </div>
      </label>

      <div className='flex flex-col gap-2'>
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

        {tempFile && (
          <div className='relative flex items-center space-x-4'>
            <div className='flex flex-1 space-x-2'>
              <FileIcon className='size-8 text-slate-600 stroke-[1px]' />
              <div className='flex w-full flex-col gap-2'>
                <div className='space-y-px'>
                  <p className='line-clamp-1 text-sm font-medium text-foreground/80'>
                    {tempFile.name}
                  </p>
                  <p className='text-xs text-slate-600'>
                    {formatBytes(tempFile.size)}
                  </p>
                </div>
                {progress ? <Progress value={progress} /> : null}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='size-7'
                onClick={removeFile}
              >
                <Close className='size-4 ' aria-hidden='true' />
                <span className='sr-only'>Remove file</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <Button
        type='submit'
        disabled={loading || tempFile === null}
        className='w-fit'
      >
        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {loading ? 'uploading...' : 'Upload'}
      </Button>
    </form>
  );
}
