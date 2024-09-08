var players = JSON.parse(localStorage.getItem("players")) || [];
var numberOfPlayers = players.length;

function Player(name, points, wins, losses) {
    this.name = name;
    this.points = points;
    this.wins = wins;
    this.losses = losses;
}

// Add players if localStorage is empty
if (players.length === 0) {
    var player1 = new Player("Sarath", 0, 0, 0);
    players.push(player1, player2);
    localStorage.setItem("players", JSON.stringify(players));
    numberOfPlayers = players.length;
}

function addPlayer() {
    let name = window.prompt("Enter player name");
    let player = new Player(name, 0, 0, 0);
    players.push(player);
    localStorage.setItem("players", JSON.stringify(players));  // Save to localStorage
    numberOfPlayers = players.length;
    buildtable(players);  // Update table
}

function buildtable(data) {
    var table = document.getElementById("table-body");
    table.innerHTML = "";  // Clear table before adding rows

    for(var i = 0; i < data.length; i++) {
        if (data[i].name != null && data[i].name != "") {
        var row = "<tr><td>" + data[i].name + "</td><td>" + data[i].points + "</td><td>" + data[i].wins + "</td><td>" + data[i].losses + "</td></tr>";
        table.innerHTML += row;
        }
    }
}

/*function updatePlayer(name, points, wins, losses) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].name === name) {
            players[i].points += points;
            players[i].wins += wins;
            players[i].losses += losses;
            localStorage.setItem("players", JSON.stringify(players));  // Save to localStorage
            buildtable(players);  // Update table
            return;
        }
    }
}*/

function deletePlayer() {
    let name = window.prompt("Enter player name");
    for (var i = 0; i < players.length; i++) {
        if (players[i].name === name) {
            players.splice(i, 1);
            localStorage.setItem("players", JSON.stringify(players));  // Save to localStorage
            buildtable(players);  // Update table
            return;
        }
    }
}

// Initialize table when the page loads
window.onload = function() {
    buildtable(players);
}

function handleImageClick() {
    addPlayer();
}