import { Entity } from "@dojoengine/recs";
import { useEffect, useState, useMemo } from "react";
import { QueryBuilder, SDK, createDojoStore } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { addAddressPadding } from "starknet";

import { Models, Schema, GameStatus } from "./bindings";
import { useDojo } from "./useDojo";
import useModel from "./useModel";
import { useSystemCalls } from "./useSystemCalls";
import World from "./World";
import Lobby from "./Lobby";
import useBoard from './Board';

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

  const [isPlaying, setIsPlaying] = useState(false);
  const chompSound = new Audio("assets/pacman_chomp.wav");
  const beginningSound = new Audio("assets/pacman_beginning.wav");
  const extraPacSound = new Audio("assets/pacman_extrapac.wav");

  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(account?.account.address)]),
    [account?.account.address]
  );

  const grid = useBoard();

  const moves = useModel(entityId, Models.Moves);
  const position = useModel(entityId, Models.Position);
  const gameState = useModel(1 as Entity, Models.GameState);

  return (
    <div className="bg-black min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {(!gameState || gameState.status === GameStatus.Lobby) ? (
          <Lobby gameState={gameState} />
        ) : (
          <>
            <button
              className="mb-6 px-6 py-2 bg-yellow-400 rounded-full shadow-md active:shadow-inner active:bg-yellow-500 focus:outline-none text-xl font-bold text-black"
              onClick={() => {
                setIsPlaying(!isPlaying);
                beginningSound.play();
              }}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              className="mb-6 ml-4 px-6 py-2 bg-yellow-400 rounded-full shadow-md active:shadow-inner active:bg-yellow-500 focus:outline-none text-xl font-bold text-black"
              onClick={() => account?.create()}
            >
              {account?.isDeploying ? "Deploying Burner..." : "Create Burner"}
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <World grid={grid} position={position} />
              </div>
              <div className="flex-1 space-y-6">
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

                <div className="bg-gray-800 shadow-md rounded-lg p-4">
                  <div className="text-lg sm:text-xl font-semibold mb-4 text-white">{`Burners Deployed: ${account.count}`}</div>
                  <div className="mb-4">
                    <label
                      htmlFor="signer-select"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Select Signer:
                    </label>
                    <select
                      id="signer-select"
                      className="w-full px-3 py-2 text-base text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={account ? account.account.address : ""}
                      onChange={(e) => account.select(e.target.value)}
                    >
                      {account?.list().map((account, index) => (
                        <option value={account.address} key={index}>
                          {account.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 text-base rounded transition duration-300 ease-in-out"
                    onClick={() => account.clear()}
                  >
                    Clear Burners
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
