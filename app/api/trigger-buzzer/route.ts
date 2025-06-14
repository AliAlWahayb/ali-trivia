// app/api/trigger-buzzer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { roomQueues } from '@/lib/roomQueues';  // Import shared roomQueues




export async function POST(request: NextRequest) {
  try {
     // Get token from cookies instead of Authorization header

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload || payload.role !== 'player') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, player } = body;

    // Ensure the data is correct
    if (!roomId || !player) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Check if the queue exists
    if (!roomQueues[roomId]) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 400 });
    }

    // Check if the player is already in the queue
    if (roomQueues[roomId].includes(player)) {
      return NextResponse.json({ error: 'Player already in the queue' }, { status: 400 });
    }
    
    // Add the player to the queue
    roomQueues[roomId].push(player);

    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'buzzer-queue', roomQueues[roomId]);
    console.log(`Triggered 'buzzer-queue' event for room ${roomId}`);
    console.log(roomQueues[roomId]);
    
    return NextResponse.json({
      success: true,
      queue: roomQueues[roomId],
    });
  } catch (error) {
    console.error('Error in trigger-buzzer API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
