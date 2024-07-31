import { faker } from '@faker-js/faker';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature */
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
  if (bytes === 0) return '0 Byte';

  const { decimals = 0, sizeType = 'normal' } = opts;

  const k = 1024;
  const dm = !decimals || decimals < 0 ? 0 : decimals;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
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
