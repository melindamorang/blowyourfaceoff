<?php
$gid = $_GET["gid"];
$name = $_GET["name"];
$round = $_GET["round"];
include("serverside/player-limits.php");
?>

<html>
  	<head>
    <title>Blow your face off!</title>
		<link rel="stylesheet" href="style.css"/>
		<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
		<script src = "gameplay.js"></script>
		<script src="gameplay-canvas.js"></script>
		<meta name='viewport' content='width=device-width, initial-scale=.86, minimum-scale=.86, maximum-scale=2.0'/>
  	</head>
  	<body>
		<!--Hidden controls to hold variables that need to be passed around-->
		<input type="number" id="gid" hidden <?php echo "value='".$gid."'"; ?>></p>
		<input type="number" id="round" hidden <?php echo "value='".$round."'"; ?>></p>
		<input type="text" id="name" hidden <?php echo "value='".$name."'"; ?>></p>

		<!--The actual content!-->  
		<?php include("snippets/banner.html"); ?>
		<p id="waitMessage" hidden>Please wait until the other players have finished the round.</p>
		<div id="gameplayArea"> <!--This zone encompasses the entire gameplay area, both display and input.-->
			<p>Round <?php echo $round; ?></p> 
			<h2 id="instructions">Write a word, phrase, or sentence.</h2>
			<div id="displayZone"> <!--This section displays the previous round's content.-->
				<p id="textDisplay"></p> <!--For displaying text-->
				<img id="drawingDisplay"></img> <!--For displaying drawings-->
			</div><br />
			<div id="inputZone"> <!--This section is for the text/drawing input area and associated controls.-->
				<div id="textInput"> <!--Inputs for the writing phase-->
					<input type="text" id="textInputBox" maxlength=<?php echo '"' . $maxTextInputLength . '"'; ?>></input>
				</div>
				<div id="drawingInput"> <!--Inputs for the drawing phase-->
					<canvas id="drawingCanvas"></canvas>
					<div id="controlSection">
						<input type="radio" name="thickness" id="fine" onclick="changeThickness('Fine')" checked="checked"></input>
						<label for="fine">Fine</label>

						<input type="radio" name="thickness" id="mfine" onclick="changeThickness('Medium Fine')"></input>
						<label for="mfine">Medium Fine</label>

						<input type="radio" name="thickness" id="mthick" onclick="changeThickness('Medium Thick')"></input>
						<label for="mthick">Medium Thick</label>

						<input type="radio" name="thickness" id="thick" onclick="changeThickness('Thick')"></input>
						<label for="thick">Thick</label>

						<br>
						<input type="radio" name="tool" id="draw" onclick="changeTool('#000000')" checked="checked"></input>
						<label for="draw">Draw</label>

						<input type="radio" name="tool" id="erase" onclick="changeTool('#FFFFFF')"></input>
						<label for="erase">Erase</label>
					</div>
				</div>
				<div id="submission"> <!--Controls for submitting and clearing data-->
					<button onclick="clearCanvas()">Clear</button>
					<button onclick="submit()">Submit</button>
				</div>
			</div>
		</div>
  </body>
</html>