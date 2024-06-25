(function() {
  const script = document.currentScript;
  const url = 'https://float-video.vercel.app/index.html';

  fetch(url)
    .then(response => response.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);

      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://float-video.vercel.app/script.js';
      document.body.appendChild(scriptElement);
    })
    .catch(error => {
      console.error('Error loading the HTML content:', error);
    });
})();
