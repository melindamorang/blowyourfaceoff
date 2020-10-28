// Contains functions referenced by multiple other js files

// Display error text in the error element
// Assumes the element's ID is "ErrorLine"
function addError(errorText) {
	document.getElementById("ErrorLine").innerHTML = errorText
}

// Generic function that hides or shows a particular element
function showHideElement(element, shouldShow) {
    if (shouldShow) element.removeAttribute("hidden");
    else element.setAttribute("hidden", "true");
}

// Return 1 if the number is odd or 0 if even
function isOdd(num) { return num % 2; }