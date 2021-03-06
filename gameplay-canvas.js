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

	// Determine if the user's device is running ios
	// See https://racase.com.np/javascript-how-to-detect-if-device-is-ios/
	isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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

// Functions taken from
// https://stackoverflow.com/questions/9975352/javascript-html5-canvas-drawing-instead-of-dragging-scrolling-on-mobile-devic
// To prevent awkward scrolling on ios.
function preventDefault(e) {
    e.preventDefault();
}
function disableScroll() {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}
function enableScroll() {
    document.body.removeEventListener('touchmove', preventDefault);
}

function drawStart(mouseEvent) {
	console.debug("drawStart. event type: " + mouseEvent.type)
	//If we dragged the mouse out of the canvas, I want the drawing to resume when dragging back in.
	//This if statement catches non-drags, and the case where mouse up happened out of frame 
	if (mouseEvent.type == "mouseover" && !draggedOut) {
		return;
	}

	if (mouseEvent.type == "touchstart") {
		mouseEvent = mouseEvent.touches[0];
		if (isIOS) disableScroll();
	}

	//Move the "brush" to where the mouse was clicked
	canvasContext.beginPath();
	pos = getXYPos(mouseEvent);
	canvasContext.moveTo(pos.x, pos.y);

	//Enter Drawing State
	isDrawing = true;
	// The canvas has now been touched
	canvasEdited = true;
}

function drawTick(mouseEvent) {
	console.debug("drawTick. event type: " + mouseEvent.type)
	//Only draw if we are in a drawing state
	if (isDrawing) {

		//If this is a touchscreen event, use the primary touch for drawing
		if (mouseEvent.type == "touchmove") {
			mouseEvent = mouseEvent.touches[0];
		}

		pos = getXYPos(mouseEvent);

		//Draw a line leading to the current mouse position
		canvasContext.lineTo(pos.x, pos.y);
		canvasContext.stroke();

		//Start a new line, and put the "brush" at the mouse position
		canvasContext.beginPath();
		canvasContext.moveTo(pos.x, pos.y);
	}
}

function drawEnd(mouseEvent) {
	console.debug("drawEnd. event type: " + mouseEvent.type)

	if (!isDrawing) {
		// Weird case where they clicked outside the canvas, held the mouse button, dragged
		// over the canvas, and then released the button. Don't add a random line in this case
		// from the previous draw end location.
		console.debug("Skipping draw ending because we weren't actually drawing.");
		draggedOut = false;
		return;
	}

	//If this is a touchscreen event, look at the primary touch
	if (mouseEvent.type == "touchend" || mouseEvent.type == "touchcancel") {
		mouseEvent = mouseEvent.touches[0];
		if (isIOS) enableScroll();
	}

	//If the mouse is still on the canvas, make one last line
	pos = getXYPos(mouseEvent);
	if (pos.x > 0 && pos.x < canvas.width && pos.y > 0 && pos.y < canvas.height) {
		canvasContext.lineTo(pos.x, pos.y);
		canvasContext.stroke();
	}

	//Completely stop all drawing states
	draggedOut = false;
	isDrawing = false;
}

function drawLeave(mouseEvent) {
	console.debug("drawLeave. event type: " + mouseEvent.type)
	//If we were drawing when we dragged out, we want that to continue when we drag back in
	draggedOut = isDrawing;

	//Finish our current line, then stop the drawing state
	//canvasContext.stroke();
	isDrawing = false;
}

// Get the coordinates of the canvas's bounding rectangle
function getCanvasLocation() {
	var rect = canvas.getBoundingClientRect();
	return rect;
}

// Find the mouse's XY position with respect to the canvas
function getXYPos(mouseEvent) {
	var rect = getCanvasLocation();
	return {
		x: mouseEvent.clientX - rect.left,
		y: mouseEvent.clientY - rect.top
	}
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

// Draw an automatically-generated happy face
// Used to fill the canvas if the user lets the time run out without drawing anything.
// Borrowed from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
function drawHappyFace() {
	canvasContext.beginPath();
    canvasContext.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    canvasContext.moveTo(110, 75);
    canvasContext.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
    canvasContext.moveTo(65, 65);
    canvasContext.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
    canvasContext.moveTo(95, 65);
    canvasContext.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
	canvasContext.stroke();
	canvasEdited = true;
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