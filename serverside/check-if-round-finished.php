<?php

$request_body = file_get_contents('php://input');

include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);
$round = mysqli_real_escape_string($link, json_decode($request_body,true)["round"]);

// Ping the database to check if all players are finished for this round
$result = mysqli_query($link, "SELECT Status FROM roundstatus WHERE GameID = '".$gameID . "' AND Round = ".$round);
include("close-database-connection.php");
//go through each player's submission
$status = mysqli_fetch_row($result)[0];

echo $status;
?>