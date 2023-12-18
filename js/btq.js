function isInViewport(el) {
	var rect = el.getBoundingClientRect();
	var windowHeight = window.innerHeight || document.documentElement.clientHeight;
	var windowWidth = window.innerWidth || document.documentElement.clientWidth;
	var vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
	var horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
	return vertInView && horInView;
}


function onScroll() {
	var items = document.querySelectorAll('.ani-item,  .ani-text');
	var textAni = document.querySelectorAll('.text-ani-item, .text-inner');

	items.forEach(function (el) {
		if (isInViewport(el)) {
			if (el.classList.contains('ani-text')) {
				el.classList.add('on-text');
			} else {
				el.classList.add('on-show', 'on-view');
			}

		} else {
			if (el.classList.contains('ani-text')) {
				el.classList.remove('on-text');
			} else {
				el.classList.remove('on-view');
			}
		}
	});

	//TITLE SHOW
	if (textAni) {
		textAni.forEach(function (element) {
			var Move;
			if (isInViewport(element)) {
				clearTimeout(Move);
				Array.from(element.querySelectorAll('.char'), function (el, i) {
					Move = setTimeout(function () { el.classList.add('move') }, (i + 1) * 50);
					return false;
				});
			}
		});
	}
}

//----------------//SLIDE PICTURE-----------------------------

