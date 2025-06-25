import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { leaderboard, roomQueues } from '@/lib/roomQueues';

function isValidPlayerName(name: string) {
  return /^[a-zA-Z0-9_]{3,16}$/.test(name);
}
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
    if (!isValidPlayerName(player)) {
      return NextResponse.json({ error: 'Invalid player name. Use 3-16 alphanumeric characters or underscores.' }, { status: 400 });
    }
    if (!roomQueues[roomId]) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 400 });
    }
    if (roomQueues[roomId].includes(player)) {
      return NextResponse.json({ error: 'Player already in the queue' }, { status: 400 });
    }
    if (!leaderboard[roomId].some(p => p.player === player)) {
      return NextResponse.json({ error: 'Player not in the leaderboard' }, { status: 400 });
    }

    roomQueues[roomId].push(player);

    await triggerEvent(`room-${roomId}`, 'buzzer-queue', roomQueues[roomId]);

    return NextResponse.json({
      success: true,
      queue: roomQueues[roomId],
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
