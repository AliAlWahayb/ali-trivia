// app/api/trigger-buzzer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { leaderboard } from '@/lib/roomQueues';




export async function POST(request: NextRequest) {
  try {
    // Get token from cookies instead of Authorization header

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload || (payload.role !== 'admin' && payload.role !== 'spectator')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId } = body;


    // Ensure the data is correct
    if (!roomId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Check if the leaderboard exists
    if (!leaderboard[roomId]) {
      if (payload.role == 'admin') {
        leaderboard[roomId] = [];
      }
    }




    console.log(`Leaderboard for room ${roomId}`);
    console.log(leaderboard[roomId]);

    return NextResponse.json({
      success: true,
      leaderboard: leaderboard[roomId],
    });
  } catch (error) {
    console.error('Error in getting leaderboard from API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
