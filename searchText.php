<?php
$searchTextDisplay = htmlspecialchars($_GET["searchText"]);
// include("serverside/search-stack-text.php");
include("serverside/open-database-connection.php");
$searchText = mysqli_real_escape_string($link, $searchTextDisplay);
// There doesn't seem to be a good way to return only distinct GameID/StackOwner combinations.
// Can't use DISTINCT because we only want it to apply to GameID/StackOwner and not ImgRef.
// DISTINCT ON (GameID, StackOwner) is not supported on our flavor of SQL.
// Just grab them all and deal with it in post-processing.
$result = mysqli_query($link, "SELECT GameID, StackOwner, ImgRef FROM game_data WHERE ImgRef LIKE '%" . $searchText . "%' ORDER BY GameID, StackOwner");
include("serverside/close-database-connection.php");
?>



<?php $pagename = "Search Stacks" ?>
<?php include("header.php"); ?>

	<div class="main-content">
		<h2>Showing results for: <span id="searchText"><?php echo $searchTextDisplay; ?></span></h2>

		<div id="searchResults">
			<p>Search results should be below here</p>

			<?php 

				if(mysqli_num_rows($result)==0){
					echo "<p>No results found.<p>";
				} else {
					echo "<p>Apparently there were some rows.  Where are they?</p>";

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
		</div>

		<ul class="endStackMenu">
			<li><a class="button" onclick="window.scrollTo(0,0)">Return to top</a></li>
			<li><a class="button" href="index.php">Back to Home</a></li>
		</ul>

	</div>

<?php include("footer.php"); ?>