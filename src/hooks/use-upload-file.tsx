'use client';

import { useState } from 'react';

import { useEdgeStore } from '@/lib/edgestore';

import { fileSchema } from '@/constant/data';

export type EdgeFileType = {
  url: string;
  size: number;
  uploadedAt: Date;
  metadata: Record<string, string | undefined>;
  path: Record<string, string>;
  pathOrder: string[];
};
type UseUploadProps = {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
};

const { error } = console;

export const useUploadFile = (props: UseUploadProps) => {
  const { onSuccess, onError } = props;
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<EdgeFileType[]>([]);
  const [abortController, setAbortController] = useState<AbortController>(
    new AbortController()
  );

  const abortUpload = () => {
    abortController.abort();
    setAbortController(new AbortController());
  };

  const handleUpload = async (file: File | null) => {
    if (!file) {
      error('File is null');
      return;
    }

    try {
      const parse = fileSchema.safeParse(file);
      if (!parse.success) {
        error('Failed to parse file:', parse.error);
        onError?.('Invalid file type');
        return;
      }

      const data = await edgestore.publicFiles.upload({
        file: parse.data,
        options: { temporary: true },
        onProgressChange: setProgress,
        signal: abortController.signal,
      });

      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        { ...data, metadata: { ...data.metadata, name: file.name } },
      ]);
      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        error('Failed to upload file:', error);
        onError?.(err.message);
      } else {
        error('Unknown error occurred:', error);
        onError?.('An unknown error occurred');
      }
    } finally {
      setProgress(0);
    }
  };

  const handleDelete = async (file: EdgeFileType) => {
    if (!file) return;
    try {
      await edgestore.publicFiles.delete({ url: file.url });
      setUploadedFiles((prev) => prev.filter((f) => f.url !== file.url));
    } catch (error) {
      onError?.('Error deleting file');
    }
  };

  return {
    progress,
    abortUpload,
    handleUpload,
    handleDelete,
    uploadedFiles,
  };
};
