<?php

include("serverside/database-connection.php");
$request_body = file_get_contents('php://input');

$gid = mysqli_real_escape_string($link, $_GET["gid"]);
$name = mysqli_real_escape_string($link, $_GET["name"]);

// Get all player names for this game
$result1 = mysqli_query($link, "SELECT DISTINCT Player FROM game_data WHERE GameID = " . $gid);

// Get the full set of text and drawings for this player
$result2 = mysqli_query($link, "SELECT Round,ImgRef FROM game_data WHERE GameID = " . $gid . " AND StackOwner = '" . $name . "'");

?>

<html>

<head>
  <title>End game</title>
  <link rel="stylesheet" href="style.css" />
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <meta name='viewport' content='width=device-width, initial-scale=.86, minimum-scale=.86, maximum-scale=2.0' />
</head>

<body>
  <?php include("snippets/banner.html"); ?>
  <h1>End game</h1>
  <p>Time to view the results and laugh a lot.</p>
  <p>View another player's stack:</p>
  <ul><?php
      while ($row = mysqli_fetch_assoc($result1)) {
        $player = $row["Player"];
        $url = "./endgame.php?gid=" . $gid . "&name=" . $player;
        echo '<li><a href="' . $url . '">' . $row["Player"] . "</a></li>";
      }
      ?>
  </ul>

  <p><?php echo "Game ID: " . $gid; ?></p>
  <p><?php echo "Player name: " . $name; ?></p>

  <?php
  while ($row = mysqli_fetch_assoc($result2)) {
    $data = $row["ImgRef"];
    $round = $row["Round"];
    if (intval($round) % 2 == 0) {
      echo '<p class="endgameText">' . $data . '</p><br />';
    } else {
      echo '<img class="endgameDrawing" src="' . $data . '" /><br />';
    }
  }
  ?>
</body>

</html>