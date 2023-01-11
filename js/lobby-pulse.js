// Code for periodic checking of the current game players to populate list in lobby

var gid = document.getElementById("gid").innerHTML;

// Check if the game has started
isGameStarted();

// Check if the game is started. If it isn't, get the current list of players waiting
function isGameStarted() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		console.debug(this.readyState);
		console.debug(this.status);
		if (this.readyState == 4 && this.status == 200) {
			console.debug("Checking valid response text.");
			console.debug(xhttp.responseText);
			if (xhttp.responseText === null) {
				addError("Error getting game status from server.");
			}
			else if (xhttp.responseText == "playing") {
				window.location.replace("gameplay.php?gid=" + gid + "&round=0&name=" + window.name);
			}
			else {
				printNameList(JSON.parse(xhttp.responseText));
			}
		}
	};
	xhttp.open("GET", "serverside/lobby-pulse.php?gid=" + gid, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send();

	// If we got this far without redirecting, then either the game hasn't started or there was an error
    // Sleep for 5 seconds and then try again.
    setTimeout(isGameStarted, 5000);
}

// Print the list of currently-waiting players
function printNameList(names) {
	var list = "";
	for (let i = 0; i < names.length; i++) {
		list += names[i].name + "<br>";
	}
	document.getElementById("nameList").innerHTML = list;
}
