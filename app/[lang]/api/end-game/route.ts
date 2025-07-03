import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { triggerEvent } from '@/lib/pusherServer';
import { getLeaderboard, setLeaderboard, setRoomQueue } from '@/lib/roomQueues';

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

    if (!(await getLeaderboard(roomId))) {
      return NextResponse.json({ error: 'Leaderboard not found' }, { status: 400 });
    }

    if ((await getLeaderboard(roomId)).length === 0) {
      return NextResponse.json({ error: 'Leaderboard is empty' }, { status: 400 });
    }

    const topScorePlayer = (await getLeaderboard(roomId)).length > 0
      ? (await getLeaderboard(roomId)).reduce((max, current) => {
        return current.score > max.score ? current : max;
      }, (await getLeaderboard(roomId))[0])
      : null;

    // Delete the leaderboard and queue for the room
    await setLeaderboard(roomId, []);
    await setRoomQueue(roomId, []);

    const response = NextResponse.json({
      success: true,
      topScorePlayer
    });
    response.headers.set('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');

    // Trigger the 'end-game' event to notify others
    await triggerEvent(`room-${roomId}`, 'end-game', {});

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

