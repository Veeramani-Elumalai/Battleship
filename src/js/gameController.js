import Player from "./player.js";
import { randomizeShips } from "./shipPlacement.js";

export default class GameController {
    constructor(gameMode = "modeSelection") {
        this.gameMode = gameMode; // "modeSelection" | "computer" | "twoPlayer"
        this.player1 = new Player("real");
        this.player2 = gameMode === "computer" ? new Player("computer") : new Player("real");
        
        // For compatibility with existing code
        this.player = this.player1;
        this.computer = this.player2;

        this.phase = gameMode; // modeSelection | setup | setupPlayer2 | playing | gameOver
        this.currentTurn = null;
        this.currentSetupPlayer = "player1";

        if (gameMode === "computer") {
            this.setupComputer();
            this.phase = "setup";
        }
    }

    // computer ships are always randomized
    setupComputer() {
        randomizeShips(this.computer.gameBoard);
    }

    // Setup player 2 ships (for two-player mode)
    setupPlayer2() {
        this.phase = "setupPlayer2";
        this.currentSetupPlayer = "player2";
    }

    // called after player finishes drag & drop
    startGame() {
        if (this.gameMode === "twoPlayer" && this.phase === "setup") {
            // Player 1 finished, now setup player 2
            this.setupPlayer2();
            return "setupPlayer2";
        }

        if (this.phase !== "setup" && this.phase !== "setupPlayer2") return;

        this.phase = "playing";
        this.currentTurn = this.gameMode === "computer" ? "player" : "player1";
        return "started";
    }

    player1Attack(x, y) {
        if (
            this.phase !== "playing" ||
            this.currentTurn !== "player1"
        ) return;

        const result = this.player1.attack(this.player2.gameBoard, x, y);
        if (!result) return;

        if (this.player2.gameBoard.allShipsSunk()) {
            this.phase = "gameOver";
            return "player1-wins";
        }

        this.currentTurn = "player2";
        return result;
    }

    player2Attack(x, y) {
        if (
            this.phase !== "playing" ||
            this.currentTurn !== "player2"
        ) return;

        const result = this.player2.attack(this.player1.gameBoard, x, y);
        if (!result) return;

        if (this.player1.gameBoard.allShipsSunk()) {
            this.phase = "gameOver";
            return "player2-wins";
        }

        this.currentTurn = "player1";
        return result;
    }

    // For backward compatibility with computer mode
    playerAttack(x, y) {
        if (this.gameMode === "computer") {
            if (
                this.phase !== "playing" ||
                this.currentTurn !== "player"
            ) return;

            const result = this.player.attack(this.computer.gameBoard, x, y);
            if (!result) return;

            if (this.computer.gameBoard.allShipsSunk()) {
                this.phase = "gameOver";
                return "player-wins";
            }

            this.currentTurn = "computer";
            return result;
        }
        return this.player1Attack(x, y);
    }

    computerAttack() {
        if (this.gameMode !== "computer") return null;
        
        if (
            this.phase !== "playing" ||
            this.currentTurn !== "computer"
        ) return null;

        const result = this.computer.attack(this.player.gameBoard);

        if (this.player.gameBoard.allShipsSunk()) {
            this.phase = "gameOver";
            return "computer-wins";
        }

        this.currentTurn = "player";
        return result;
    }

    // Reset the game
    reset() {
        const currentMode = this.gameMode;
        this.player1 = new Player("real");
        this.player2 = currentMode === "computer" ? new Player("computer") : new Player("real");
        this.player = this.player1;
        this.computer = this.player2;
        
        this.phase = currentMode === "computer" ? "setup" : currentMode === "twoPlayer" ? "setup" : "modeSelection";
        this.currentTurn = null;
        this.currentSetupPlayer = "player1";

        if (currentMode === "computer") {
            this.setupComputer();
        }
    }
}