var SlidePicture = {

	//SLIDE BANNER
	slideBanner: function () {
		if (slideMask.querySelectorAll('.slidebox-item').length > 1) {
			var timeSlide = slideMask.getAttribute('data-time');
		} else {
			var timeSlide = false;
		}

		var Slide = new Splide(slideMask, {
			type: 'fade',
			rewind: true,
			gap: 0,
			speed: 2000,
			autoplay: true,
			interval: timeSlide,
			pauseOnHover: false,
			arrows: true,
			pagination: true,
			SizeH: 40,
			SizeW: 80,
			dotNum: false,
		});


		Slide.on('mounted', function () {
			var Items = slideMask.querySelectorAll('.slidebox-item').length;
			if (Items > 1) {
				slideMask.classList.add('true-option');
				slideMask.addEventListener("swiperight", function (e) {
					Slide.go('<')
				})
				slideMask.addEventListener("swipeleft", function (e) {
					Slide.go('>')
				})
			} else {
				slideMask.classList.remove('true-option');
			}
		});


		StopMask.addEventListener('click', function () {
			Slide.Components.Autoplay.pause();
		})

		PlayMask.addEventListener('click', function () {
			Slide.Components.Autoplay.play();
		})


		Slide.on('moved', function (slideObject) {
			Array.from(slideMask.querySelectorAll('.banner-home'), function (Item) {
				Item.classList.remove('this-view');
			});
		});

		Slide.on('active', function () {
			var Current = slideMask.querySelector('.is-active');
			Current.classList.add('this-view');
		});

		Slide.mount();
	},

	//--------------------------------SLIDE-HOME-BUSINESS
	SlideHomeBusiness: function () {
		var slideThumb = Container.querySelector('.business-thumbs:not(.slide-already)');
		var SlideBusiness = Container.querySelector('.slide-business');
		var BoxBusiness = Container.querySelectorAll('.slide-box-business');
		var NextBus = Container.querySelector('.arrows-business .next-bus');
		var PrevBus = Container.querySelector('.arrows-business .prev-bus');

		if (slideThumb) {
			slideThumb.classList.add('slide-already');
			var sliders = new Splide(slideThumb, {
				rewind: true,
				speed: 1000,
				perPage: 1,
				perMove: 1,
				pagination: false,
				gap: '30px',
				arrows: false,
				drag: false,
				updateOnMove: true,
				easing: 'cubic-bezier(0.84, 0, 0.16, 1)',
				breakpoints: {
					1500: {
						gap: '20px',
						drag: false,
						pagination: false,
					},
					570: {
						destroy: true,
					}
				}
			});

			var DefaulState = {
				top: '22vw',
				left: '45vw',
				height: '22vw',
				width: '15vw',
				radius: '20px',
				pointer: 'none',
			}


			//ZOOM-OUT
			var AnimateOut = function (el) {
				el.style.opacity = "1";
				setTimeout(function () { el.classList.add('show-ani'); }, 800);
				gsap.to(el, {
					duration: 1, width: '100%', height: '100%', top: '0', left: '0', borderRadius: '0', opacity: 1, PointerEvent: 'auto', ease: "power4.inOut"
				});
			}


			//ZOOM-IN
			var AnimateIn = function (el) {
				BoxBusiness.forEach(function (el) {
					el.classList.remove('show-ani');
				})
				gsap.to(el, {
					duration: 1, width: DefaulState.width, height: DefaulState.height, top: DefaulState.top, left: DefaulState.left, PointerEvent: DefaulState.pointer, borderRadius: DefaulState.radius, ease: "power4.inOut", onComplete: function () {
						el.style.opacity = "0";
					}
				});
			}


			sliders.on('mounted', function () {
				var first = SlideBusiness.querySelector('.slide-box-business:nth-child(1)');
				AnimateOut(first);
			});

			sliders.on('mounted moved', function () {
				setTimeout(function () {
					var IsActive = slideThumb.querySelector('.thumbs-box-business.is-active');
					var Index = [].slice.call(IsActive.parentNode.children).indexOf(IsActive) + 1;
					var Bar = Container.querySelector('.slider-progress-bar');
					var SlideNumber = Container.querySelector('.slider-number');
					Bar.style.width = (Index * 100 / BoxBusiness.length) + '%';
					SlideNumber.innerHTML = "0" + Index + "";
				}, 100);

			});


			SlideBusiness.addEventListener("swiperight", function (e) {
				PrevBus.click();
			})
			SlideBusiness.addEventListener("swipeleft", function (e) {
				NextBus.click();
			})

			//NEXT--BUSINESS
			NextBus.addEventListener('click', function () {
				var IsActive = slideThumb.querySelector('.thumbs-box-business.is-active');
				var Index = [].slice.call(IsActive.parentNode.children).indexOf(IsActive) + 2;
				var TargetFull = SlideBusiness.querySelector('.slide-box-business:nth-child(' + Index + ')');

				if (Index > BoxBusiness.length) {
					Index = BoxBusiness.length;
					Array.from(Container.querySelectorAll('.thumbs-box-business'), function (Tar) {
						Tar.style.opacity = "1";
					});

					var FirstTargetFull = SlideBusiness.querySelector('.slide-box-business:first-child');
					BoxBusiness.forEach(function (Target) {
						AnimateIn(Target);
					})

					AnimateOut(FirstTargetFull);
					sliders.go('>');
				} else {
					IsActive.nextElementSibling.style.opacity = "0";
					AnimateOut(TargetFull);
					setTimeout(function () {
						sliders.go('>');
					}, 400);
				}
			})


			//PREV--BUSINESS
			PrevBus.addEventListener('click', function () {
				var IsActive = slideThumb.querySelector('.thumbs-box-business.is-active');
				var Index = [].slice.call(IsActive.parentNode.children).indexOf(IsActive) + 1;
				if (Index == 1) {
					Index = BoxBusiness.length;
					IsActive = slideThumb.querySelector('.thumbs-box-business:last-child');
					var TargetFull = SlideBusiness.querySelector('.slide-box-business:nth-child(' + Index + ')');
					AnimateOut(TargetFull)
				} else {
					var TargetFull = SlideBusiness.querySelector('.slide-box-business:nth-child(' + Index + ')');
					AnimateIn(TargetFull);
					AnimateOut(TargetFull.previousElementSibling)
				}

				sliders.go('<');

				setTimeout(function () {
					IsActive.style.opacity = "1";
				}, 950);
			})
			sliders.mount();
		}
	},

	//--------------------------------SLIDE-ONE
	SlideOneObject: function () {
		var slidesone = document.querySelectorAll('.slider-carousel:not(.slide-already)');
		if (slidesone) {
			slidesone.forEach(function (slide) {
				if (slide) {
					slide.classList.add('slide-already');
					var sliders = new Splide(slide, {
						type: 'fade',
						speed: 1500,
						perPage: 1,
						pagination: false,
						gap: '0px',
						SizeW: 50,
						SizeH: 30,
						drag: true,
						arrowPath: 'M47.5,16.2 2.5,16.2 2.5,13.8 21.7,13.8 47.5,13.8z',
						breakpoints: {
							1100: {
								pagination: true,
								arrows: false,
							},
						}
					});

					sliders.on('resize', function () {
						var Items = slide.querySelectorAll('.slidebox-item').length;
						if (Items > 1) {
							slide.classList.add('true-option');
						} else {
							slide.classList.remove('true-option');
						}
					});

					sliders.on('mounted', function () {
						var Items = slide.querySelectorAll('.slidebox-item').length;
						if (Items > 1) {
							slide.classList.add('true-option');
							slide.addEventListener("swiperight", function (e) {
								sliders.go('<')
							})
							slide.addEventListener("swipeleft", function (e) {
								sliders.go('>')
							})
						} else {
							slide.classList.remove('true-option');
						}
					});

					sliders.mount();
				}
			})
		}
	},

	//--------------------------------SLIDE-TWO
	SlideTwoObject: function () {
		var slidestwo = document.querySelectorAll('.slide-two:not(.slide-already)');
		if (slidestwo) {
			slidestwo.forEach(function (slide) {
				if (slide) {
					slide.classList.add('slide-already');
					var sliders = new Splide(slide, {
						rewind: true,
						perPage: 2,
						pagination: false,
						gap: '30px',
						SizeW: 50,
						SizeH: 30,
						arrowPath: 'M47.5,16.2 2.5,16.2 2.5,13.8 21.7,13.8 47.5,13.8z',
						speed: 600,
						breakpoints: {
							1100: {
								pagination: true,
								perPage: 2,
								gap: '20px',
							},
							660: {
								pagination: true,
								perPage: 1,
								gap: '0',
							},
						}
					});

					sliders.on('mounted', function () {
						var Items = slide.querySelectorAll('.slidebox-item').length;
						if (innerWidth > 570) {
							if (Items > 2) {
								slide.classList.add('true-option');
							} else {
								slide.classList.remove('true-option');
							}
						} else {
							if (Items > 1) {
								slide.classList.add('true-option');
							} else {
								slide.classList.remove('true-option');
							}
						}
					});

					sliders.on('resize', function () {
						var Items = slide.querySelectorAll('.slidebox-item').length;
						if (innerWidth > 570) {
							if (Items > 2) {
								slide.classList.add('true-option');
							} else {
								slide.classList.remove('true-option');
							}
						} else {
							if (Items > 1) {
								slide.classList.add('true-option');
							} else {
								slide.classList.remove('true-option');
							}
						}

					});
					sliders.mount();
				}
			})
		}
	},

	//--------------------------------SLIDE-TWO
	SlideThreeObject: function () {
		var slidesthree = document.querySelectorAll('.slide-three:not(.slide-already)');
		if (slidesthree) {
			slidesthree.forEach(function (slide) {
				if (slide) {
					slide.classList.add('slide-already');
					var sliders = new Splide(slide, {
						rewind: true,
						perPage: 3,
						pagination: false,
						gap: '30px',
						SizeW: 50,
						SizeH: 30,
						arrowPath: 'M47.5,16.2 2.5,16.2 2.5,13.8 21.7,13.8 47.5,13.8z',
						speed: 600,
						breakpoints: {
							1100: {
								destroy: true,
							},
						}
					});

					sliders.on('mounted', function () {
						var Items = slide.querySelectorAll('.slidebox-item').length;
						if (Items > 3) {
							slide.classList.add('true-option');
						} else {
							slide.classList.remove('true-option');
						}
					});

					sliders.mount();
				}
			})
		}
	},

	//--------------------------------SLIDE-POPUP-DETAILS
	SlidePopupDetails: function () {
		var slideers = document.querySelectorAll('.slide-popup-details');
		slideers.forEach(function (slide) {
			if (slide) {
				var SlideBoxTrack = slide.querySelector('.slidebox-track')
				var sliders = new Splide(slide, {
					rewind: true,
					perPage: 1,
					pagination: true,
					gap: '0px',
					SizeW: 50,
					SizeH: 30,
					arrowPath: 'M47.5,16.2 2.5,16.2 2.5,13.8 21.7,13.8 47.5,13.8z',
					speed: 600,
					updateOnMove: true,
				});

				sliders.on('mounted', function () {
					var Items = slide.querySelectorAll('.slidebox-item').length;
					if (Items > 1) {
						slide.classList.add('true-option');
					} else {
						slide.classList.remove('true-option');
					}

					setTimeout(function () {
						var ActiveHeight = slide.querySelector('.slidebox-item.is-active .pic-cover').clientHeight;
						SlideBoxTrack.style.height = ActiveHeight + 'px';
					}, 100);
				});

				sliders.on('move', function (element) {
					setTimeout(function () {
						var ActiveHeight = slide.querySelector('.slidebox-item.is-active .pic-cover').clientHeight;
						SlideBoxTrack.style.height = ActiveHeight + 'px';
					}, 50);
				});

				sliders.on('resize', function () {
					var Items = slide.querySelectorAll('.slidebox-item').length;
					if (Items > 1) {
						slide.classList.add('true-option');
					} else {
						slide.classList.remove('true-option');
					}
				});
				sliders.mount();
			}
		})
	},
}

