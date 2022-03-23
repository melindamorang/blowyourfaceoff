<?php
include("open-database-connection.php");
$searchText = mysqli_real_escape_string($link, $_GET["searchText"]);
// TODO: Figure out how to return only distinct GameID/StackOwner combinations.
// Can't use DISTINCT because we only want it to apply to GameID/StackOwner and not ImgRef.
// DISTINCT ON (GameID, StackOwner) is not supported on our flavor of SQL.
$result = mysqli_query($link, "SELECT GameID, StackOwner, ImgRef FROM game_data WHERE ImgRef LIKE '%" . $searchText . "%' ORDER BY GameID, StackOwner");
include("close-database-connection.php");

if(mysqli_num_rows($result)==0){
    echo "<p>No results found.<p>";
} else {
    echo "<ul>";
    while ($row = mysqli_fetch_assoc($result)) {
        $data = htmlspecialchars($row["ImgRef"]);
        $gid = htmlspecialchars($row["GameID"]);
        $owner = htmlspecialchars($row["StackOwner"]);

        $url = "./endgame.php?gid=" . $gid . "&name=" . $owner;
        echo '<li><a href="' . $url . '" target="_blank" rel="noopener">' . $data . ' (Game ID ' . $gid . ', ' . $owner . '\'s stack)</a></li>';
    }
    echo "</ul>";
}

?>