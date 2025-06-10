// pages/api/trigger-event.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { triggerEvent } from '@/lib/pusherServer';  // Server-side logic for triggering Pusher events
import { verifyToken } from "../../../lib/jwt";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verify the JWT token from the request headers
  const token = req.headers.authorization?.split(' ')[1];
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { roomId, player, score } = req.body;

    // Ensure the data is correct
    if (!roomId || !player || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid data' });
    }

    try {
      // Trigger event securely from the backend
      triggerEvent(`room-${roomId}`, 'score-update', { player, score });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error triggering Pusher event:', error);
      res.status(500).json({ error: 'Failed to trigger event' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
