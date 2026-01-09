import GameBoard from "./board.js";
import Ship from "./ships.js";

test("places ship horizontally", () => {
    const newBoard = new GameBoard();
    const newShip = new Ship(3);

    expect(newBoard.placeShip(newShip, 0, 0, "horizontal")).toBe(true);

    expect(newBoard.board[0][0]).toBe(newShip);
    expect(newBoard.board[0][1]).toBe(newShip);
    expect(newBoard.board[0][2]).toBe(newShip);
});
