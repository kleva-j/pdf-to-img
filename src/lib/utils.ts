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
  bytes: number, //example: 5242880
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
 * Delays the execution of the Promise by the specified number of milliseconds.
 * @param ms - The number of milliseconds to delay. Must be a non-negative integer.
 * @returns A Promise that resolves after the specified number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve): void => {
    setTimeout(resolve, ms);
  });
}

/**
 * Extracts the timestamp from a UUID v1 string.
 * @param uuid - The UUID v1 string from which to extract the timestamp.
 * @returns The timestamp extracted from the UUID v1 string.
 */
export function extractTimestampFromUuidV1(uuid: string): number {
  const uuidParts = uuid.split('-');
  const timeString = `${uuidParts[2].substring(1)}${uuidParts[1]}${
    uuidParts[0]
  }`;
  return parseInt(timeString, 16);
}

/**
 * Generates a random ID of the specified size.
 * @param size - The length of the ID to generate. Defaults to 21.
 * @returns A string representing the generated random ID.
 */
export function generateRandomId(size = 21): string {
  const generatedId: string[] = Array.from({ length: size }, () => {
    const randomNumber: number = Math.floor(Math.random() * 62);
    return randomNumber.toString(36).padStart(1, '0');
  });

  return generatedId.join('');
}

export const nanoId = (size = 21): string => {
  const alphameric =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphameric.charAt(Math.floor(Math.random() * alphameric.length));
  }
  return id;
};
