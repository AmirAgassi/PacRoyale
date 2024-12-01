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
            const isPlayer = position && 
              position.vec.x === cellIndex && 
              position.vec.y === rowIndex;
            
            return (
              <div
                key={`${rowIndex}-${cellIndex}`}
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: isPlayer ? "yellow" : 
                                 cell === 0 ? "black" : "blue",
                  border: "1px solid #333",
                  borderRadius: isPlayer ? "50%" : "0",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default World;
