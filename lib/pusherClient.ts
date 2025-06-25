import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

function createPusherClient() {
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    throw new Error('Pusher configuration is missing. Please check your environment variables.');
  }

  return new Pusher(key, {
    cluster: cluster,
    forceTLS: true,
  });
}

if (typeof window !== 'undefined') {
  try {
    pusherClient = createPusherClient();
  } catch {
    // Fail silently
  }
}

export default pusherClient;
