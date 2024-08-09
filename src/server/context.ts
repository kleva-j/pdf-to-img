import { CreateContextOptions } from '@edgestore/server/adapters/next/app';

export type Context = {
  userId: string;
  sessionId: string;
};

export async function createContext({
  req,
}: CreateContextOptions): Promise<Context> {
  const uid = req.cookies.get('uid');
  const sid = req.cookies.get('sid');

  return {
    userId: uid ? uid.value : '', // Handle undefined case
    sessionId: sid ? sid.value : '', // Handle undefined case
  };
}
