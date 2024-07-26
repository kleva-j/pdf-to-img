'use client';

import { useUploadFile } from '@/hooks/use-upload-file';

import { FileUploader } from '@/components/file-uploader';

import { UploadedFilesCard } from '@/app/_components/file-cards';

export default function HomePage() {
  const { uploadFiles, progresses, uploadedFiles, isUploading } =
    useUploadFile('pdfUploader');

  return (
    <div className='max-w-xl space-y-6 px-4 mx-auto my-6 sm:my-12 md:my-16 lg:my-20'>
      <FileUploader
        maxFiles={3}
        maxSize={10 * 1024 * 1024}
        progresses={progresses}
        onUpload={uploadFiles}
        disabled={isUploading}
        multiple
      />
      <UploadedFilesCard uploadedFiles={uploadedFiles} />
    </div>
  );
}
