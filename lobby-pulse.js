// Code for periodic checking of the current game players to populate list in lobby

var gid = document.getElementById("gid").innerHTML;

// Call the function "isGameStarted" every 5000ms or 5s
var pingInterval = setInterval(isGameStarted, 5000);

// Check if the game is started. If it isn't, get the current list of players waiting
function isGameStarted() {
	var jsonBody = {};
	jsonBody["gid"] = gid;
	var jsonCall = {};
	jsonCall["method"] = "POST";
	jsonCall["body"] = JSON.stringify(jsonBody);
	console.log(jsonCall);
	var request = new Request("serverside/lobby-pulse.php", jsonCall);

	fetch(request)
		.then(response => response.text())
		.then(response => {
			console.debug(response);
			if (response == "playing") {
				window.location.replace("gameplay.php?gid=" + gid + "&round=0&name=" + window.name);
			}
			else {
				printNameList(response.split(","));
			}
		});
}

// Print the list of currently-waiting players
function printNameList(names) {
	var list = "";
	for (let i = 0; i < names.length; i++) {
		list += names[i] + "<br>";
	}
	document.getElementById("nameList").innerHTML = list;
}
