import { type UseFormReturn, useForm } from 'react-hook-form';

import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileUploaderTrigger,
} from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';

import { type Schema, formResolver } from '@/constant/data';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/ui/form';

type FormProps = {
  loading: boolean;
  onSubmit: (data: Schema, form: UseFormReturn<Schema>) => void;
};

export const UploadFileForm = ({ loading, onSubmit }: FormProps) => {
  const form = useForm<Schema>({
    resolver: formResolver,
    defaultValues: { file: [] },
  });

  const handleSubmit = (data: Schema) => {
    onSubmit(data, form);
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
