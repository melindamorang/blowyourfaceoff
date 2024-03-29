// Contains basic javascript for showing and hiding elements during gameplay,
// handling calls to Submit(), and populating the display area with the previous
// round's data.
// Canvas-specific control logic is in gameplay-canvas.js.
// HTML file must import shared-functions.js for this file to work.

// Show an alert if the user tries to leave, reload, or close the page during gameplay.
// The pop-up gives the browser's default message with a continue or cancel button.
// According to the internet, there is no way to customize the message in modern browsers.
// Chrome says "Leave site? The changes you made might not be saved." Better than nothing
// and probably suffient to prevent people from accidentally ruining the game even if it
// doesn't explicitly say "Leaving this page will ruin the game."
// We are dumb and shouldn't have done this. Leave this here until we find a better way.
// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     e.returnValue = '';
// });

// When the page first loads, show and hide content depending on round
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve page elements and store them as global variables
    // (This is done by not declaring them as var. Javascript is sneaky.)
    // Retrieve current GameID, round number, and player name from the page
    gid = document.getElementById("gid").value;
    round = document.getElementById("round").value;
    roundInt = parseInt(round);
    numRounds = parseInt(document.getElementById("numRounds").value);
    name = document.getElementById("name").value;
    timeLimitSeconds = parseInt(document.getElementById("timeoutSeconds").value);
    console.debug(gid);
    console.debug(round);
    console.debug(numRounds);
    console.debug(name);
    console.debug(timeLimitSeconds);
    // Retrieve relevant elements
    gameplayArea = document.getElementById("gameplayArea");
    displayZone = document.getElementById("displayZone");
    textDisplay = document.getElementById("textDisplay");
    drawingDisplay = document.getElementById("drawingDisplay");
    textInput = document.getElementById("textInput");
    drawingInput = document.getElementById("drawingInput");
    textInputBox = document.getElementById("textInputBox");
    canvas = document.getElementById("drawingCanvas");
    waitMessage = document.getElementById("waitMessage");
    timeoutAlert = document.getElementById("timeoutAlert");
    instructionMsg = document.getElementById("instructions");
    timer = document.getElementById("timer");
	// Retrieve browser window width for resizing elements
	var viewWidth = window.innerWidth;

    // Always hide the waitMessage and timeoutAlert when the page first loads
    showHideElement(waitMessage, false);
    showHideElement(timeoutAlert, false);

    // For the first round only, hide the display zone because there is
    // no prior content to display.
    if (roundInt == 0) showHideElement(displayZone, false);
    else showHideElement(displayZone, true);

    // For the first round only, change the text input area's placeholder text
    if (roundInt == 0) textInputBox.placeholder = "Type your word, phrase, or sentence here."

    // Even-numbered rounds are text input and drawing display.
    // Odd rounds are drawing input and text display.
    mode = "writing";
    if (isOdd(round)) {
        mode = "drawing";
        //instructionMsg.innerHTML = "Draw this description:";
        instructionMsg.innerHTML = "Round "+round+": Draw";
        showHideElement(textDisplay, true);
        showHideElement(drawingDisplay, false);
        showHideElement(textInput, false);
        showHideElement(drawingInput, true);
		//Adjust canvas size for mobile - SCG 2022-01-08
		if (viewWidth <= 550) {
			canvasWidth = viewWidth - 40;
			canvasHeight = canvasWidth * .6;
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			drawingDisplay.width = canvasWidth;
		}
    }
    else {
        if (roundInt == 0) instructionMsg.innerHTML = "Write a word, phrase, or sentence.";
        //else instructionMsg.innerHTML = "Describe this drawing:";
        else instructionMsg.innerHTML = "Round "+round+": Write";
        showHideElement(textDisplay, false);
        showHideElement(drawingDisplay, true);
        showHideElement(textInput, true);
        showHideElement(drawingInput, false);
		//Adjust canvas size for mobile - SCG 2022-01-08
		if (viewWidth <= 550) {
			textInputWidth = viewWidth - 80;
			textInputHeight = textInputWidth * .6;
			textInputBox.style.width = textInputWidth+'px';
			textInputBox.style.height = textInputHeight+'px';
		}
    }

    // Fetch the last round's data and display it in the display area
    if (roundInt != 0) fetchLastRoundsData();

    if (isNaN(timeLimitSeconds)) {
        // No timer for this game
        showHideElement(timer);
    }
    else {
        // Start the timer
        runTimer();
    }
});

// When the user hits Submit, send the input to the database
function submit() {
    // Get the data from either the text input box or the drawing canvas
    // and validate it
    var data = "";
    var valid = true;
    if (mode == "writing") {
        data = textInputBox.value;
        if (data === "") {
            valid = false;
            addError("<p>You must write something.</p>");
        }
    }
    else {
        data = canvas.toDataURL("image/png");
        if (isCanvasBlank()) {
            valid = false;
            addError("<p>You must draw something.</p>");
        }
    }

    if (valid) {
        // Hide the gameplay area and show the wait message
        showHideElement(waitMessage, true);
        showHideElement(gameplayArea, false);
		
		//Resize the image - SCG 2022-01-09
		if (mode == "drawing" && canvas.width != 500) {
			var resizedCanvas = document.createElement("canvas");
			var resizedContext = resizedCanvas.getContext("2d");

			resizedCanvas.width = "500";
			resizedCanvas.height = "300";

			resizedContext.drawImage(canvas, 0, 0, 500, 300);
			data = resizedCanvas.toDataURL();
		}

        // Submit the data
        sendData(data);
    }
}

