// Contains basic javascript for showing and hiding elements in the lobby and handling
// actions for static elements.
// Code for checking players repeatedly until the host starts is in lobby-pulse.js
// HTML file must import shared-functions.js for this file to work.

document.addEventListener('DOMContentLoaded', function () {
	// When the page first loads, show contents for host or player.
	var isHost = document.getElementById("isHost").innerHTML;
	var hostArea = document.getElementById("hostArea");
	var playerArea = document.getElementById("playerArea");
	if (isHost === "true") {
		showHideElement(hostArea, true);
		showHideElement(playerArea, false);
	}
	else {
		showHideElement(hostArea, false);
		showHideElement(playerArea, true);
	}
});

function startGame() {
	var gid = document.getElementById("gid").innerHTML;
	var request = new Request("serverside/create-gameplay-tables.php", { method: "POST", body: '{"gid":"' + gid + '"}' });

	fetch(request)
		.then(response => response.text())
		.then(response => {
			if (response == "Bad number of players") {
				addError("The game has too many or too few players.")
			}
			else {
				window.location.replace("gameplay.php?gid=" + gid + "&round=0&name=" + window.name);
			}
		});
}
