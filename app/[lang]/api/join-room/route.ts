import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { leaderboard } from "@/lib/roomQueues";
import { triggerEvent } from "@/lib/pusherServer";

// TODO: Add rate limiting and CSRF protection middleware for this endpoint in production.
// TODO: Remove or sanitize logs before deploying to production.

function isValidPlayerName(name: string) {
    // Only allow alphanumeric and underscores, 3-16 chars
    return /^[a-zA-Z0-9_]{3,16}$/.test(name);
}

function isValidRoomId(roomId: string) {
    // Only allow 4 digit numbers
    return /^\d{4}$/.test(roomId);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const player = formData.get("username") as string;
        const roomId = formData.get("roomId") as string;

        if (!player || !roomId) {
            return NextResponse.json({ error: "Missing username or roomId" }, { status: 400 });
        }
        if (!isValidPlayerName(player)) {
            return NextResponse.json({ error: "Invalid player name. Use 3-16 alphanumeric characters or underscores." }, { status: 400 });
        }
        if (!isValidRoomId(roomId)) {
            return NextResponse.json({ error: "Invalid room ID. Must be a 4-digit number." }, { status: 400 });
        }

        // Generate the JWT token
        const token = signToken({
            role: "player",
            player,
            roomId,
        });

        // Check if the leaderboard exists for the roomId
        if (!leaderboard[roomId]) {
            return NextResponse.json({ error: 'Room not found' }, { status: 400 });
        }

        // Check if the player is already in the leaderboard
        if (leaderboard[roomId].some(entry => entry.player === player)) {
            return NextResponse.json({ error: 'Player already in the leaderboard' }, { status: 400 });
        }

        // Add the player to the leaderboard with an initial score of 0
        leaderboard[roomId].push({ player, score: 0 });

        // Trigger the 'leader-board' event to notify others about the leaderboard update
        await triggerEvent(`room-${roomId}`, 'leader-board', leaderboard[roomId]);

        // Set token as a cookie and return the response
        const response = NextResponse.json({ success: true, roomId });
        response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
        return response;

    } catch {
        // In production, avoid logging sensitive errors. Consider using a monitoring service.
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
