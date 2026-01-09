export default class GameBoard {
    constructor() {
        this.board = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));
    }

    placeShip(ship, x, y, direction) {
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

        return true;
    }
}
