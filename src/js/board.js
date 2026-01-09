export default class GameBoard {
    constructor() {
        this.board = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));
        
        this.missedAttacks = [];
        this.ships = new Set();
    }

    placeShip(ship, x, y, direction) {
        if (!ship || typeof ship.hit !== "function") {
            throw new Error("placeShip expects a ship-like object");
        }

        // boundary checks
        if (direction === "horizontal") {
            if (y + ship.length > 10) return false;

            // collision check
            for (let i = 0; i < ship.length; i++) {
                if (this.board[x][y + i] !== null) return false;
            }

            // place ship
            for (let i = 0; i < ship.length; i++) {
                this.board[x][y + i] = ship;
            }
        }

        if (direction === "vertical") {
            if (x + ship.length > 10) return false;

            for (let i = 0; i < ship.length; i++) {
                if (this.board[x + i][y] !== null) return false;
            }

            for (let i = 0; i < ship.length; i++) {
                this.board[x + i][y] = ship;
            }
        }
        this.ships.add(ship);
        return true;
    }
    receiveAttack(x, y) {
        const target = this.board[x][y];

        // prevent duplicate attacks
         if (target === "hit" || target === "miss") return false;

        if (target === null) {
            this.board[x][y] = "miss";
            this.missedAttacks.push([x, y]);
            return "miss";
        }

        // hit a ship
        target.hit();
        this.board[x][y] = "hit";
        return "hit";
    }
    allShipsSunk() {
        for (const ship of this.ships) {
            if (!ship.isSunk()) return false;
        }
        return true;
    }
}
