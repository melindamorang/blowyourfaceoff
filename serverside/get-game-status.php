<?php
include("open-database-connection.php");
$gameID = mysqli_real_escape_string($link, $_GET["gid"]);
$result = mysqli_query($link, "SELECT status FROM gamestatus WHERE GameID='" . $gameID . "'");
include("close-database-connection.php");

if(mysqli_num_rows($result)==0){
    echo "Bad Game ID";
} else {
	$row = mysqli_fetch_assoc($result);
    $gameStatus = $row["status"];
    echo $gameStatus;
}
?>