// import { NextResponse } from 'next/server';

// const { error: logError } = console;

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const file = formData.get('file') as File;

//     if (!file) return { message: 'No file provided', status: 'error' };

//     return NextResponse.json({ status: 'success', data: [] });
//   } catch (e) {
//     logError(e);
//     return NextResponse.json({ status: 'fail', error: e });
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  return NextResponse.json({ status: 'success', data: { name, email } });
}
