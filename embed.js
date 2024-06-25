(function() {
  const config = window.MyVideoCarouselConfig;

  function createElements() {
    const portraitContainer = document.createElement('div');
    portraitContainer.id = 'portrait-container';
    portraitContainer.innerHTML = `
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
    document.body.appendChild(portraitContainer);

    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.className = 'fullscreen-overlay';
    fullscreenOverlay.id = 'fullscreen-overlay';
    fullscreenOverlay.innerHTML = `
      <mux-player class="fullscreen-video" playback-id="" metadata-video-title="" metadata-viewer-user-id="user"></mux-player>
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
    document.body.appendChild(fullscreenOverlay);

    const style = document.createElement('style');
    style.innerHTML = `
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        background-color: #000;
        color: #fff;
        font-family: Arial, sans-serif;
      }

      #portrait-container {
        display: none; /* Hide initially */
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 120px;
        height: 200px;
        z-index: 1000;
        cursor: pointer;
        border: 2px solid #5E35B1;
        border-radius: 10px;
        overflow: hidden;
        background-color: #000;
      }

      .fullscreen-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }

      .fullscreen-video {
        height: 100%;
        width: auto;
        max-width: 100%;
      }

      .close-button {
        position: absolute;
        top: 16px;
        left: 16px;
        cursor: pointer;
        z-index: 10;
      }

      .close-button-icon svg {
        width: 24px;
        height: 24px;
      }

      .navigation-buttons {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .nav-button {
        width: 48px;
        height: 48px;
        cursor: pointer;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        margin-bottom: 8px;
        border: 2px solid grey;
      }

      .nav-button:last-child {
        margin-bottom: 0;
      }

      .nav-button-icon svg {
        fill: white;
        width: 22px;
        height: 13px;
      }

      .play-button-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }

      .play-button-overlay svg {
        width: 64px;
        height: 64px;
        fill: white;
        opacity: 0.7;
      }

      .close-portrait-button {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        z-index: 10;
      }

      .close-portrait-icon svg {
        width: 16px;
        height: 16px;
      }
    `;
    document.head.appendChild(style);
  }

  function initializeVideoPlayer() {
    let data = [];
    let currentIndex = 0;

    async function fetchData() {
      const supabaseUrl = `https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/integrations?id=eq.${config.integrationId}&select=vid1,vid2,vid3,vid4,vid5`;
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZmN4bHF3ZmZkcnFjd2dnb3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyNjY2NTYsImV4cCI6MTk4ODg0MjY1Nn0.lha9G8j7lPLVGv0IU1sAT4SzrJb0I87LfhhvQV8Tc2Q';
      
      const response = await fetch(supabaseUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const integrationData = await response.json();
      const videoIds = [integrationData[0].vid1, integrationData[0].vid2, integrationData[0].vid3, integrationData[0].vid4, integrationData[0].vid5].slice(0, config.numVideos);
      
      const videosResponse = await fetch(`https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/hostedSubs?id=in.(${videoIds.join(',')})&select=*`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      data = await videosResponse.json();
      initializePortraitPlayer();
    }

    function initializePortraitPlayer() {
      const portraitContainer = document.getElementById('portrait-container');
      const portraitThumbnail = document.getElementById('portrait-thumbnail');
      const playButtonOverlay = document.getElementById('play-button-overlay');
      const closePortraitButton = document.getElementById('close-portrait-button');

      portraitThumbnail.onload = function() {
        portraitContainer.style.display = 'block'; // Show the container once the thumbnail is loaded
      };

      portraitThumbnail.src = data[0].thumbnail;

      portraitContainer.addEventListener('click', () => openOverlay(0));
      playButtonOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        openOverlay(0);
      });

      closePortraitButton.addEventListener('click', (e) => {
        e.stopPropagation();
        portraitContainer.style.display = 'none';
      });
    }

    function openOverlay(index) {
      currentIndex = index;
      const overlay = document.getElementById('fullscreen-overlay');
      const muxPlayer = overlay.querySelector('mux-player');
      const video = data[currentIndex];

      overlay.style.display = 'flex';

      muxPlayer.setAttribute('playback-id', video.playback_id);
      muxPlayer.setAttribute('metadata-video-title', video.title);
      muxPlayer.setAttribute('metadata-viewer-user-id', 'user');

      muxPlayer.load();

      muxPlayer.addEventListener('loadeddata', function () {
        muxPlayer.play();
      });

      muxPlayer.removeEventListener('ended', playNextVideo);
      muxPlayer.addEventListener('ended', playNextVideo);
    }

    function playNextVideo() {
      currentIndex = (currentIndex + 1) % data.length;
      openOverlay(currentIndex);
    }

    function playPreviousVideo() {
      currentIndex = (currentIndex - 1 + data.length) % data.length;
      openOverlay(currentIndex);
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.close-button')) {
        const overlay = document.getElementById('fullscreen-overlay');
        const muxPlayer = overlay.querySelector('mux-player');
        muxPlayer.pause();
        overlay.style.display = 'none';
      } else if (e.target.closest('.nav-button-next')) {
        playNextVideo();
      } else if (e.target.closest('.nav-button-prev')) {
        playPreviousVideo();
      }
    });

    // Fetch data dynamically based on the integration ID
    fetchData();
  }

  function init() {
    createElements();
    initializeVideoPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
