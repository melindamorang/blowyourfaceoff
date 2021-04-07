// JavaScript Document

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-candy-vomit'){
       setTheme('theme-basic');
   } else {
       setTheme('theme-candy-vomit');
   }
}
// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-candy-vomit') {
       setTheme('theme-candy-vomit');
   } else {
       setTheme('theme-basic');
   }
})();