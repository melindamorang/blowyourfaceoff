<?php
$request_body = file_get_contents('php://input');
$searchTextDisplay = htmlspecialchars($_GET["searchText"]);
include("serverside/search-stack-text.php");
?>


<?php
// Forbid caching so the database queries don't inadvertently neglect
// to check the database for updated values and return a 304 code.
// Caching was causing the site to fail to populate the lobby or
// trigger the rounds to move forward.
// header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate"); // HTTP/1.1
// header("Cache-Control: post-check=0, pre-check=0", false);
// header("Pragma: no-cache"); // HTTP/1.0
?>

<?php $pagename = "Search Stacks" ?>
<?php include("header.php"); ?>

	<div class="main-content">
		<h2>Showing results for: <span id="searchText"><?php echo $searchTextDisplay; ?></span></h2>

		<div id="searchResults">

			<?php 

				if(mysqli_num_rows($result)==0){
					echo "<p>No results found.<p>";
				} else {

					// For each result, construct a URL to its associated stack and create an li with the stack text
					$liStrings = array();
					$currentGameID = "";
					$currentStackOwner = "";
					while($row = mysqli_fetch_assoc($result)){
						$data = htmlspecialchars($row["ImgRef"]);
						$gid = htmlspecialchars($row["GameID"]);
						$owner = htmlspecialchars($row["StackOwner"]);
						if ($gid == $currentGameID && $owner == $currentStackOwner) {
							// Don't print this line because it's from the same stack as the last retrieved result
							continue;
						}
						if (str_starts_with($data, "data:image/png;base64")) {
							// Weed out erroneous results from the text strings defining drawings
							continue;
						}
						$url = "./endgame.php?gid=" . $gid . "&name=" . $owner;
						$liStrings[] = '<li><a href="' . $url . '" target="_blank" rel="noopener">' . $data . ' (Game ID ' . $gid . ', ' . $owner . '\'s stack)</a></li>';
						$currentGameID = $gid;
						$currentStackOwner = $owner;
					}

					$numResults = count($liStrings);
					if ($numResults == 1){
						echo "<p>" . $numResults . " result found.<p>";
					} else {
						echo "<p>" . $numResults . " results found.<p>";
					}

					// Create a ul and print links to the stacks
					echo "<ul>";
					foreach ($liStrings as $li) {
						echo $li;
					}
					echo "</ul>";
				}
			?>
			<!-- <?php include("serverside/search-stack-text.php"); ?> -->
		</div>

		<ul class="endStackMenu">
			<li><a class="button" onclick="window.scrollTo(0,0)">Return to top</a></li>
			<li><a class="button" href="index.php">Back to Home</a></li>
		</ul>

	</div>

<?php include("footer.php"); ?>