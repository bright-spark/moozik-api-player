      const data = {
        bio: {
          name: "John Doe",
          title: "Playlist Curator",
          description:
            "YouTube Plus is a curated playlist collection of the best music videos on YouTube. Enjoy the latest hits and dance tracks from around the world.",
          image: "profile.png",
        },
        playlists: [

          {
            title: "Afrikaans",
            url: "https://www.youtube.com/playlist?list=RDEMrXlQOvXJrmnCFsKcLG_LqA",
          },

          {
            title: "Hits List",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs",
          },

          {
            title: "Pop Hits",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_nhf3h98yS3LCk_bVNQu6GjWG7ARvMaiFQ",
          },

          {
            title: "Rock",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_lfU6d5d-whk0KvABtxS0yZrj6n4NW2eTM",
          },

          {
            title: "R&B",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_mu-BhJj3yO1OXEMzahs_aJVtNWJwAwFEE",
          },

          {
            title: "Indie",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_l4QirOJJ99DTK5t5h7PdS_apsSClRfPpc",
          },

          {
            title: "Alternative",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_n4oG0HK-gS2c_tstquxLhCBjs-CF2g8Qg",
          },

          {
            title: "Decibles",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_k5vcGRXixxemtzK1eKDS7BeHys7mvYOdk",
          },

          {
            title: "Beats",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_lDmrvWsJapdRC-uQzUdJmc1tPWB-jkzRM",
          },

          {
            title: "Electronica",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_kBbljBMZ2exMXUc3MZdtXHsMwvGqf3eE8",
          },

          {
            title: "Dance Hits",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_kLWIr9gv1XLlPbaDS965-Db4TrBoUTxQ8",
          },

          {
            title: "Sing-Along",
            url: "https://www.youtube.com/playlist?list=RDCLAK5uy_nUi8B-S9ckz5feHM7oMGyQQ_eKW2Zl9aE",
          }

        ],
      };

      // Add these player-related functions right after the variable declarations
      let player;
      let apiKey;
      
      // Player event handlers
      function onPlayerReady(event) {
        try {
          // Just load the playlist without playing
          const firstPlaylist = data.playlists[0];
          const listId = extractPlaylistId(firstPlaylist.url);
          if (listId) {
            player.cuePlaylist({
              list: listId,
              listType: 'playlist',
              index: 0
            });
          }
          selectButton(0);
          centerButton(0);
        } catch (error) {
          console.error('Error in onPlayerReady:', error);
          document.getElementById('youtube-error').style.display = 'block';
        }
      }
      
      function onPlayerError(event) {
        console.error('Player Error:', event.data);
        document.getElementById('youtube-error').style.display = 'block';
      }
      
      function initPlayer() {
        if (typeof YT === 'undefined' || !YT.Player) {
          setTimeout(initPlayer, 100);
          return;
        }
        try {
          player = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 0, // Disable autoplay
              controls: 1, // Enable player controls
              rel: 0,
              modestbranding: 1,
              enablejsapi: 1,
              playsinline: 1,
              fs: 1
            },
            events: {
              'onReady': onPlayerReady,
              'onError': onPlayerError,
              'onStateChange': onPlayerStateChange
            }
          });
        } catch (error) {
          console.error('Failed to initialize player:', error);
          document.getElementById('youtube-error').style.display = 'block';
        }
      }
      
      // Add player state change handler
      function onPlayerStateChange(event) {
      const playerElement = document.querySelector('#youtube-player iframe');
      if (playerElement) {
        playerElement.style.visibility = 'visible';
        playerElement.style.opacity = '1';
      }
  
        // Hide error message if player is working
        if (event.data !== YT.PlayerState.ERROR) {
          document.getElementById('youtube-error').style.display = 'none';
        }
      }
      
      // YouTube API functions
      async function fetchPlaylistItems(playlistId) {
        try {
            const response = await fetch(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
            );
            const data = await response.json();
        
            if (data.error) {
              console.error('YouTube API Error:', data.error);
              document.getElementById('youtube-error').style.display = 'block';
              return null;
            }
        
            return data;
          } catch (error) {
            console.error('Failed to fetch playlist:', error);
            document.getElementById('youtube-error').style.display = 'block';
            return null;
          }
        }
        
      async function loadPlaylist(index) {
        const playlist = data.playlists[index];
        const listId = extractPlaylistId(playlist.url);
        if (!listId) {
          console.error('Invalid playlist URL');
          return;
        }

        try {
          if (player && player.cuePlaylist) {
            // Stop current video/playlist if playing
            player.stopVideo();
            // Immediately load the new playlist
            player.cuePlaylist({
              list: listId,
              listType: 'playlist',
              index: 0
            });
          }
        } catch (error) {
          console.error('Error loading playlist:', error);
          document.getElementById('youtube-error').style.display = 'block';
        }
      }
      
      function extractPlaylistId(url) {
        const regex = /[?&]list=([^&]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
      }
      
      function handleResize() {
        const container = document.querySelector('.youtube-container');
        if (container && player) {
          const width = container.clientWidth;
          const height = width * (9/16); // maintain 16:9 aspect ratio
          player.setSize(width, height);
        }
      }
            
      document.addEventListener("DOMContentLoaded", async () => {
        // Import and set up API key
        try {
          const configModule = await import('./config.js');
          apiKey = configModule.default.YOUTUBE_API_KEY;
          
          if (!apiKey) {
            throw new Error('YouTube API key not found');
          }
        } catch (error) {
          console.error('Failed to load config:', error);
          document.getElementById('youtube-error').style.display = 'block';
          return;
        }
      
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
        // Set up YouTube API callback
        window.onYouTubeIframeAPIReady = initPlayer;
        
        // Resize the player when the window is resized
        window.addEventListener('resize', handleResize);
      
        // Initialize UI
        loadButtons();
        calculateButtonWidth();
        loadBio();
        
        // Set up event listeners
        document.getElementById("left-arrow").addEventListener("click", scrollLeft);
        document.getElementById("right-arrow").addEventListener("click", scrollRight);
        window.addEventListener("resize", calculateButtonWidth);
        
        // Touch events for mobile
        const buttonContainer = document.getElementById("button-container");
        buttonContainer.addEventListener("touchstart", handleTouchStart);
        buttonContainer.addEventListener("touchmove", handleTouchMove);
        buttonContainer.addEventListener("touchend", handleTouchEnd);
      });
      
      let buttonWidth = 280; // Default button width in pixels

      function calculateButtonWidth() {
        const button = document.querySelector(".button");
        if (button) {
          buttonWidth =
            button.offsetWidth + parseInt(getComputedStyle(button).marginRight);
        }
      }

      function loadBio() {
        document.getElementById("profile-image").src = data.bio.image;
      }

      function loadButtons() {
        const buttonContainer = document.querySelector(".button-container");

        data.playlists.forEach((playlist, index) => {
          const button = createButton(playlist, index);
          buttonContainer.appendChild(button);
        });

        selectButton(0);
        centerButton(0);
      }

      function centerButton(index) {
        const buttonContainer = document.getElementById("button-container");
        const button = document.getElementById(`btn-${index}`);
        const containerWidth = buttonContainer.offsetWidth;
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;

        buttonContainer.scrollLeft =
          buttonLeft - containerWidth / 2 + buttonWidth / 2;
      }

      function createButton(playlist, index) {
        const button = document.createElement("button");
        button.classList.add("button");
        button.textContent = playlist.title;
        button.id = `btn-${index}`;
        button.onclick = () => {
          // Immediately load playlist and update UI
          loadPlaylist(index);
          selectButton(index);
          centerButton(index);
        };
        return button;
      }

      // Function to check if the device is iOS or Android
      function isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      }

      function selectButton(selectedId) {
        document.querySelectorAll(".button").forEach((button) => {
          const buttonId = button.id.split("-")[1];
          button.classList.toggle("selected", buttonId == selectedId);
        });
      }

      function scrollRight() {
        const container = document.getElementById("button-container");
        const firstButton = container.firstElementChild;

        container.appendChild(firstButton);
        container.scrollRight += buttonWidth;
      }

      function scrollLeft() {
        const container = document.getElementById("button-container");
        const lastButton = container.lastElementChild;

        container.prepend(lastButton);
        container.scrollLeft -= buttonWidth;
      }

      // Touch handling for touch-sensitive scrolling
      let isTouching = false;
      let startX = 0;
      let touchScrollLeft = 0;

      function handleTouchStart(event) {
        isTouching = true;
        startX = event.touches[0].pageX;
        touchScrollLeft =
          document.getElementById("button-container").scrollLeft;
      }

      function handleTouchMove(event) {
        if (!isTouching) return;
        const touchX = event.touches[0].pageX;
        const walk = (touchX - startX) * 1.5;
        document.getElementById("button-container").scrollLeft =
          touchScrollLeft - walk;
      }

      function handleTouchEnd() {
        isTouching = false;
      }
