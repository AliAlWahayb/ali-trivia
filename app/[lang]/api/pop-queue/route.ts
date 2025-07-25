import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getRoomQueue, setRoomQueue } from '@/lib/roomQueues';

function isValidRoomId(roomId: string) {
  return /^\d{4}$/.test(roomId);
}

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
    if (!roomId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    if (!isValidRoomId(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID. Must be a 4-digit number.' }, { status: 400 });
    }

    // Check if the queue exists
    if (!(await getRoomQueue(roomId))) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 400 });
    }

    // Check if the queue is empty
    if ((await getRoomQueue(roomId)).length === 0) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 400 });
    }


    // pop the player from the queue
    await setRoomQueue(roomId, (await getRoomQueue(roomId)).slice(1));

    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'buzzer-queue', await getRoomQueue(roomId));
    return NextResponse.json({
      success: true,
      queue: await getRoomQueue(roomId),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

