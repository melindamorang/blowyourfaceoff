// Contains basic javascript for showing and hiding elements during gameplay,
// handling calls to Submit(), and populating the display area with the previous
// round's data.
// Canvas-specific control logic is in gameplay-canvas.js.
// HTML file must import shared-functions.js for this file to work.

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
    console.debug(gid);
    console.debug(round);
    console.debug(numRounds);
    console.debug(name);
    // Retrieve relevant divs
    gameplayArea = document.getElementById("gameplayArea");
    displayZone = document.getElementById("displayZone");
    textDisplay = document.getElementById("textDisplay");
    drawingDisplay = document.getElementById("drawingDisplay");
    textInput = document.getElementById("textInput");
    drawingInput = document.getElementById("drawingInput");
    textInputBox = document.getElementById("textInputBox");
    canvas = document.getElementById("drawingCanvas");
    waitMessage = document.getElementById("waitMessage");
    instructionMsg = document.getElementById("instructions");

    // Always hide the waitMessage when the page first loads
    showHideElement(waitMessage, false);

    // For the first round only, hide the display zone because there is
    // no prior content to display.
    if (roundInt == 0) showHideElement(displayZone, false);
    else showHideElement(displayZone, true);

    // Even-numbered rounds are text input and drawing display.
    // Odd rounds are drawing input and text display.
    mode = "writing";
    if (isOdd(round)) {
        mode = "drawing";
        instructionMsg.innerHTML = "Draw this description:";
        showHideElement(textDisplay, true);
        showHideElement(drawingDisplay, false);
        showHideElement(textInput, false);
        showHideElement(drawingInput, true);
    }
    else {
        if (roundInt == 0) instructionMsg.innerHTML = "Write a word, phrase, or sentence.";
        else instructionMsg.innerHTML = "Describe this drawing:";
        showHideElement(textDisplay, false);
        showHideElement(drawingDisplay, true);
        showHideElement(textInput, true);
        showHideElement(drawingInput, false);
    }

    // Fetch the last round's data and display it in the display area
    if (roundInt != 0) fetchLastRoundsData();
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
            addError("You must write something.");
        }
    }
    else {
        data = canvas.toDataURL("image/png");
        if (isCanvasBlank()) {
            valid = false;
            addError("You must draw something.");
        }
    }

    if (valid) {
        // Hide the gameplay area and show the wait message
        showHideElement(waitMessage, true);
        showHideElement(gameplayArea, false);

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
    if (mode == "writing") textInputBox.value = "";
    else clearCanvas();
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