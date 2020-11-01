<?php
$request_body = file_get_contents('php://input');

include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);
$name = mysqli_real_escape_string($link, json_decode($request_body,true)["name"]);
$round = mysqli_real_escape_string($link, json_decode($request_body,true)["round"]);
$data = mysqli_real_escape_string($link, json_decode($request_body,true)["data"]);

mysqli_query($link,"UPDATE game_data SET ImgRef = '".$data."' WHERE GameID = '".$gameID."' AND Round = ".$round." AND Player = '".$name."'");
include("close-database-connection.php");

echo "Done";
?>