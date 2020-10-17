<?php

$gid = $_GET["gid"];

?>

<html>
  <head>
    <title>Blow your face off!</title>
		<link rel="stylesheet" href="style.css"/>
		<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
		<meta name='viewport' content='width=device-width, initial-scale=.86, minimum-scale=.86, maximum-scale=2.0'/>
  </head>
  <body>
  <?php include("snippets/banner.html"); ?>
		<h2 id="instructions">Write a word, phrase, or sentence.</h2>
		<canvas id="displayZone"></canvas>
		<canvas id="inputZone"></canvas>
		<div id="controlSection">
			<div id="canvasInputs" hidden>
				<br>
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

			<br>
			<button onclick="clearCanvas()">Clear</button>
			<button onclick="submit()">Submit</button>
		</div>
		<input type="number" id="gid" hidden <?php echo "value='".$gid."'"; ?>></p>
		<script src="game.js"></script>
  </body>
</html>