import { initEdgeStore } from '@edgestore/server';
import { initEdgeStoreClient } from '@edgestore/server/core';

import {
  ACCEPTED_FILE_TYPES as accept,
  MAX_UPLOAD_SIZE as maxSize,
} from '@/constant/data';
import type { Context } from '@/server/context';

const es = initEdgeStore.context<Context>().create();

export const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket({ maxSize, accept })
    .path(({ ctx }) => [{ userId: ctx.userId }])
    .beforeDelete(
      ({ ctx, fileInfo }) => ctx.userId === fileInfo.metadata.userId
    ),
});

export const backendClient = initEdgeStoreClient({ router: edgeStoreRouter });
export type EdgeStoreRouter = typeof edgeStoreRouter;
