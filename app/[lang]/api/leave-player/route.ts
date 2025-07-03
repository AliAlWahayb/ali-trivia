import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { getLeaderboard, setLeaderboard, getRoomQueue, setRoomQueue } from '@/lib/roomQueues';


function isValidRoomId(roomId: string) {
  return /^\d{4}$/.test(roomId);
}

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
    if (!roomId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    if (!isValidRoomId(roomId)) {
      return NextResponse.json({ error: 'Invalid room ID. Must be a 4-digit number.' }, { status: 400 });
    }
    if (!player) {
      return NextResponse.json({ error: 'Missing player' }, { status: 400 });
    }


    // Check if the room exists in the leaderboard
    if (!(await getLeaderboard(roomId))) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Check if the player is in the leaderboard
    const playerInLeaderboard = (await getLeaderboard(roomId)).find((p) => p.player === player);

    if (!playerInLeaderboard) {
      return NextResponse.json({ error: 'Player not in the leaderboard' }, { status: 400 });
    }

    // Remove the player from the leaderboard
    await setLeaderboard(roomId, (await getLeaderboard(roomId)).filter((p) => p.player !== player));

    // Trigger the 'leader-board' event to notify others
    await triggerEvent(`room-${roomId}`, 'leader-board', await getLeaderboard(roomId));

    // Check if the player is in the roomQueues
    const playerInRoomQueues = (await getRoomQueue(roomId)).find((p) => p === player);

    if (playerInRoomQueues) {
      // Remove the player from the roomQueues
      await setRoomQueue(roomId, (await getRoomQueue(roomId)).filter((p) => p !== player));
      // Trigger the 'buzzer-queue' event to notify others
      await triggerEvent(`room-${roomId}`, 'buzzer-queue', await getRoomQueue(roomId));
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

