"use client";
import ToggleSwitch from "@/components/ToggleSwitch";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface Player {
  name: string;
  points: number;
}

const AdminAccordion = () => {
  const [AccordionOpen, setAccordionOpen] = useState(false);
  const [CloseRoom, setCloseRoom] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [players, setPlayers] = useState<Player[]>([
    { name: "alisaw11", points: 5 },
    { name: "Sara", points: 10 },
    { name: "John", points: 7 },
    { name: "Lina", points: 12 },
  ]);

  // Sort players alphabetically by name
  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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
                  <p className="text-text-primary font-semibold">Points</p>
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
                    <p className="text-text-primary">{player.points}</p>
                    <button
                      onClick={() => {
                        // Example: remove player from list
                        
                        console.log("kick", player.name);
                      }}
                      className=" bg-danger text-white font-semibold px-2 py-0.5 rounded-lg  hover:bg-primary hover:text-white transition duration-300 transform active:scale-95"
                    >
                      Kick
                    </button>
                  </div>
                ))}
              </div>
              <div className=" text-center mt-4">
                <button
                  onClick={() => console.log("end game")}
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