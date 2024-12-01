import { useEffect, useState } from "react";
import { useDojo } from "./useDojo";
import { GameStatus } from "./bindings";
import { useSystemCalls } from "./useSystemCalls";

interface LobbyProps {
  gameState?: {
    game_id: number;
    status: GameStatus;
    player_count: number;
    max_players: number;
  };
}

const Lobby: React.FC<LobbyProps> = ({ gameState }) => {
  const {
    account: { account },
  } = useDojo();
  
  const { initGame } = useSystemCalls();
  const [maxPlayers, setMaxPlayers] = useState<number>(4);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      {!gameState ? (
        // Show create game UI if no game exists
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Game</h2>
          <div>
            <label className="block text-gray-300 mb-2">Max Players:</label>
            <input
              type="number"
              min="2"
              max="10"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <button
            onClick={() => initGame(maxPlayers)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Game
          </button>
        </div>
      ) : (
        // Show lobby status if game exists
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Game Lobby</h2>
          <div className="text-gray-300">
            <p>Status: {GameStatus[gameState.status]}</p>
            <p>
              Players: {gameState.player_count} / {gameState.max_players}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby; 