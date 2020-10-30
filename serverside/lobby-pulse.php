<?php

include("database-connection.php");

$request_body = file_get_contents('php://input');

$gameID = mysqli_real_escape_string($link, json_decode($request_body,true)["gid"]);

$result = mysqli_query($link,"SELECT status FROM GameStatus WHERE gid=".$gameID);

$row = mysqli_fetch_assoc($result);
$gameStatus = $row["status"];

if($gameStatus == "playing"){
    echo "playing";
}

// Get waiting players using shared code snippet
include("get-waiting-players.php");

$nameList = "";
while($row = mysqli_fetch_assoc($result)){
        $nameList .= $row["name"] . ",";
    }
$nameList = htmlspecialchars(rtrim($nameList, ","));

echo $nameList;

?>