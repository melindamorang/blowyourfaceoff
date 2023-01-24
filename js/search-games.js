// Functions for searching old games

// When the page first loads, show and hide content depending on round
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve page elements and store them as global variables
    // (This is done by not declaring them as var. Javascript is sneaky.)
    searchText = document.getElementById("searchTextValue").value;
    console.debug(searchText);
    searchResultsDisplay = document.getElementById("searchResults");

    // Search the database using the search string entered by the user
    searchByText();

});

// Search the game database by the designated text string and return html to insert
function searchByText() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Display the results in the display area
                searchResultsDisplay.innerHTML = xhttp.responseText;
            }
            else {
                searchResultsDisplay.innerHTML = "<p>Error retrieving search results from game database.</p>";
            }
        }
        else {
            searchResultsDisplay.innerHTML = "<p>Searching game database...</p>";
        }
    };
    xhttp.open("GET", "serverside/search-stack-text.php?searchText=" + searchText, true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send();
};
