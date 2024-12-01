import React from "react";

interface WorldProps {
  grid: number[][];
  position?: { vec: { x: number; y: number } } | null;
}

const World: React.FC<WorldProps> = ({ grid, position }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => {
            const isPlayer =
              position &&
              position.vec.x === cellIndex &&
              position.vec.y === rowIndex;

            return (
              <div
                key={`${rowIndex}-${cellIndex}`}
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: isPlayer
                    ? "yellow"
                    : cell === 2
                    ? "black"
                    : cell === 0
                    ? "black"
                    : "blue",
                  border: "1px solid #333",
                  borderRadius: isPlayer ? "50%" : "0",
                  position: cell === 2 ? "relative" : "static",
                }}
              >
                {cell === 2 && (
                  <div
                    style={{
                      position: "absolute",
                      width: "4px",
                      height: "4px",
                      backgroundColor: "yellow",
                      borderRadius: "50%",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default World;
