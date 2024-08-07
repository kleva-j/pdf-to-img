import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { UploadFileForm } from '@/components/upload-file-form';

import type { Schema } from '@/constant/data';

export type FormStatus = 'pending' | 'loading' | 'done';

export const ApiRouteForm = () => {
  const [status, setStatus] = useState<FormStatus>('pending');

  const handleSubmit = async (data: Schema, form: UseFormReturn<Schema>) => {
    setStatus('loading');

    const body = new FormData();
    body.append('file', data.file[0]);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadData = await response.json();

      form.reset();

      return uploadData;
    } catch (error) {
      throw new Error('Something went wrong, please try again later.');
    } finally {
      setStatus('done');
    }
  };

  return <UploadFileForm status={status} onSubmit={handleSubmit} />;
};
