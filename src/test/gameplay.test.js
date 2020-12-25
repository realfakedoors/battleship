import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import Game from "../components/Game";

beforeEach(() => {
  render(<Game />);
  fireEvent.click(screen.getByText('Start Game'));
  fireEvent.click(screen.getByText('Ready!'));
});

afterEach(cleanup);

test("Game renders correctly", async () => {
  await screen.findByTestId("game");
});

test("Each player gets a board", async () => {
  await screen.findByTestId(/board-1/);
  await screen.findByTestId(/board-2/);
  expect(screen.getByText('Player1')).toBeDefined();
  expect(screen.getByText('Player2')).toBeDefined();
});

test("Players can only see one set of ships", async () => {
  await screen.findByTestId(/patrol-boat/);
  await screen.findByTestId(/submarine/);
  await screen.findByTestId(/destroyer/);
  await screen.findByTestId(/battleship/);
  await screen.findByTestId(/carrier/);
});

test("Clicking an opponent's square results in a hit or a miss, then prompts the player to pass the device", async () => {
  fireEvent.click(await screen.findByTestId(/2A1$/));
  expect(screen.getByText(/Player1 attacked A1, it's a/)).toBeDefined();
  expect(screen.getByText(/Good luck, Player2! It's your turn./)).toBeDefined();
  
  fireEvent.click(screen.getByText('Ready!'));
  expect(await screen.findByTestId(/1A1$/)).toBeDefined();
});

test("Sinking all of an opponent's ships results in a victory", async () => {
  // Let's cheat by recording player 1's ships, and only attacking randomly as player 1!
  const allColumns = 'ABCDEFGHIJ'.split("");
  const opponentShips = [
    await screen.findByTestId(/patrol-boat1/),
    await screen.findByTestId(/submarine1/),
    await screen.findByTestId(/destroyer1/),
    await screen.findByTestId(/battleship1/),
    await screen.findByTestId(/carrier1/)
  ]
  
  let opponentSquares = [];
  opponentShips.forEach((ship) => {    
    const grid_position = ship.style._values;
    const column = grid_position['grid-column'].split(" / ");
    const row = grid_position['grid-row'].split(" / ");
    
    let orientation;
    row[0] === row[1] ? orientation = "horizontal" : orientation = "vertical" ;
    
    let squaresToAttack = [];
    if (orientation === "horizontal"){
      let length = column[1].slice(-1);
      let currentColumn = parseInt(column[0]) - 1;
      for (let i = 0; i < length; i++){
        squaresToAttack.push(allColumns[currentColumn] + row[0]);
        currentColumn += 1;
      }
    } else if (orientation === "vertical"){
      let length = row[1].slice(-1);
      let currentRow = parseInt(row[0]);
      for (let i = 0; i < length; i++){
        squaresToAttack.push(allColumns[column[0] - 1] + currentRow);
        currentRow += 1;
      }
    }
    squaresToAttack.forEach(sq => opponentSquares.push(sq));
  });
  
  let allSquares = [];
  allColumns.forEach(col =>{
    [...Array(10).keys()].map((i) => i + 1).forEach(row =>{
      allSquares.push(`${col}${row}`);
    });
  });
  for (let x = 0; x < allSquares.length; x++){
    const y = Math.floor(Math.random() * (x + 1));
    [allSquares[x], allSquares[y]] = [allSquares[y], allSquares[x]];
  }
  
  let randomSquares = allSquares.slice(0, opponentSquares.length);
  
  for (let z = 0; z < opponentSquares.length; z++){
    let playerOneIsHopeless = new RegExp(`2${randomSquares[z]}$`);
    let playerTwoIsCheating = new RegExp(`1${opponentSquares[z]}$`);
    
    fireEvent.click(await screen.findByTestId(playerOneIsHopeless));
    fireEvent.click(screen.getByText('Ready!'));
    fireEvent.click(await screen.findByTestId(playerTwoIsCheating));
    if (screen.queryByText('Ready!')){
      fireEvent.click(screen.getByText('Ready!'));
    }
  }
  expect(screen.getByText(/Awesome job, Player1! You won!/)).toBeDefined();
});
