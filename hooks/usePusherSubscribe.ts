// hooks/usePusherSubscribe.ts
"use client"
import { useEffect, useState } from 'react';
import pusherClient from '../lib/pusherClient';
import type { Channel } from 'pusher-js';

export const usePusherSubscribe = (channelName: string) => {
    const [channel, setChannel] = useState<Channel | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Check if pusherClient is available
        if (!pusherClient) {
            setError(new Error('Pusher client is not initialized. Please check your environment variables.'));
            return;
        }

        try {
            // Check for existing subscription
            const existingChannel = pusherClient.channel(channelName);
            if (existingChannel) {
                setChannel(existingChannel);
                setError(null);
                return;
            }

            // Subscribe to new channel
            const newChannel = pusherClient.subscribe(channelName);
            
            // Success handler
            const successHandler = () => {
                setChannel(newChannel);
                setError(null);
            };
            
            // Error handler
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorHandler = (err: any) => {
                console.error("Subscription error:", err);
                setError(new Error(err?.message || "Pusher subscription failed"));
                if (pusherClient) {
                    pusherClient.unsubscribe(channelName);
                }
            };

            // Bind event handlers
            newChannel.bind("pusher:subscription_succeeded", successHandler);
            newChannel.bind("pusher:subscription_error", errorHandler);

            // Cleanup function
            return () => {
                newChannel.unbind("pusher:subscription_succeeded", successHandler);
                newChannel.unbind("pusher:subscription_error", errorHandler);
                if (pusherClient) {
                    pusherClient.unsubscribe(channelName);
                }
            };
        } catch (err) {
            console.error("Pusher subscription failed:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [channelName]);

    return { channel, error };
};
