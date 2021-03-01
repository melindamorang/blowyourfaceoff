<?php
$request_body = file_get_contents('php://input');

$gid = $_GET["gid"];
if (isset($_GET["name"])) $name = $_GET["name"];
else $name = "";
$gidDisplay = htmlspecialchars($gid);
$nameDisplay = htmlspecialchars($name);

include("serverside/open-database-connection.php");
$gidQuery = mysqli_real_escape_string($link, $gid);
$nameQuery = mysqli_real_escape_string($link, $name);
// Get all player names for this game
$result1 = mysqli_query($link, "SELECT DISTINCT Player FROM game_data WHERE GameID = '" . $gidQuery . "' ORDER BY Player");
include("serverside/close-database-connection.php");
?>

<html class="theme-basic">

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
        $url = "./endgame.php?gid=" . $gidQuery . "&name=" . htmlspecialchars($row["Player"]);
        echo '<li><a href="' . $url . '">' . htmlspecialchars($row["Player"]) . "</a></li>";
      }
      ?>
  </ul>
	<p><a href="index.php">Start or join a new game</a></p>';

  <p><?php echo "Game ID: " . $gidDisplay; ?></p>
	
  <div class="endgameStacks">
    <!-- Display your stack -->
    <?php include("serverside/retrieve-stack.php"); ?>
  </div><!-- end .endgameStacks -->
	
	

  <?php include("snippets/footer.html"); ?>
</body>

</html>