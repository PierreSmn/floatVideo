(function() {
  const config = window.MyVideoCarouselConfig;
  const embedContainer = document.getElementById('carousel-container');

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';

  embedContainer.appendChild(iframe);

  iframe.onload = function() {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Floating Video Player</title>
        <link rel="stylesheet" href="https://float-video.vercel.app/styles.css">
      </head>
      <body>
        <div id="portrait-container">
          <img id="portrait-thumbnail" src="" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="play-button-overlay" id="play-button-overlay">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          </div>
          <div class="close-portrait-button" id="close-portrait-button" tabindex="0" aria-label="Close portrait" role="button">
            <span class="close-portrait-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 10.586L4.70718 3.29297L3.29297 4.70718L10.586 12.0002L3.29297 19.2933L4.70718 20.7075L12.0002 13.4145L19.2933 20.7075L20.7075 19.2933L13.4145 12.0002L20.7075 4.70723L19.2933 3.29302L12.0002 10.586Z" fill="white"></path>
              </svg>
            </span>
          </div>
        </div>
        <div class="fullscreen-overlay" id="fullscreen-overlay">
          <mux-player class="fullscreen-video" playback-id="" metadata-video-title="" metadata-viewer-user-id="user" autoplay></mux-player>
          <div class="close-button" tabindex="0" aria-label="Close dialog" role="button">
            <span class="close-button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 10.586L4.70718 3.29297L3.29297 4.70718L10.586 12.0002L3.29297 19.2933L4.70718 20.7075L12.0002 13.4145L19.2933 20.7075L20.7075 19.2933L13.4145 12.0002L20.7075 4.70723L19.2933 3.29302L12.0002 10.586Z" fill="white"></path>
              </svg>
            </span>
          </div>
          <div class="navigation-buttons">
            <div class="nav-button nav-button-prev" tabindex="0" aria-label="Previous video" role="button">
              <span class="nav-button-icon">
                <svg width="22" height="13" viewBox="0 0 22 13" fill="none">
                  <path d="M0.999907 11.9999L10.9998 2L20.9999 12" stroke="white" stroke-width="2.2"></path>
                </svg>
              </span>
            </div>
            <div class="nav-button nav-button-next" tabindex="0" aria-label="Next video" role="button">
              <span class="nav-button-icon">
                <svg width="22" height="13" viewBox="0 0 22 13" fill="none">
                  <path d="M0.999907 1.00013L10.9998 11L20.9999 1" stroke="white" stroke-width="2.2"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <script src="https://unpkg.com/@mux/mux-player"></script>
        <script>
          ${initializeVideoPlayer.toString()}
          ${fetchData.toString()}
          ${initializePortraitPlayer.toString()}
          ${openOverlay.toString()}
          ${playNextVideo.toString()}
          ${playPreviousVideo.toString()}
          window.initializeVideoPlayer = initializeVideoPlayer;
          initializeVideoPlayer(${JSON.stringify(config)});
        </script>
      </body>
      </html>
    `);
    doc.close();
  };
})();
