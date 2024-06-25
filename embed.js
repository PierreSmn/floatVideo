(function() {
  const script = document.currentScript;
  const src = script.src;
  const url = src.substring(0, src.lastIndexOf('/')) + '/index.html';

  fetch(url)
    .then(response => response.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
      // Initialize your video player here if needed
    });
})();
