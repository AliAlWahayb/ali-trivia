"use client";
import ToggleSwitch from "@/components/ToggleSwitch";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  roomId: string;
}

interface Player {
  name: string;
  Score: number;
}

const AdminAccordion = ({ roomId }: Props) => {
  const [AccordionOpen, setAccordionOpen] = useState(false);
  const [CloseRoom, setCloseRoom] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [kickIsLoading, setKickIsLoading] = useState(false);
  const [endIsLoading, setEndIsLoading] = useState(false);
  const [topScorePlayer, setTopScorePlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  const handleList = useCallback((data: string[]) => {
    try {
      console.log("leaderboard received:", data); // Debug log
      setPlayers(data.map((player) => JSON.parse(player)));
    } catch (err) {
      console.error("Error handling players:", err);
      setError("Failed to get player status");
    }
  }, []);

  usePusherBind(channel, "leader-board", handleList);

  // Sort players alphabetically by name
  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handelKick = async (name: string) => {
    if (kickIsLoading) return;

    try {
      setKickIsLoading(true);
      setError(null);

      const response = await fetch("/api/kick-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player: name,
          roomId: roomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to kick player");
      }

      console.log("kicked player successfully");
    } catch (error) {
      console.error("Error kicking player:", error);
      setError(
        error instanceof Error ? error.message : "Failed to kick player"
      );
    } finally {
      setKickIsLoading(false);
    }
  };

  const handelEnd = async () => {
    if (endIsLoading) return;

    try {
      setEndIsLoading(true);
      setError(null);

      const response = await fetch("/api/end-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
      });

      const data = await response.json();
      setTopScorePlayer(data.topScorePlayer);

      if (!response.ok) {
        throw new Error(data.error || "Failed to end game");
      }

      console.log("ended game successfully");
    } catch (error) {
      console.error("Error ending game:", error);
      setError(error instanceof Error ? error.message : "Failed to end game");
    } finally {
      setEndIsLoading(false);
    }
  };

  // Show error state
  if (pusherError) {
    return (
      <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-4 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2">Connection Error</h3>
          <p className="mb-4">{pusherError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // end game
  if (topScorePlayer) {
    return (
      <div className="flex flex-col min-h-screen w-full h-full bg-red-100 p-4 items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2">Game has ended</h3>
          <p className="mb-4">{topScorePlayer.name}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-gray-100 rounded-lg  px-6 py-3 ">
      <Accordion.Root type="single" collapsible className="w-full ">
        <Accordion.Item value="item-1" className="">
          <Accordion.Header className="flex justify-between items-center">
            <Accordion.Trigger
              onClick={() => {
                setAccordionOpen(!AccordionOpen);
              }}
              className="text-lg w-full font-semibold text-text-primary"
            >
              <div className="flex flex-row justify-between ">
                <p className="text-text-primary">Game Settings</p>
                <ChevronDownIcon
                  className={`size-6 text-text-primary transition-transform duration-200 ${
                    AccordionOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="py-4">
            <div>
              {error && (
                <div className="bg-red-500 text-white p-2 text-center">
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 text-xs underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              <ToggleSwitch
                id="closeRoom"
                label={`Close Room`}
                className="mb-4"
                onChange={(checked) => setCloseRoom(checked)}
                checked={CloseRoom}
              />
              <div>
                <div className="flex justify-between items-center mb-2  pb-1">
                  <p className="text-text-primary  font-semibold">Name</p>
                  <p className="text-text-primary font-semibold">Score</p>
                  <button className="text-text-primary font-semibold">
                    Action
                  </button>
                </div>
                {sortedPlayers.map((player, idx) => (
                  <div
                    key={player.name + idx}
                    className="flex justify-between items-center mb-2 border-b border-gray-300 pb-1"
                  >
                    <p className="text-text-primary ">{player.name}</p>
                    <p className="text-text-primary">{player.Score}</p>
                    <button
                      disabled={kickIsLoading}
                      onClick={() => handelKick(player.name)}
                      className=" bg-danger text-white font-semibold px-2 py-0.5 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
                    >
                      Kick
                    </button>
                  </div>
                ))}
              </div>
              <div className=" text-center mt-4">
                <button
                  onClick={() => handelEnd()}
                  className=" bg-danger text-white font-semibold px-2 py-0.5 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
                >
                  End Game
                </button>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default AdminAccordion;
