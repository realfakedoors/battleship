import React from "react";

const Ship = ({ player, length, type, column, row, orientation, shipName }) => {
  const numberedColumn = () => {
    const columns = "ABCDEFGHIJ".split("");
    return (columns.findIndex((col) => col === column)) + 1;
  };

  const vertical = {
    gridColumn: `${numberedColumn()} / ${numberedColumn()}`,
    gridRow: `${row} / span ${length}`,
  };

  const horizontal = {
    gridColumn: `${numberedColumn()} / span ${length}`,
    gridRow: `${row} / ${row}`,
  };

  const transformText = {
    transform: `rotate(-90deg)`,
  };

  return (
    <div
      className={"ship " + type}
      data-testid={type + player}
      style={orientation === "vertical" ? vertical : horizontal}
    >
      <p style={orientation === "vertical" ? transformText : null}>
        {shipName(type)}
      </p>
    </div>
  );
};

export default Ship;
