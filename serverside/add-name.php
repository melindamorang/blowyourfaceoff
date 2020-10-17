<?php
/*

This is no longer necessary, as name adding is no longer separate from joining the game

*/




// Simplified database connection function with prewritten ip, username, password, etc.
// Use dbQuery("SQL query as a string");
include("database-connection.php");


$request_body = file_get_contents('php://input');

$payload = json_decode($request_body,true);

$gameID = $payload["gid"];
$name = $payload["name"];

//Check existing names in that
$result = dbQuery("SELECT name FROM waitingplayers WHERE gameid=".$gameID.";");

while($row = fetch_assoc($result)){
	$nameList[] = $row["name"];
}
/* End goal of the database version:

Check the game status table to see if the status of the selected gameid is "waiting"

If so, check to see if that name isn't already under the waiting players table WHERE the gameid is the same

If all is well, add the name and gameID to the waiting players table with FALSE for IsHost

*/

?>