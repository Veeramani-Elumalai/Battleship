import Ship from "./ships.js";

export default function DOMController(game) {
    const placementBoardEl = document.querySelector("#placement-board");
    const playerBoardEl = document.querySelector("#player-board");
    const computerBoardEl = document.querySelector("#computer-board");
    const statusEl = document.querySelector("#status");
    const shipYardEl = document.querySelector("#ship-yard");
    const rotateBtn = document.querySelector("#rotate");
    const startBtn = document.querySelector("#start");
    const boardsEl = document.querySelector(".boards");
    const setupSection = document.querySelector("#setup-section");
    const modeSelection = document.querySelector("#mode-selection");
    const resetBtn = document.querySelector("#reset-game");
    const resetBtnPlaying = document.querySelector("#reset-game-playing");
    const setupTitle = document.querySelector("#setup-title");
    const player1Title = document.querySelector("#player1-title");
    const player2Title = document.querySelector("#player2-title");
    const modeComputerBtn = document.querySelector("#mode-computer");
    const modeTwoPlayerBtn = document.querySelector("#mode-two-player");

    let draggedShipLength = null;
    let direction = "horizontal";
    let placedCount = 0;
    let currentPlayerBoard = null;

    // Initialize
    boardsEl.style.display = "none";
    setupSection.style.display = "none";

    // Mode selection handlers
    modeComputerBtn.addEventListener("click", () => {
        game.gameMode = "computer";
        game.reset();
        startSetup("computer");
    });

    modeTwoPlayerBtn.addEventListener("click", () => {
        game.gameMode = "twoPlayer";
        game.reset();
        startSetup("twoPlayer");
    });

    function startSetup(mode) {
        modeSelection.style.display = "none";
        setupSection.style.display = "block";
        boardsEl.style.display = "none";
        
        if (mode === "twoPlayer") {
            setupTitle.textContent = "Player 1 - Place Your Ships";
            currentPlayerBoard = game.player1.gameBoard;
        } else {
            setupTitle.textContent = "Place Your Ships";
            currentPlayerBoard = game.player.gameBoard;
        }
        
        resetBoard();
        renderBoard(placementBoardEl, currentPlayerBoard, true);
        updateStatus(mode === "twoPlayer" 
            ? "🚢 Player 1: Drag ships to place them on your board. Click Rotate to change direction."
            : "🚢 Drag ships from the ship yard to place them on your board. Click Rotate to change direction.");
    }

    function resetBoard() {
        placedCount = 0;
        draggedShipLength = null;
        direction = "horizontal";
        
        // Reset ship yard
        const shipEls = document.querySelectorAll("#ship-yard .ship");
        shipEls.forEach(ship => {
            ship.classList.remove("placed");
        });
        
        // Reset button states
        startBtn.disabled = true;
        rotateBtn.textContent = `🔄 Rotate (${direction === "horizontal" ? "→" : "↓"})`;
    }

    // render board with data-x / data-y
    function renderBoard(boardEl, gameBoard, showShips) {
        boardEl.innerHTML = ""; // Clear
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;
                const target = gameBoard.board[x][y];
                if (target === "hit") {
                    cell.classList.add("hit");
                    cell.textContent = "💥";
                } else if (target === "miss") {
                    cell.classList.add("miss");
                    cell.textContent = "○";
                } else if (typeof target === "object" && target !== null) {
                    // It's a ship
                    if (showShips) {
                        cell.classList.add("ship");
                        if (target.isSunk()) {
                            cell.classList.add("sunk");
                            cell.textContent = "💀";
                        } else {
                            cell.textContent = "🚢";
                        }
                    }
                }
                boardEl.appendChild(cell);
            }
        }
    }

    // drag start
    const shipEls = document.querySelectorAll("#ship-yard .ship");
    shipEls.forEach(ship => {
        ship.addEventListener("dragstart", e => {
            draggedShipLength = Number(e.target.dataset.length);
            ship.classList.add("dragging");
        });

        ship.addEventListener("dragend", e => {
            ship.classList.remove("dragging");
        });
    });

    // allow drop
    placementBoardEl.addEventListener("dragover", e => e.preventDefault());

    // drop ship
    placementBoardEl.addEventListener("drop", e => {
        e.preventDefault();
        let cell = e.target;
        // Find the cell element if drop happened on a child
        while (cell && !cell.classList.contains("cell")) {
            cell = cell.parentElement;
        }
        if (!cell || !cell.classList.contains("cell")) return;

        const x = Number(cell.dataset.x);
        const y = Number(cell.dataset.y);

        if (draggedShipLength === null) return;

        const ship = new Ship(draggedShipLength);
        const placed = currentPlayerBoard.placeShip(
            ship,
            x,
            y,
            direction
        );

        if (placed) {
            const shipEl = document.querySelector(`.ship[data-length="${draggedShipLength}"]:not(.placed)`);
            if (shipEl) {
                shipEl.classList.add("placed");
            }

            placedCount++;
            const remaining = shipEls.length - placedCount;
            if (placedCount === shipEls.length) {
                startBtn.disabled = false;
                if (game.gameMode === "twoPlayer" && game.phase === "setup") {
                    updateStatus("✅ All ships placed! Ready to start Player 2 setup!");
                } else {
                    updateStatus("✅ All ships placed! Ready to start the battle!");
                }
            } else {
                updateStatus(`✅ Ship placed! ${remaining} ship${remaining > 1 ? 's' : ''} remaining.`);
            }

            renderBoard(placementBoardEl, currentPlayerBoard, true);
        } else {
            updateStatus("❌ Cannot place ship there! Try another position.");
        }
    });

    // rotate ships
    rotateBtn.addEventListener("click", () => {
        direction = direction === "horizontal" ? "vertical" : "horizontal";
        rotateBtn.textContent = `🔄 Rotate (${direction === "horizontal" ? "→" : "↓"})`;
        updateStatus(`Ship orientation: ${direction === "horizontal" ? "Horizontal (→)" : "Vertical (↓)"}`);
    });

    // start game
    startBtn.addEventListener("click", () => {
        const result = game.startGame();
        
        if (result === "setupPlayer2") {
            // Switch to player 2 setup
            setupTitle.textContent = "Player 2 - Place Your Ships";
            currentPlayerBoard = game.player2.gameBoard;
            resetBoard();
            renderBoard(placementBoardEl, currentPlayerBoard, true);
            updateStatus("🚢 Player 2: Drag ships to place them on your board. Click Rotate to change direction.");
            return;
        }

        // Game started
        setupSection.style.display = "none";
        boardsEl.style.display = "flex";
        
        if (game.gameMode === "twoPlayer") {
            player1Title.textContent = "Player 1's Fleet";
            player2Title.textContent = "Player 2's Fleet";
            updateStatus("🎯 Player 1's turn! Click on Player 2's board to attack.");
        } else {
            player1Title.textContent = "Your Fleet";
            player2Title.textContent = "Enemy Waters";
            updateStatus("🎯 Your turn! Click on the enemy waters to attack.");
        }
        
        renderGameBoards();
    });

    // Render boards during game
    function renderGameBoards() {
        if (game.gameMode === "twoPlayer") {
            renderBoard(playerBoardEl, game.player1.gameBoard, true);
            renderBoard(computerBoardEl, game.player2.gameBoard, false);
        } else {
            renderBoard(playerBoardEl, game.player.gameBoard, true);
            renderBoard(computerBoardEl, game.computer.gameBoard, false);
        }
    }

    // Reset game handler
    function handleReset() {
        const wasPlaying = game.phase === "playing" || game.phase === "gameOver";
        const currentMode = game.gameMode;
        
        game.gameMode = "modeSelection";
        game.reset();
        
        // If resetting during gameplay, go back to mode selection
        // If resetting during setup, restart the same mode
        if (wasPlaying || currentMode === "modeSelection" || currentMode === undefined) {
            modeSelection.style.display = "block";
            setupSection.style.display = "none";
            boardsEl.style.display = "none";
            updateStatus("Choose a game mode to start playing!");
        } else {
            // Reset but keep the same mode
            game.gameMode = currentMode;
            if (currentMode === "computer") {
                startSetup("computer");
            } else if (currentMode === "twoPlayer") {
                startSetup("twoPlayer");
            }
        }
    }

    resetBtn.addEventListener("click", handleReset);
    resetBtnPlaying.addEventListener("click", handleReset);

    // Add click listeners to enemy board for attacks
    computerBoardEl.addEventListener("click", (e) => {
        if (game.phase !== "playing") return;
        
        const cell = e.target;
        if (!cell.classList.contains("cell")) return;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        // Check if already attacked
        if (cell.classList.contains("hit") || cell.classList.contains("miss")) {
            updateStatus("⚠️ Already attacked that position! Choose another target.");
            return;
        }
        
        let result;
        if (game.gameMode === "twoPlayer") {
            if (game.currentTurn === "player1") {
                result = game.player1Attack(x, y);
                if (!result) {
                    updateStatus("❌ Invalid attack. Try again!");
                    return;
                }
            } else if (game.currentTurn === "player2") {
                result = game.player2Attack(x, y);
                if (!result) {
                    updateStatus("❌ Invalid attack. Try again!");
                    return;
                }
            } else {
                return;
            }
        } else {
            if (game.currentTurn !== "player") return;
            result = game.playerAttack(x, y);
            if (!result) {
                updateStatus("❌ Invalid attack. Try again!");
                return;
            }
        }
        
        renderGameBoards();
        
        if (result === "player-wins" || result === "player1-wins") {
            updateStatus("🎉🎉🎉 VICTORY! All enemy ships have been sunk! 🎉🎉🎉");
            return;
        }
        
        if (result === "player2-wins") {
            updateStatus("🎉🎉🎉 Player 2 Wins! All Player 1's ships have been sunk! 🎉🎉🎉");
            return;
        }
        
        // Show attack result
        if (result === "hit") {
            if (game.gameMode === "twoPlayer") {
                const currentPlayer = game.currentTurn === "player1" ? "Player 1" : "Player 2";
                updateStatus(`💥 ${currentPlayer} hit! Switching turns...`);
                setTimeout(() => {
                    const nextPlayer = game.currentTurn === "player1" ? "Player 1" : "Player 2";
                    updateStatus(`🎯 ${nextPlayer}'s turn! Click on the opponent's board to attack.`);
                }, 1000);
            } else {
                updateStatus("💥 Direct hit! Enemy ship damaged! Computer is attacking...");
                // Computer turn
                setTimeout(() => {
                    const compResult = game.computerAttack();
                    renderGameBoards();
                    if (compResult === "computer-wins") {
                        updateStatus("💀 Defeat! All your ships have been sunk. Better luck next time!");
                    } else if (compResult === "hit") {
                        updateStatus("💥 Enemy hit your ship! Your turn - strike back!");
                    } else {
                        updateStatus("🌊 Enemy missed! Your turn - choose your target!");
                    }
                }, 1000);
            }
        } else {
            if (game.gameMode === "twoPlayer") {
                const currentPlayer = game.currentTurn === "player1" ? "Player 1" : "Player 2";
                updateStatus(`🌊 ${currentPlayer} missed! Switching turns...`);
                setTimeout(() => {
                    const nextPlayer = game.currentTurn === "player1" ? "Player 1" : "Player 2";
                    updateStatus(`🎯 ${nextPlayer}'s turn! Click on the opponent's board to attack.`);
                }, 1000);
            } else {
                updateStatus("🌊 Miss! The shot splashed into the water. Computer is attacking...");
                // Computer turn
                setTimeout(() => {
                    const compResult = game.computerAttack();
                    renderGameBoards();
                    if (compResult === "computer-wins") {
                        updateStatus("💀 Defeat! All your ships have been sunk. Better luck next time!");
                    } else if (compResult === "hit") {
                        updateStatus("💥 Enemy hit your ship! Your turn - strike back!");
                    } else {
                        updateStatus("🌊 Enemy missed! Your turn - choose your target!");
                    }
                }, 1000);
            }
        }
    });

    function updateStatus(message) {
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // Initialize status message
    updateStatus("Choose a game mode to start playing!");
}
