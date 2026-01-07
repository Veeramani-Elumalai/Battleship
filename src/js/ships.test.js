import { Cell } from "recharts";
import { ship } from "./ships";

const battleship = new ship(4,1);
const carrierShip = new ship(4,4);

test('ship object creation', ()=>{
    expect(new ship(4)).toMatchObject({length : 4, hits : 0});
})

test('adding hits to the ship', ()=> {
    expect(battleship).toMatchObject({length : 4, hits : 1});
    expect(carrierShip.sunk()).toEqual('Ship is sunking');
})

test('testing sunk logic', ()=> {
    battleship.hit();
    battleship.hit();
    battleship.hit();
    battleship.hit();
    expect(battleship.sunk()).toEqual('Ship is sunking');
})