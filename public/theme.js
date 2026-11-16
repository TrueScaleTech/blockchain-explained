// Applies a saved theme choice before the first paint, so the page never flashes the other
// theme. Loaded as a file (not inline) because the Content-Security-Policy allows only 'self'.
try {
  var saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
} catch (e) {}
