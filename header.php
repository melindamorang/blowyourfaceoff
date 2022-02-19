<?php include("load.php"); ?>

<!doctype html>
<html lang="en" class="theme-basic">
	
<head>
	<meta charset="UTF-8">
	<meta name="description" content="A COVID-19 social distancing-inspired version of a common party game. Check out the project on GitHub." />
	<meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=2.0' />
	<link rel="icon" type="image/png" href="images/favicon-16x16.png" sizes="16x16">
	<link rel="icon" type="image/png" href="images/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="images/favicon-96x96.png" sizes="96x96">
	<title><?= $sitetitle ?></title>
	<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
	<script src="modules/shared-functions.js"></script>
	<script src="js/themes.js"></script>
	<?= $headscripts ?>
	<script src="https://kit.fontawesome.com/9e0e384b62.js" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="style.css" />
</head>

<body class="<?= $pagename ?>">
	<div class="layout-wrapper"><!-- LAYOUT-WRAPPER ENDS IN FOOTER -->
		<div id="header">
			<div id="mainmenu">
				<ul>
					<li><a href="index.php">New Game</a></li>
					<li class="dropdown"><a>Themes</a>
						<ul class="dropdown-content">
							<?php include("modules/themesmenu.html"); ?>
						</ul>
					</li>
				</ul>
			</div>
			<div id="logo"></div>
		</div>