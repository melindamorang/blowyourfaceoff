<?php
$result = mysqli_query($link, "SELECT name FROM WaitingPlayers WHERE gid='" . $gameID . "'");
?>