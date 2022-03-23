<?php $pagename = "Welcome" ?>
<?php include("header.php"); ?>

	<div class="main-content">
		<div id="initialEntry">
			<button onclick="showPlayerEntry()">Join a Game</button><br>
			<button onclick="showHostEntry()">Host a Game</button><br>
			<button onclick="showPriorGameEntry()">See results of a completed game</button>
			<button onclick="showSearchStackEntry()">Search prior games</button>
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
			<div id="stackSearchEntry">
				<label for="searchText">Enter stack text search keyword:</label><br />
				<input type="text" id="searchText"><br>
				<button onclick="searchStackText()">Submit</button><br><br>
			</div>
			<p id="ErrorLine"></p>
			<a href="#" onclick="setInitialState()">Cancel</a>
		</div>
	</div><!-- end main-content -->

<?php include("footer.php"); ?>