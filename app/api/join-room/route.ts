import { NextResponse } from "next/server";
import { signToken } from "../../../lib/jwt";

export async function POST(request: Request) {
    const formData = await request.formData();
    const username = formData.get("username");
    const roomId = formData.get("roomId");

    if (!username || !roomId) {
        return NextResponse.json({ error: "Missing username or roomId" }, { status: 400 });
    }

    const token = signToken({
        role: "player",
        username,
        roomId,
    });

    const response = NextResponse.json({ success: true, roomId });
    response.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
    return response;
}
