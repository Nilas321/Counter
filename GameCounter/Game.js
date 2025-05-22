let selectedPlayers = [];
let totalScores = [];
let roundNumber = 1;

window.onload = function () {
    // Load saved game state if available
    const savedState = JSON.parse(localStorage.getItem("gameState"));

    if (savedState) {
        selectedPlayers = savedState.selectedPlayers || [];
        totalScores = savedState.totalScores || Array(selectedPlayers.length).fill(0);
        roundNumber = savedState.roundNumber || 1;
    } else {
        selectedPlayers = JSON.parse(localStorage.getItem("selectedPlayers")) || [];
        totalScores = Array(selectedPlayers.length).fill(0);
    }

    buildTable();
    updateTotalRow();
};

// Build the game table header + totals
function buildTable() {
    const table = document.getElementById("roundsTable");

    // Clear previous content if any
    table.innerHTML = "";

    // Header row
    const headerRow = table.insertRow();
    headerRow.insertCell(0).textContent = "Round";

    for (let player of selectedPlayers) {
        const cell = headerRow.insertCell();
        cell.textContent = player;
    }

    // Totals row
    const totalsRow = table.insertRow();
    totalsRow.id = "totalsRow";
    totalsRow.insertCell(0).textContent = "Total";

    for (let score of totalScores) {
        const cell = totalsRow.insertCell();
        cell.textContent = score;
    }
}

function updateTotalRow() {
    const totalsRow = document.getElementById("totalsRow");
    if (!totalsRow) return;

    for (let i = 0; i < totalScores.length; i++) {
        totalsRow.cells[i + 1].textContent = totalScores[i];
    }
}

function addRound() {
    const table = document.getElementById("roundsTable");
    const totalsRow = document.getElementById("totalsRow");

    const newRow = table.insertRow(totalsRow.rowIndex); // Insert before totals row
    const roundCell = newRow.insertCell(0);
    roundCell.textContent = roundNumber++;

    for (let i = 0; i < selectedPlayers.length; i++) {
        const score = prompt(`Enter score for ${selectedPlayers[i]}:`, "0");
        const scoreNum = parseInt(score) || 0;

        const cell = newRow.insertCell(i + 1);
        cell.textContent = scoreNum;

        totalScores[i] += scoreNum;
        totalsRow.cells[i + 1].textContent = totalScores[i];
    }

    // Save game state after each round
    localStorage.setItem("gameInProgress", "true");
    localStorage.setItem("gameState", JSON.stringify({
        selectedPlayers,
        totalScores,
        roundNumber
    }));
}

function endGame() {
    if (!selectedPlayers || selectedPlayers.length === 0) {
        alert("No players found!");
        return;
    }

    const minScore = Math.min(...totalScores);
    const maxScore = Math.max(...totalScores);

    const winnerIndexes = [];
    const loserIndexes = [];

    totalScores.forEach((score, i) => {
        if (score === minScore) winnerIndexes.push(i);
        if (score === maxScore) loserIndexes.push(i);
    });

    let draw = (winnerIndexes.length > 1 || loserIndexes.length > 1) && 
               JSON.stringify(winnerIndexes) === JSON.stringify(loserIndexes);

    let allPlayers = JSON.parse(localStorage.getItem("players")) || [];

    for (let i = 0; i < selectedPlayers.length; i++) {
        let playerName = selectedPlayers[i];
        let score = totalScores[i];

        for (let j = 0; j < allPlayers.length; j++) {
            if (allPlayers[j].name === playerName) {
                allPlayers[j].points += score;

                if (!draw) {
                    if (winnerIndexes.includes(i)) allPlayers[j].wins += 1;
                    if (loserIndexes.includes(i)) allPlayers[j].losses += 1;
                }

                break;
            }
        }
    }

    localStorage.setItem("players", JSON.stringify(allPlayers));
    localStorage.removeItem("gameState");
    localStorage.removeItem("gameInProgress");

    if (draw) {
        alert("Game Over! It was a draw. Points updated, no wins/losses given.");
    } else {
        alert("Game Over! Stats updated.");
    }

    window.location.href = "Players.html";
}

