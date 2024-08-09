'use client';

import { createEdgeStoreProvider } from '@edgestore/react';

import { EdgeStoreRouter } from '@/server/edgestore';

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();

export { EdgeStoreProvider, useEdgeStore };
