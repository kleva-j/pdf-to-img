'use client';

import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useEdgeStore } from '@/lib/edgestore';

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
} from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { type Schema, formResolver as resolver } from '@/constant/data';

type EdgeFileType = {
  url: string;
  size: number;
  uploadedAt: Date;
  metadata: Record<string, never>;
  path: Record<string, never>;
  pathOrder: string[];
};

export const EdgeStoreForm = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [edgeFile, setFile] = useState<EdgeFileType | null>(null);
  const [abortController, setAbortController] = useState<AbortController>(
    new AbortController()
  );

  const { edgestore } = useEdgeStore();

  const form = useForm<Schema>({ resolver, defaultValues: { file: [] } });

  const onSubmit = async (data: Schema) => {
    setLoading(true);
    const [file] = data['file'];
    if (!file) return;
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        options: { temporary: true },
        onProgressChange: setProgress,
        signal: abortController.signal,
      });
      setFile(res);
      toast.success('Successfully uploaded!');
    } catch (error) {
      toast.error('Failed to upload your files!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setProgress(0);
    setFile(null);
  };

  const handleDelete = async () => {
    try {
      if (edgeFile) {
        // Check if edgeFile is not null
        await edgestore.publicFiles.delete({ url: edgeFile.url });
        handleReset();
        toast.success('File deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete file!');
    }
  };

  const abortUpload = () => {
    abortController.abort();
    setAbortController(new AbortController());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-4'
      >
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
                      value={value}
                      onValueChange={onChange}
                      opts={{
                        maxSize: 1024 * 1024 * 5,
                        accept: { 'application/pdf': [] },
                      }}
                      {...rest}
                    >
                      <div className='flex flex-col gap-4'>
                        <FileUploaderTrigger />
                        <FileUploaderContent>
                          <span className='mb-4 inline-block text-sm font-medium text-slate-600'>
                            Preview below.
                          </span>
                          {value.map((file, index) => (
                            <FileUploaderItem
                              key={file.name}
                              file={file}
                              index={index}
                              progress={progress}
                              abortUpload={abortUpload}
                              moreActions={
                                <DropdownMenu>
                                  <DropdownMenuTrigger>
                                    <Button
                                      variant='outline'
                                      size='icon'
                                      className='size-7'
                                    >
                                      <EllipsisVertical className='size-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='start'>
                                    <DropdownMenuLabel>
                                      Download as
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>JPG</DropdownMenuItem>
                                    <DropdownMenuItem>PNG</DropdownMenuItem>
                                    <DropdownMenuItem>JPEG</DropdownMenuItem>
                                    <DropdownMenuLabel>
                                      More options
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={handleReset}>
                                      Reset
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete}>
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              }
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
        <Button
          className='w-fit'
          disabled={loading || form.getValues().file.length === 0}
        >
          Upload
        </Button>
      </form>
    </Form>
  );
};
