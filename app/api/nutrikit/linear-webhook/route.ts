import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  syncIssueUpdate,
  verifyWebhookSignature,
  type LinearWebhookPayload,
} from '@/lib/nutrikit/linear-webhook-sync';

// Handle Linear webhook POST requests
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('linear-signature');
    const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;

    // Log incoming webhook
    console.log('[Linear Webhook] Received webhook');

    // Verify signature if secret is configured
    if (webhookSecret && signature) {
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error('[Linear Webhook] Invalid signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else if (!signature) {
      // Allow requests without signature for initial testing
      // Linear webhooks include the signature when the secret is set
      console.warn('[Linear Webhook] No signature provided - allowing for testing');
    }

    // Parse payload
    const payload: LinearWebhookPayload = JSON.parse(rawBody);

    console.log(`[Linear Webhook] Type: ${payload.type}, Action: ${payload.action}`);
    console.log(`[Linear Webhook] Data:`, JSON.stringify(payload.data, null, 2));

    // Only process Issue webhooks
    if (payload.type !== 'Issue') {
      return NextResponse.json({
        success: true,
        message: `Ignoring ${payload.type} webhook`,
      });
    }

    // Sync the issue update to local files and GitHub
    const result = await syncIssueUpdate(payload);

    // Trigger on-demand revalidation for sprint pages
    // Always revalidate on Issue updates since we fetch live data from Linear
    try {
      revalidatePath('/block');
      revalidatePath('/block/task/[id]', 'page');
      console.log('[Linear Webhook] Triggered revalidation for block pages');
    } catch (revalidateError) {
      console.error('[Linear Webhook] Revalidation error:', revalidateError);
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      changes: result.changes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Linear Webhook] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle webhook verification (GET request from Linear)
export async function GET() {
  return NextResponse.json({
    status: 'Linear webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}
