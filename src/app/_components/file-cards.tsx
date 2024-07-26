import { CloudDownload, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { EmptyCard } from '@/app/_components/empty-card';

type UploadedFile = {
  key: string;
  url: string;
  name: string;
};

interface UploadedFilesCardProps {
  uploadedFiles: UploadedFile[];
}

export function UploadedFilesCard({ uploadedFiles }: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <div className='flex flex-col w-full space-y-2'>
            {uploadedFiles.map((file) => (
              <div
                key={file.key}
                className='relative flex w-full gap-x-2 items-center text-slate-400'
              >
                <FileText className='text-2xl stroke-[1px]' />
                <span className='text-sm truncate flex-1 text-slate-600'>
                  {file.name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='rounded-md text-xs ml-auto h-7 px-2'
                    >
                      <CloudDownload className='size-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    <DropdownMenuItem>JPG</DropdownMenuItem>
                    <DropdownMenuItem>PNG</DropdownMenuItem>
                    <DropdownMenuItem>JPEG</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <EmptyCard
            title='No files uploaded'
            description='Upload some files to see them here'
            className='w-full'
          />
        )}
      </CardContent>
    </Card>
  );
}
