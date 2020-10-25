<?php

include("database-connection.php");

$request_body = file_get_contents('php://input');

$gameID = json_decode($request_body,true)["gid"];
$player = json_decode($request_body,true)["player"];  // current player
$round = json_decode($request_body,true)["round"];  // current round

// First figure out whose stack to draw from
$result = mysqli_query($link, "SELECT StackOwner FROM game_data WHERE GameID = ".$gameID." AND Round = ".$round." AND Player = '".$player."'");
//If we didn't get a result on this SQL, that means something is wrong with the gameplay tables or we made an invalid query.
if(mysqli_num_rows($result)===0){
    echo "Bad request"; 
} else {
	// Otherwise, continue the game and start the next round
	$row = mysqli_fetch_assoc($result);
	$stackOwner = $row["StackOwner"];

    // Now grab the data from the stack owner from the previous round
    $result = mysqli_query($link, "SELECT ImgRef FROM game_data WHERE GameID = ".$gameID." AND Round = ".strval(intval($round-1))." AND StackOwner = '".$stackOwner."'");

    //If we didn't get a result on this SQL, that means something is wrong with the gameplay tables or we made an invalid query.
    if(mysqli_num_rows($result)===0){
        echo "Bad request"; 
    } else {
        // Otherwise, continue the game and start the next round
        $row = mysqli_fetch_assoc($result);
        $data = $row["ImgRef"];
        echo $data;
    }
}
?>