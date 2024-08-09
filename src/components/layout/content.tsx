'use client';

import { ChevronsUpDown, Download, FileInput, Trash2 } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn, formatBytes } from '@/lib/utils';
import { type EdgeFileType, useUploadFile } from '@/hooks/use-upload-file';

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
} from '@/components/file-dropzone';

import {
  type Schema,
  formResolver as resolver,
  uploaderOptions as opts,
} from '@/constant/data';
import { Button } from '@/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';

export type DownloadFormat = 'jpg' | 'png' | 'jpeg';
export type DownloadOptions = { format: DownloadFormat };

const { log } = console;

export const Content = () => {
  const id = useId();
  const form = useForm<Schema>({ resolver, defaultValues: { file: [] } });

  const { progress, uploadedFiles, handleDelete, handleUpload, abortUpload } =
    useUploadFile({
      onSuccess: () => {
        toast.success('Successfully uploaded!');
        form.reset();
      },
      onError: (msg) => toast.error(msg),
    });

  function downloadFile(file: EdgeFileType, options: DownloadOptions): void {
    log({ file, options });
    throw new Error('Function not implemented.');
  }

  return (
    <div className='flex flex-col gap-y-6'>
      <Form {...form}>
        <form className='flex w-full flex-col gap-4'>
          <FormField
            control={form.control}
            name='file'
            render={({ field }) => {
              const { value, onChange, ...rest } = field;
              return (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormControl>
                      <FileUploader
                        opts={opts}
                        value={value}
                        onValueChange={onChange}
                        {...rest}
                      >
                        <div className='flex flex-col gap-4'>
                          <FileUploaderTrigger />
                          <FileUploaderContent>
                            {value.map((file: File, index) => (
                              <FileUploaderItem
                                key={file.name}
                                file={file}
                                index={index}
                                progress={progress}
                                abortUpload={abortUpload}
                                handleUpload={handleUpload}
                                className={cn(
                                  'border border-dashed border-slate-300 dark:border-slate-700 px-5 py-2.5 transition rounded-md'
                                )}
                              />
                            ))}
                          </FileUploaderContent>
                        </div>
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              );
            }}
          />
          <Separator className='relative my-3'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-50 absolute -translate-y-1/2 inset-x-1/2 -translate-x-1/2 bg-white dark:bg-slate-950 inline-block w-8 h-5 text-center'>
              OR
            </span>
          </Separator>
          <div className='flex gap-2 flex-col'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Upload from URL
            </span>

            <div className='flex items-center border border-slate-300 rounded-md h-10 dark:border-slate-700'>
              <Label
                className='border-r dark:border-slate-700 px-3 py-[9px] h-full text-sm text-slate-500 dark:text-slate-400'
                htmlFor='upload-url'
              >
                https://
              </Label>
              <Input
                id='upload-url'
                type='text'
                placeholder='eg: www.dropbox.com/xyz/file.pdf'
                className='border-0 ring-0 outline-none w-full focus-visible:ring-0'
              />
              <Button
                variant='outline'
                size='sm'
                className='my-1.5 mr-0.5 border-slate-300'
              >
                Upload
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Collapsible className={cn('space-y-2')}>
        <CollapsibleTrigger asChild>
          <div className='flex items-center justify-between px-2 py-1 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50/50 dark:bg-slate-900'>
            <h4 className='text-sm font-semibold dark:text-slate-300'>
              Uploaded files ({uploadedFiles.length})
            </h4>
            <Button variant='ghost' size='sm' className='hover:bg-transparent'>
              <ChevronsUpDown className='size-4' />
              <span className='sr-only'>Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className='border border-slate-300 dark:border-slate-700 rounded-md'>
          <ul className='divide-y divide-slate-200 dark:divide-slate-700'>
            {uploadedFiles.map((file, index) => {
              const { size, metadata } = file;

              const download = (format: DownloadFormat) => () =>
                downloadFile(file, { format });

              return (
                <li
                  key={`${id}-${index}`}
                  className='py-2 px-3 even:bg-slate-50/50 dark:even:bg-slate-900/50'
                >
                  <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                    <div className='flex-shrink-0 border dark:border-slate-700 rounded p-1'>
                      <FileInput className='size-6 text-slate-600 dark:text-slate-400 stroke-[1px]' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='line-clamp-1 text-sm truncate font-medium text-slate-700 dark:text-slate-300'>
                        {metadata.name}
                      </p>
                      <p className='text-xs text-slate-600 w-max text-nowrap'>
                        {formatBytes(size)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant='outline'
                          size='icon'
                          className='size-7'
                        >
                          <Download className='size-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start'>
                        <DropdownMenuLabel>Download as</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={download('jpg')}>
                          JPG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={download('png')}>
                          PNG
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={download('jpeg')}>
                          JPEG
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      size='icon'
                      variant='destructive'
                      className='size-7'
                      onClick={() => handleDelete(file)}
                    >
                      <Trash2 className='size-4' aria-hidden='true' />
                      <span className='sr-only'>Delete file</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
