import { signToken } from "@/lib/jwt";
import { leaderboard } from "@/lib/roomQueues";
import { NextResponse } from "next/server";


function isValidRoomId(roomId: string) {
    // Only allow 4 digit numbers
    return /^\d{4}$/.test(roomId);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const roomId = formData.get("roomId") as string;

        if (!roomId) {
            return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
        }
        if (!isValidRoomId(roomId)) {
            return NextResponse.json({ error: "Invalid room ID. Must be a 4-digit number." }, { status: 400 });
        }

        const token = signToken({
            role: "spectator",
            roomId,
        });

        // Check if the leaderboard exists for the roomId
        if (!leaderboard[roomId]) {
            return NextResponse.json({ error: 'Room not found' }, { status: 400 });
        }


        const response = NextResponse.json({ success: true, roomId });
        response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
        return response;
    } catch {
        return NextResponse.json({ error: "Failed to join leaderboard" }, { status: 500 });
    }
}
