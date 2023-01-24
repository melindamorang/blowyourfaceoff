<?php
$searchTextDisplay = htmlspecialchars($_GET["searchText"]);
?>

<?php $pagename = "Search Stacks" ?>
<?php include("header.php"); ?>

<!--Hidden controls to hold variables that need to be passed around-->
<input type="text" id="searchTextValue" hidden value="<?php echo $searchTextDisplay; ?>">

	<div class="main-content">
		<h2>Showing results for: <span id="searchText"><?php echo $searchTextDisplay; ?></span></h2>

		<div id="searchResults"></div>

		<ul class="endStackMenu">
			<li><a class="button" onclick="window.scrollTo(0,0)">Return to top</a></li>
			<li><a class="button" href="index.php">Back to Home</a></li>
		</ul>

	</div>

<?php include("footer.php"); ?>