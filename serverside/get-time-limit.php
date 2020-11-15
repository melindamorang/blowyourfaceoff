<?php
include("open-database-connection.php");
$gidClean = mysqli_real_escape_string($link, $gid);
$result = mysqli_query($link, "SELECT TimeLimitSeconds FROM gamestatus WHERE GameID = '" . $gidClean . "'");
include("close-database-connection.php");
$timeLimit = mysqli_fetch_row($result)[0];
?>