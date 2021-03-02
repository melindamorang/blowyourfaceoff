<?php
include("serverside/player-limits.php");
?>
<html class="theme-basic home">

<head>
    <script src="modules/shared-functions.js"></script>
    <script src="pregame.js"></script>
	<link rel="stylesheet" href="style.css" />
</head>

<body>
    <?php include("snippets/banner.html"); ?>
    <div id="initialEntry">
        <button onclick="showPlayerEntry()">Join a Game</button>
        <button onclick="showHostEntry()">Host a Game</button><br>
        <button onclick="showPriorGameEntry()">See results of a completed game</button>
    </div>
    <div id="startGameForm">
        <div id="newGameEntry">
            <label for="playerName">Enter your name:</label><br />
            <input type="text" id="playerName" maxlength=<?php echo '"' . $maxNameLength . '"'; ?>><br>
            <div id="forPlayer">
                <label for="gid">Enter Game ID:</label><br />
                <input type="text" id="gid"><br>
                <button onclick="tryJoin()">Join Game</button><br><br>
            </div>
            <div id="forHost">
                <label for="timeLimit">Time limit for rounds in minutes (leave blank for none):</label><br />
                <input type="number" id="timeLimit" min=0.25 max=30><br>
                <button onclick="startHost()">Create Game</button><br>
            </div>
        </div>
        <div id="priorGameEntry">
            <label for="gid2">Enter ID of completed game:</label><br />
            <input type="text" id="gid2"><br>
            <button onclick="tryPriorGame()">Submit</button><br><br>
        </div>
        <p id="ErrorLine"></p>
        <a href="#" onclick="setInitialState()">Cancel</a>
    </div>

    <?php include("snippets/footer.html"); ?>
</body>

</html>
