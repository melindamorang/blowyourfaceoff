<?php
$gid = htmlspecialchars($_GET["gid"]);
$isHost = htmlspecialchars($_GET["isHost"]);
?>

<html>

<head>
	<script src="modules/shared-functions.js"></script>
	<script src="lobby.js"></script>
	<link rel="stylesheet" href="style.css" />
</head>

<body>
	<?php include("snippets/banner.html"); ?>
	<h2>Game ID: <span id="gid"><?php echo $gid; ?></span></h2>
	<span id="isHost" hidden><?php echo $isHost; ?></span>
	<div id="hostArea">
		<p>Send the Game ID code to the other players. When everyone has joined, click the Start Game button.</p>
		<button onclick='startGame()'>Start Game</button>
		<p id="ErrorLine"></p>
	</div>
	<div id="playerArea">
		<p>Wait for the other players to join and the host to start the game.</p>
	</div>
	<p id="ErrorLine"></p>
	<h3>Current players:</h3>
	<div id="nameList"></div>
	<script src="lobby-pulse.js"></script>
</body>

</html>
