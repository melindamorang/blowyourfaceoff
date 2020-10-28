<?php
include("serverside/player-limits.php");
?>
<html>

<head>
    <script src="modules/shared-functions.js"></script>
    <script src="pregame.js"></script>
</head>

<body>
    <?php include("snippets/banner.html"); ?>
    <div id="initialEntry">
        <button onclick="showPlayerEntry()">Join a Game</button>
        <button onclick="showHostEntry()">Host a Game</button>
    </div>
    <div id="startGameForm">
        <label for="playerName">Enter your name: </label>
        <input type="text" id="playerName" maxlength=<?php echo '"' . $maxNameLength . '"'; ?>><br>
        <div id="forPlayer">
            <label for="gid">Enter Game ID: </label>
            <input type="text" id="gid"><br>
            <button onclick="tryJoin()">Join Game</button><br><br>
        </div>
        <div id="forHost">
            <button onclick="startHost()">Create Game</button><br>
        </div>
        <p id="ErrorLine"></p>
    </div>
</body>

</html>