//----------------------------------------------------------------------------------

//LOAD POPUP
function popupLoad(url) {
	var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	request.open('GET', url, true);

	request.onreadystatechange = function () {
		if (this.readyState >= 4 && this.status < 2000) {
			var data = this.response;
			Body.insertAdjacentHTML('beforeend', data);
			var DetailsContent = document.querySelector('.details-content');
			var DetailsCenter = document.querySelector('.details-center');
			var ClosePopup = DetailsContent.querySelector('.close-popup');
			gsap.fromTo(DetailsCenter, 1.2, { opacity: "0", transform: "translateY(200px)" }, { opacity: "1", delay: 0.5, transform: "none", ease: "power2" });
			ClosePopup.classList.add('goleft');

			var Loadx = document.querySelector('.loadx');
			gsap.to(Loadx, 0.4, {
				opacity: "0", ease: "power2", delay: 0.5, onComplete: function () {
					var HH = DetailsCenter.clientHeight;
					if (HH > window.innerheight) {
						DetailsCenter.classList.add('no-after');
					}
					Loadx.remove();
					TabContent();

					var AllSongs = DetailsContent.querySelectorAll('.line:not(.first-line)')
					for (var i = 0; i < AllSongs.length; i++) {
						AllSongs[i].insertAdjacentHTML('afterBegin', '<div class="num">' + i + '.</div>');
					}


				}
			});

			///CLOSE POPUP
			var ClosePopup = document.querySelectorAll('.close-popup, .details-content > span');
			ClosePopup.forEach(function (el) {
				el.addEventListener('click', function () {
					TweenMax.to(DetailsContent, 0.6, {
						opacity: "0", ease: "power2", onComplete: function () {
							DetailsContent.remove();
						}
					});
					OverlayDark.classList.remove('show');
					Body.classList.remove('no-scroll');
					HTML.classList.remove('no-scroll');
					Container.classList.remove('blur');
					Header.classList.remove('blur');
					return false;
				})
			})
		}
	};
	request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	request.send();
}


