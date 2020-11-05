<?php

include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, $_GET["gid"]);
$round = mysqli_real_escape_string($link, $_GET["round"]);

// Ping the database to check if all players are finished for this round
$result = mysqli_query($link, "SELECT Status FROM roundstatus WHERE GameID = '".$gameID . "' AND Round = ".$round);
include("close-database-connection.php");
//go through each player's submission
$status = mysqli_fetch_row($result)[0];

echo $status;
?>