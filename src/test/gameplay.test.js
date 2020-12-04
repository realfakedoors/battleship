import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import Game from "../components/Game";

beforeEach(() => {
  render(<Game />);
});

test("Game renders correctly", async () => {
  const game = await screen.findByTestId("game");
  expect(game).toBeDefined();
});

// test("Players can only see their own ships", async () => {
//   await screen.findByTestId(/patrol-boat/);
//   await screen.findByTestId(/submarine/);
//   await screen.findByTestId(/destroyer/);
//   await screen.findByTestId(/battleship/);
//   await screen.findByTestId(/carrier/);
// });

test("Each player gets a board", async () => {
  const boardOne = await screen.findByTestId(/board-1/);
  expect(boardOne).toBeDefined();
  const boardTwo = await screen.findByTestId(/board-2/);
  expect(boardTwo).toBeDefined();
});

// test("Players can't place their ships out of bounds", async () => {
//   fireEvent.click(await screen.findByTestId(/submarine/));
//   fireEvent.click(await screen.findByTestId(/game-title/));
//   const errorWindow = await screen.findByTestId(/error-window/);
//   expect(errorWindow).toContain("Can't place your ship out of bounds!");
// });