//----------------------------------------------------------------------------------

//LOAD ALBUM
function AlbumLoad(Url, Num) {

	var PageAjax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	PageAjax.open('GET', Url, true);

	PageAjax.onreadystatechange = function () {

		if (PageAjax.readyState == 4 && PageAjax.status == 200) {

			AllAlbum.innerHTML = PageAjax.responseText;
			var albumLoad = AllAlbum.querySelector('.album-load');
			var Close = AllAlbum.querySelector('.close-album');
			var timex;

			//CHARMING TEXT
			Array.from(AllAlbum.querySelectorAll('.pic-name > h3'), function (el) {
				Splitting({
					target: el,
					by: "chars",
				});
			});


			//PINCH ZOOM
			Array.from(AllAlbum.querySelectorAll('.pinch-zoom'), function (el) {
				new PinchZoom.default(el, { draggableUnzoomed: false });
			});

			//ADD TEXT
			function addText() {
				var Text = AllAlbum.querySelector('.this-view')
				var Box = Text.querySelectorAll('.pic-name h3 .char');
				Box.forEach(function (el, i) {
					timex = setTimeout(function () { el.classList.add('move') }, (i + 1) * 50);
				});
			}

			//SLIDE
			var albumSlide = albumLoad.querySelector('.album-center');
			var albumThumb = albumLoad.querySelector('.thumbs');
			var itemAlbum = albumLoad.querySelectorAll('.slidebox-item').length;
			var Items = albumSlide.querySelectorAll('.slidebox-item').length;

			if (itemAlbum > 1) {
				albumThumb.classList.add('display-block');
				albumSlide.classList.add('true-option');
			}

			//ALBUM
			var Slide = new Splide(albumSlide, {
				gap: 0,
				perPage: 1,
				speed: 600,
				start: Num,
				pagination: false,
				SizeW: 50,
				SizeH: 30,
				arrowPath: 'M47.5,16.2 2.5,16.2 2.5,13.8 21.7,13.8 47.5,13.8z',
			});

			Slide.on('moved', function () {
				Array.from(document.querySelectorAll('.slidebox-item, .pic-name h3 .char'), function (Item) {
					Item.classList.remove('this-view', 'current', 'move');
				});
			});


			Slide.on('active', function () {
				var Current = albumSlide.querySelector('.is-active');
				Current.classList.add('this-view');
				clearTimeout(timex);
				addText();
			});

			var Focus;
			if (Items > 6) {
				Focus = 'center';
			} else {
				Focus = false;
				albumThumb.classList.add('center');
			}

			//THUMB
			var Thumb = new Splide(albumThumb, {
				rewind: true,
				isNavigation: true,
				gap: 6,
				pagination: false,
				arrows: false,
				start: Num,
				perMove: 1,
				perPage: 6,
				focus: Focus,
				pagination: false,
			}).mount()

			//INIT ALBUM
			Slide.sync(Thumb).mount()
			var Loadx = document.querySelector('.loadx');

			gsap.to(albumLoad, {
				duration: 0.8, opacity: 1, ease: "none", onComplete: function () {
					Close.classList.add('goleft');
					albumSlide.classList.add('fadein');
					albumThumb.classList.add('fadeinup');
					Loadx.classList.remove('display-block');
					gsap.to(Loadx, {
						duration: 0.4, opacity: 0, ease: "none", onComplete: function () {
							Loadx.remove();
						}
					});
				}
			});


			Close.addEventListener('click', function () {
				OverlayDark.classList.remove('show');
				gsap.to(albumLoad, {
					duration: 0.5, opacity: 0, ease: "none", onComplete: function () {
						AllAlbum.classList.remove('show');
						Body.classList.remove('no-scroll');
						HTML.classList.remove('no-scroll');
						Container.classList.remove('blur');
						Header.classList.remove('blur');
						OverlayDark.innerHTML = '';
						AllAlbum.innerHTML = '';
					}
				});

				return false;

			});
		}
	}

	PageAjax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	PageAjax.send();
}

