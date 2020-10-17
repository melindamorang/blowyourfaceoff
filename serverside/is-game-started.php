<?php

include("database-connection.php");

$request_body = file_get_contents('php://input');

$gameID = json_decode($request_body,true)["gid"];

$result = mysqli_query($link,"SELECT status FROM GameStatus WHERE gid=".$gameID);

$row = mysqli_fetch_assoc($result);
$gameStatus = $row["status"];

return $gameStatus;

?>