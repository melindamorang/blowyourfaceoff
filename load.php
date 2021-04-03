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

?>