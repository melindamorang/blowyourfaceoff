/////////////////////////////////////////////////////////////
///          Initialization and Global Variables          ///
/////////////////////////////////////////////////////////////

//Round number
var round = 1;
var gid = document.getElementById("gid").value;

//Canvas DOM Objects. Canvas is input (right/bottom), Destination is the output (left/top)
var canvas = document.getElementById("inputZone");
var canvasContext = canvas.getContext("2d");
var destination = document.getElementById("displayZone");
var destinationContext = destination.getContext("2d");

//Canvas Size
canvas.width = 1000;
canvas.height = 600;

destination.width = 1000;
destination.height = 600;

var mode = "writing";

//////////////////////////////
// Drawing data and globals //
//////////////////////////////

//Drawing properties for canvas
canvasContext.strokeStyle = "#000000";
canvasContext.lineWidth = 3;
canvasContext.lineCap = "round";

//Drawing States
var isDrawing = false;
var draggedOut = false;
var currentThickness = "Fine";

//Line thickness data
var lineThicknesses = { "Fine": 3, "Medium Fine": 5, "Medium Thick": 8, "Thick": 12 };
var eraserThicknesses = { "Fine": 6, "Medium Fine": 10, "Medium Thick": 16, "Thick": 24 };


//////////////////////////////
// Writing data and globals //
//////////////////////////////

//Font Properties
var fontSize = 72;
var fontFam = 'Arial';

var text = ""; //string copy of what was last printed

/////////////////////
// Textarea Object //
/////////////////////

var textarea = document.createElement("TEXTAREA");

//Set textarea attributes
var canvasData = canvas.getBoundingClientRect();
textarea.id = "textInput";
textarea.style = "position:absolute;" +
	"top:" + canvasData.top + ";" +
	"left:" + canvasData.left + ";" +
	"width:" + canvasData.width + ";" +
	"height:" + canvasData.height + ";";

/////////////////////////
// Add event listeners //
/////////////////////////

setWritingEventListeners();

function setDrawingEventListeners() {
	//Remove Writing Listeners
	canvas.removeEventListener("click", showTextArea);
	canvas.removeEventListener("touchend", showTextArea);

	//Desktop
	canvas.addEventListener("mousedown", drawStart);
	canvas.addEventListener("mouseout", drawLeave);
	canvas.addEventListener("mouseover", drawStart);
	canvas.addEventListener("mousemove", drawTick);
	document.addEventListener("mouseup", drawEnd);

	//Mobile
	canvas.addEventListener("touchstart", drawStart);
	canvas.addEventListener("touchcancel", drawEnd);
	canvas.addEventListener("touchmove", drawTick);
	document.addEventListener("touchend", drawEnd);
}

function setWritingEventListeners() {
	//Remove Drawing Listeners
	//Desktop
	canvas.removeEventListener("mousedown", drawStart);
	canvas.removeEventListener("mouseout", drawLeave);
	canvas.removeEventListener("mouseover", drawStart);
	canvas.removeEventListener("mousemove", drawTick);
	document.removeEventListener("mouseup", drawEnd);

	//Mobile
	canvas.removeEventListener("touchstart", drawStart);
	canvas.removeEventListener("touchcancel", drawEnd);
	canvas.removeEventListener("touchmove", drawTick);
	document.removeEventListener("touchend", drawEnd);

	//Add Writing Listeners
	canvas.addEventListener("click", showTextArea);
	canvas.addEventListener("touchend", showTextArea);
}

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////
///          Drawing-unique Functions          //
/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function drawStart(mouseEvent) {


	//If we dragged the mouse out of the canvas, I want the drawing to resume when dragging back in.
	//This if statement catches non-drags, and the case where mouse up happened out of frame 
	if (mouseEvent.type == "mouseover" && !draggedOut) {
		return;
	}

	if (mouseEvent.type == "touchstart") {
		mouseEvent = mouseEvent.touches[0];
	}

	//Move the "brush" to where the mouse was clicked
	canvasContext.beginPath();
	canvasContext.moveTo(xPos(mouseEvent), yPos(mouseEvent));

	//Enter Drawing State
	isDrawing = true;
}

