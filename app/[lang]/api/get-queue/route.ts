// app/api/trigger-buzzer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { roomQueues } from '@/lib/roomQueues';




export async function POST(request: NextRequest) {
  try {
    // Get token from cookies instead of Authorization header

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    console.log(payload);

    if (!payload || (payload.role !== 'admin' && payload.role !== 'player')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId } = body;


    // Ensure the data is correct
    if (!roomId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Check if the roomQueues exists
    if (!roomQueues[roomId]) {
      roomQueues[roomId] = [];
    }




    console.log(`Queue for room ${roomId}`);
    console.log(roomQueues[roomId]);

    return NextResponse.json({
      success: true,
      queue: roomQueues[roomId],
    });
  } catch (error) {
    console.error('Error in getting queue from API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
