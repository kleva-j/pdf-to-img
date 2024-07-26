import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { generateSessionId, generateUserId } from '@/lib/utils';

export function middleware(request: NextRequest) {
  // Set the 'uid' and 'sid' cookies if they don't exist
  const response = NextResponse.next();
  const now = Date.now() / 1000;
  const maxAge = 3600; // 1 hour

  if (!request.cookies.has('uid')) {
    response.cookies.set('uid', generateUserId(), {
      maxAge,
      expires: new Date(now + maxAge),
      secure: true,
    });
  }

  if (!request.cookies.has('sid')) {
    response.cookies.set('sid', generateSessionId(), {
      maxAge,
      expires: new Date(now + maxAge),
      secure: true,
    });
  }

  return response;
}
