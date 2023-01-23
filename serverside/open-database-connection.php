<?php

// Forbid caching so the database queries don't inadvertently neglect
// to check the database for updated values and return a 304 code.
// Caching was causing the site to fail to populate the lobby or
// trigger the rounds to move forward.
header("Cache-Control: no-store"); // HTTP/1.1
// header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate"); // HTTP/1.1
//header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); // HTTP/1.0

// These variables must be defined with valid values for your database
// in order for the program to run. You can change the values here if
// desired. However, a better option is to add a file in the serverside
// folder called local-database-variables.php and define the variables
// there. If that file exists, the variable values in that file will
// override the values here. The local-database-variables.php file is
// untracked by the git repo, so you can keep your database info locally,
// change it as needed, and not risk accidentally checking it in.
$servername = "";
$username = "";
$password = "";
$database = "";
// Import local database connection info from the local-database-variables.php
// file if it exists to override the defaults above.
// Because this open-database-connection.php file may be imported into files
// in the serverside folder or its parent directory, we need to check both
// paths for the existence of the local-database-variables.php file.
$db_local_config = "local-database-variables.php";
if (file_exists($db_local_config)) include($db_local_config);
else {
    $db_local_config = "serverside/local-database-variables.php";
    if (file_exists($db_local_config)) include($db_local_config);
}

// Create connection
$link = mysqli_connect($servername, $username, $password, $database);
mysqli_set_charset($link, "utf8mb4")

?>