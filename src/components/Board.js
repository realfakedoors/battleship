import React from "react";

import Ship from "./Ship";
import Square from "./Square";

const Board = ({
  boardNumber,
  playerName,
  boardState,
  sunkenShips,
  showShips,
  attemptAttack,
}) => {
  function displaySquare(square) {
    return (
      <Square
        contents={square.contents}
        attackResult={square.attackResult}
        column={square.column}
        row={square.row}
        boardNumber={boardNumber}
        attemptAttack={attemptAttack}
        key={square.column + square.row}
      />
    );
  }

  function displayShip(ship) {
    if (showShips) {
      return (
        <Ship
          player={boardNumber}
          type={ship.type}
          shipName={shipName}
          length={ship.length}
          column={ship.column}
          row={ship.row}
          orientation={ship.orientation}
          key={ship.type + boardNumber}
        />
      );
    }
  }

  function shipName(type) {
    return type
      .replace(/-/, " ")
      .split(" ")
      .map((str) => str[0].toUpperCase() + str.substr(1))
      .join(" ");
  }

  function displayColumn(col) {
    return (
      <p className="display-column" key={col + boardNumber}>
        {col}
      </p>
    );
  }

  function displayRow(row) {
    return (
      <p className="display-row" key={row + boardNumber}>
        {row}
      </p>
    );
  }

  function displaySunkenShip(sunkenShip) {
    return (
      <div
        className={"sunken-ship " + sunkenShip}
        key={playerName + sunkenShip}
      >
        {shipName(sunkenShip)}
      </div>
    );
  }

  let columns = "ABCDEFGHIJ".split("");
  let rows = [...Array(10).keys()].map((i) => i + 1);

  return (
    <div className="board-container">
      <div className="player-name">{playerName}</div>
      <div className="display-columns">{columns.map(displayColumn)}</div>
      <div className="display-rows">{rows.map(displayRow)}</div>
      <div className="board" data-testid={"board-" + boardNumber}>
        {boardState.squares.map(displaySquare)}
        {boardState.ships.map(displayShip)}
      </div>
      <div className="display-sunken-ships">
        <span className="sunk-text">{sunkenShips.length > 0 && "Sunk:"}</span>
        {sunkenShips.map(displaySunkenShip)}
      </div>
    </div>
  );
};

export default Board;