//----------------//CONTENT LOAD-----------------------------

function ContentLoad() {
	LinkPage();
	setTimeout(function () {
		Header.classList.add('show');
		Wheel.classList.add('show');
	}, 1000);

	/* HOME PAGE */
	LinkLoadPopup();

	var carousels = document.querySelector('.carousel');
	if (!document.querySelector('.is-Safari')) {
		Carousel(carousels);
	} else {
		Array.from(carousels.querySelectorAll('img'), function (el) {
			var NewDiv = document.createElement('div');
			NewDiv.className = "slidebox-item";
			NewDiv.append(el);
			carousels.querySelector('.slidebox-list').append(NewDiv);
		});
		setTimeout(function () {
			SlidePicture.SlideOneObject();
			if (!Mobile.matches) { thatScroll.update(); }
		}, 500);

	}
}


function Carousel(root) {
	var figure = root.querySelector('figure'),
		nav = root.querySelector('nav'),
		images = figure.children,
		n = images.length,
		gap = window.innerWidth > 1100 ? 80 : window.innerWidth / 20,
		bfc = 'bfc' in root.dataset,

		theta = 2 * Math.PI / n,
		currImage = 0
		;

	function setupCarousel(n, s) {
		var apothem = s / (2 * Math.tan(Math.PI / n));
		figure.style.transformOrigin = `50% 50% ${- apothem}px`;

		for (var i = 0; i < n; i++) {
			images[i].style.padding = `${gap}px`;
		}
		for (i = 1; i < n; i++) {
			images[i].style.transformOrigin = `50% 50% ${- apothem}px`;
			images[i].style.transform = `rotateY(${i * theta}rad)`;
		}
		if (bfc) {
			for (i = 0; i < n; i++) {
				images[i].style.backfaceVisibility = 'hidden';
			}
		}

		rotateCarousel(currImage);
	}

	setTimeout(function () {
		setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
	}, 500);


	window.addEventListener('resize', () => {
		setupCarousel(n, parseFloat(getComputedStyle(images[0]).width))
	});

	setupNavigation();

	function setupNavigation() {
		nav.addEventListener('click', onClick, true);
		function onClick(e) {
			e.stopPropagation();

			var t = e.target;
			if (t.tagName.toUpperCase() != 'BUTTON')
				return;

			if (t.classList.contains('next')) {
				currImage++;
			}
			else {
				currImage--;
			}
			rotateCarousel(currImage);
		}
	}

	function rotateCarousel(imageIndex) {
		figure.style.transform = `rotateY(${imageIndex * -theta}rad)`;
	}

	root.addEventListener('swipeleft', function () {
		root.querySelector('.nav.next').click()
	})

	root.addEventListener('swiperight', function () {
		root.querySelector('.nav.prev').click()
	})
}


