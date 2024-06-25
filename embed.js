(function() {
  const config = window.MyVideoCarouselConfig;

  function createPortraitContainer() {
    const container = document.createElement('div');
    container.id = 'portrait-container';
    container.innerHTML = `
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
    `;
    document.body.appendChild(container);

    const thumbnail = container.querySelector('#portrait-thumbnail');
    thumbnail.onload = () => {
      container.style.display = 'block';
    };
    thumbnail.src = ''; // The thumbnail URL will be set later when the data is fetched
  }

  function createFullscreenOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.id = 'fullscreen-overlay';
    overlay.innerHTML = `
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
    `;
    document.body.appendChild(overlay);
  }

  function init() {
    createPortraitContainer();
    createFullscreenOverlay();
    const script = document.createElement('script');
    script.src = 'https://float-video.vercel.app/scripts.js';
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
