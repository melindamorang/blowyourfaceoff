<?php
// Simplified database connection function with prewritten ip, username, password, etc.
// Use dbQuery("SQL query as a string");
include("database-connection.php");

$request_body = file_get_contents('php://input');

$name = json_decode($request_body,true)["name"];

/*
Get a list of taken gameIDs from the game status table
Generate a random gameID
Iterate the gameID until you get a gameID that doesn't exist yet
Add game to gamestatus table with status "waiting"
Add the host and gameID to the waiting players table, this time with TRUE for isHost
Respond with the gid or an error
*/

$takenIDResult = mysqli_query($link,"SELECT * FROM GameStatus");
$takenIDs = [];

//Turn each "result row" into an array, and add the first column of each to takenIDs (the "gid" column)
while($row = mysqli_fetch_assoc($takenIDResult)){
	$takenIDs[] = $row["gid"];
}


$gid = rand(100000,999999);

while(in_array($gid,$takenIDs)){
	$gid += 1;
	if($gid>999999){
		$gid = 100000;
	}
}

//Add the new game to the gamestatus table
mysqli_query($link,"INSERT INTO GameStatus VALUES(".$gid.",'waiting')");

//Add the host to the waiting players table
mysqli_query($link,"INSERT INTO WaitingPlayers VALUES(".$gid.",'".$name."','TRUE')");

echo $gid;
?>