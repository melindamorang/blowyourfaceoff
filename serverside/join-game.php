<?php

include("player-limits.php");

$request_body = file_get_contents('php://input');

include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);
$name   = mysqli_real_escape_string($link, json_decode($request_body,true)["name"]);

// Pull the records for this Game ID
// Do some validation, and if everything is good, enter the player into the waiting players table
// Try to grab the game status
$result = mysqli_query($link, "SELECT status FROM GameStatus WHERE GameID='" . $gameID . "'");
// Check if the Game ID even exists
if(mysqli_num_rows($result)==0){
	echo "Bad Game ID";
} else {
	// Check if the status is 0 (not yet started) 
	$row = mysqli_fetch_assoc($result);
	$gameStatus = $row["status"];
	if($gameStatus != 0){
		echo "Bad Game Status";
	} else {
		// Check if game already has a waiting player with the same name
		$result = mysqli_query($link,"SELECT name FROM WaitingPlayers WHERE GameID='".$gameID."' AND name='".$name."'");
		// If we got a result, then another player with the same name already exists in that game
		if (mysqli_num_rows($result)!=0) {
			echo "Name Taken";
		}
		else {
			// Check if game is full
			include("get-waiting-players.php");
			if (mysqli_num_rows($result) >= $maxPlayers) {
				echo "Game Full";
			}
			else {
				// Finally everything worked out and we can start the game.
				// Add them to the waiting players list
				mysqli_query($link,"INSERT INTO WaitingPlayers VALUES ('".$gameID."','".$name."','FALSE')");
				echo "Success";
			}
		}
	}
}
include("close-database-connection.php");
?>