function drawTick(mouseEvent) {
	//Only draw if we are in a drawing state
	if (isDrawing) {

		//If this is a touchscreen event, use the primary touch for drawing
		if (mouseEvent.type == "touchmove") {
			mouseEvent = mouseEvent.touches[0];
		}

		//Draw a line leading to the current mouse position
		canvasContext.lineTo(xPos(mouseEvent), yPos(mouseEvent));
		canvasContext.stroke();

		//Start a new line, and put the "brush" at the mouse position
		canvasContext.beginPath();
		canvasContext.moveTo(xPos(mouseEvent), yPos(mouseEvent));
	}
}

function drawEnd(mouseEvent) {
	//If this is a touchscreen event, look at the primary touch
	if (mouseEvent.type == "touchend" || mouseEvent.type == "touchcancel") {
		mouseEvent = mouseEvent.touches[0];
	}

	//If the mouse is still on the canvas, make one last line
	if (xPos(mouseEvent) > 0 && xPos(mouseEvent) < canvas.width && yPos(mouseEvent) > 0 && yPos(mouseEvent) < canvas.height) {
		canvasContext.lineTo(xPos(mouseEvent), yPos(mouseEvent));
	}

	//Finish the current line
	canvasContext.stroke();

	//Completely stop all drawing states
	draggedOut = false;
	isDrawing = false;
}

function drawLeave(mouseEvent) {
	//If we were drawing when we dragged out, we want that to continue when we drag back in
	draggedOut = isDrawing;

	//Finish our current line, then stop the drawing state
	canvasContext.stroke();
	isDrawing = false;
}

function xPos(mouseEvent) {
	//Determine if the window is portrait or landscape, and scale canvas coordinates appropriately

	//Landscape
	if (window.innerWidth > window.innerHeight) {
		return (mouseEvent.pageX - $('#inputZone').offset().left) * (canvas.width / (.45 * window.innerWidth));
	}         //Real Mouse Position                                //Scale factor (canvas internal width vs real width)
	//Portrait / Default
	return (mouseEvent.pageX - $('#inputZone').offset().left) * (canvas.width / (.9 * window.innerWidth));
}

function yPos(mouseEvent) {
	//Determine if the window is portrait or landscape, and scale canvas coordinates appropriately

	//Landscape
	if (window.innerWidth > window.innerHeight) {
		return (mouseEvent.pageY - $('#inputZone').offset().top) * (canvas.height / (.27 * window.innerWidth));
	}         //Real Mouse Position                               //Scale factor (canvas internal width vs real width)
	//Portrait / Default
	return (mouseEvent.pageY - $('#inputZone').offset().top) * (canvas.height / (.54 * window.innerWidth));
}

function changeThickness(thickness) {
	currentThickness = thickness;
	if (canvasContext.strokeStyle == "#000000") {
		canvasContext.lineWidth = lineThicknesses[thickness];
	}
	else {
		canvasContext.lineWidth = eraserThicknesses[thickness];
	}
}

function changeTool(color) {
	//Drawing tool is black, Eraser is white
	//Set the canvas line color appropriately
	canvasContext.strokeStyle = color;
	if (color == "#000000") {
		canvasContext.lineWidth = lineThicknesses[currentThickness];
	}
	else {
		canvasContext.lineWidth = eraserThicknesses[currentThickness];
	}
}

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////
///          Writing-unique Functions          //
/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function showTextArea() {
	//Add the textarea to the page
	document.body.appendChild(textarea);

	//Add eventListener for when the user clicks away
	textarea.addEventListener("focusout", finalizeText);

	//If we had text before, add that now
	textarea.value = text;

	//Make it start selected
	if (textarea != document.activeElement) {
		textarea.focus();
	}
}

function finalizeText() {
	text = textarea.value;
	canvasWrite(canvas, text);
}

function canvasWrite(canvas, text) {
	//Get canvas context
	var ctx = canvas.getContext("2d");

	//Clean canvas
	clearCanvas(ctx);

	//Set Font
	ctx.font = fontSize + 'px ' + fontFam;
	ctx.textAlign = "center";

	//Write the text
	drawString(ctx, text);
}

