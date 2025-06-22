// app/api/kick-player/route.ts
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

    // Check if the player is in the leaderboard
    const playerInLeaderboard = leaderboard[roomId].find((p) => p.player === player);

    if (!playerInLeaderboard) {
      return NextResponse.json({ error: 'Player not in the leaderboard' }, { status: 400 });
    }


    // Remove the player from the leaderboard
    leaderboard[roomId] = leaderboard[roomId].filter((p) => p.player !== player);

    // Trigger the 'buzzer-queue' event to notify others
    await triggerEvent(`room-${roomId}`, 'leader-board', leaderboard[roomId]);
    console.log(`Leaderboard updated for room ${roomId}`);
    console.log(leaderboard[roomId]);

    // Check if the player is in the roomQueues
    const playerInRoomQueues = roomQueues[roomId].find((p) => p === player);

    if (playerInRoomQueues) {
      // Remove the player from the roomQueues
      roomQueues[roomId] = roomQueues[roomId].filter((p) => p !== player);
      console.log(`Player ${player} removed from room ${roomId} queue`);
      // Trigger the 'buzzer-queue' event to notify others
      await triggerEvent(`room-${roomId}`, 'buzzer-queue', roomQueues[roomId]);
    }


    return NextResponse.json({
      success: true,
      queue: leaderboard[roomId],
    });
  } catch (error) {
    console.error('Error in kick player API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
