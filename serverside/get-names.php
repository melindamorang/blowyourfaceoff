<?php

include("database-connection.php");

$request_body = file_get_contents('php://input');

$gameID = json_decode($request_body,true)["gid"];

$result = mysqli_query($link,"SELECT name FROM WaitingPlayers WHERE gid=".$gameID);

//Initialize the name list using the first name
$row = mysqli_fetch_assoc($result);
$nameList = $row["name"];

//Add ',Name' for every other person
while($row = mysqli_fetch_assoc($result)){
	$nameList .= ",".$row["name"];
}

echo $nameList

?>