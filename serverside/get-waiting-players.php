<?php
$result = mysqli_query($link, "SELECT name FROM waitingplayers WHERE GameID='" . $gameID . "' ORDER BY name");
?>