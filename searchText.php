<?php
$searchTextDisplay = htmlspecialchars($_GET["searchText"]);
?>

<?php
// Forbid caching so the database queries don't inadvertently neglect
// to check the database for updated values and return a 304 code.
// Caching was causing the site to fail to populate the lobby or
// trigger the rounds to move forward.
header("Cache-Control: no-store, no-cache, must-revalidate"); // HTTP/1.1
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP/1.0
?>

<?php $pagename = "Search Stacks" ?>
<?php include("header.php"); ?>

	<div class="main-content">
		<h2>Showing results for: <span id="searchText"><?php echo $searchTextDisplay; ?></span></h2>

		<div id="searchResults">
			<?php include("serverside/search-stack-text.php"); ?>
		</div>

		<ul class="endStackMenu">
			<li><a class="button" onclick="window.scrollTo(0,0)">Return to top</a></li>
			<li><a class="button" href="index.php">Back to Home</a></li>
		</ul>

	</div>

<?php include("footer.php"); ?>