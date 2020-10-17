<?php

include("database-connection.php");

$request_body = file_get_contents('php://input');

$gameID = json_decode($request_body,true)["gid"];
$name   = json_decode($request_body,true)["name"];
$round  = json_decode($request_body,true)["round"];
$data   = json_decode($request_body,true)["data"];

/////////////////////////////////////////////////
// Save file here, then set $data = filepath
/////////////////////////////////////////////////

mysqli_query($link,"UPDATE game_data SET ImgRef = '".$data."' WHERE GameID = ".$gameID." AND Round = ".$round." AND Player = '".$name."'");

////////////////////////////////////////////
/**/ $startsWith = "data:image";
//   Change this to whatever your filepaths always start with. This is for testing whether the round is done, and to pass on the previous card
////////////////////////////////////////////

// This part pings the database until it shows that all players are finished for this round
$isDone = false;
while(!$isDone){
    $isDone = true;
    //Get all data for this round on this game
	$result = mysqli_query($link,"SELECT ImgRef FROM game_data WHERE Round = ".$round." AND GameID = ".$gameID);
	
	//go through each player's submission
	while($row = mysqli_fetch_assoc($result)){
	    //if any of them don't start with something that indicates an image, that's still a name and therefore their image isn't submitted
	    if(substr($row["ImgRef"],0,strlen($startsWith))!=$startsWith){
	        //If their image isn't submitted, we're not done. Break the loop and try again in a bit.
	        $isDone = false;
	        break;
	    }
	}
	// Wait 5 sec then try again
	sleep(5);
}

// Continue on to the next round
//Get the name of the person whose work you're grabbing
//The target's name will be in your column for the next round
$result = mysqli_query($link,"SELECT ImgRef FROM game_data WHERE GameID = ".$gameID." AND Player = '".$name."' AND Round = ".strval(intval($round+1)));

//If we didn't get a result on this SQL, that means that the WHERE round = <next round> failed.
//Therefore, the next round doesn't exist and the game's over
if(mysqli_num_rows($result)===0){
    mysqli_query($link,"UPDATE GameStatus SET status = 'finished' WHERE gid = ".$gameID);
    echo "Game's over"; 
} else {
	// Otherwise, continue the game and start the next round
	$row = mysqli_fetch_assoc($result);
	$targetName = $row["ImgRef"];

	//Use the target name to get the target's work from this round we are leaving
	$result = mysqli_query($link,"SELECT ImgRef FROM game_data WHERE GameID = ".$gameID." AND Player='".$targetName."' AND Round = ".$round);
	$row = mysqli_fetch_assoc($result);
	$dataURL = $row["ImgRef"];

	//////////////////////////////////////////////////////
	//Grab the file from the server, turn it into an image blob, then send it to the user
	/////////////////////////////////////////////////////
	$imgBlob = $dataURL;

	echo $imgBlob;
}
?>