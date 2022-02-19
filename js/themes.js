// JavaScript Document
/*
There are three files related to using themes: style.css, modules/themesmenu.html, and this one.
To add a new theme:
-Create a new theme class in style.css
-Add the theme option to themesmenu.html: toggleTheme('cssclassname')
*/


//Saves theme name to local storage
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

//Apply selectd theme
function toggleTheme(themeName) {
	setTheme(themeName);
}

//Sets default theme if no theme is saved in local storage
(function () {
	var currentTheme = localStorage.getItem('theme');
	if (currentTheme != null) {
       setTheme(currentTheme);
   } else {
       setTheme('theme-basic');
   }
})();