'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { forwardRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { cn, composeEventHandlers } from '@/lib/utils';

import {
  type ButtonProps,
  Button,
  buttonVariants,
} from '@/components/ui/button';

interface LoadingButtonProps extends ButtonProps {
  action: 'create' | 'update' | 'delete';
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, variant, size, action, ...props }, ref) => {
    const { pending } = useFormStatus();
    const [buttonAction, setButtonAction] = useState<
      'update' | 'delete' | 'create'
    >('create');

    return (
      <Button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={pending}
        {...props}
        onClick={composeEventHandlers(props.onClick, () => {
          if (!props.disabled) {
            setButtonAction(action);
          }
        })}
      >
        {buttonAction === action && pending && (
          <ReloadIcon className='mr-2 size-4 animate-spin' aria-hidden='true' />
        )}

        {children}
      </Button>
    );
  }
);
LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
