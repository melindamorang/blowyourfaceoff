<?php

include("database-connection.php");

$gameID = mysqli_real_escape_string($link, $_GET["gid"]);

$result = mysqli_query($link,"SELECT status FROM GameStatus WHERE gid='".$gameID . "'");

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

mysqli_close($link);

echo $nameList;

?>