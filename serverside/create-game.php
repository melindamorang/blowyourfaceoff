<?php

$request_body = file_get_contents('php://input');
$name = json_decode($request_body,true)["name"];

// Generate a 13-character-long unique ID
//$gid = uniqid();
// ^Don't do that anymore because everyone hated it.
// Generate a random number with no more than 6 digits
$gid = rand(0, 999999);

include("open-database-connection.php");
// Be sure this ID isn't taken by searching the gamestatus table for it
$gidTaken = true;
while ($gidTaken) {
	$takenIDResult = mysqli_query($link, "SELECT GameID FROM gamestatus WHERE GameID='" . $gid . "'");
	if (mysqli_num_rows($takenIDResult) == 0) $gidTaken = false;
	// In the unlikely even that it was already taken, try again
	else $gid = uniqid();
}

//Add the new game to the gamestatus table
mysqli_query($link,"INSERT INTO gamestatus VALUES('".$gid."',0)");

//Add the host to the waiting players table
$name = mysqli_real_escape_string($link, $name);
mysqli_query($link,"INSERT INTO waitingplayers VALUES('".$gid."','".$name."','TRUE')");

include("close-database-connection.php");

echo $gid;
?>