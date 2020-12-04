import React from "react";

const Square = ({ contents, column, row }) => {
  function attemptAttack() {
    console.log("ATTACK!");
  }

  const numberedColumn = () => {
    const columns = "ABCDEFGHIJ".split("");
    return columns.findIndex((col) => col === column) + 1;
  };

  const placeSquare = {
    gridColumn: `${numberedColumn()} / span 1`,
    gridRow: `${row} / span 1`,
  };

  return (
    <div
      className="square"
      data-testid={column + row}
      style={placeSquare}
      onClick={() => attemptAttack()}
    ></div>
  );
};

export default Square;
