<?php
// Simplified database connection function with prewritten ip, username, password, etc.
// Use dbQuery("SQL query as a string");
include("database-connection.php");

$request_body = file_get_contents('php://input');

$name = mysqli_real_escape_string($link, json_decode($request_body,true)["name"]);

// Generate a 13-character-long unique ID
$gid = uniqid();

// Be sure this ID isn't taken by searching the GameStatus table for it
$gidTaken = true;
while ($gidTaken) {
	$takenIDResult = mysqli_query($link, "SELECT * FROM GameStatus WHERE gid='" . $gid . "'");
	if (mysqli_num_rows($takenIDResult) == 0) $gidTaken = false;
	// In the unlikely even that it was already taken, try again
	else $gid = uniqid();
}

//Add the new game to the gamestatus table
mysqli_query($link,"INSERT INTO GameStatus VALUES('".$gid."','waiting')");

//Add the host to the waiting players table
mysqli_query($link,"INSERT INTO WaitingPlayers VALUES('".$gid."','".$name."','TRUE')");

echo $gid;
?>