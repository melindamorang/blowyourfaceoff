<?php
include("serverside/database-connection.php");
include("serverside/player-limits.php");
?>
<html>

<head>
    <script src="modules/shared-functions.js"></script>
    <script src="pregame.js"></script>
	<link rel="stylesheet" href="style.css" />
</head>

<body>
    <?php include("snippets/banner.html"); ?>
    <div id="initialEntry">
        <button onclick="showPlayerEntry()">Join a Game</button>
        <button onclick="showHostEntry()">Host a Game</button>
    </div>
    <div id="startGameForm">
        <label for="playerName">Enter your name: </label><br />
        <input type="text" id="playerName" maxlength=<?php echo '"' . $maxNameLength . '"'; ?>><br>
        <div id="forPlayer">
            <label for="gid">Enter Game ID: </label><br />
            <input type="text" id="gid"><br>
            <button onclick="tryJoin()">Join Game</button><br><br>
        </div>
        <div id="forHost">
            <button onclick="startHost()">Create Game</button><br>
        </div>
        <p id="ErrorLine"></p>
        <a onclick="setInitialState()">Cancel</a>
    </div>
</body>

</html>
<?php
include("serverside/close-database-connection.php");
?>