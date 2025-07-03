import Redis from "ioredis";

// Initialize Redis client with the provided REDIS_URL
const redis = new Redis(process.env.REDIS_URL as string);

const ROOM_EXPIRY_TIME = 60 * 60; // 1 hour

const setRoomTTL = async (roomId: string) => {
  await redis.expire(`roomQueue:${roomId}`, ROOM_EXPIRY_TIME);
  await redis.expire(`leaderboard:${roomId}`, ROOM_EXPIRY_TIME);
};


export const setRoomQueue = async (roomId: string, queue: string[]) => {
  await redis.set(`roomQueue:${roomId}`, JSON.stringify(queue)); // Store the queue in Redis as a string
  await setRoomTTL(roomId); // Set TTL for the room's keys
};

export const getRoomQueue = async (roomId: string): Promise<string[]> => {
  const queue = await redis.get(`roomQueue:${roomId}`);
  await setRoomTTL(roomId);
  return queue ? JSON.parse(queue) : []; // Return parsed queue or empty array if not found
};

export const setLeaderboard = async (
  roomId: string,
  leaderboard: { player: string; score: number }[]
) => {
  await redis.set(`leaderboard:${roomId}`, JSON.stringify(leaderboard)); // Store leaderboard in Redis
  await setRoomTTL(roomId);
};

export const getLeaderboard = async (
  roomId: string
): Promise<{ player: string; score: number }[]> => {
  const leaderboard = await redis.get(`leaderboard:${roomId}`);
  await setRoomTTL(roomId);
  return leaderboard ? JSON.parse(leaderboard) : []; // Return parsed leaderboard or empty array if not found
};

export const updateScore = async (roomId: string, player: string) => {
  const leaderboard = await getLeaderboard(roomId);
  const updatedLeaderboard = leaderboard.map((p) => {
    if (p.player === player) {
      return { ...p, score: p.score + 1 }; // Increment score for the player
    }
    return p;
  });
  await setLeaderboard(roomId, updatedLeaderboard); // Save updated leaderboard to Redis
};

export const addPlayerToQueue = async (roomId: string, player: string) => {
  const queue = await getRoomQueue(roomId);
  queue.push(player); // Add player to the queue
  await setRoomQueue(roomId, queue); // Save updated queue to Redis
};

export const removePlayerFromLeaderboard = async (
  roomId: string,
  player: string
) => {
  let leaderboard = await getLeaderboard(roomId);
  leaderboard = leaderboard.filter((p) => p.player !== player); // Remove player from leaderboard
  await setLeaderboard(roomId, leaderboard); // Save updated leaderboard to Redis
};

export const emptyQueue = async (roomId: string) => {
  await setRoomQueue(roomId, []); // Empty the queue
};
