<?php

// For a given index and array length, if the index is negative,
// wrap around and find a valid positive index within the array length.
// This is because php is dumb and can't do negative array indexing automatically.
// Example: getValidIndex(-1, 3) returns index 2 (the last item in the array)
// Note: Does not help if the $idx is > $arrayLen-1
function getValidIndex($idx, $arrayLen) {
	if ($idx < 0) {
		// Call this function recursively in case the resulting value is still negative.
		$idx = getValidIndex($arrayLen + $idx, $arrayLen);
	}
	return $idx;
}
?>