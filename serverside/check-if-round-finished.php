<?php

$request_body = file_get_contents('php://input');

$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);
$round = mysqli_real_escape_string($link, json_decode($request_body,true)["round"]);

// Ping the database to check if all players are finished for this round
$isDone = true;
//Get all data for this round on this game
$result = mysqli_query($link, "SELECT ImgRef FROM game_data WHERE GameID = '".$gameID . "' AND Round = ".$round);
//go through each player's submission
while($row = mysqli_fetch_assoc($result)){
	// If any of them are still null, the data isn't yet submitted, so we're not done with the round.
	// Keep trying.
	$data = $row["ImgRef"];
	if ($data=== NULL) {
		// Not done. Break the loop and try again in a bit.
		$isDone = false;
		break;
	}
}

if ($isDone) echo "Done";
else echo "Not done";
?>