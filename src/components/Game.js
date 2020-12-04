import React, { useState } from "react";

import Board from "./Board";

const Game = () => {
  const [board1] = useState(newRandomizedBoard(1));
  const [board2] = useState(newRandomizedBoard(2));

  function allShips() {
    return [
      {
        type: "carrier",
        length: 5,
      },
      {
        type: "battleship",
        length: 4,
      },
      {
        type: "destroyer",
        length: 3,
      },
      {
        type: "submarine",
        length: 3,
      },
      {
        type: "patrol-boat",
        length: 2,
      },
    ];
  }

  function addShip(ship, squares, orientation, player) {
    const findLowestColumn = (squares) => {
      return (squares.map(sq => (sq[0])).sort()[0]);
    }
    
    const findLowestRow = (squares) => {
      return (Math.min(...squares.map(sq => (sq[1]))));
    }
    return({
      type: ship.type,
      length: ship.length,
      column: findLowestColumn(squares),
      row: findLowestRow(squares),
      orientation: orientation
    });
  }

  function buildBoard(columns, rows) {
    let newBoard = {squares: [], ships:[]};
    
      rows.forEach((row) => {
        columns.forEach((column) => {
        const square = {
          column: column,
          row: row,
          contents: [],
        };
        newBoard.squares.push(square);
      });
    });
    return newBoard;
  }
  
  function checkSquares(length, orientation, startingCol, startingRow, columns){
    let squares = []
    for (let i = 0; i < length; i++) {
      let colToTry;
      let rowToTry;

      if (orientation === "horizontal") {
        rowToTry = startingRow;
        if (startingCol + i > 9) {
          colToTry = columns[startingCol - (length - i)];
        } else {
          colToTry = columns[startingCol + i];
        }
      } else if (orientation === "vertical") {
        colToTry = columns[startingCol];
        if (startingRow + i > 10) {
          rowToTry = startingRow - (length - i);
        } else {
          rowToTry = startingRow + i;
        }
      }
      squares.push([colToTry, rowToTry]);
    }
    return squares;
  }

  function newRandomizedBoard(player) {
    const columns = "ABCDEFGHIJ".split("");
    const rows = [...Array(10).keys()].map((i) => i + 1);

    let newBoard = buildBoard(columns, rows);

    allShips().forEach((ship) => {
      let shipPlaced = false;
      while (shipPlaced !== true) {
        const startingCol = Math.floor(Math.random() * 10);
        const startingRow = Math.floor(Math.random() * 10) + 1;
        const coinflip = Math.floor(Math.random() * 2);
        let orientation;
        coinflip === 0
          ? (orientation = "vertical")
          : (orientation = "horizontal");

        let squaresToTry = checkSquares(ship.length, orientation, startingCol, startingRow, columns);
        
        const checkForOccupancy = (thisSquare) => {
          const squareToCheck = newBoard.squares.filter((square) => {
            return (
              square.column === thisSquare[0] && square.row === thisSquare[1]
            );
          });
          return squareToCheck[0].contents.length === 0;
        };

        if (squaresToTry.every(checkForOccupancy)) {
          squaresToTry.forEach((square) => {
            square = { column: square[0], row: square[1] };
            const squareIndex = newBoard.squares.findIndex(
              (sq) => sq.column === square.column && sq.row === square.row
            );
            newBoard.squares.[squareIndex].contents = [ship.type];
          });
          newBoard.ships.push(addShip(ship, squaresToTry, orientation, player));
          shipPlaced = true;
        }
      }
    });
    return newBoard;
  }

  return (
    <div className="game" data-testid="game">
      <h1 className="title">BATTLESHIP</h1>
      <Board player={1} boardState={board1}/>
      <Board player={2} boardState={board2}/>
    </div>
  );
};

export default Game;
