<?php
// This special check should only be hit if the timer runs out and the user's submission is empty. In some weird cases,
// The player might have managed to submit from a different tab and then leave the original tab open, so the timer runs out.
// Check to see in that special case if the database already has something in it. On the javascript side, we won't inject
// auto-generated stuff if that's the case.
include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, $_GET["gid"]);
$player = mysqli_real_escape_string($link, $_GET["name"]);  // current player
$round = mysqli_real_escape_string($link, $_GET["round"]);  // current round

$result = mysqli_query($link, "SELECT COUNT(IFNULL(ImgRef)) ImgRef AS num FROM game_data WHERE GameID = '".$gameID."' AND Round = ".strval(intval($round))." AND StackOwner = '".$player."' AND ImgRef IS NULL");
include("close-database-connection.php");

// Otherwise, continue the game and start the next round
$row = mysqli_fetch_assoc($result);
$numNulls = $row[0];
echo $numNulls;

?>