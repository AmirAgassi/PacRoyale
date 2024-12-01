import { useEffect, useMemo, useState } from "react";
import { QueryBuilder, SDK, createDojoStore } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { addAddressPadding } from "starknet";

import { Models, Schema } from "./bindings.ts";
import { useDojo } from "./useDojo.tsx";
import useModel from "./useModel.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";

/**
 * Global store for managing Dojo game state.
 */
export const useDojoStore = createDojoStore<Schema>();

/**
 * Main application component that provides game functionality and UI.
 * Handles entity subscriptions, state management, and user interactions.
 *
 * @param props.sdk - The Dojo SDK instance configured with the game schema
 */
function App({ sdk }: { sdk: SDK<Schema> }) {
  const {
    account,
    setup: { client },
  } = useDojo();
  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  const { spawn } = useSystemCalls();

  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(account?.account.address)]),
    [account?.account.address]
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery({
        query: new QueryBuilder<Schema>()
          .namespace("dojo_starter", (n) =>
            n
              .entity("Moves", (e) =>
                e.eq("player", addAddressPadding(account.account.address))
              )
              .entity("Position", (e) =>
                e.is("player", addAddressPadding(account.account.address))
              )
          )
          .build(),
        callback: (response) => {
          if (response.error) {
            console.error("Error setting up entity sync:", response.error);
          } else if (response.data && response.data[0].entityId !== "0x0") {
            console.log("subscribed", response.data[0]);
            state.updateEntity(response.data[0]);
          }
        },
      });

      unsubscribe = () => subscription.cancel();
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, account?.account.address]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        await sdk.getEntities({
          query: new QueryBuilder<Schema>()
            .namespace("dojo_starter", (n) =>
              n.entity("Moves", (e) =>
                e.eq("player", addAddressPadding(account.account.address))
              )
            )
            .build(),
          callback: (resp) => {
            if (resp.error) {
              console.error("resp.error.message:", resp.error.message);
              return;
            }
            if (resp.data) {
              state.setEntities(resp.data);
            }
          },
        });
      } catch (error) {
        console.error("Error querying entities:", error);
      }
    };

    fetchEntities();
  }, [sdk, account?.account.address]);

  const moves = useModel(entityId, Models.Moves);
  const position = useModel(entityId, Models.Position);

  const [isPlaying, setIsPlaying] = useState(false);
  const chompSound = new Audio("assets/pacman_chomp.wav");
  const beginningSound = new Audio("assets/pacman_beginning.wav");
  const extraPacSound = new Audio("assets/pacman_extrapac.wav");

  return (
    <div className="bg-black min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          className="mb-6 px-6 py-2 bg-yellow-400 rounded-full shadow-md active:shadow-inner active:bg-yellow-500 focus:outline-none text-xl font-bold text-black"
          onClick={() => {
            setIsPlaying(!isPlaying);
            beginningSound.play();
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-3 gap-2 w-full h-48">
              <div className="col-start-2">
                <button
                  className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                  onClick={async () => {
                    extraPacSound.play();
                    await spawn();
                  }}
                >
                  +
                </button>
              </div>
              <div className="col-span-3 text-center text-base text-white">
                Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
              </div>
              <div className="col-span-3 text-center text-base text-white">
                {position
                  ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
                  : "Need to Spawn"}
              </div>
              <div className="col-span-3 text-center text-base text-white">
                {moves && moves.last_direction}
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-3 gap-2 w-full h-48">
              {[
                {
                  direction: "Up" as const,
                  label: "↑",
                  col: "col-start-2",
                },
                {
                  direction: "Left" as const,
                  label: "←",
                  col: "col-start-1",
                },
                {
                  direction: "Right" as const,
                  label: "→",
                  col: "col-start-3",
                },
                {
                  direction: "Down" as const,
                  label: "↓",
                  col: "col-start-2",
                },
              ].map(({ direction, label, col }) => (
                <button
                  className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                  key={direction}
                  onClick={async () => {
                    chompSound.play();
                    await client.actions.move({
                      account: account.account,
                      direction: { type: direction },
                    });
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
