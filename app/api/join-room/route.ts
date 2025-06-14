import { NextResponse } from "next/server";
import { signToken } from "../../../lib/jwt";
import { leaderboard } from "@/lib/roomQueues";
import { triggerEvent } from "@/lib/pusherServer";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const player = formData.get("username") as string;
        const roomId = formData.get("roomId") as string;

        if (!player || !roomId) {
            return NextResponse.json({ error: "Missing username or roomId" }, { status: 400 });
        }

        // Generate the JWT token
        const token = signToken({
            role: "player",
            player,
            roomId,
        }, { expiresIn: "1h" });

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
        console.log(`Leaderboard updated for room ${roomId}`);
        console.log(leaderboard[roomId]);


        // Set token as a cookie and return the response
        const response = NextResponse.json({ success: true, roomId });
        response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
        return response;

    } catch (error) {
        console.error('Error in join-room API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
