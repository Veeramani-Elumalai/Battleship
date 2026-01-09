import Ship from './ships.js';

let battleship;

beforeEach(() => {
  battleship = new Ship(4);
});

test('ship object creation', () => {
  expect(battleship.length).toBe(4);
  expect(battleship.hits).toBe(0);
});

test('hit() increases hits', () => {
  battleship.hit();
  expect(battleship.hits).toBe(1);
});

test('isSunk() returns false when ship is not sunk', () => {
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk()).toBe(false);
});

test('isSunk() returns true when hits equal length', () => {
  battleship.hit();
  battleship.hit();
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk()).toBe(true);
});
