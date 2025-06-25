import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { leaderboard } from '@/lib/roomQueues';

function isValidRoomId(roomId: string) {
  return /^\d{4}$/.test(roomId);
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies instead of Authorization header

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload || (payload.role !== 'admin' && payload.role !== 'spectator' && payload.role !== 'player')) {
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

    // Check if the leaderboard exists
    if (!leaderboard[roomId]) {
      if (payload.role == 'admin') {
        leaderboard[roomId] = [];
      }
    }

    return NextResponse.json({
      success: true,
      leaderboard: leaderboard[roomId],
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

