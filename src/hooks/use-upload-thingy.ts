import { type UseUploadthingProps } from '@uploadthing/react';
import { useState } from 'react';

import { useUploadThing } from '@/lib/uploadthing';

import { type OurFileRouter } from '@/app/api/uploadthing/core';

type UseUploadThingyProps = UseUploadthingProps<
  OurFileRouter,
  keyof OurFileRouter
>;

export function useUploadThingy(
  endpoint: keyof OurFileRouter,
  props: UseUploadThingyProps = {}
) {
  const [progress, setProgress] = useState(0);
  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: setProgress,
    ...props,
  });

  return { startUpload, isUploading, progress };
}
