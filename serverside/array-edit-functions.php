<?php

// For a given index and array length, wrap around either end of the array to find
// a valid index value. If the index is negative, wrap around and find a valid
// positive index within the array length. If the index is positive and larger than
// the size of the array, wrap around to find a valid position within the array.
// This is because php is dumb and can't do negative array indexing automatically.
// Example: getValidIndex(-1, 3) returns index 2 (the last item in the array)
function getValidIndex($idx, $arrayLen) {
	if ($idx < 0) {
		// Call this function recursively in case the resulting value is still negative.
		$idx = getValidIndex($arrayLen + $idx, $arrayLen);
	}
	elseif ($idx >= $arrayLen) {
		// Call this function recursively in case the resulting value is still too big.
		$idx = getValidIndex($idx - $arrayLen, $arrayLen);
	}
	return $idx;
}
?>