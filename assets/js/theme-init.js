// Runs in <head> before first paint, so a remembered theme never flashes.
(function () {
  var root = document.documentElement;
  root.setAttribute('data-js', '');
  try {
    var stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);
  } catch (error) {
    // Storage is blocked, so the page follows the system setting.
  }
})();
