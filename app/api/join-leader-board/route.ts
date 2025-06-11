// app/api/join-leader-board/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { triggerEvent } from '@/lib/pusherServer';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { leaderboard } from '@/lib/roomQueues';




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

    // initialize the leaderboard if it doesn't exist for the roomId
    if (!leaderboard[roomId]) {
      leaderboard[roomId] = [];
    }

    // Check if the player is already in the leaderboard
    if (leaderboard[roomId].includes(player)) {
      return NextResponse.json({ error: 'Player already in the leaderboard' }, { status: 400 });
    }


    // Add the player to the leaderboard and set their score to 0
    leaderboard[roomId].push({ player, score: 0 });



    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'leader-board', leaderboard[roomId]);
    console.log(`Leaderboard updated for room ${roomId}`);
    console.log(leaderboard[roomId]);

    return NextResponse.json({
      success: true,
      queue: leaderboard[roomId],
    });
  } catch (error) {
    console.error('Error in join-leader-board API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
