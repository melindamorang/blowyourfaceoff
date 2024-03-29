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
<?php $pagename = "Results" ?>
<?php include("header.php"); ?>


	<div class="main-content">
		<h1>Results</h1>
		<h3>Game ID: <?php echo $gidDisplay; ?></h3>
		<!-- <p>Time to view the results and laugh a lot.<br>
		View another player's stack:</p>-->

		<!--Links to view another player's stack-->
		<ul class="playerList"><?php
			while ($row = mysqli_fetch_assoc($result1)) {
				$playerListName = htmlspecialchars($row["Player"]);
				$url = "./endgame.php?gid=" . $gidQuery . "&name=" . $playerListName;
				echo '<li';
				if ($playerListName == $nameDisplay) { echo ' class="currentPlayer"'; }
				echo '><a href="' . $url . '">' . htmlspecialchars($row["Player"]) . "</a></li>";
			}
			?>
		</ul>
		<!--<p><a href="index.php">Start or join a new game</a></p>-->

		<div class="endgameStacks">
		<!-- Display your stack -->
		<?php include("serverside/retrieve-stack.php"); ?>
		</div><!-- end .endgameStacks -->
		
		<ul class="endStackMenu">
			<li><a class="button" onclick="window.scrollTo(0,0)">Return to top</a></li>
			<li><a class="button" href="index.php">New Game</a></li>
		</ul>

	</div><!-- end .main-content -->




<?php include("footer.php"); ?>