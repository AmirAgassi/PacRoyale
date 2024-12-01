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
  const { spawn } = useSystemCalls();

  return (
    <div className="bg-black min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <img src="/assets/logo.png" alt="Game Logo" className="h-12" />
          <div>
            <button
              className="ml-4 px-6 py-2 bg-yellow-400 rounded-full shadow-md active:shadow-inner active:bg-yellow-500 focus:outline-none text-xl font-bold text-black"
              onClick={() => account?.create()}
            >
              {account?.isDeploying ? "Deploying Burner..." : "Create Burner"}
            </button>
          </div>
        </div>

        {(!gameState || gameState.status === GameStatus.Lobby) ? (
          <Lobby gameState={gameState} />
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <button
                className="mb-6 px-6 py-2 bg-yellow-400 rounded-full shadow-md active:shadow-inner active:bg-yellow-500 focus:outline-none text-xl font-bold text-black"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  beginningSound.play();
                }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
