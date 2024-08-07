import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormStatus } from '@/components/api-route/form';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
} from '@/components/file-dropzone';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import type { UploadFileResponseType } from '@/app/api/upload/route';
import { type Schema, formResolver } from '@/constant/data';
import { Button } from '@/ui/button';

const { log } = console;

type FormProps = {
  status: FormStatus;
  onSubmit: (
    data: Schema,
    form: UseFormReturn<Schema>
  ) => Promise<UploadFileResponseType>;
};

export const UploadFileForm = ({ status, onSubmit }: FormProps) => {
  const [progress, setProgress] = useState<number>(0);

  const form = useForm<Schema>({
    resolver: formResolver,
    defaultValues: { file: [] },
  });

  const handleSubmit = (data: Schema) => {
    toast.promise(onSubmit(data, form), {
      loading: 'Uploading file...',
      success: (data: UploadFileResponseType) => {
        setProgress(100);
        log(data);
        return 'File uploaded successfully';
      },
      error: 'Failed to upload file',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
          disabled={status === 'loading' || form.getValues().file.length === 0}
        >
          {status === 'loading' && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          {status === 'loading' ? 'uploading...' : 'Upload'}
        </Button>
      </form>
    </Form>
  );
};
