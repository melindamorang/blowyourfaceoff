// Code for periodic checking of the current game players to populate list in lobby

var gid = document.getElementById("gid").innerHTML;

// Call the function "isGameStarted" every 5000ms or 5s
var pingInterval = setInterval(isGameStarted, 5000);

// Check if the game is started. If it isn't, get the current list of players waiting
function isGameStarted(){
	var request = new Request("serverside/lobby-pulse.php",{method:"POST",body:'{"gid":"'+gid+'"}'});

	fetch(request)
	.then(response => response.text())
	.then(response =>{
		console.debug(response);
		if(response == "playing"){
			window.location.replace("gameplay.php?gid="+gid);
		}
		else{
			printNameList(response.split(","));
		}
	});
}

// Print the list of currently-waiting players
function printNameList(names){
    var list = "";
	for(let i = 0; i < names.length; i++){
		list += names[i]+"<br>";
	}
	document.getElementById("nameList").innerHTML = list;
}
