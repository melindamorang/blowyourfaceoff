<?php

include("array-edit-functions.php");
include("player-limits.php");

$request_body = file_get_contents('php://input');

$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);

////////////////////////////////////////
// Get all of the players into an array
////////////////////////////////////////

// Use shared function to get waiting players. Retured as $result.
include("get-waiting-players.php");

// Check if the number of players is inappropriate
// Note: The upper limit is also checked in join-game.php when each player tries to join.
$numPlayers = mysqli_num_rows($result);
if ($numPlayers < $minPlayers || $numPlayers > $maxPlayers) {
    echo "Bad number of players";
} else {

    // Get list of player names for this game
    $nameList = array();
    while($row = mysqli_fetch_assoc($result)){
        $nameList[] = mysqli_real_escape_string($link, $row["name"]);
    }
    // Shuffle the ordering of the player names. This will now be the game rotation order.
    shuffle($nameList);

    /////////////////////////////////////////////////////////////
    // Fill the gameplay table
    /////////////////////////////////////////////////////////////
    $dataSQL = "INSERT INTO game_data (GameID,Round,Player,StackOwner,PlayerOrder) VALUES ";
    $roundCount = count($nameList);

    for($round = 0; $round < $roundCount; $round++){
        for($playerIdx = 0; $playerIdx < $roundCount; $playerIdx++) {
            // The stack owner for the current player and current round is a cyclic permutation, incrementing once each round.
            $stackOwnerIdx = getValidIndex($playerIdx - $round, $roundCount);
            // Construct the insert statement
            $dataSQL .= "('".$gameID."',".$round.",'".$nameList[$playerIdx]."','".$nameList[$stackOwnerIdx]."'," . $playerIdx .")";
            if(!($playerIdx == $roundCount-1 && $round == $roundCount-1)){
                $dataSQL .= ",";
            }
        }
    }

    mysqli_query($link,$dataSQL);

    ////////////////////////////////////////////////////////////////////////////
    // Go change the game status and remove the players from "waitingPlayers"
    ////////////////////////////////////////////////////////////////////////////

    mysqli_query($link,"UPDATE GameStatus SET status = 'playing' WHERE gid = '".$gameID . "'");

    mysqli_query($link,"DELETE FROM WaitingPlayers WHERE gid = '".$gameID . "'");

    echo "Game Started";
}
?>