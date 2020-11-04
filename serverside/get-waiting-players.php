<?php
$result = mysqli_query($link, "SELECT name FROM WaitingPlayers WHERE GameID='" . $gameID . "' ORDER BY name");
?>