'use client';

import { Cross2Icon, UploadIcon } from '@radix-ui/react-icons';
import { FileClock } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

import { cn, formatBytes } from '@/lib/utils';
import { useControllableState } from '@/hooks/use-controllable-state';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { FileUploaderType } from '@/types';

export function FileUploader(props: FileUploaderType) {
  const {
    value: valueProp,
    onValueChange: onChange,
    onUpload,
    progresses,
    accept = { 'application/pdf': ['.pdf'] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({ prop: valueProp, onChange });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors, file }) => {
          toast.message(`REJECTED ${file.name}`, {
            description: `(${formatBytes(file.size)}) ${errors[0].message}`,
            closeButton: true,
          });
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_: File, i: number) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
  }

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach((file) => {
        toast.success(`ACCEPTED ${file.name}`);
      });
    }
  }, []);

  // Revoke preview url when component unmounts
  useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file: File) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
        onDropAccepted={onDropAccepted}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed dark:border-slate-600/40 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadIcon
                    className='size-7 text-slate-500 dark:text-slate-400'
                    aria-hidden='true'
                  />
                </div>
                <p className='font-medium text-slate-500 dark:text-slate-400'>
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <UploadIcon
                    className='size-7 text-slate-500 dark:text-slate-400'
                    aria-hidden='true'
                  />
                </div>
                <div className='space-y-px'>
                  <p className='font-medium text-slate-500 dark:text-slate-400'>
                    Drag {`'n'`} drop files here, or click to select files
                  </p>
                  <p className='text-sm text-slate-500 dark:text-slate-400/70'>
                    You can upload
                    {maxFiles > 1
                      ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                      : ` a file with ${formatBytes(maxSize)}`}
                  </p>
                  <small className='text-sm'>
                    (Only *.pdf files will be accepted)
                  </small>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className='h-fit w-full px-3'>
          <div className='max-h-48 space-y-4'>
            {files?.map((file: File, index: React.Key | null | undefined) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index as number)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className='relative flex items-center space-x-4'>
      <div className='flex flex-1 space-x-4'>
        {isFileWithPreview(file) ? (
          <FileClock className='h-8 w-8 stroke-[1px]' />
        ) : null}
        <div className='flex w-full flex-col gap-2'>
          <div className='space-y-px'>
            <p className='line-clamp-1 text-sm font-medium text-foreground/80'>
              {file.name}
            </p>
            <p className='text-xs text-muted-foreground'>
              {formatBytes(file.size)}
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
          onClick={onRemove}
        >
          <Cross2Icon className='size-4' aria-hidden='true' />
          <span className='sr-only'>Remove file</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
