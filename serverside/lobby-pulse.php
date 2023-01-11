<?php

include("open-database-connection.php");

$gameID = mysqli_real_escape_string($link, $_GET["gid"]);

$result = mysqli_query($link,"SELECT status FROM gamestatus WHERE GameID='".$gameID . "'");
include("close-database-connection.php");

$row = mysqli_fetch_assoc($result);
$gameStatus = $row["status"];

if($gameStatus == 1){
    echo "playing";
} elseif ($gameStatus == 0) {

    // Get waiting players using shared code snippet
    include("open-database-connection.php");
    include("get-waiting-players.php");
    include("close-database-connection.php");

    // fetch all results into an array and convert to json
    $nameList = array();
    while($row = mysqli_fetch_assoc($result)) $nameList[] = $row;
    $jsonData = json_encode($nameList); 

    echo $jsonData;

} else echo "Bad game status: " . $gameStatus;

?>