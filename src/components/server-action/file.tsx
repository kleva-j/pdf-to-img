import { Cross2Icon } from '@radix-ui/react-icons';
import { Progress } from '@radix-ui/react-progress';
import { FileIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { cn, formatBytes } from '@/lib/utils';

import { Button } from '@/ui/button';

type FileCardProps = PropsWithChildren<{
  index: number;
  className: string;
  file: File & { preview: string };
  progress?: number;
  onRemove: (index: number) => void;
}>;

export const FileCard = (props: FileCardProps) => {
  const { file, index, onRemove, progress, className, ...rest } = props;
  return (
    <div
      className={cn('relative flex items-center space-x-4', className)}
      {...rest}
    >
      <div className='flex flex-1 space-x-2'>
        <FileIcon className='size-8 text-slate-600 stroke-[1px]' />
        <div className='flex w-full flex-col gap-2'>
          <div className='space-y-px'>
            <p className='line-clamp-1 text-sm font-medium text-foreground/80'>
              {file.name}
            </p>
            <p className='text-xs text-slate-600'>{formatBytes(file.size)}</p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='size-7'
          onClick={() => onRemove(index)}
        >
          <Cross2Icon className='size-4 ' aria-hidden='true' />
          <span className='sr-only'>Remove file</span>
        </Button>
      </div>
    </div>
  );
};
