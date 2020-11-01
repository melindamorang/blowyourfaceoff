<?php
include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, $_GET["gid"]);
$player = mysqli_real_escape_string($link, $_GET["name"]);  // current player
$round = mysqli_real_escape_string($link, $_GET["round"]);  // current round

// First figure out whose stack to draw from
$result = mysqli_query($link, "SELECT StackOwner FROM game_data WHERE GameID = '".$gameID."' AND Round = ".$round." AND Player = '".$player."'");
include("close-database-connection.php");

//If we didn't get a result on this SQL, that means something is wrong with the gameplay tables or we made an invalid query.
if(mysqli_num_rows($result)===0){
    echo "Bad request"; 
} else {
	// Otherwise, continue the game and start the next round
	$row = mysqli_fetch_assoc($result);

    // Now grab the data from the stack owner from the previous round
    include("open-database-connection.php");
    $stackOwner = mysqli_real_escape_string($link, $row["StackOwner"]);
    $result = mysqli_query($link, "SELECT ImgRef FROM game_data WHERE GameID = '".$gameID."' AND Round = ".strval(intval($round-1))." AND StackOwner = '".$stackOwner."'");
    include("close-database-connection.php");

    //If we didn't get a result on this SQL, that means something is wrong with the gameplay tables or we made an invalid query.
    if(mysqli_num_rows($result)===0){
        echo "Bad request"; 
    } else {
        // Otherwise, continue the game and start the next round
        $row = mysqli_fetch_assoc($result);
        $data = $row["ImgRef"];
        echo htmlspecialchars($data);
    }
}
?>