// Send the data to the database after hitting submit
// If the round is finished, move on to the next round.
function sendData(data) {
    // First send the data
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.debug(xhttp.responseText);
			if (xhttp.responseText == "Done") {
                console.debug("Data submitted successfully.");
            }
            else {
                console.debug("Error submitting data.");
                console.debug(xhttp.responseText);
                addError("Error submitting data." + xhttp.responseText);
                showHideElement(waitMessage, false);
                showHideElement(gameplayArea, true);
            }
		}
	};
	xhttp.open("POST", "serverside/add-entry.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	var jsonBody = {};
    jsonBody["gid"] = gid;
    jsonBody["name"] = name;
    jsonBody["round"] = round;
    jsonBody["data"] = data;
    xhttp.send(JSON.stringify(jsonBody));
    
    // Next, check whether we're done with the round
    isRoundFinished();
}

// Ping the server and database to see if all players have submitted their data for the round
function isRoundFinished() {
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.debug(xhttp.responseText);
			if (xhttp.responseText == "2") {
                console.debug("Round complete.");
                if (roundInt >= numRounds - 1) {
                    // This was the last round
                    // Send the player to the results screen
                    console.debug("Game is finished");
                    window.location.replace("endgame.php?gid=" + gid + "&name=" + name);
                }
                else {
                    // Send the user to the next round
                    console.debug("Moving on to next round");
                    var nextRound = roundInt + 1;
                    console.debug(nextRound);
                    window.location.replace("gameplay.php?gid=" + gid + "&round=" + nextRound.toString() + "&name=" + name);
                }
            }
            else if (xhttp.responseText == "1") {
                console.debug("Round not done yet.");
            }
            else {
                console.debug("Error checking round status.");
                console.debug(xhttp.responseText);
                addError("Error checking round status." + xhttp.responseText);
                showHideElement(waitMessage, false);
                showHideElement(gameplayArea, true);
            }
		}
	};
    xhttp.open("GET", "serverside/check-if-round-finished.php?gid=" + gid + "&round=" + round, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();

    // If we got this far without redirecting, then either the round wasn't done or there was an error
    // Sleep for 5 seconds and then try again.
    setTimeout(isRoundFinished, 5000);
}

// Clear the user's input data
function clearInput() {
	if (confirm("Do you want to erase your entire drawing?")) {
    	if (mode == "writing") textInputBox.value = "";
    	else clearCanvas();
	}
}

// Fetch the last round's data for this player's stack and show it
// in the display area.
function fetchLastRoundsData() {
    if (roundInt != 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (xhttp.responseText == "Bad request") {
                    console.debug("Unable to fetch last round's data.");
                }
                else {
                    // Display the data in the display area
                    displayLast(xhttp.responseText);
                }
            }
        };
        xhttp.open("GET", "serverside/fetch-last-rounds-data.php?gid=" + gid + "&round=" + round + "&name=" + name, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send();
    }
}

// Show the specified data in the display area
function displayLast(data) {
    if (mode == "writing") {
        // Last round's data is an image.
        drawingDisplay.setAttribute("src", data);
    }
    else {
        // Last round's data is text
        textDisplay.innerHTML = data;
    }

}

// Change the appearance of the textarea - Sarah 2021-03-23
function textSize() {
	var ta = document.getElementById("textInputBox");
	var gameStr = ta.value;
	var lg = gameStr.length;
	var limit = ta.getAttribute("maxlength");
	if (lg > limit/2) {
		ta.className = "txt-sm";
	}
	else {
		ta.className = "txt-reg";
	}
}


function runTimer() {
    var endTime = new Date().getTime() + (1000 * timeLimitSeconds);
    // Update the countdown every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
    
        // Find the distance between now and the count down date
        var timeRemaining = endTime - now;
    
        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
        // Display the result in the timer element
        timer.innerHTML = minutes + "m " + seconds + "s ";
    
        // If the countdown is finished, submit whatever they have
        // Fill in dummy values if their submission is blank.
        if (timeRemaining < 0) {
            clearInterval(x);
            timer.innerHTML = "Time's up! Moving on.";

            if (mode == "writing") {
                if (textInputBox.value === "") {
                    showHideElement(timeoutAlert, true);
                    showHideElement(gameplayArea, false);
                }
                else submit();
            } else {
                if (isCanvasBlank()) {
                    showHideElement(timeoutAlert, true);
                    showHideElement(gameplayArea, false);
                }
                else submit();
            }
        }
    }, 1000);
}

function imStillHere() {
    // This function gets called when the round times out and the user has entered nothing, they see the message
    // asking if they're still playing, and they click the "I'm stil here!" button to confirm they are still playing in this tab.

    // Hide the timeout alert and show the wait message temporarily
    showHideElement(timeoutAlert, false);
    showHideElement(waitMessage, true);

    // Fill in dummy values so the game can proceed.
    // First, check to make sure data wasn't already submitted in some other way.
    // This shouldn't happen, but it could if a player switched devices mid-game and
    // left it open on another device or otherwise did something weird.
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.debug(xhttp.responseText);
            if (xhttp.responseText == "Bad request") {
                // Something bad happened.  Just fill in dummy values and proceed.
                console.debug("Unable to check if data already submitted.");
                fillInDummyValues();
                submit();
            }
            else {
                // Only fill in dummy values if the database had nothing in it already.
                var numNulls = parseInt(xhttp.responseText);
                if (numNulls == 0) {
                    // Somehow values were already in the database. Don't submit anything, just
                    // use what was already there and proceed.
                    isRoundFinished();
                } else {
                    fillInDummyValues();
                    submit();
                }
            }
        }
    };
    xhttp.open("GET", "serverside/is-round-data-submitted.php?gid=" + gid + "&round=" + round + "&name=" + name, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function fillInDummyValues() {
    // Fill in dummy values if needed.
    if (mode == "writing") {
        textInputBox.value = "Oh dear, I'm really slow.";
    } else {
        drawHappyFace();
    }
}
