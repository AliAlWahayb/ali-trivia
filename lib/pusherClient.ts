// lib/pusherClient.ts
import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

function createPusherClient() {
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    console.error('Pusher environment variables missing:', {
      key: !!key,
      cluster: !!cluster,
      env: {
        NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
      }
    });
    throw new Error('Pusher configuration is missing. Please check your environment variables.');
  }

  return new Pusher(key, {
    cluster: cluster,
    forceTLS: true,
  });
}

// Create a singleton instance
if (typeof window !== 'undefined') {
  try {
    pusherClient = createPusherClient();
  } catch (error) {
    console.error('Failed to initialize Pusher:', error);
  }
}

export default pusherClient;
