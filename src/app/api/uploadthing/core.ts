/* eslint-disable no-console */
import type { NextRequest } from 'next/server';
import { type FileRouter, createUploadthing } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { ratelimit } from '@/lib/rate-limit';

const f = createUploadthing();

// Fake auth function
async function auth(req: NextRequest) {
  const userId = req.cookies.get('uid');
  const sessionId = req.cookies.get('sid');
  if (!userId || !sessionId) return null;
  return { id: userId.value, sessionId: sessionId.value };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({
    'application/pdf': { maxFileSize: '32MB', maxFileCount: 8 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Rate limit the upload
      const ip = req.ip ?? '127.0.0.1';

      const { success } = await ratelimit.limit(ip);

      if (!success) {
        throw new UploadThingError('Rate limit exceeded');
      }

      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadError(async ({ error }) => {
      console.log('onUploadError', error);
      return { cause: error.code };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
