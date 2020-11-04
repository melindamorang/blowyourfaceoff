<?php

include("array-edit-functions.php");
include("player-limits.php");

$request_body = file_get_contents('php://input');

include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);

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

    // Populate a table with a flag for the round status for each round of the game
    $roundSQL = "INSERT INTO roundstatus (GameID,Round,Status) VALUES ";
    for($round = 0; $round < $roundCount; $round++) {
        if ($round == 0) $status = 1;
        else $status = 0;
        $roundSQL .= "('" . $gameID . "'," . $round . "," . $status . ")";
        if ($round != $roundCount-1) $roundSQL .= ",";
    }
    mysqli_query($link,$roundSQL);

    include("close-database-connection.php");

    echo "Game Started";
}
?>