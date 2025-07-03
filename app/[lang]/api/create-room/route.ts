import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { getLeaderboard, getRoomQueue, setLeaderboard, setRoomQueue } from "@/lib/roomQueues";

export async function POST() {
  // Generate a unique 4-digit room ID that doesn't exist in the leaderboard
  let roomId;
  do {
    roomId = `${Math.floor(1000 + Math.random() * 9000)}`;
  } while ((await getRoomQueue(roomId)).length > 0 || (await getLeaderboard(roomId)).length > 0);

  // Initialize the leaderboard and queue for the new room ID
  await setLeaderboard(roomId, []);
  await setRoomQueue(roomId, []);

  const username = `admin-${roomId}`;

  const token = signToken({
    role: "admin",
    username,
    roomId,
  });

  const response = NextResponse.json({ success: true, roomId });
  response.headers.set(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=3600`
  );
  return response;
}
