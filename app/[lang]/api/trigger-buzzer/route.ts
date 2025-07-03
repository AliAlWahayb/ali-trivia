import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getRoomQueue, getLeaderboard, setRoomQueue } from '@/lib/roomQueues';


function isValidRoomId(roomId: string) {
  return /^\d{4}$/.test(roomId);
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload || typeof payload !== 'object' || payload === null || payload.role !== 'player') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, player } = body;

    if (!roomId || !player) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    if (!isValidRoomId(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID. Must be a 4-digit number.' }, { status: 400 });
    }

    if (!(await getRoomQueue(roomId))) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 400 });
    }
    if ((await getRoomQueue(roomId)).includes(player)) {
      return NextResponse.json({ error: 'Player already in the queue' }, { status: 400 });
    }
    if (!(await getLeaderboard(roomId)).some(p => p.player === player)) {
      return NextResponse.json({ error: 'Player not in the leaderboard' }, { status: 400 });
    }

    await setRoomQueue(roomId, [...(await getRoomQueue(roomId)), player]);

    await triggerEvent(`room-${roomId}`, 'buzzer-queue', await getRoomQueue(roomId));

    return NextResponse.json({
      success: true,
      queue: await getRoomQueue(roomId),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
