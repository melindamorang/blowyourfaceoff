<?php

include("database-connection.php");
include("refresh-rates.php");

$request_body = file_get_contents('php://input');

$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);
$name = mysqli_real_escape_string($link, json_decode($request_body,true)["name"]);
$round = mysqli_real_escape_string($link, json_decode($request_body,true)["round"]);
$data = mysqli_real_escape_string($link, json_decode($request_body,true)["data"]);

/////////////////////////////////////////////////
// Save file here, then set $data = filepath
/////////////////////////////////////////////////

mysqli_query($link,"UPDATE game_data SET ImgRef = '".$data."' WHERE GameID = ".$gameID." AND Round = ".$round." AND Player = '".$name."'");

// This part pings the database until it shows that all players are finished for this round
$isDone = false;
while(!$isDone){
    $isDone = true;
    //Get all data for this round on this game
	$result = mysqli_query($link, "SELECT ImgRef FROM game_data WHERE Round = ".$round." AND GameID = ".$gameID);
	
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
	// Wait a bit, then try again
	sleep($gameplayRefresh);
}

echo "Done";