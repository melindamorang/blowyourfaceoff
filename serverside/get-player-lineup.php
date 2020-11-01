<?php
include("database-connection.php");
include("array-edit-functions.php");
$request_body = file_get_contents('php://input');

$gidClean =  mysqli_real_escape_string($link, $gid);
$roundClean = mysqli_real_escape_string($link, $round);

$result = mysqli_query($link, "SELECT Player FROM game_data WHERE GameID = '" . $gidClean . "' AND Round = " . $roundClean . " ORDER BY PlayerOrder");

$nameList = array();
while($row = mysqli_fetch_assoc($result)){
    $nameList[] = $row["Player"];
}
$numPlayers = count($nameList);
// Figure out the previous player and next player based on player array indexing
$currentPlayerIdx = array_search($name, $nameList);
$nextPlayerIdx = getValidIndex($currentPlayerIdx + 1, $numPlayers);
$previousPlayerIdx = getValidIndex($currentPlayerIdx - 1, $numPlayers);
$nextPlayer = htmlspecialchars($nameList[$nextPlayerIdx]);
$previousPlayer = htmlspecialchars($nameList[$previousPlayerIdx]);
mysqli_close($link);
?>