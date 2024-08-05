import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { UploadFileForm } from '@/components/upload-file-form';

import type { Schema } from '@/constant/data';

const { log } = console;

export const ApiRouteForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: Schema, form: UseFormReturn<Schema>) => {
    setLoading(true);

    const body = new FormData();
    body.append('file', data.file[0]);

    const response = await fetch('/api/upload', { method: 'POST', body });

    if (!response.ok) {
      toast.error('Something went wrong, please try again later.');
      setLoading(false);
    }

    const { status, data: fileData } = await response.json();
    log({ status, fileData });

    toast.success("You've successfully uploaded your files!");
    setLoading(false);
    form.reset();
  };

  return <UploadFileForm loading={loading} onSubmit={handleSubmit} />;
};
