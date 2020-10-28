<?php
include("database-connection.php");
$request_body = file_get_contents('php://input');

$result = mysqli_query($link, "SELECT DISTINCT Player FROM game_data WHERE GameID = " . $gid);
$numPlayers = mysqli_num_rows($result);
?>