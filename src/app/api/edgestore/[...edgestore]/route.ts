import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

import { createContext } from '@/server/context';
import { edgeStoreRouter } from '@/server/edgestore';

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };
