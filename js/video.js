//VIDEO
document.querySelectorAll('.box-video-center').forEach(function (videoFull) {
	var timeX;
	var player;
	var timeupdate = 0;
	var inlineVideo = videoFull.querySelector(".inline-video");
	var youtubeVideo = videoFull.querySelector(".youtube-video");
	var BgVideo = videoFull.querySelector('.bg-video');
	var videoControls = videoFull.querySelector('.controls');
	var playBack = videoFull.querySelector('.playback-button');
	var playVid = videoFull.querySelector('.player-vid');
	var videoTime = videoFull.querySelector('.video-time');
	var timeElapsed = videoFull.querySelector('.time-elapsed');
	var duration = videoFull.querySelector('.duration');
	var progressBar = videoFull.querySelector('.progressbar');
	var Seek = videoFull.querySelector('.seek');
	var volumeButton = videoFull.querySelector('.volume-button');
	var volumeMute = videoFull.querySelector('.volume-mute');
	var volumeHigh = videoFull.querySelector('.volume-high');
	var fullscreenButton = videoFull.querySelector('.fullscreen-button');

	if (BgVideo) {
		var Bg = BgVideo.getAttribute('data-background');
		BgVideo.style.backgroundImage = "url('" + Bg + "')";
	}


	if (fullscreenButton) {
		var goFullscreen = fullscreenButton.querySelector('.fullscreen-icon');
		var exitFullscreen = fullscreenButton.querySelector('.fullscreen-exit-icon');
	}

	//---------------------------------------
	//CONVERT TIME
	function formatTime(time) {
		time = Math.round(time);
		var minutes = Math.floor(time / 60),
			seconds = time - minutes * 60;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		return minutes + ":" + seconds;
	}

	//GET TIME 
	function getTimeVideo() {
		if (youtubeVideo) {
			var videoDuration = Math.round(player.getDuration());
		} else {
			var videoDuration = Math.round(inlineVideo.duration);
		}

		Seek.setAttribute('max', videoDuration);
		progressBar.setAttribute('max', videoDuration);

	}


	//ANIMATION PLAY PAUSE BUTTON CENTER
	function animatePlayback() {
		if (!Mobile.matches) {
			// playVid.classList.remove('display-none');
		}
		playVid.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.3)' }], { duration: 500 });
	}


	//UPDATE CLASS BUTTON
	function updateFullscreenButton() {
		if (document.webkitFullscreenElement || document.fullscreenElement) {
			fullscreenButton.setAttribute('data-state', 'cancel-fullscreen');
			videoFull.classList.add('full-frame');
			document.body.classList.add('no-scroll', 'fullscreen');
			goFullscreen.classList.add('display-none');
			exitFullscreen.classList.remove('display-none');
		} else {
			fullscreenButton.setAttribute('data-state', 'go-fullscreen');
			videoFull.classList.remove('full-frame');
			document.body.classList.remove('no-scroll', 'fullscreen');
			goFullscreen.classList.remove('display-none');
			exitFullscreen.classList.add('display-none');
		}
	}

	//HIDE CONTROL
	function hideControls() {
		if (youtubeVideo) {
			if (YT.PlayerState.PAUSED) return;
		} else {
			if (inlineVideo.paused) return;
		}

		videoControls.classList.add('hide');
	}

	//SHOW CONTROL
	function showControls() {
		videoControls.classList.remove('hide');
		clearInterval(timeX);
		timeX = setInterval(function () {
			if (!Mobile.matches) {
				videoControls.classList.add('hide');
			}
		}, 5000);
	}

	function StopAPI() {
		videoFull.classList.remove('onstream');
		playVid.classList.remove('hide');
		playBack.setAttribute('data-state', 'play');
		Array.from(videoFull.querySelectorAll('.play-icon'), function (el) {
			el.classList.remove('display-none');
		});

		Array.from(videoFull.querySelectorAll('.pause-icon'), function (el) {
			el.classList.add('display-none');
		});
	}


	function PlayAPI() {
		videoFull.classList.add('onstream');
		playVid.classList.add('hide');
		playBack.setAttribute('data-state', 'pause');
		if (BgVideo) {
			BgVideo.classList.add('hide');
		}
		Array.from(videoFull.querySelectorAll('.play-icon'), function (el) {
			el.classList.add('display-none');
		});

		Array.from(videoFull.querySelectorAll('.pause-icon'), function (el) {
			el.classList.remove('display-none');
		});
	}


	//TOGGLE PLAY STOP
	function togglePlay() {
		var Data = playBack.getAttribute('data-state');
		if (Data == "play") {
			if (youtubeVideo) {
				player.playVideo();
			} else {
				inlineVideo.play();
			}
			PlayAPI();

		} else {
			if (youtubeVideo) {
				player.pauseVideo();
			} else {
				inlineVideo.pause();
			}
			StopAPI();
		}
	}


	//TOGGLE MUTE UNMUTE
	function toggleMute() {
		var Data = volumeButton.getAttribute('data-state');
		if (Data == "unmute") {
			if (youtubeVideo) {
				player.unMute();
			} else {
				inlineVideo.muted = false;
			}
			volumeButton.setAttribute('data-state', 'mute');
			volumeMute.classList.add('display-none');
			volumeHigh.classList.remove('display-none');
		} else {
			if (youtubeVideo) {
				player.mute();
			} else {
				inlineVideo.muted = true;
			}
			volumeButton.setAttribute('data-state', 'unmute');
			volumeMute.classList.remove('display-none');
			volumeHigh.classList.add('display-none');
		}
	}


	//UPDATE TIME DISPLAY
	function updateTimerDisplay() {
		if (youtubeVideo) {
			timeElapsed.innerHTML = formatTime(player.getCurrentTime());
			duration.innerHTML = formatTime(player.getDuration());
		} else {
			timeElapsed.innerHTML = formatTime(inlineVideo.currentTime);
			duration.innerHTML = formatTime(inlineVideo.duration);
		}
	}

	//UPDATE PROGRESSBAR
	function updateProgress() {
		if (youtubeVideo) {
			Seek.value = Math.floor(player.getCurrentTime());
			progressBar.value = Math.floor(player.getCurrentTime());
		} else {
			Seek.value = Math.floor(inlineVideo.currentTime);
			progressBar.value = Math.floor(inlineVideo.currentTime);
		}
	}

	//TRACK SKIP
	function trackSkip(event) {
		var skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
		if (youtubeVideo) {
			player.seekTo(skipTo);
		} else {
			inlineVideo.currentTime = skipTo;
		}
		progressBar.value = skipTo;
		Seek.value = skipTo;
	}

	//KEYBOARD HOTKEY
	function keyboardShortcuts(event) {
		var key = event.key;
		switch (key) {
			case 'k':
				togglePlay();
				animatePlayback();
				break;
			case 'm':
				toggleMute();
				break;
			case 'f':
				//toggleFullScreen();
				break;
		}
	}


	//-------------------------------------
	//VIDEO YOUTUBE

	if (youtubeVideo) {

		//APPEND JS	
		var IDscript = document.getElementById("youtube_js");
		if (!IDscript) {
			var script = document.createElement('script');
			script.id = 'youtube_js';
			script.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(script);
		}

		if (youtubeVideo && !IDscript) {

			var youTubeUrl = youtubeVideo.getAttribute('data-embed');
			var youTubeId;
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = youTubeUrl.match(regExp);
			if (match && match[2].length == 11) {
				youTubeId = match[2];
			} else {
				youTubeId = 'no video found';
			}

			if (Mobile.matches) {
				var SRC = '<iframe id="VYT" title="video" src="https://www.youtube.com/embed/' + youTubeId + '?autoplay=1&enablejsapi=1&controls=1&loop=1&playsinline=1&color=white&rel=0&cc_load_policy=1&playlist=' + youTubeId + '" frameborder="0"  allow="autoplay" allowfullscreen></iframe>';
			} else {
				var SRC = '<iframe id="VYT" title="video" src="https://www.youtube.com/embed/' + youTubeId + '?autoplay=1&enablejsapi=1&controls=0&loop=1&playsinline=1&color=white&rel=0&cc_load_policy=1&playlist=' + youTubeId + '" frameborder="0"  allow="autoplay" allowfullscreen></iframe>';
			}

			//APPEND IFRAME
			youtubeVideo.innerHTML = SRC;

			window.onYouTubePlayerAPIReady = function () {
				player = new YT.Player('VYT', {
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChange,
					}
				});
			}

			//ON STATE CHANGE
			function onPlayerStateChange(event) {
				switch (event.data) {
					case YT.PlayerState.PLAYING:
						clearInterval(timeupdate);
						timeupdate = setInterval(function () {
							updateTimerDisplay();
							updateProgress();
						}, 300);
						break;
					case YT.PlayerState.PAUSED:

						break;
					case YT.PlayerState.ENDED:
						break;
				};
			}

			//ON READY
			function onPlayerReady(event) {
				event.target.mute();
				var Iframe = youtubeVideo.querySelector('iframe');

				if (player.getPlayerState()) {
					var Title = player.getVideoData().title;
					Iframe.setAttribute('title', Title);
				}

				getTimeVideo();
				controlVideo();
				setTimeout(function () {
					player.pauseVideo();
					updateTimerDisplay();
					updateProgress();
					videoTime.classList.remove('display-none');
				}, 300);

			}

			//VIDEO YOUTUBE EVENTS
			youtubeVideo.addEventListener('click', togglePlay);
			youtubeVideo.addEventListener('click', animatePlayback);
			youtubeVideo.addEventListener('onStateChange', updateTimerDisplay);
			youtubeVideo.addEventListener('onStateChange', updateProgress);

		}

	}

	//-------------------------------------
	//VIDEO INLINE

	if (inlineVideo) {

		//OFF ON CONTROLS VIDEO	
		if (!Mobile.matches) {
			inlineVideo.controls = false;
			videoControls.classList.remove('display-none');
		} else {
			inlineVideo.controls = true;
			videoControls.classList.add('display-none');
		}

		inlineVideo.load();
		inlineVideo.addEventListener('timeupdate', updateTimerDisplay);
		inlineVideo.addEventListener('timeupdate', updateProgress);
		inlineVideo.addEventListener('click', togglePlay);
		inlineVideo.addEventListener('click', animatePlayback);
		inlineVideo.addEventListener('loadedmetadata', getTimeVideo);

		inlineVideo.onloadedmetadata = function () {
			controlVideo();
			setTimeout(function () {
				updateTimerDisplay();
				updateProgress();
				if (!inlineVideo.paused || !inlineVideo.ended) {
					inlineVideo.pause();
				}
				videoTime.classList.remove('display-none');
			}, 300);
		}
	}

	//-------------------------------------
	//ALL EVENTS VIDEO
	document.addEventListener('fullscreenchange', updateFullscreenButton);
	document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
	function controlVideo() {
		Seek.addEventListener('input', trackSkip);
		playBack.addEventListener('click', togglePlay);
		volumeButton.addEventListener('click', toggleMute);
		fullscreenButton.addEventListener('click', function(){
			toggleFullScreen(videoFull);
		});
		videoFull.addEventListener('fullscreenchange', updateFullscreenButton);
		videoFull.addEventListener('webkitfullscreenchange', updateFullscreenButton);
		videoFull.addEventListener('mouseenter', showControls);
		videoFull.addEventListener('mousemove', showControls);
		videoFull.addEventListener('mouseleave', hideControls);
		videoControls.addEventListener('mouseenter', showControls);
		videoControls.addEventListener('mousemove', showControls);
		videoControls.addEventListener('mouseleave', hideControls);
		playVid.addEventListener('click', togglePlay);

	}
	//---------------------------------------------------

});

//TRIGGER VIDEO STOP
//STOP FUNCTION
function StopPlay(ElVideo) {
	var playBack = ElVideo.querySelector('.playback-button');
	playBack.setAttribute('data-state', 'pause');
	ElVideo.querySelector('.player-vid').click();
}


//START FUNCTION
function StartPlay(ElVideo) {
	var playBack = ElVideo.querySelector('.playback-button');
	playBack.setAttribute('data-state', 'play');
	ElVideo.querySelector('.player-vid').click();
}

