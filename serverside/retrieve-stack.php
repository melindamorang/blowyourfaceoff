<?php

if ($nameQuery == "") echo "<p>Click one of the names above to view the player's stack.</p>";
else {
    echo "<p class=\"playerNameEnd\">" . $nameDisplay . "'s Stack</p>";

    // Get the full set of text and drawings for this player
    include("open-database-connection.php");
    $result2 = mysqli_query($link, "SELECT Round,ImgRef,Player FROM game_data WHERE GameID = '" . $gidQuery . "' AND StackOwner = '" . $nameQuery . "'");
    include("close-database-connection.php");

    while ($row = mysqli_fetch_assoc($result2)) {
        $data = htmlspecialchars($row["ImgRef"]);
        $round = htmlspecialchars($row["Round"]);
        $player = htmlspecialchars($row["Player"]);
		$sizeClass = "";
        if(intval($round) != 0){
            echo '<p class="endgamePlayer">From ' . $player . ':</p>';
        } else {
            echo '<p class="endgamePlayer">Start:</p>';
        }
        if (intval($round) % 2 == 0) {
			if (strlen($data) > 180){ $sizeClass = " longtext"; }
            echo '<div class="endgameTextCanvas"><p class="endgameText' . $sizeClass . '">' . $data . '</p></div>';
        } else {
            echo '<img class="endgameDrawing" src="' . $data . '" />';
        }
    }
}
?>