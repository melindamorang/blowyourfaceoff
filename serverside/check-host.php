<?php

include("database-connection.php");

$request_body = file_get_contents('php://input');

$gameID = json_decode($request_body,true)["gid"];
$name   = json_decode($request_body,true)["name"];

$result = mysqli_query($link,"SELECT isHost FROM WaitingPlayers WHERE gid=".$gameID." AND name='".$name."'");

$row = mysqli_fetch_assoc($result);
$isHost = $row["isHost"];

if($isHost == "TRUE"){
	echo "host";
}
else{
	echo "not host";
}
?>