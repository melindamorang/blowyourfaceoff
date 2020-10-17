<?php
function rotateArray($arr,$number){
	//If they ask for "rotate 0 times", just give them back the array
	if($number == 0){
		return $arr;
	}

	$output = [];

	//Iterate from the starting number to the end of the array
	for($i = $number; $i < count($arr); $i++){
		//"$array[] =" is equivalent to pushing a new value onto the array in php
		$output[] = $arr[$i];
	}

	//Then Iterate from 0 back around to the starting number
	for($i = 0; $i < $number; $i++){
		$output[] = $arr[$i];
	}

	/*
	Basically, starts at array[number], iterates to the end, loops to 0, then up to array[number]
	ex. rotateArray([0,1,2,3,4,5,6],2) should start at 2, go to the end, which is 6, start at 0, then go back to 2, exclusive.

	[0,1,2,3,4,5,6] => [2,3,4,5,6,0,1];
	*/

	return $output;

}

function reverseArray($arr){
	$output = [];
	//Iterate from the end of the array down to 0
	for($i = count($arr)-1; $i >= 0; $i--){
		$output[] = $arr[$i];
	}
	return $output;
}
?>