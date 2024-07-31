'use client';

import { Cross2Icon, UploadIcon } from '@radix-ui/react-icons';
import { type VariantProps, cva } from 'class-variance-authority';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  type DropzoneOptions,
  type DropzoneState,
  type FileRejection,
  useDropzone,
} from 'react-dropzone';
import { toast } from 'sonner';

import { cn, formatBytes } from '@/lib/utils';
import { useControllableState } from '@/hooks/use-controllable-state';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Progress } from '@/ui/progress';

/**
 * @see https://github.com/sadmann7/file-uploader/blob/main/src/components/file-uploader-primitive.tsx
 */

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Options for the dropzone.
   * @type DropzoneOptions | undefined
   * @default undefined
   * @example opts={{ maxFiles: 3, multiple: true }}
   */
  opts?: DropzoneOptions;
}

interface FileUploaderContextProps extends DropzoneState {
  files: File[];
  maxFiles: number;
  maxSize: number;
  setFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
  progresses?: Record<string, number>;
  disabled: boolean;
}

const FileUploaderContext = createContext<FileUploaderContextProps | null>(
  null
);

export function useFileUploader() {
  const context = useContext(FileUploaderContext);

  if (!context) {
    throw new Error('useFileUploader must be used within a <FileUploader />');
  }

  return context;
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps>(
  (
    {
      value: valueProp,
      onValueChange,
      onUpload,
      progresses,
      opts,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const {
      accept = { 'image/*': [] },
      maxSize = 1024 * 1024 * 4,
      maxFiles = 1,
      multiple = false,
      disabled = false,
      ...dropzoneProps
    } = opts ?? {};

    const [files, setFiles] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
    });

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
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        const updatedFiles = files ? [...files, ...newFiles] : newFiles;

        setFiles(updatedFiles);

        if (rejectedFiles.length > 0) {
          rejectedFiles.forEach(({ file }) => {
            toast.error(`File ${file.name} was rejected`);
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
      onValueChange?.(newFiles);
    }

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

    const dropzone = useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles,
      multiple,
      disabled: isDisabled,
      ...dropzoneProps,
    });

    return (
      <FileUploaderContext.Provider
        value={{
          files: files ?? [],
          maxFiles,
          maxSize,
          setFiles,
          onRemove,
          progresses,
          disabled: isDisabled,
          ...dropzone,
        }}
      >
        <div
          ref={ref}
          className={cn(
            'relative flex flex-col gap-6 overflow-hidden',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  }
);
FileUploader.displayName = 'FileUploader';

const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
FileUploaderContent.displayName = 'FileUploaderContent';

const fileUploaderInputVariants = cva(
  'group relative cursor-pointer focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default:
          'grid h-52 w-full place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center ring-offset-background transition hover:bg-muted/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:border-muted-foreground/50',
        button:
          'inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90',
        headless: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const FileUploaderTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof fileUploaderInputVariants>
>(({ children, className, variant, ...props }, ref) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    maxFiles,
    maxSize,
    disabled,
  } = useFileUploader();

  return (
    <div
      ref={ref}
      data-state={
        isDragActive
          ? 'active'
          : isDragAccept
          ? 'accept'
          : isDragReject
          ? 'reject'
          : undefined
      }
      data-disabled={disabled ? '' : undefined}
      className={cn(fileUploaderInputVariants({ variant, className }))}
      {...props}
      {...getRootProps()}
    >
      <Input type='file' name='file' {...getInputProps()} />
      {isDragActive ? (
        <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
          <div className='rounded-full border border-dashed p-3'>
            <UploadIcon className='size-7 text-slate-600' aria-hidden='true' />
          </div>
          <p className='font-medium text-slate-600'>Drop the files here</p>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
          <div className='rounded-full border border-dashed p-3'>
            <UploadIcon className='size-7 text-slate-600' aria-hidden='true' />
          </div>
          <div className='space-y-px'>
            <p className='font-medium text-slate-600'>
              Drag {`'n'`} drop files here, or click to select files
            </p>
            <p className='text-sm text-slate-600/70'>
              You can upload
              {maxFiles > 1
                ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                : ` a file with ${formatBytes(maxSize)}`}
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
});
FileUploaderTrigger.displayName = 'FileUploaderTrigger';

interface FileUploaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
  file: File;
  index: number;
  progress?: number;
}

const FileUploaderItem = forwardRef<HTMLDivElement, FileUploaderItemProps>(
  ({ file, index, progress, className, ...props }, ref) => {
    const { onRemove } = useFileUploader();

    return (
      <div
        ref={ref}
        className={cn('relative flex items-center space-x-4', className)}
        {...props}
      >
        <div className='flex flex-1 space-x-2'>
          {file.type.startsWith('application') ? (
            <FileIcon className='size-8 text-slate-600 stroke-[1px]' />
          ) : isFileWithPreview(file) ? (
            <Image
              src={file.preview}
              alt={file.name}
              width={48}
              height={48}
              loading='lazy'
              className='aspect-square shrink-0 rounded-md object-cover'
            />
          ) : null}
          <div className='flex w-full flex-col gap-2'>
            <div className='space-y-px'>
              <p className='line-clamp-1 text-sm font-medium text-foreground/80'>
                {file.name}
              </p>
              <p className='text-xs text-slate-600'>{formatBytes(file.size)}</p>
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
            onClick={() => onRemove(index)}
          >
            <Cross2Icon className='size-4 ' aria-hidden='true' />
            <span className='sr-only'>Remove file</span>
          </Button>
        </div>
      </div>
    );
  }
);
FileUploaderItem.displayName = 'FileUploaderItem';

export {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
};
