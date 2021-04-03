<?php include("load.php"); ?>

<!doctype html>
<html lang="en" class="theme-basic <?= $pagename ?>">
	
<head>
	<meta charset="UTF-8">
	<meta name="description" content="A COVID-19 social distancing-inspired version of a common party game. Check out the project on GitHub." />
	<meta name='viewport' content='width=device-width, initial-scale=.86, minimum-scale=.86, maximum-scale=2.0' />
	<link rel="icon" type="image/png" href="images/favicon-16x16.png" sizes="16x16">
	<link rel="icon" type="image/png" href="images/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="images/favicon-96x96.png" sizes="96x96">
	<title><?= $sitetitle ?></title>
	<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
	<script src="modules/shared-functions.js"></script>
	<script src="js/gameplay-canvas.js"></script>
	<script src="js/gameplay.js"></script>
	<script src="js/pregame.js"></script>
	<script src="https://kit.fontawesome.com/9e0e384b62.js" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="style.css" />
</head>

<body>
	<div class="layout-wrapper"><!-- LAYOUT-WRAPPER ENDS IN FOOTER -->
		<div id="header">
			<div id="logo"><a href="index.php"></a></div>
		</div>
		