//----------------//CHANGE PAGE-----------------------------
function LinkPage() {
	var allBlank = document.querySelectorAll('.link-blank');
	var allLink = document.querySelectorAll('.link-load, .link-home');
	allLink.forEach(function (Link) {
		Link.addEventListener('click', function (e) {

			e.preventDefault();
			var linkLocation = this.href;
			gsap.to([Container], {
				duration: 0.6, opacity: 0, ease: "none", onComplete: function () {
					window.location = linkLocation;
				}
			});
			if (hasClass(NavClick, 'show')) {
				NavClick.click();
			}

			return false;
		});
	});

	//OPEN NEW WINDOW PAGE
	allBlank.forEach(function (Link) {
		Link.addEventListener('click', function (e) {
			e.preventDefault();
			var url = this.href;
			window.open(url, '_blank');
			return false;
		});
	});
}

//----------------------------------------------------------------

//VIDEO LOAD
function VideoLoad(idx, Source) {
	var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	request.open('GET', idx, true);

	request.onload = function () {
		if (this.status >= 200 && this.status < 400) {
			var data = this.response;
			var AllVideo = document.querySelector('.allvideo');
			AllVideo.insertAdjacentHTML('beforeend', data);
			var YoutubeJs = document.querySelector('#youtube_js');
			if (!YoutubeJs) {
				var script = document.createElement('script');
				script.id = 'youtube_js';
				script.src = "https://www.youtube.com/player_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
			}

			var ViewVideo = document.querySelector('#view-video');
			var VideoList = document.querySelector('.video-list');
			var VideoWrap = VideoList.querySelector('.video-wrap');
			var VideoWrapIframe = VideoWrap.querySelector('iframe');
			var CloseVideo = VideoList.querySelector('.close-video');
			setTimeout(function () {

				if (ViewVideo) {
					var ThisVideo = document.getElementById("view-video");
					function playVid() {
						ThisVideo.play();
					}
					function pauseVid() {
						ThisVideo.pause();
					}
				}

				//------------------------------------------------------------------
				CloseVideo.classList.add('goleft');
				CloseVideo.addEventListener('click', function () {
					if (ViewVideo) { pauseVid(); }
					OverlayDark.classList.remove('show');
					gsap.to(AllVideo, {
						opacity: "0", duration: 0.5, display: 'none', ease: Power2.easeOut, onComplete: function () {
							CloseVideo.classList.remove('goleft');
							AllVideo.style.display = "none";
							VideoList.remove();
							Html.classList.remove('no-scroll');
							Body.classList.remove('no-scroll');
							Container.classList.remove('blur');
							Header.classList.remove('blur');
						}
					});
				})

				//LOADX
				var Loadx = document.querySelector('.loadx');
				gsap.to(Loadx, {
					duration: 0.4, opacity: 0, delay: 0.4, ease: Power0.easeOut, onComplete: function () {
						Loadx.remove();
					}
				});

				//------------------------------------------------------------------
				if (Source) {
					var VideoWrap = VideoList.querySelector('.video-wrap');
					VideoWrap.insertAdjacentHTML('beforeend', Source);
					var player;
					function onYouTubePlayerAPIReady() {
						player = new YT.Player('VYT', {
							events: {
								'onReady': onPlayerReady,
							}
						});
					}

					function onPlayerReady(event) {
						if (Mobile.matches) {
							event.target.mute();
							event.target.playVideo();
						}

						if (player.getPlayerState() > 1) {
							var Title = player.getVideoData().title;
							var VideoWrapIframe = VideoWrap.querySelector('iframe');
							VideoWrapIframe.setAttribute('title', Title);
						}
					}

					onYouTubePlayerAPIReady();

				} else {
					if (ViewVideo) { playVid(); }
				}
			}, 300);

		}
	};
	request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	request.send();

}

