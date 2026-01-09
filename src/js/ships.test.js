import Ship from './ships';

const battleship = new Ship(4);

test('ship object creation', () => {
  expect(new Ship(4)).toMatchObject({ length: 4, hits: 0 , isSunk : false});
});

test('adding hits to the ship', () => {
  expect(battleship).toMatchObject({ length: 4, hits: 0 , isSunk : false});
});

test('testing sunk logic', () => {
  battleship.hit();
  battleship.hit();
  battleship.hit();
  battleship.hit();
  expect(battleship.isSunk).toBe(true);
});
