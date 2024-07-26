import { faker } from '@faker-js/faker';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number of bytes into a human-readable string representation.
 *
 * @param bytes - The number of bytes to format.
 * @param opts - Additional options for formatting.
 * @param opts.decimals - The number of decimal places to include in the formatted string. Defaults to 0.
 * @param opts.sizeType - The type of size to format. Defaults to 'normal'.
 * @returns The formatted string representation of the number of bytes.
 */
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

/**
 * Generates a random user ID using the nanoid algorithm.
 * @param length - The length of the user ID. Defaults to 16.
 * @returns A strongly typed random user ID in the form of a string.
 */
export function generateUserId(length = 16): string {
  return faker.string.nanoid(length);
}

/**
 * Generates a random session ID using the uuid v4 algorithm.
 * @returns A strong random session ID in the form of a UUID v4 string.
 */
export function generateSessionId(): string {
  return faker.string.uuid();
}