//-----------------//BLOCK - RIGHT - CLICK ------------------------------
//document.addEventListener('contextmenu', function (event) {
//	event.preventDefault();
//})

//-----------------//KEYDOWN ------------------------------

window.addEventListener('keydown', function (e) {
	var n = 40;
	var keyCode = e.keyCode || e.which;

	var Detail = document.querySelector('.content-details');
	var NavClick = document.querySelector('.nav-click');

	//ESC
	if (keyCode == 27) {
		e.preventDefault();

		Array.from(document.querySelectorAll('.close-pics, .close-popup'), function (element) {
			if (element) {
				element.click();
			}
		});
	}


	if (keyCode == 38) {
		e.preventDefault();
		if (Detail) {
			DetailLoad.scrollTop -= n;
		} else {
			document.documentElement.scrollTop -= n;
		}
	}

	if (keyCode == 40) {
		e.preventDefault();
		if (Detail) {
			DetailLoad.scrollTop += n;
		} else {
			document.documentElement.scrollTop += n;
		}
	}

	if (keyCode === 123 || keyCode === 67 || keyCode === 85) {
		return false;
	}
});

//------------------//ROTATE DEVICE---------------------------

window.addEventListener("orientationchange", function (event) {
	ResizeWindows();
});



//------------------//RESIZE WINDOWS---------------------------------

//RESIZE DELAY
window.addEventListener('resize', debounce(function () {
	ResizeWindows();
	if (OuterNav) { SubOverSize(); detectBut(); }

}, 350));


//GOTOP 
goTop.addEventListener('click', function (e) {
	e.preventDefault();
	gsap.to('html', { duration: 1, scrollTop: 0, ease: "none" })
});


//-----------------------------**/  DOMCONTENT-LOADED  /**-----------------------------//
document.addEventListener("DOMContentLoaded", function () {
	textBreak();
	Done();
	SlidePicture.slideBanner();
	SlidePicture.SlideHomeBusiness();
	Banner.classList.add('show');

	onScroll();
	Option();


	//HOME-PAGE
	if (IDPage !== "home-page") {
		//NOT HOME-PAGE

		var w = innerWidth;
		var h = innerHeight;
		var tile_amount_precalc = (w > h) ? w * 0.00013 : h * 0.00015,
			tile_amount_clac = (w > h) ? w * tile_amount_precalc : h * tile_amount_precalc,
			tile_amount = Math.round(tile_amount_clac);
		for (let i = tile_amount; i--;) {

			TileReveal.insertAdjacentHTML('beforeend', '<div class="tile-reveal-square"></div>');

		};

		Container.style.opacity = "1";
		var TileSquares = Container.querySelectorAll('.tile-reveal-square');
		gsap.to(TileSquares, {
			duration: 1,
			opacity: 0,
			scale: 0.75,
			delay: 0.25,
			ease: 'back.out(1.5)',
			stagger: {
				amount: 1,
				from: `center`,
				axis: null,
				grid: 'auto'
			}
		}, 'scene+=0.12')

		Banner.classList.add('show');
		setTimeout(function () { Done() }, 400);
	}

});

// ----------------------//GO TOP LAYOUT//-------------------------------

window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}


// ----------------------// LOCATION-HASH //-------------------------------
function LocationHash() {
	var PageActive = window.location.hash;
	PageActive = PageActive.slice(1);

	var ItemNewsA = Container.querySelector(".news-relative .item-news-home a[data-details='" + PageActive + "']");
	var SlidePagiA = Container.querySelector(".slide-pagi a[data-number='" + PageActive + "']");

	var SubNavA = Container.querySelector(".sub-nav li button[data-name='" + PageActive + "']");
	var SubAjax = Container.querySelector(".sub-ajax li a[data-name='" + PageActive + "']");

	Array.from([ItemNewsA, SlidePagiA, SubAjax, SubNavA], function (element) {
		if (element) {
			element.click();
		}
	});
}