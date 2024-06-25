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

  function initializeVideoPlayer() {
    let data = [];
    let currentIndex = 0;

    async function fetchData(integrationId) {
      const supabaseUrl = `https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/integrations?id=eq.${integrationId}&select=vid1,vid2,vid3,vid4,vid5`;
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

    document.querySelector('.close-button').addEventListener('click', () => {
      const overlay = document.getElementById('fullscreen-overlay');
      const muxPlayer = overlay.querySelector('mux-player');
      muxPlayer.pause();
      overlay.style.display = 'none';
    });

    document.querySelector('.nav-button-next').addEventListener('click', playNextVideo);
    document.querySelector('.nav-button-prev').addEventListener('click', playPreviousVideo);

    // Fetch data dynamically based on the integration ID
    fetchData(config.integrationId);
  }

  function init() {
    createPortraitContainer();
    createFullscreenOverlay();
    initializeVideoPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
