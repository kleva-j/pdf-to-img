'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

import { type Schema, formResolver } from '@/constant/data';
import { Button } from '@/ui/button';

const { log } = console;

export const EdgeStoreForm = () => {
  const [loading] = useState<boolean>(false);

  const form = useForm<Schema>({
    resolver: formResolver,
    defaultValues: { file: [] },
  });

  const onSubmit = (data: Schema) => {
    log(data);
    toast.success("You've successfully uploaded your files!");
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
