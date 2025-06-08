import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const formData = await request.formData();
    const roomId = formData.get("roomId");

    if (!roomId) {
        return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    const token = signToken({
        role: "spectator",
        roomId,
    });

    const response = NextResponse.json({ success: true, roomId });
    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
    return response;
}
