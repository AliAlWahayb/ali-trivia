// app/api/pop-queue/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { roomQueues } from '@/lib/roomQueues';




export async function POST(request: NextRequest) {
  try {
        // Get token from cookies instead of Authorization header

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId } = body;

    // Ensure the data is correct
    if (!roomId ) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Check if the queue exists
    if (!roomQueues[roomId]) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 400 });
    }

    // Check if the queue is empty
    if (roomQueues[roomId].length === 0) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 400 });
    }

    
    // pop the player from the queue
    roomQueues[roomId].shift();

    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'buzzer-queue', roomQueues[roomId]);
    console.log(`queue popped for room ${roomId}`);
    console.log(roomQueues[roomId]);
    
    return NextResponse.json({
      success: true,
      queue: roomQueues[roomId],
    });
  } catch (error) {
    console.error('Error in pop-queue API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
