// app/api/update-score/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { leaderboard, roomQueues } from '@/lib/roomQueues';




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

    if (!player) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 400 });
    }

    // Check if the leaderboard exists
    if (!leaderboard[roomId]) {
      return NextResponse.json({ error: 'Leaderboard not found' }, { status: 400 });
    }

    if (leaderboard[roomId].length === 0) {
      return NextResponse.json({ error: 'Leaderboard is empty' }, { status: 400 });
    }

    // Check if the player is in the leaderboard
    const playerInLeaderboard = leaderboard[roomId].find((p) => p.player === player);

    if (!playerInLeaderboard) {
      return NextResponse.json({ error: 'Player not in the leaderboard' }, { status: 400 });
    }


    // update the player's score
    leaderboard[roomId] = leaderboard[roomId].map((p) => {
      if (p.player === player) {
        return { ...p, score: p.score + 1 };
      }
      return p;
    });

    // empty the queue
    roomQueues[roomId] = [];

    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'buzzer-queue', roomQueues[roomId]);
    console.log(`queue emptyed for room ${roomId}`);
    console.log(roomQueues[roomId]);

    // Trigger the 'leader-board' event to notify others
    await triggerEvent(`room-${roomId}`, 'leader-board', leaderboard[roomId]);
    console.log(`Leaderboard updated for room ${roomId}`);
    console.log(leaderboard[roomId]);

    return NextResponse.json({
      success: true,
      queue: leaderboard[roomId],
    });
  } catch (error) {
    console.error('Error in update-score API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
