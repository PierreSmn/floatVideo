(function() {
  const baseUrl = 'https://float-video.vercel.app';

  // Function to dynamically load CSS
  function loadCSS(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS from ${url}`));
      document.head.appendChild(link);
    });
  }

  // Function to dynamically load JavaScript
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script from ${url}`));
      document.body.appendChild(script);
    });
  }

  // Function to dynamically load HTML content
  function loadHTML(url) {
    return fetch(url)
      .then(response => response.text())
      .then(html => {
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);
      });
  }

  // Load all resources and initialize player
  window.initializeVideoPlayer = function(integrationId) {
    Promise.all([
      loadCSS(`${baseUrl}/style.css`),
      loadHTML(`${baseUrl}/index.html`)
    ])
    .then(() => loadScript('https://unpkg.com/@mux/mux-player'))
    .then(() => loadScript(`${baseUrl}/script.js`))
    .then(() => initializePlayer(integrationId))
    .catch(error => console.error('Error loading resources:', error));
  };
})();
