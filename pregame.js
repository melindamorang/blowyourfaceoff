// HTML file must import shared-functions.js for this file to work.

document.addEventListener('DOMContentLoaded', function () {
	initialButtons = document.getElementById("initialEntry");
	newGameArea = document.getElementById("newGameEntry");
	priorGameArea = document.getElementById("priorGameEntry");
	nameEntryForm = document.getElementById("startGameForm");
	hostEntry = document.getElementById("forHost");
	playerEntry = document.getElementById("forPlayer");
	nameEdit = document.getElementById("playerName");
	gidEdit = document.getElementById("gid");
	timeLimitEdit = document.getElementById("timeLimit");
	priorGameEdit = document.getElementById("gid2");
	setInitialState();
});

// Set the page to its initial state.
// Show the Host Game / Join Game buttons and hide the input form where
// the host/player enters their name and joins the game
function setInitialState() {
	showHideElement(newGameArea, false);
	showHideElement(priorGameArea, false);
	showHideElement(initialButtons, true);
	showHideElement(nameEntryForm, false);
	showHideElement(hostEntry, false);
	showHideElement(playerEntry, false);
	nameEdit.value = "";
	gidEdit.value = "";
	timeLimitEdit.value = 3; // Default to a 3-minute time limit for each round.
	priorGameEdit.value = "";
}

// Show the elements appropriate for the Host for entering game start info
function showHostEntry() {
	showNameEntry();
	showHideElement(newGameArea, true);
	showHideElement(hostEntry, true);
}

// Show the elements appropriate for the Player for entering game start info
function showPlayerEntry() {
	showNameEntry();
	showHideElement(newGameArea, true);
	showHideElement(playerEntry, true);
}

// Show the name entry form shared by both Host and Player to collect info before starting/joining game
// Also hide the initial Join Game / Host Game buttons since those have already been used.
function showNameEntry() {
	showHideElement(initialButtons, false);
	showHideElement(nameEntryForm, true);
}

// Show the prior game entry form
function showPriorGameEntry() {
	showNameEntry();
	showHideElement(priorGameArea, true);
}

// Get the player name from the input control
function getPlayerName() {
	var name = nameEdit.value;
	if (name === "") addError("Enter a valid name.");
	return name;
}

// Get the time limit from the input control and return the value in seconds
function getTimeLimit() {
	var timeLimitMinutes = parseFloat(timeLimitEdit.value);
	if (isNaN(timeLimitMinutes) || timeLimitMinutes === null) return null;
	if (timeLimitMinutes < 0.25 || timeLimitMinutes > 30) {
		addError("Time limit must be greater than 15 seconds and less than 30 minutes.");
		return "invalid";
	}
	return timeLimitMinutes * 60.0;
}

// Go to the lobby page for this game ID and set the player name
function goToLobby(gid, name, isHost) {
	window.name = name;
	window.location.replace("lobby.php?gid=" + gid + "&isHost=" + isHost.toString());
}

// Attempt to join an existing game. Do some validation to make sure the game is valid
function tryJoin() {
	// Build a request with the game ID in it
	var gid = gidEdit.value;
	if (gid === "") {
		addError("Enter a valid Game ID.");
		return;
	}
	var name = getPlayerName();
	if (name === "") return;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.debug(xhttp.responseText);
			//If the game exists and is not started, responds with "Success". Go to the lobby page
			if (xhttp.responseText == "Success") {
				goToLobby(gid, name, false);
			}
			//Otherwise, tell the user that they're is something wrong
			else if (xhttp.responseText == "Bad Game ID") {
				addError("That game does not exist. Double check that the Game ID is correct.");
			}
			else if (xhttp.responseText == "Bad Game Status") {
				addError("The game with this ID is already in progress or has finished.");
			}
			else if (xhttp.responseText == "Name Taken") {
				addError("That name is already taken for this game. Try another name.");
			}
			else if (xhttp.responseText == "Game Full") {
				addError("This game is full and cannot accommodate any more players.");
			}
			else {
				addError("Server Error. " + xhttp.responseText);
			}
		}
	};
	xhttp.open("POST", "serverside/join-game.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	var jsonBody = {};
	jsonBody["gid"] = gid;
	jsonBody["name"] = name;
	xhttp.send(JSON.stringify(jsonBody));
}

function startHost() {
	var name = getPlayerName();
	if (name === "") return;

	var timeLimitSeconds = getTimeLimit();
	if (timeLimitSeconds == "invalid") return;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.debug(xhttp.responseText);
			console.debug(name);
			goToLobby(xhttp.responseText, name, true);
		}
	};
	xhttp.open("POST", "serverside/create-game.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	var jsonBody = {};
	jsonBody["name"] = name;
	jsonBody["timeLimit"] = timeLimitSeconds;
	console.debug(jsonBody);
	xhttp.send(JSON.stringify(jsonBody));
}

function tryPriorGame() {
	var gid = priorGameEdit.value;
	if (gid === "") {
		addError("Enter a valid Game ID.");
		return;
	}

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.debug(xhttp.responseText);
			if (xhttp.responseText == "Bad Game ID") {
				addError("That game does not exist. Double check that the Game ID is correct.");
			}
			else if (xhttp.responseText == "0" || xhttp.responseText == "1") {
				addError("The game with this ID has not yet finished.");
			}
			else if (xhttp.responseText == "2") {
				window.location.replace("endgame.php?gid=" + gid);
			}
			else {
				addError("Server Error. " + xhttp.responseText);
			}
		}
	};
	xhttp.open("POST", "serverside/get-game-status.php?gid=" + gid, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send();
}