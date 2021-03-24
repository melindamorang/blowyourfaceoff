<?php
$gid = htmlspecialchars($_GET["gid"]);
$name = htmlspecialchars($_GET["name"]);
$round = htmlspecialchars($_GET["round"]);
include("serverside/player-limits.php");
include("serverside/get-player-lineup.php");
include("serverside/get-time-limit.php");
?>

<html class="theme-basic">

<head>
	<title>Blow your face off!</title>
	<link rel="stylesheet" href="style.css" />
	<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
	<script src="modules/shared-functions.js"></script>
	<script src="gameplay-canvas.js"></script>
	<script src="gameplay.js"></script>
	<meta name='viewport' content='width=device-width, initial-scale=.86, minimum-scale=.86, maximum-scale=2.0' />
	<script src="https://kit.fontawesome.com/9e0e384b62.js" crossorigin="anonymous"></script>
</head>

<body>
	<!--Hidden controls to hold variables that need to be passed around-->
	<input type="text" id="gid" hidden value="<?php echo $gid; ?>"></p>
	<input type="number" id="round" hidden value="<?php echo $round; ?>"></p>
	<input type="text" id="name" hidden value="<?php echo $name; ?>"></p>
	<input type="number" id="numRounds" hidden value="<?php echo $numPlayers; ?>"></p>
	<input type="number" id="timeoutSeconds" hidden value="<?php echo $timeLimit; ?>"></p>

	<!--Determine if starting round-->
	<?php if ($round==0) {$roundlabel="Start Here";} else {$roundlabel="Round " . $round;} ?>


	<!--The actual content!-->
	<?php include("snippets/banner.html"); ?>
	<p id="waitMessage" hidden>Please wait until the other players have finished the round.</p>
	<div id="timeoutAlert" hidden>
		<!--This zone is for a special message and confirmation button if the player's time runs out and they haven't entered anything.-->
		<h2>Are you still here?</h2>
		<p>We noticed that your time ran out, and you didn't enter anything. If you're no longer playing or have switched to a different browser tab
			or device, please close this browser tab or <a href="index.php">return to the homepage</a>.</p>
			<button onclick="imStillHere()">I'm still here!</button>
	</div>
	<div id="gameplayArea">
		<!--This zone encompasses the entire gameplay area, both display and input.-->
		<p><?php echo $roundlabel; ?></p>
		<h2 id="instructions"></h2>
		<!--The instructions are dynamically updated in the javascript-->
		<div id="displayZone">
			<!--This section displays the previous round's content.-->
			<p>(Content from <?php echo $previousPlayer; ?>)</p>
			<p id="textDisplay"></p>
			<!--For displaying text-->
			<img id="drawingDisplay"></img>
			<!--For displaying drawings-->
		</div><br />
		<div id="inputZone">
			<!--This section is for the text/drawing input area and associated controls.-->
			<p>(Your submission will go to <?php echo $nextPlayer; ?>)</p>
			<p id="timer"></p>
			<div id="textInput">
				<!--Inputs for the writing phase-->
				<textarea autocomplete="off" spellcheck="true" id="textInputBox" maxlength=<?php echo '"' . $maxTextInputLength . '"'; ?>></textarea>
			</div>
			<div id="drawingInput">
				<!--Inputs for the drawing phase-->
				<!--The internet says you should explicitly define the canvas height and width here
				to avoid drawing offsets and strange behavior with scaling-->
				<canvas id="drawingCanvas" width="500" height="300"></canvas><br />
				<div id="controlSection">
					<div class="thicknesses">
						<div class="controlSet"><!-- Fine -->
						<input type="radio" name="thickness" id="fine" onclick="changeThickness('Fine')" checked="checked"></input>
						<label for="fine"><img alt="thin line" title="Thin" src="images/thicknesses/squiggle-thin.png" /></label>
						</div>

						<div class="controlSet"><!-- Medium Fine -->
						<input type="radio" name="thickness" id="mfine" onclick="changeThickness('Medium Fine')"></input>
						<label for="mfine"><img alt="medium thin line" title="Medium Thin" src="images/thicknesses/squiggle-medthin.png" /></label>
						</div>

						<div class="controlSet"><!-- Medium Thick -->
						<input type="radio" name="thickness" id="mthick" onclick="changeThickness('Medium Thick')"></input>
						<label for="mthick"><img alt="medium thick line" title="Medium Thick" src="images/thicknesses/squiggle-medthick.png" /></label>
						</div>

						<div class="controlSet"><!-- Think -->
						<input type="radio" name="thickness" id="thick" onclick="changeThickness('Thick')"></input>
						<label for="thick"><img alt="thick line" title="Thick" src="images/thicknesses/squiggle-thick.png" /></label>
						</div>
					</div>

					<div id="drawtools">
						<div class="controlSet draw">
						<input type="radio" name="tool" id="draw" onclick="changeTool('#000000')" checked="checked"></input>
						<label for="draw"><i class="fas fa-pencil-alt"></i> Draw</label>
						</div>

						<div class="controlSet eraser">
						<input type="radio" name="tool" id="erase" onclick="changeTool('#FFFFFF')"></input>
						<label for="erase"><i class="fas fa-eraser"></i> Erase</label>
						</div>

						<div class="undoredo">
						<button href="" name="undo" id="undo" onclick="undoHistory.undo();">Undo</button>
						<button href="" name="redo" id="redo" onclick="undoHistory.redo();">Redo</button>
						</div>


						<div class="controlSet eraseall">
							<button href="" onclick="clearInput();"><i class="fas fa-trash-alt"></i> Erase All</button>
						</div>
					</div>

					
				</div>
			</div><br />
			<div id="submission">
				<!--Controls for submitting and clearing data-->
				<p id="ErrorLine"></p>
				<button onclick="submit()">Submit</button>
			</div>
		</div>
	</div>

	<?php include("snippets/footer.html"); ?>
</body>

</html>
