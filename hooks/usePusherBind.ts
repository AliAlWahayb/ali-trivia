"use client"
import { useEffect } from 'react';
import { Channel } from 'pusher-js';


export const usePusherBind = (
  channel: Channel | null,
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (data: any) => void
) => {
  useEffect(() => {
    if (!channel) return;

    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
};
