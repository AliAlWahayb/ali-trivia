import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getLeaderboard, setLeaderboard, setRoomQueue, getRoomQueue } from '@/lib/roomQueues';



function isValidRoomId(roomId: string) {
  // Only allow 4 digit numbers
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
    const { roomId, player } = body;

    // Ensure the data is correct
    if (!roomId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    if (!isValidRoomId(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID. Must be a 4-digit number.' }, { status: 400 });
    }
    if (!player) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 400 });
    }


    // Check if the leaderboard exists
    if (!(await getLeaderboard(roomId))) {
      return NextResponse.json({ error: 'Leaderboard not found' }, { status: 400 });
    }

    if ((await getLeaderboard(roomId)).length === 0) {
      return NextResponse.json({ error: 'Leaderboard is empty' }, { status: 400 });
    }

    // Check if the player is in the leaderboard
    const playerInLeaderboard = (await getLeaderboard(roomId)).find((p) => p.player === player);

    if (!playerInLeaderboard) {
      return NextResponse.json({ error: 'Player not in the leaderboard' }, { status: 400 });
    }


    // update the player's score
    await setLeaderboard(roomId, (await getLeaderboard(roomId)).map((p) => {
      if (p.player === player) {
        return { ...p, score: p.score + 1 };
      }
      return p;
    }));

    // empty the queue
    await setRoomQueue(roomId, []);

    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'buzzer-queue', await getRoomQueue(roomId));


    // Trigger the 'leader-board' event to notify others
    await triggerEvent(`room-${roomId}`, 'leader-board', await getLeaderboard(roomId));

    return NextResponse.json({
      success: true,
      queue: await getLeaderboard(roomId),
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
