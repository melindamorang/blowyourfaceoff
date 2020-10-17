<?php

include("database-connection.php");
include("array-edit-functions.php");
include("player-limits.php");

$request_body = file_get_contents('php://input');

$gameID = json_decode($request_body,true)["gid"];

////////////////////////////////////////
// Get all of the players into an array
////////////////////////////////////////

// Use shared function to get waiting players
include("get-waiting-players.php");
//$result = mysqli_query($link,"SELECT name FROM WaitingPlayers WHERE gid=".$gameID);

// Check if the number of players is inappropriate
// Note: The upper limit is also checked in join-game.php when each player tries to join.
$numPlayers = mysqli_num_rows($result);
if ($numPlayers < $minPlayers || $numPlayers > $maxPlayers) {
    echo "Bad number of players";
} else {

    //Initialize the name list
    $nameList = array();

    //Push each name onto the list
    while($row = mysqli_fetch_assoc($result)){
        $nameList[] = $row["name"];
    }

    /////////////////////////////////////////////////////////////
    // Fill the gameplay table with whose work you're supposed to use
    /////////////////////////////////////////////////////////////
    $dataSQL = "INSERT INTO game_data VALUES ";
    $roundCount = count($nameList);
    $rotatedNames = rotateArray($nameList,1); //Shifts the array over by 1 person, that way it represents "the person next to you", or the one you'll get your next card from

    for($i = 1; $i <= $roundCount; $i++){
        for($j=0;$j<$roundCount;$j++){
            // $i is the current round, $j is a temporary index for each name
            $dataSQL .= "(".$gameID.",".$i.",'".$nameList[$j]."','".$rotatedNames[$j]."')";
            if(!($j == $roundCount-1 && $i == $roundCount)){
                $dataSQL .= ",";
            }
        }
        
    }

    mysqli_query($link,$dataSQL);

    ////////////////////////////////////////////////////////////////////////////
    // Go change the game status and remove the players from "waitingPlayers"
    ////////////////////////////////////////////////////////////////////////////

    mysqli_query($link,"UPDATE GameStatus SET status = 'playing' WHERE gid = ".$gameID);

    mysqli_query($link,"DELETE FROM WaitingPlayers WHERE gid = ".$gameID);

    echo "Game Started";
}
?>