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

	// Initialize undo and redo buttons
	let btnUndo = document.getElementById("undo");
	let btnRedo = document.getElementById("redo");
	btnUndo.disabled = true;
	btnRedo.disabled = true;

	// undo/redo stack - tracks 
	undoHistory = {
		states: [canvasContext.getImageData(0, 0, canvas.width, canvas.height)],
		curIdx: 0,
		maxLen: 20, // store a maximum number of states that we can undo/redo
	};

	// Undo the previous action
	undoHistory.undo = function () {
		console.debug("Attempting to undo action. States: " + this.states.length + "; Current index: " + this.curIdx);
		if ((this.states.length < 1) || (this.curIdx < 1)) {
			// can't undo any further
			console.debug("Could not undo any further.")
			return;
		}
		this.curIdx -= 1;
		// Just grab the stored image of the previous state and put that back into the canvas.
		canvasContext.putImageData(this.states[this.curIdx], 0, 0);
		// Update button states
		this.updateButtons();
	}

	// Redo the most recent undone action.
	undoHistory.redo = function () {
		console.debug("Attempting to redo action. States: " + this.states.length + "; Current index: " + this.curIdx);
		if (this.curIdx >= this.states.length - 1) {
			// can't redo into the future
			console.debug("Could not redo any further.")
			return;
		}
		this.curIdx += 1;
		// Just grab the stored image of the next state and put it back into the canvas
		canvasContext.putImageData(this.states[this.curIdx], 0, 0);
		// Update button states
		this.updateButtons();
	}

	// I drew something, so add it to the history
	undoHistory.push = function () {
		console.debug("Pushing canvas image to undo/redo stack.")
		this.curIdx += 1;
		this.states.length = this.curIdx; // truncate
		// Add the current canvas state to the undo/redo stack so we can revisit it if necessary.
		this.states.push(canvasContext.getImageData(0, 0, canvas.width, canvas.height));
		if (this.states.length > this.maxLen) {
			this.states.shift();  // drop oldest
			this.curIdx -= 1;
		}
		// Update button states
		this.updateButtons();
	}

	// Enable or disable Undo and Redo buttons depending on state of stack
	undoHistory.updateButtons = function () {
		// If the stack is empty, disable both Undo and Redo
		if (this.states.length < 1) {
			btnUndo.disabled = true;
			btnRedo.disabled = true;
		}
		else {
			// Enable both buttons
			btnUndo.disabled = false;
			btnRedo.disabled = false;
			// If the current index is 0, we cannot undo any further, so disable the Undo button
			if (this.curIdx < 1) btnUndo.disabled = true;
			// If the current index is at its maximum value, we cannot redo any further, so disable the Redo button
			if (this.curIdx >= this.states.length - 1) btnRedo.disabled = true;
		}
	}

});

function setDrawingEventListeners() {

	//Desktop
	canvas.addEventListener("mousedown", drawStart);
	canvas.addEventListener("mouseout", drawLeave);
	canvas.addEventListener("mouseover", drawStart);
	canvas.addEventListener("mousemove", drawTick);
	document.addEventListener("mouseup", drawEnd);
	// If the canvas is accidentally selected and is getting dragged over itself, don't try to draw.
	canvas.addEventListener("drag", drawEnd);

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
	//If we dragged the mouse out of the canvas, I want the drawing to resume when dragging back in.
	//This if statement catches non-drags, and the case where mouse up happened out of frame 
	if (mouseEvent.type == "mouseover" && !draggedOut) {
		console.debug("mouseover event without being in draggedOut state. Do not start drawing.")
		return;
	}

	console.debug("drawStart. mouseEvent: " + mouseEvent.type)

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
	//Only draw if we are in a drawing state
	if (isDrawing) {
		console.debug("drawTick. mouseEvent: " + mouseEvent.type)

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
	console.debug("drawEnd. mouseEvent: " + mouseEvent.type)
	//If this is a touchscreen event, look at the primary touch
	if (mouseEvent.type == "touchend" || mouseEvent.type == "touchcancel") {
		updatedMouseEvent = mouseEvent.touches[0];
		if (updatedMouseEvent !== undefined) mouseEvent = updatedMouseEvent;
		if (isIOS) enableScroll();
	}

	//If the mouse is still on the canvas, make one last line
	if (isDrawing) {
		pos = getXYPos(mouseEvent);
		if (pos.x > 0 && pos.x < canvas.width && pos.y > 0 && pos.y < canvas.height) {
			// Include a tiny offset so we can successfully make dots
			canvasContext.lineTo(pos.x + 0.01, pos.y + 0.01);
			canvasContext.stroke();
		}

		// Add current canvas state to the undo/redo stack
		undoHistory.push();
	}

	//Completely stop all drawing states
	draggedOut = false;
	isDrawing = false;
}

function drawLeave(mouseEvent) {
	console.debug("drawLeave. mouseEvent: " + mouseEvent.type)
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
	console.debug("Cleared canvas.")
	// Clear canvas
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	// Add current canvas state to the undo/redo stack
	undoHistory.push();
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
