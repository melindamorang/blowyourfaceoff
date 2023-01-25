<?php
include("open-database-connection.php");
$searchText = mysqli_real_escape_string($link, $_GET["searchText"]);
// There doesn't seem to be a good way to return only distinct GameID/StackOwner combinations.
// Can't use DISTINCT because we only want it to apply to GameID/StackOwner and not ImgRef.
// DISTINCT ON (GameID, StackOwner) is not supported on our flavor of SQL.
// Just grab them all and deal with it in post-processing.
//$result = mysqli_query($link, "SELECT GameID, StackOwner, ImgRef FROM game_data WHERE ImgRef LIKE '%" . $searchText . "%' ORDER BY GameID, StackOwner");
$result = mysqli_query($link, "SELECT GameID, StackOwner, ImgRef FROM game_data WHERE MATCH(ImgRef) AGAINST ('" . $searchText . "' IN NATURAL LANGUAGE MODE)");

if ($result) {
    if(mysqli_num_rows($result)==0){
        echo "<p>No results found for \"" . $searchText . "\".<p>";
    }
    else {
        // For each result, construct a URL to its associated stack and create an li with the stack text
        $liStrings = array();
        $currentGameID = "";
        $currentStackOwner = "";
        while($row = mysqli_fetch_assoc($result)){
            $data = htmlspecialchars($row["ImgRef"]);
            $gid = htmlspecialchars($row["GameID"]);
            $owner = htmlspecialchars($row["StackOwner"]);
            if ($gid == $currentGameID && $owner == $currentStackOwner) {
                // Don't print this line because it's from the same stack as the last retrieved result
                continue;
            }
            if (str_starts_with($data, "data:image/png;base64")) {
                // Weed out erroneous results from the text strings defining drawings
                continue;
            }
            $url = "./endgame.php?gid=" . $gid . "&name=" . $owner;
            $liStrings[] = '<li><a href="' . $url . '" target="_blank" rel="noopener">' . $data . ' (Game ID ' . $gid . ', ' . $owner . '\'s stack)</a></li>';
            $currentGameID = $gid;
            $currentStackOwner = $owner;
        }

        $numResults = count($liStrings);
        if ($numResults == 1){
            echo "<p>" . $numResults . " result found.<p>";
        } else {
            echo "<p>" . $numResults . " results found.<p>";
        }

        // Create a ul and print links to the stacks
        echo "<ul>";
        foreach ($liStrings as $li) {
            echo $li;
        }
        echo "</ul>";
    }
}
else {
    echo "<p>Error querying database: " . mysqli_error($link) . "</p>";
}

include("close-database-connection.php");

?>