<?php
$request_body = file_get_contents('php://input');

$gid = $_GET["gid"];
$name = $_GET["name"];
$gidDisplay = htmlspecialchars($gid);
$nameDisplay = htmlspecialchars($name);

include("serverside/open-database-connection.php");
$gidQuery = mysqli_real_escape_string($link, $gid);
$nameQuery = mysqli_real_escape_string($link, $name);
// Get all player names for this game
$result1 = mysqli_query($link, "SELECT DISTINCT Player FROM game_data WHERE GameID = '" . $gidQuery . "'");

// Get the full set of text and drawings for this player
$result2 = mysqli_query($link, "SELECT Round,ImgRef,Player FROM game_data WHERE GameID = '" . $gidQuery . "' AND StackOwner = '" . $nameQuery . "'");
include("serverside/close-database-connection.php");
?>

<html>

<head>
  <title>Results</title>
  <link rel="stylesheet" href="style.css" />
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <meta name='viewport' content='width=device-width, initial-scale=.86, minimum-scale=.86, maximum-scale=2.0' />
</head>

<body>
  <?php include("snippets/banner.html"); ?>
  <h1>Results</h1>
  <p>Time to view the results and laugh a lot.</p>

  <!--Links to view another player's stack-->
  <p>View another player's stack:</p>
  <ul><?php
      while ($row = mysqli_fetch_assoc($result1)) {
        $url = "./endgame.php?gid=" . $gidQuery . "&name=" . $row["Player"];
        echo '<li><a href="' . $url . '">' . htmlspecialchars($row["Player"]) . "</a></li>";
      }
      ?>
  </ul>

  <p><?php echo "Game ID: " . $gidDisplay; ?></p>
	
  <div class="endgameStacks">
  <p class="playerNameEnd"><?php echo $nameDisplay . "'s Stack"; ?></p>
  
  <!-- Display your stack -->
  <?php
  while ($row = mysqli_fetch_assoc($result2)) {
    $data = htmlspecialchars($row["ImgRef"]);
    $round = htmlspecialchars($row["Round"]);
    $player = htmlspecialchars($row["Player"]);
	if(intval($round) != 0){
	  echo '<p class="endgamePlayer">From ' . $player . ':</p>';
	} else {
	  echo '<p class="endgamePlayer">Start:</p>';
	}
    if (intval($round) % 2 == 0) {
      echo '<p class="endgameText">' . $data . '</p>';
    } else {
      echo '<img class="endgameDrawing" src="' . $data . '" />';
    }
  }
  ?>
  </div><!-- end .endgameStacks -->
	<p><a class="button" href="index.php">New Game</a></p>
</body>

</html>