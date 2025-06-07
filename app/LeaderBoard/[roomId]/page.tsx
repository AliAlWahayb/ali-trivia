interface Player {
  name: string;
  points: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getLeaderboard(roomId: string): Promise<Player[]> {
  // Replace this with your real data fetching logic
  // Example: const res = await fetch(`/api/leaderboard/${roomId}`);
  // return await res.json();
  return [
    { name: "Ali", points: 25 },
    { name: "Sara", points: 40 },
    { name: "John", points: 15 },
    { name: "Lina", points: 30 },
  ];
}

export default async function LeaderBoard({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = params;
  const players = await getLeaderboard(roomId);

  // Sort by points descending
  const sortedPlayers = players.sort((a, b) => b.points - a.points);

  return (
    <div className="flex flex-col items-center p-5 min-h-screen bg-background-light">
      <h1 className="text-4xl font-bold mb-6 text-secondary text-center">
        Leaderboard
      </h1>
      <div className="flex flex-col justify-between text-lg items-center mb-2 pb-1 w-full px-4">
        <div className="flex justify-between text-lg items-center mb-2 pb-1 w-full px-4">
          <p className="text-text-primary font-bold">Name</p>
          <p className="text-text-primary font-bold">Points</p>
        </div>
        {sortedPlayers.map((player, idx) => (
          <div
            key={player.name + idx}
            className="flex justify-between text-lg items-center mb-2 pb-1 border-b border-gray-300 w-full px-5"
          >
            <p className="text-text-primary font-semibold">{player.name}</p>
            <p className="text-secondary font-semibold">{player.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
}