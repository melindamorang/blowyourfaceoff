// Contains javascript for controlling canvas drawing

// When the page first loads, show and hide content depending on round
document.addEventListener('DOMContentLoaded', function () {
	// Retrieve page elements and store them as global variables
	// (This is done by not declaring them as var. Javascript is sneaky.)
	canvas = document.getElementById("drawingCanvas");
	canvasContext = canvas.getContext("2d");

	// Initialize a flag to help us track whether the canvas has been edited
	canvasEdited = false;

	// Size and drawing properties for canvas
	canvasContext.strokeStyle = "#000000";
	canvasContext.lineWidth = 3;
	canvasContext.lineCap = "round";

	// Drawing States
	isDrawing = false;
	draggedOut = false;
	currentThickness = "Fine";

	// Line thickness data
	lineThicknesses = { "Fine": 3, "Medium Fine": 5, "Medium Thick": 8, "Thick": 12 };
	eraserThicknesses = { "Fine": 6, "Medium Fine": 10, "Medium Thick": 16, "Thick": 24 };

	// Set drawing event listeners so you can interact with the canvas
	setDrawingEventListeners();
});


function setDrawingEventListeners() {
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
	// The canvas has now been touched
	canvasEdited = true;
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
	//canvasContext.stroke();

	//Completely stop all drawing states
	draggedOut = false;
	isDrawing = false;
}

function drawLeave(mouseEvent) {
	//If we were drawing when we dragged out, we want that to continue when we drag back in
	draggedOut = isDrawing;

	//Finish our current line, then stop the drawing state
	//canvasContext.stroke();
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
	isDrawing = false;
	draggedOut = false;
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
	isDrawing = false;
	draggedOut = false;
	canvasContext.strokeStyle = color;
	if (color == "#000000") {
		canvasContext.lineWidth = lineThicknesses[currentThickness];
	}
	else {
		canvasContext.lineWidth = eraserThicknesses[currentThickness];
	}
}

function clearCanvas() {
	// Clear canvas
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	// Reset canvas editing tracker.
	canvasEdited = false;
}

// Returns true if the canvas has not been edited since the page loaded or the canvas was cleared
// Does not work if the player manually erases everything
// I tried all the options shown here: https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
// None of them worked reliably.  This is better.
function isCanvasBlank() {
	return !canvasEdited;
}