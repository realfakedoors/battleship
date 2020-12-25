import React from "react";

const Square = ({
  contents,
  column,
  row,
  boardNumber,
  attemptAttack,
  attackResult,
}) => {  
  const placeSquare = {
    gridColumn: `${numberedColumn()} / span 1`,
    gridRow: `${row} / span 1`,
  };

  function numberedColumn() {
    const columns = "ABCDEFGHIJ".split("");
    return columns.findIndex((col) => col === column) + 1;
  }

  function statusIcon(attackResult) {
    if (attackResult) {
      const icon = process.env.PUBLIC_URL + "/icons/" + attackResult + ".svg";
      return <img src={icon} alt={attackResult} className="attack-result" />;
    }
  }

  return (
    <div
      className="square"
      data-testid={boardNumber + column + row}
      style={placeSquare}
      onClick={() => attemptAttack(boardNumber, column, row)}
    >
      {statusIcon(attackResult)}
    </div>
  );
};

export default Square;
