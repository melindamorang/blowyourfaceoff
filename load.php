<?php

// Forbid caching so the database queries don't inadvertently neglect
// to check the database for updated values and return a 304 code.
// Caching was causing the site to fail to populate the lobby or
// trigger the rounds to move forward.
header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate"); // HTTP/1.1
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP/1.0

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
	else $headscripts = '';
}
?>