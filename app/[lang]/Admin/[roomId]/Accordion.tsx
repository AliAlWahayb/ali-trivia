"use client";
import { customConfirm } from "@/components/customConfirm";
import { usePusherBind } from "@/hooks/usePusherBind";
import { usePusherSubscribe } from "@/hooks/usePusherSubscribe";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { AutoTextSize } from "auto-text-size";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Props {
  roomId: string;
  lang: "ar" | "en";
  dict: Record<string, string>;
}

interface Player {
  player: string;
  score: number;
}


const AdminAccordion = ({ roomId, dict, lang }: Props) => {
  const [AccordionOpen, setAccordionOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [kickIsLoading, setKickIsLoading] = useState(false);
  const [endIsLoading, setEndIsLoading] = useState(false);
  const [topScorePlayer, setTopScorePlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch the leaderboard data when the component mounts
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/get-leader-board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: roomId,
          }),
        });

        const data = await response.json();
        if (data.leaderboard.length > 0) {
          setPlayers(data.leaderboard);
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to get leaderboard");
        }

        console.log("got leaderboard successfully");
        console.log(data);
      } catch (error) {
        console.error("Error getting leaderboard:", error);
        setError(
          error instanceof Error ? error.message : "Failed to get leaderboard"
        );
      }
    };
    fetchLeaderboard();
  }, [roomId]);

  const channelName = `room-${roomId}`;
  const { channel, error: pusherError } = usePusherSubscribe(channelName);

  //handle game end
  const handelGameEnd = useCallback(
    async (data: string) => {
      try {
        console.log("game ended", data);

        document.cookie = "token=; Max-Age=0; path=/";

        localStorage.removeItem("roomId");
        sessionStorage.clear();

        // Wait for 1 minutes before redirecting
        setTimeout(() => {
          router.push(`/${lang}`);
        }, 60000);
      } catch (err) {
        console.error("Error ending game:", err);
        setError("Failed to end game");
      }
    },
    [lang, router]
  );

  usePusherBind(channel, "end-game", handelGameEnd);

  const handleList = useCallback((data: Player[]) => {
    try {
      console.log("leaderboard received:", data); // Debug log
      setPlayers(data);
    } catch (err) {
      console.error("Error handling players:", err);
      setError("Failed to get player status");
    }
  }, []);

  usePusherBind(channel, "leader-board", handleList);

  // Sort players alphabetically by name
  const sortedPlayers = [...players].sort((a, b) =>
    a.player.localeCompare(b.player)
  );

  const handelKick = async (player: string) => {
    if (!(await customConfirm(dict.kickConfirmation, dict.yes, dict.no)))
      return;

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
          player: player,
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
    if (!(await customConfirm(dict.endGameConfirmation, dict.yes, dict.no))) {
      return;
    }
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
          <h3 className="font-bold mb-2">{dict.connectionError}</h3>
          <p className="mb-4">{pusherError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
          >
            {dict.refreshPage}
          </button>
        </div>
      </div>
    );
  }

  // end game
  if (topScorePlayer) {
    return (
      <div className="flex flex-col  w-full h-full bg-secondary rounded-lg  p-4 items-center ">
        <div className="bg-secondary text-white p-4 rounded-lg text-center max-w-md">
          <h3 className="font-bold mb-2 capitalize">
            {dict.gameHasEnded || "Game has ended"}
          </h3>
          <p className="mb-4 capitalize">
            {dict.theWinnerIs}: {topScorePlayer.player}
          </p>
          <button
            onClick={() => router.push(`/${lang}`)}
            className="bg-white text-text-primary px-4 py-2 rounded hover:bg-gray-100"
          >
            {dict.goHome}
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
                <p className="text-text-primary">{dict.gameSettings}</p>
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

              <div>
                {/* Header row for labels */}
                <div className="grid grid-cols-3 gap-4 mb-2 pb-1">
                  <p className="text-text-primary font-semibold text-center">
                    {dict.name}
                  </p>
                  <p className="text-text-primary font-semibold text-center">
                    {dict.score}
                  </p>
                  <p className="text-text-primary font-semibold text-center">
                    {dict.action}
                  </p>
                </div>

                {sortedPlayers.map((player, idx) => (
                  <div
                    key={player.player + idx}
                    className="grid grid-cols-3 gap-4 mb-2 border-b border-gray-300 pb-1"
                  >
                    <div className="flex items-center justify-center">
                      <AutoTextSize
                        mode="oneline"
                        maxFontSizePx={36}
                        className="w-full text-center text-text-primary font-semibold"
                      >
                        {player.player}
                      </AutoTextSize>
                    </div>

                    <p className="text-secondary text-center font-semibold">
                      {player.score}
                    </p>

                    <div className="flex items-center justify-center">
                      <button
                        disabled={kickIsLoading}
                        onClick={() => handelKick(player.player)}
                        className="bg-danger text-white font-semibold px-2 py-0.5 rounded-lg hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
                      >
                        {dict.kick}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className=" text-center mt-4">
                <button
                  onClick={() => handelEnd()}
                  className=" bg-danger text-white font-semibold px-2 py-0.5 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
                >
                  {dict.endGame}
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
