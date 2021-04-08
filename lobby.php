<?php
$gid = htmlspecialchars($_GET["gid"]);
$isHost = htmlspecialchars($_GET["isHost"]);
?>

<?php $pagename = "Lobby" ?>
<?php include("header.php"); ?>

	<div class="main-content">
		<h2>Game ID: <span id="gid"><?php echo $gid; ?></span></h2>
		<span id="isHost" hidden><?php echo $isHost; ?></span>
		<h3>Current players:</h3>
		<div id="nameList"></div>
		
		<div id="hostArea">
			<p>Send the Game ID code to the other players. When everyone has joined, click the Start Game button.</p>
			<p id="ErrorLine"></p>
			<button onclick='startGame()'>Start Game</button>
		</div>
		
		<div id="playerArea">
			<p>Wait for the other players to join and the host to start the game.</p>
		</div>
		<script src="js/lobby-pulse.js"></script>
	</div>

<?php include("footer.php"); ?>