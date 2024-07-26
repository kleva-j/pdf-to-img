/* eslint-disable no-console */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    console.log('Webhook payload:', JSON.stringify(json, null, 2));
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${(error as Error).message}`, {
      status: 400,
    });
  }

  return new Response('Success!', { status: 200 });
}
