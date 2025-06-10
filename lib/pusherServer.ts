// lib/pusherServer.ts
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

export const triggerEvent = async (channelName: string, eventName: string, data: object) => {
  try {
    await pusher.trigger(channelName, eventName, data);
  } catch (error) {
    console.error('Error triggering Pusher event:', error);
    throw error;
  }
};
