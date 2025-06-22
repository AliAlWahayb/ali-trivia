import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { leaderboard, roomQueues } from '@/lib/roomQueues';
import { triggerEvent } from '@/lib/pusherServer';

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

    if (!leaderboard[roomId]) {
      return NextResponse.json({ error: 'Leaderboard not found' }, { status: 400 });
    }

    // Check if the leaderboard for the room is empty
    // Uncomment the following lines if you want to enforce that the leaderboard must have entries
    // if (leaderboard[roomId].length === 0) {
    //   return NextResponse.json({ error: 'Leaderboard is empty' }, { status: 400 });
    // }

    const topScorePlayer = leaderboard[roomId].length > 0
      ? leaderboard[roomId].reduce((max, current) => {
        return current.score > max.score ? current : max;
      }, leaderboard[roomId][0])
      : null;

    // Delete the leaderboard and queue for the room
    delete leaderboard[roomId];
    delete roomQueues[roomId];

    const response = NextResponse.json({
      success: true,
      topScorePlayer
    });
    response.headers.set('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');

    // Trigger the 'end-game' event to notify others
    await triggerEvent(`room-${roomId}`, 'end-game', {});
    console.log(`Triggered 'end-game' event for room ${roomId}`);
    console.log('Top score player:', topScorePlayer);

    return response;
  } catch (error) {
    console.error('Error in end game API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
