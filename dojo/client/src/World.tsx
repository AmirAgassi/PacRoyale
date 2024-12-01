import React from "react";

interface WorldProps {
  grid: number[][];
}

const World: React.FC<WorldProps> = ({ grid }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: cell === 0 ? "black" : "blue",
                border: "1px solid #333",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default World;
