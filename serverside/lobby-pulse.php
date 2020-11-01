<?php

include("open-database-connection.php");

$gameID = mysqli_real_escape_string($link, $_GET["gid"]);

$result = mysqli_query($link,"SELECT status FROM GameStatus WHERE gid='".$gameID . "'");
include("close-database-connection.php");

$row = mysqli_fetch_assoc($result);
$gameStatus = $row["status"];

if($gameStatus == "playing"){
    echo "playing";
} elseif ($gameStatus == "waiting") {

    // Get waiting players using shared code snippet
    include("open-database-connection.php");
    include("get-waiting-players.php");
    include("close-database-connection.php");

    $nameList = "";
    while($row = mysqli_fetch_assoc($result)){
            $nameList .= $row["name"] . ",";
        }
    $nameList = htmlspecialchars(rtrim($nameList, ","));

    echo $nameList;
} else echo "Bad game status: " . $gameStatus;

?>