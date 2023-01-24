<?php
/** Define ABSPATH as this file's directory */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

// setting title for using in the main template
$site = "Blow Your Face Off";
$divider = " | ";
$sitetitle = $pagename . $divider . $site;

//
include("serverside/player-limits.php");

//scripts for page heads
if ($pagename) {
	if ($pagename == "Welcome") {
		$headscripts = '<script src="js/pregame.js"></script>';
	}
	else if ($pagename == "Gameplay") {
		$headscripts = '<script src="js/gameplay-canvas.js"></script> <script src="js/gameplay.js"></script>';
	}
	else if ($pagename == "Lobby") {
		$headscripts = '<script src="js/lobby.js"></script>';
	}
	else if ($pagename == "Search Stacks") {
		$headscripts = '<script src="js/search-games.js"></script>';
	}
	else $headscripts = '';
}
?>