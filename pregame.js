// HTML file must import shared-functions.js for this file to work.

document.addEventListener('DOMContentLoaded', function () {
	initialButtons = document.getElementById("initialEntry");
	nameEntryForm = document.getElementById("startGameForm");
	hostEntry = document.getElementById("forHost");
	playerEntry = document.getElementById("forPlayer");
	nameEdit = document.getElementById("playerName");
	gidEdit = document.getElementById("gid");
	setInitialState();
});

// Set the page to its initial state.
// Show the Host Game / Join Game buttons and hide the input form where
// the host/player enters their name and joins the game
function setInitialState() {
	showHideElement(initialButtons, true);
	showHideElement(nameEntryForm, false);
	showHideElement(hostEntry, false);
	showHideElement(playerEntry, false);
	nameEdit.value = "";
	gidEdit.value = "";
}

// Show the elements appropriate for the Host for entering game start info
function showHostEntry() {
	showNameEntry();
	showHideElement(hostEntry, true);
}

// Show the elements appropriate for the Player for entering game start info
function showPlayerEntry() {
	showNameEntry()
	showHideElement(playerEntry, true);
}

// Show the name entry form shared by both Host and Player to collect info before starting/joining game
// Also hide the initial Join Game / Host Game buttons since those have already been used.
function showNameEntry() {
	showHideElement(initialButtons, false);
	showHideElement(nameEntryForm, true);
}

// Get the player name from the input control
function getPlayerName() {
	var name = nameEdit.value;
	if (name === "") addError("Enter a valid name.");
	return name;
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
