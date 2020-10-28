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
    name = document.getElementById("name").value;
    console.debug(gid);
    console.debug(round);
    console.debug(typeof round);
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

// Returns true if every pixel's uint32 representation is 0 (or "blank")
// Borrowed from https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
// Does not work after the canvas is cleared or erased
function isCanvasBlank() {
    const context = canvas.getContext('2d');
  
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
  
    return !pixelBuffer.some(color => color !== 0);
}

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
        showHideElement(gameplayArea, false)

        // Submit the data
        sendData(data);
    }
}

// Send the data to the database after hitting submit
// If the round is finished, move on to the next round.
function sendData(data) {
    // Construct a request to add the data to the database
    const request = new Request("serverside/add-entry.php", { method: "POST", body: '{"gid":"' + gid + '","name":"' + name + '","round":"' + round + '","data":"' + data + '"}' });

    //I discovered that there is no time-out by default on the fetch api and it's asynchronous, so I can just leave this request and it'll do all the switching
    // whenever the response eventually comes. The page should still be responsive, I think.
    fetch(request)
        .then(response => response.text())
        .then(response => {
            if (response == "Game's over") {
                //Send the player to the results screen
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
        });
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
        // Construct a request to add the data to the database
        const request = new Request("serverside/fetch-last-rounds-data.php", { method: "POST", body: '{"gid":"' + gid + '","player":"' + name + '","round":"' + round + '"}' });

        //I discovered that there is no time-out by default on the fetch api and it's asynchronous, so I can just leave this request and it'll do all the switching whenever the response eventually comes. The page should still be responsive, I think.
        fetch(request)
            .then(response => response.text())
            .then(response => {
                if (response == "Bad request") {
                    console.debug("Bad request");
                }
                else {
                    // Display the data in the display area
                    displayLast(response);
                }
            });
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