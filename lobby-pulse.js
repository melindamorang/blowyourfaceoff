// Code for periodic checking of the current game players to populate list in lobby

var gid = document.getElementById("gid").innerHTML;

// Call the function "isGameStarted" every 5000ms or 5s
var pingInterval = setInterval(isGameStarted, 5000);

// Check if the game is started. If it isn't, get the current list of players waiting
function isGameStarted() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			//document.getElementById("demo").innerHTML = xhttp.responseText;
			console.debug(xhttp.responseText);
			if (xhttp.responseText === null) {
				addError("Error getting game status from server.");
			}
			else if (xhttp.responseText == "playing") {
				window.location.replace("gameplay.php?gid=" + gid + "&round=0&name=" + window.name);
			}
			else {
				printNameList(xhttp.responseText.split(","));
			}
		}
	};
	xhttp.open("GET", "serverside/lobby-pulse.php?gid=" + gid, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send();
}

// Print the list of currently-waiting players
function printNameList(names) {
	var list = "";
	for (let i = 0; i < names.length; i++) {
		list += names[i] + "<br>";
	}
	document.getElementById("nameList").innerHTML = list;
}
