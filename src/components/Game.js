import React, { useState, useEffect } from "react";

import Board from "./Board";
import Dialog from "./Dialog";

import { allShips } from "../assets/allShips.js";

const Game = () => {
  const [board1, setBoard1] = useState(newRandomizedBoard(1));
  const [board2, setBoard2] = useState(newRandomizedBoard(2));
  const [name1, setName1] = useState("Player1");
  const [name2, setName2] = useState("Player2");
  const [currentTurn, setCurrentTurn] = useState(1);
  const [lastAttack, setLastAttack] = useState(null);
  const [gameStatus, setGameStatus] = useState("New Game");
  
  useEffect(() => {
    checkForVictory(checkForSunkenShips(board1), name1);
    checkForVictory(checkForSunkenShips(board2), name2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn]);
  
  function checkForVictory(sunkenShips, playerName){
    if (sunkenShips.length === allShips.length){
      setGameStatus("Victory");
    }
  }
  
  function checkForSunkenShips(board){
    let sunkenShips = [];
    let shipsToCheck = allShips.map((ship) => {
      return ship.type
    });
    
    shipsToCheck.forEach(ship => {
      const shipToCheck = board.squares.filter((square) => {
        return square.contents[0] === ship
      });
      if (shipToCheck.every(square => square.attackResult === "hit")){
        sunkenShips.push(ship)
      }
    })
    return sunkenShips;
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
      orientation: orientation,
      sunk: false
    });
  }
  
  function showShips(player){
    return (currentTurn === player);
  }

  function buildBoard(columns, rows) {
    let newBoard = {squares: [], ships:[]};
    
      rows.forEach((row) => {
        columns.forEach((column) => {
          const square = {
            column: column,
            row: row,
            contents: [],
            attackResult: null,
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
  
  function grabSquare(board, thisSquare){
    return (board.squares.filter((square) => {
      return (
        square.column === thisSquare[0] && square.row === thisSquare[1]
      );
    }))[0];
  }
  
  function squareHasNoShip(board, thisSquare){
    return grabSquare(board, thisSquare).contents.length === 0;
  };
  
  function squareNotYetAttacked(board, thisSquare){
    return grabSquare(board, thisSquare).attackResult === null;
  }

  function newRandomizedBoard(player) {
    const columns = "ABCDEFGHIJ".split("");
    const rows = [...Array(10).keys()].map((i) => i + 1);

    let newBoard = buildBoard(columns, rows);

    allShips.forEach((ship) => {
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
        
        if (squaresToTry.every(sq => squareHasNoShip(newBoard, sq))) {
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
  
  function recordAttack(board, square, attempt){
    grabSquare(board, square).attackResult = attempt;
    if (currentTurn === 1){
      setBoard2(board);
      setCurrentTurn(2);
    } else if (currentTurn === 2){
      setBoard1(board);
      setCurrentTurn(1);
    }
    setLastAttack({result: attempt, square: square[0] + square[1]});
    setGameStatus("Swap");
  }
  
  function attemptAttack(boardNumber, column, row){
    const square = [column, row];
    
    if (boardNumber === 1 && currentTurn === 2 && squareNotYetAttacked(board1, square)) {
      if (squareHasNoShip(board1, square)){
        recordAttack(board1, square, "miss");
      } else {
        recordAttack(board1, square, "hit");
      };
    } else if (boardNumber === 2 && currentTurn === 1 && squareNotYetAttacked(board2, square)) {
      if (squareHasNoShip(board2, square)){
        recordAttack(board2, square, "miss");
      } else {
        recordAttack(board2, square, "hit");
      };
    }
  }
  
  function startGame(){
    setName1(document.getElementById("name1-field").value || name1);
    setName2(document.getElementById("name2-field").value || name2);
    setGameStatus("Swap");
  }
  
  function displayBoards(){
    if (currentTurn === 1) {
      return (
        <div>
          <Board boardNumber={2} playerName={name2} boardState={board2} sunkenShips={checkForSunkenShips(board2)} showShips={showShips(2)} attemptAttack={attemptAttack} />
          <Board boardNumber={1} playerName={name1} boardState={board1} sunkenShips={checkForSunkenShips(board1)} showShips={showShips(1)} attemptAttack={attemptAttack} />
        </div>
      );
    } else if (currentTurn === 2) {
      return (
        <div>
          <Board boardNumber={1} playerName={name1} boardState={board1} sunkenShips={checkForSunkenShips(board1)} showShips={showShips(1)} attemptAttack={attemptAttack} />
          <Board boardNumber={2} playerName={name2} boardState={board2} sunkenShips={checkForSunkenShips(board2)} showShips={showShips(2)} attemptAttack={attemptAttack} />
        </div>
      );
    }
  }
  
  let display;
  switch(gameStatus){
    case "New Game":
      display = (
        <div className="new-game">
          <p className="new-game-text">
            Welcome to Battleship!<br />Enter your names:
          </p>
          <div className="username-fields">
            <input type="text" placeholder={name1} id="name1-field"></input>
            <input type="text" placeholder={name2} id="name2-field"></input>
          </div>
          <button className="button" onClick={() => {startGame()}}>Start Game</button>
        </div>
      );
      break;
    case "Swap":
      let nextPlayer;
      let currentPlayer;
      let lastTurnMessage = "";
      
      if (currentTurn === 1){
        nextPlayer = name1;
        currentPlayer = name2;
      } else if (currentTurn === 2){
        nextPlayer = name2;
        currentPlayer = name1;
      }
      if (lastAttack?.result){
        lastTurnMessage = `${currentPlayer} attacked ${lastAttack.square}, resulting in a ${lastAttack.result}. `;
      }
      
      display = (
        <Dialog
          displayText={lastTurnMessage + `Good luck, ${nextPlayer}! It's your turn.`}
          buttonText={"Ready!"}
          buttonAction={() => {setGameStatus("Gameplay")}}
        />
      );
      break;
    case "Victory":
      let victor;
      currentTurn === 1 ? victor = name1 : victor = name2 ;
      display = (
        <Dialog 
          displayText={`Awesome job, ${victor}! You won!`} 
          buttonText={"Play Again?"} 
          buttonAction={() => {setGameStatus("New Game")}} />
      );
      break;
    default:
      display = displayBoards();
  }
  
  return (
    <div className="game" data-testid="game">
      {display}
    </div>
  );
};

export default Game;
