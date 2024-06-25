(function() {
  const script = document.currentScript;
  const baseUrl = 'https://float-video.vercel.app';

  fetch(`${baseUrl}/index.html`)
    .then(response => response.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);

      const styleElement = document.createElement('link');
      styleElement.rel = 'stylesheet';
      styleElement.href = `${baseUrl}/style.css`;
      document.head.appendChild(styleElement);

      const scriptElement = document.createElement('script');
      scriptElement.src = `${baseUrl}/script.js`;
      document.body.appendChild(scriptElement);
    })
    .catch(error => {
      console.error('Error loading the HTML content:', error);
    });
})();