function drawString(ctx, text) {
	var maxCharCount = 25;
	var output = [];

	//Get the text as a string and separate it into multiple lines
	var lines = text.toString().split("\n");

	//On each line, verify if text wrap is needed
	for (let i = 0; i < lines.length; i++) {
		//Check line length vs max length
		if (lines[i].length < maxCharCount) {
			output.push(lines[i]);
			//If line length was good, skip the rest of this code block and move on to the next line
			continue;
		}

		//Until a breakpoint is found
		while (lines[i].length > maxCharCount) {
			//Find the last whitespace/a breakpoint char within the width limit
			splitLocation = lines[i].slice(0, maxCharCount).search(/[\s.\-][^\s.\-]+?$/);

			//If there isn't a good natural breakpoint, split it at that length and add a dash
			if (splitLocation < 0) {
				output.push(lines[i].slice(0, maxCharCount + 1) + "-"); //Add the new safely sized line
				lines[i] = lines[i].slice(maxCharCount + 1);
			}

			//If there is a good breakpoint, just separate them onto new lines
			else {
				output.push(lines[i].slice(0, splitLocation + 1)); //Add the new safely sized line
				lines[i] = lines[i].slice(splitLocation + 1);
			}
		}
		//After the line shrinks down to acceptable width, just throw that on
		output.push(lines[i]);
	}

	//For each of the newly formatted lines, write them onto the canvas
	for (let i = 0; i < output.length; i++) {
		ctx.fillText(output[i], canvas.width / 2, canvas.height / 2 + (i - (output.length - 1) / 2) * fontSize);
	}

}

////////////////////////////////////////////////////////
///     General Canvas/Rules Functions
////////////////////////////////////////////////////////

function clearCanvas(ctx = canvasContext) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function submit() {
	// Hide the input area and show the wait message
	document.getElementById("waitMessage").removeAttribute("hidden");
	document.getElementById("inputArea").setAttribute("hidden", "true");
	// For the first round, unhide the display zone when the user clicks submit
	// After this, it remains exposed since we always want to display the previous round's stuff.
	if (round === 1) destination.removeAttribute("hidden");

	if (mode == "writing") {
		finalizeText();
		textarea.remove();
	}
	var url = canvas.toDataURL("image/png");

	sendData(url);
}

function sendData(url) {
	const request = new Request("serverside/add-entry.php", { method: "POST", body: '{"gid":"' + gid + '","name":"' + window.name + '","round":"' + round + '","data":"' + url + '"}' });

	//I discovered that there is no time-out by default on the fetch api and it's asynchronous, so I can just leave this request and it'll do all the switching whenever the response eventually comes. The page should still be responsive, I think.
	fetch(request)
		.then(response => response.text())
		.then(response => {
			if (response == "Game's over") {
				//Send the player to the results screen
				console.debug("Game is finished")
				window.location.replace("endgame.php?gid=" + gid + "&name=" + window.name);

			}
			displayLast(response);
			switchMode();
			round += 1;
			text = "";
		});

}

function displayLast(url) {
	clearCanvas(destinationContext);
	var img = new Image(canvas.width, canvas.height);
	img.src = url;
	img.onload = function () {
		destinationContext.drawImage(img, 0, 0);
	}
}

function switchMode() {
	// Show the input area and hide the wait message
	document.getElementById("waitMessage").setAttribute("hidden", "true");
	document.getElementById("inputArea").removeAttribute("hidden");
	if (mode == "writing") {
		setDrawingEventListeners();
		document.getElementById("canvasInputs").removeAttribute("hidden");
		document.getElementById("instructions").innerHTML = "Draw this description:";
		mode = "drawing";
	}
	else if (mode == "drawing") {
		setWritingEventListeners();
		document.getElementById("canvasInputs").setAttribute("hidden", "true");
		document.getElementById("instructions").innerHTML = "Describe this drawing:";
		mode = "writing";
	}
	clearCanvas(canvasContext);
}
