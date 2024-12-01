{
  /* <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => account?.create()}
                >
                    {account?.isDeploying
                        ? "Deploying Burner..."
                        : "Create Burner"}
                </button> */
}

{
  /* <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-6 w-full max-w-md">
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
                </div> */
}


{
  /* 
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-700 p-2">
                                    Entity ID
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Player
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position X
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position Y
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Can Move
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Last Direction
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Remaining Moves
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(entities).map(
                                ([entityId, entity]) => {
                                    const position =
                                        entity.models.dojo_starter.Position;
                                    const moves =
                                        entity.models.dojo_starter.Moves;

                                    return (
                                        <tr
                                            key={entityId}
                                            className="text-gray-300"
                                        >
                                            <td className="border border-gray-700 p-2">
                                                {entityId}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.player ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.x ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.y ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.can_move?.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.last_direction ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.remaining ?? "N/A"}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div> */
}