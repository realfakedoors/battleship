import React from "react";

const Ship = ({ player, length, type, column, row, orientation }) => {
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

  function shipName(type) {
    return type
      .replace(/-/, " ")
      .split(" ")
      .map((str) => str[0].toUpperCase() + str.substr(1))
      .join(" ");
  }

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
