import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

import { edgeStoreRouter } from '@/server/edgestore';

const handler = createEdgeStoreNextHandler({ router: edgeStoreRouter });

export { handler as GET, handler as POST };
