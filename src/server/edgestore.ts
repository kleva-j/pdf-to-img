import { initEdgeStore } from '@edgestore/server';
import { initEdgeStoreClient } from '@edgestore/server/core';

import {
  ACCEPTED_FILE_TYPES as accept,
  MAX_UPLOAD_SIZE as maxSize,
} from '@/constant/data';

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket({ maxSize, accept }),
});

export const backendClient = initEdgeStoreClient({ router: edgeStoreRouter });
export type EdgeStoreRouter = typeof edgeStoreRouter;
