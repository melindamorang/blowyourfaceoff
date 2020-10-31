// HTML file must import shared-functions.js for this file to work.

document.addEventListener('DOMContentLoaded', function () {
	// When the page first loads, show the Host Game / Join Game buttons
	// and hide the input form where the host/player enters their name
	// and joins the game
	var initialButtons = document.getElementById("initialEntry");
	showHideElement(initialButtons, true);
	var nameEntryForm = document.getElementById("startGameForm");
	showHideElement(nameEntryForm, false);
	var hostEntry = document.getElementById("forHost");
	showHideElement(hostEntry, false);
	var hostEntry = document.getElementById("forPlayer");
	showHideElement(hostEntry, false);
});

function showHostEntry() {
	// Show the elements appropriate for the Host for entering game start info
	showNameEntry()
	var hostEntry = document.getElementById("forHost");
	showHideElement(hostEntry, true);
}

function showPlayerEntry() {
	// Show the elements appropriate for the Player for entering game start info
	showNameEntry()
	var hostEntry = document.getElementById("forPlayer");
	showHideElement(hostEntry, true);
}

function showNameEntry() {
	// Show the name entry form shared by both Host and Player to collect info before starting/joining game
	// Also hide the initial Join Game / Host Game buttons since those have already been used.
	var initialButtons = document.getElementById("initialEntry");
	showHideElement(initialButtons, false);
	var nameEntryForm = document.getElementById("startGameForm");
	showHideElement(nameEntryForm, true);
}

function getPlayerName() {
	// Get the player name from the input control
	var name = document.getElementById("playerName").value;
	if (name === "") addError("Enter a valid name.");
	return name;
}

function goToLobby(gid, name, isHost) {
	// Go to the lobby page for this game ID and set the player name
	window.name = name;
	window.location.replace("lobby.php?gid=" + gid + "&isHost=" + isHost.toString());
}

function tryJoin() {
	// Attempt to join an existing game. Do some validation to make sure the game is valid
	// Build a request with the game ID in it
	var gid = document.getElementById("gid").value;
	if (gid === "") {
		addError("Enter a valid Game ID.");
		return;
	}
	var name = getPlayerName();
	if (name === "") return;

	var jsonBody = {};
	jsonBody["gid"] = gid;
	jsonBody["name"] = name;
	var jsonCall = {};
	jsonCall["method"] = "POST";
	jsonCall["body"] = JSON.stringify(jsonBody);
	console.log(jsonCall);
	const request = new Request("serverside/join-game.php", jsonCall);

	//Send the request
	fetch(request)
		.then(response => response.text())
		.then(response => {
			//If the game exists and is not started, responds with "Success". Go to the lobby page
			if (response == "Success") {
				goToLobby(gid, name, false);
			}
			//Otherwise, tell the user that they're is something wrong
			else if (response == "Bad Game ID") {
				addError("That game does not exist. Double check that the Game ID is correct.");
			}
			else if (response == "Bad Game Status") {
				addError("The game with this ID is already in progress or has finished.");
			}
			else if (response == "Name Taken") {
				addError("That name is already taken for this game. Try another name.");
			}
			else if (response == "Game Full") {
				addError("This game is full and cannot accommodate any more players.");
			}
			else {
				addError("Server Error. " + response);
			}
		})
		.catch(error => {
			console.error(error);
		});
}

function startHost() {
	var name = getPlayerName();
	if (name === "") return;

	// Construct JSON request call and make request
	var jsonBody = {};
	jsonBody["name"] = name;
	var jsonCall = {};
	jsonCall["method"] = "POST";
	jsonCall["body"] = JSON.stringify(jsonBody);
	console.log(jsonCall);
	const request = new Request("serverside/create-game.php", jsonCall);
	//Pings a serverside script to open a new lobby, and if it works, send the user there
	fetch(request)
		.then(response => response.text())
		.then(response => {
			console.log(response);
			goToLobby(response, name, true);
		})
		.catch(error => {
			console.log("Error creating game.");
			console.error(error);
		});
}
