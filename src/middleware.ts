import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { generateSessionId, generateUserId } from '@/lib/utils';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const now = Date.now() / 1000;
  const maxAge = 3600; // 1 hour
  const expires = new Date(now + maxAge);

  if (!req.cookies.has('uid')) {
    const config = { maxAge, expires, secure: true };
    response.cookies.set('uid', generateUserId(), config);
  }

  if (!req.cookies.has('sid')) {
    const config = { maxAge, expires, secure: true };
    response.cookies.set('sid', generateSessionId(), config);
  }

  return response;
}
