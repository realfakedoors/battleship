import React from "react";

import Ship from "./Ship";
import Square from "./Square";

const Board = ({ player, boardState }) => {
  function displaySquare(square) {
    return (
      <Square
        contents={square.contents}
        column={square.column}
        row={square.row}
        key={square.column + square.row}
      />
    );
  }

  function displayShip(ship) {
    return (
      <Ship
        player={player}
        type={ship.type}
        length={ship.length}
        column={ship.column}
        row={ship.row}
        orientation={ship.orientation}
        key={ship.type + player}
      />
    );
  }

  return (
    <div className="board" data-testid={"board-" + player}>
      {boardState.squares.map(displaySquare)}
      {boardState.ships.map(displayShip)}
    </div>
  );
};

export default Board;
