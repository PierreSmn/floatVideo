
(function() {
  console.log('Embed script loaded');

  // Configuration object
  window.MyVideoWidgetConfig = window.MyVideoWidgetConfig || {
    playButtonColor: '#0000FF',
    integrationId: '26' // Replace with your actual integration ID
  };

  const supabaseUrl = 'https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/integrations';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZmN4bHF3ZmZkcnFjd2dnb3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyNjY2NTYsImV4cCI6MTk4ODg0MjY1Nn0.lha9G8j7lPLVGv0IU1sAT4SzrJb0I87LfhhvQV8Tc2Q'; // Replace with your actual Supabase key

  // Function to fetch video data from the integration ID
  async function fetchVideoData(integrationId) {
    try {
      const response = await fetch(`${supabaseUrl}?id=eq.${integrationId}`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.length > 0) {
        return data[0];
      } else {
        console.error('No data found for the specified integration ID');
        return null;
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      return null;
    }
  }

  // Fetch video details from hostedSubs table using videoIds
  async function fetchVideoDetails(videoIds) {
    try {
      const response = await fetch(`https://pifcxlqwffdrqcwggoqb.supabase.co/rest/v1/hostedSubs?id=in.(${videoIds.join(',')})&select=*`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching video details:', error);
      return [];
    }
  }

  // Dynamically load external scripts like the Mux Player
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load script:', src);
    };
    document.head.appendChild(script);
  }

  // Initialize the widget and load the Mux player script
  async function initializeWidget() {
    const integrationId = window.MyVideoWidgetConfig.integrationId;

    if (!integrationId) {
      console.error('Integration ID is not specified in the configuration');
      return;
    }

    const integrationData = await fetchVideoData(integrationId);
    if (!integrationData) {
      return;
    }

    // Fetch the first video ID and title
    const videoId = integrationData['vid1'];
    if (!videoId) {
      console.error('No video ID found in integration data');
      return;
    }

    // Fetch video details from hostedSubs
    const videoDataArray = await fetchVideoDetails([videoId]);
    if (videoDataArray.length === 0) {
      console.error('No video details found for video ID:', videoId);
      return;
    }
    const videoData = videoDataArray[0];

    // Prepare video details
    const videoDetails = {
      ...videoData,
      customTitle: integrationData['title1'] || videoData.title // Use custom title from integrationData
    };

    window.MyVideoWidgetConfig.videoData = videoDetails;

    // Load Mux Player script FIRST, then render the widget after it's fully loaded
    loadScript('https://unpkg.com/@mux/mux-player', function() {
      console.log('Mux Player script loaded');
      renderWidget(); // Only render the widget after the Mux player script is loaded
    });

    // Optional: Load external CSS for styles if you have one
    /*
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://YOUR_CSS_URL_HERE/styles.css';
    document.head.appendChild(link);
    */

    // Prepare overlay
    var overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.id = 'fullscreen-overlay';
    overlay.innerHTML = `
      <div class="fullscreen-video-container">
        <mux-player class="fullscreen-video" playback-id="" metadata-video-title="" metadata-viewer-user-id="user" autoplay></mux-player>
        <div class="close-button" id="close-overlay" tabindex="0" aria-label="Close dialog" role="button">
          <span class="close-button-icon">
            <!-- Close button SVG -->
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 10.586L4.70718 3.29297L3.29297 4.70718L10.586 12.0002L3.29297 19.2933L4.70718 20.7075L12.0002 13.4145L19.2933 20.7075L20.7075 19.2933L13.4145 12.0002L20.7075 4.70723L19.2933 3.29302L12.0002 10.586Z" fill="white"></path>
            </svg>
          </span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.style.display = 'none';

    document.querySelector('.close-button').addEventListener('click', closeOverlay);
    document.getElementById('fullscreen-overlay').addEventListener('click', (e) => {
      if (!e.target.closest('.fullscreen-video-container')) {
        closeOverlay();
      }
    });
  }

  // Render the floating widget with fetched video data
  function renderWidget() {
    const { videoData } = window.MyVideoWidgetConfig;

    console.log('Video Data:', videoData);

    // Create floating widget container
    var widgetContainer = document.createElement('div');
    widgetContainer.className = 'floating-video-widget';
    widgetContainer.id = 'floating-video-widget';

    var widgetImageDiv = document.createElement('div');
    widgetImageDiv.className = 'widget-image';

    var img = document.createElement('img');
    img.src = videoData.thumbnail;
    img.alt = videoData.customTitle; // Use the custom title for the alt attribute

    var playButtonOverlay = document.createElement('div');
    playButtonOverlay.className = 'play-button-overlay';
    playButtonOverlay.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${window.MyVideoWidgetConfig.playButtonColor}">
        <path d="M8 5v14l11-7z"></path>
      </svg>
    `;

    widgetImageDiv.appendChild(img);
    widgetImageDiv.appendChild(playButtonOverlay);
    widgetContainer.appendChild(widgetImageDiv);

    // Optional: Add title below the thumbnail
    var titleDiv = document.createElement('div');
    titleDiv.className = 'widget-title';
    titleDiv.textContent = videoData.customTitle; // Use custom title from integrationData

    widgetContainer.appendChild(titleDiv);

    // Append the widget to the body
    document.body.appendChild(widgetContainer);

    // Event listener to open the overlay
    widgetContainer.addEventListener('click', () => openOverlay());

    // Add styles for the widget
    var style = document.createElement('style');
    style.innerHTML = `
      .floating-video-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 200px;
        cursor: pointer;
        z-index: 1000;
        text-align: center;
      }
      .floating-video-widget .widget-image {
        position: relative;
      }
      .floating-video-widget img {
        width: 100%;
        border-radius: 8px;
      }
      .floating-video-widget .play-button-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .floating-video-widget .widget-title {
        margin-top: 8px;
        font-size: 16px;
        color: #333;
      }
      .fullscreen-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        justify-content: center;
        align-items: center;
        z-index: 1001;
      }
      .fullscreen-video-container {
        position: relative;
        width: 80%;
        max-width: 800px;
      }
      .fullscreen-video-container mux-player {
        width: 100%;
        height: auto;
      }
      .close-button {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #fff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 28px;
        font-size: 24px;
        cursor: pointer;
        color: #000;
      }
      .close-button-icon svg {
        width: 24px;
        height: 24px;
      }
    `;
    document.head.appendChild(style);
  }

  // Function to open the video overlay with Mux player
  function openOverlay() {
    const overlay = document.getElementById('fullscreen-overlay');
    const muxPlayer = overlay.querySelector('mux-player');
    const video = window.MyVideoWidgetConfig.videoData;

    // Log title and metadata
    console.log('Setting metadata-video-title:', video.customTitle);

    // Set the metadata BEFORE loading the player
    muxPlayer.setAttribute('playback-id', video.playback_id);
    muxPlayer.setAttribute('metadata-video-title', video.customTitle || 'Untitled Video'); // Use custom title
    muxPlayer.setAttribute('metadata-viewer-user-id', 'user');

    // Load the player AFTER setting metadata
    muxPlayer.load();

    // Use loadedmetadata event to ensure metadata is processed before playing
    muxPlayer.addEventListener('loadedmetadata', function () {
      console.log('Player loaded with metadata:', {
        title: muxPlayer.getAttribute('metadata-video-title'),
        playbackId: muxPlayer.getAttribute('playback-id')
      });
      muxPlayer.play(); // Play the video once metadata is fully loaded
    });

    overlay.style.display = 'flex'; // Show the overlay
  }

  // Function to close the overlay and pause the video
  function closeOverlay() {
    const overlay = document.getElementById('fullscreen-overlay');
    const muxPlayer = overlay.querySelector('mux-player');
    muxPlayer.pause();
    overlay.style.display = 'none';
  }

  // Initialize widget on page load
  initializeWidget();
})();
</script>
