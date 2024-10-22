
function initializePlayer(integrationId) {
  window.MyVideoCarouselConfig = {
    playButtonColor: '#0000FF',
    integrationId: integrationId,
    numVideos: 1
  };

  let data = [];
  let currentIndex = 0;

  async function fetchData() {
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
    const videoIds = [integrationData[0].vid1, integrationData[0].vid2, integrationData[0].vid3, integrationData[0].vid4, integrationData[0].vid5].slice(0, window.MyVideoCarouselConfig.numVideos);
    
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
    const thumbnailPlaceholder = document.getElementById('thumbnail-placeholder');
    const playButtonOverlay = document.getElementById('play-button-overlay');
    const closePortraitButton = document.getElementById('close-portrait-button');

    portraitThumbnail.onload = function() {
      thumbnailPlaceholder.style.display = 'none';
      portraitThumbnail.style.display = 'block';
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
    const portraitContainer = document.getElementById('portrait-container');
    const muxPlayer = overlay.querySelector('mux-player');
    const video = data[currentIndex];

    portraitContainer.style.display = 'none'; // Hide portrait container

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
    const portraitContainer = document.getElementById('portrait-container');
    //const muxPlayer = overlay.querySelector('mux-player');
    
   // muxPlayer.pause();
    overlay.style.display = 'none';
    portraitContainer.style.display = 'block'; // Show portrait container
  });



  fetchData();
}

window.initializePlayer = initializePlayer;
