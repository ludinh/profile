//----------------// //REMOVE WARN GSAP  //--------------------------//
gsap.config({ nullTargetWarn: false });

//-----------------//RESIZE WINDOWS //--------------------

//RESIZE WINDOWS
function ResizeWindows() {
	var Portrait = innerHeight >= innerWidth;
	var Landscape = innerHeight < innerWidth;
	var RatioScreeen = innerHeight / innerWidth;
	var RatioIMG = 1125 / 2000;

	if (Mobile.matches) {
		HTML.classList.add("is-mobile");

	} else {
		HTML.classList.remove("is-mobile");
	}

	Array.from(document.querySelectorAll('.more-button'), function (el) {
		if (el) {
			var Target = el.parentNode.parentNode.querySelector('.wrap-text-us');
			var FirstHeight = 0;
			if (Target) {
				var AllP = Target.querySelectorAll('p');
				if (AllP.length > 10) {
					for (var i = 0; i < 10; i++) {
						FirstHeight = AllP[i].clientHeight + FirstHeight;
					}
					Target.style.height = FirstHeight + 'px';
				}
			}
		}
	});
}

//--------------------------// SCROLL BODY //--------------------------//
document.addEventListener('scroll', function (e) {
	var currenttop = window.pageYOffset;
	//BANNER HEIGHT
	if (currenttop > 100) {
		Header.classList.add('hide');
		if (Wheel) Wheel.classList.remove('show');
	} else if (currenttop < 100 && currenttop > 10) {
		Header.classList.remove('hide');
		if (Wheel) Wheel.classList.add('show');
	}

	if (!isInViewport(Banner)) {
		StopMask.click();
	} else if (isInViewport(Banner)) {
		PlayMask.click();
	}

	if (!Mobile.matches && isInViewport(Banner)) {
		gsap.to(BannerScroll, { duration: 0, y: currenttop / 2.5 })
	}

	var YouVideo = Container.querySelector(".box-video-center");
	if (isInViewport(YouVideo)) {
		StartPlay(YouVideo);
	} else {
		StopPlay(YouVideo)
	}

	onScroll();
	windscroll = currenttop;
}, { passive: true });

//-----------------------------**/  DONE  /**-----------------------------//
function Done() {
	ContentLoad();
}

//----------------//TEXT BREAK //-------------------------
function textBreak() {
	//var textH = document.querySelectorAll('.title-main');
	var textSplit = document.querySelectorAll('.text-ani-item');

	//TEXT PRODUCT
	if (textSplit) {
		textSplit.forEach(function (element) {
			element.setAttribute('data-splitting', '');
			Splitting();
		});
	}
}


//------------------------------------------------------------------------------------------------------------------------

function TabContent() {
	//TAB-CONTENT ---------------------------------------------
	var AllTab = document.querySelector('.all-tab-content');
	var TabContent = AllTab.querySelectorAll('.tab-content');
	var InHeight = TabContent[0].clientHeight;

	//var Width = 0;
	//for (var i = 0; i < TabContent.length; i++) {
	//	Width = TabContent[i].clientWidth + Width;
	//}

	//AllTab.style.width = Width + 'px';
	AllTab.style.height = InHeight + 'px';
	TabContent[0].classList.add('active');

	Array.from(document.querySelectorAll('.trigger-tab'), function (el) {
		el.addEventListener('click', function () {
			var Data = el.getAttribute('data-name');
			isFirst = 1;

			Array.from(document.querySelectorAll('.trigger-tab'), function (el) {
				el.classList.remove('current');
			});

			Array.from(document.querySelectorAll(".trigger-tab[data-name='" + Data + "']"), function (el) {
				el.classList.add('current');
			});

			gsap.to(AllTab, {
				duration: 0.3, opacity: 0, ease: "none", onComplete: function () {
					Array.from(AllTab.querySelectorAll(".on-show"), function (el) {
						el.classList.remove('on-show')
					});

					Array.from(AllTab.querySelectorAll('.char'), function (el, i) {
						el.classList.remove('move');
					});

					gsap.to(AllTab, { duration: 0.2, opacity: 1, ease: "none" });
					var Active = document.querySelector(".tab-content[data-tab='" + Data + "']");
					TabContent.forEach(function (el) { el.classList.remove('active') });
					Active.classList.add('active');
					var ToHeight = Active.querySelector('.content-design-drop').offsetHeight;
					AllTab.style.height = ToHeight + 'px';

					onScroll();
					detectBut();
				}
			});
			var DetailsContent = document.querySelector('.details-content');
			DetailsContent.scrollTo(0, 0);
		})
	});

	//WEB STATIC
	if (window.location.hash) {
		LocationHash();
	} else {
		document.querySelector('.trigger-tab').click();
	}
}


function UpdateHeightTabContent() {
	var AllTab = Container.querySelector('.all-tab-content');
	var Distance = window.innerWidth;
	if (AllTab) {
		var TabContent = AllTab.querySelectorAll('.tab-content');
		var Width = 0;
		for (var i = 0; i < TabContent.length; i++) {
			Width = TabContent[i].clientWidth + Width;
		}
		var Active = AllTab.querySelector('.tab-content.active');
		if (Active) {
			var InHeight = Active.offsetHeight;
			var Index = [].slice.call(Active.parentNode.children).indexOf(Active);
			AllTab.style.width = Width + 'px';
			AllTab.style.height = InHeight + 'px';
			gsap.to(AllTab, { duration: 0, left: -((Index) * Distance), ease: "power2" });
		}
	}
}


//---------------------------------------**/  OPTION  /**------------------------------------------------//

function Option() {
	var ViewAlbum = Container.querySelectorAll('.view-album:not(.already)');
	ViewAlbum.forEach(function (el) {
		el.classList.add('already');
		el.addEventListener('click', function (e) {
			e.preventDefault();
			var Url = this.getAttribute('href');
			Body.classList.add('no-scroll');
			HTML.classList.add('no-scroll');
			OverlayDark.classList.add('show');
			AllAlbum.classList.add('show');
			Container.classList.add('blur');
			Header.classList.add('blur');

			//LOADX
			Body.insertAdjacentHTML('beforeend', '<div class="loadx"></div>');
			var Loadx = document.querySelector('.loadx');
			Loadx.style.opacity = "1";
			AlbumLoad(Url, 0);
			return false;
		});
	})

	var ViewVideo = Container.querySelectorAll('.view-video:not(.already)');
	ViewVideo.forEach(function (el) {
		el.classList.add('already');
		el.addEventListener('click', function (e) {
			e.preventDefault();
			var idx = this.getAttribute('href');
			var youTubeUrl = this.getAttribute('data-embed');
			var youTubeId;
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = youTubeUrl.match(regExp);
			if (match && match[2].length == 11) {
				youTubeId = match[2];
			} else {
				youTubeId = 'no video found';
			}
			var Source = '<iframe id="VYT" title="video" src="https://www.youtube.com/embed/' + youTubeId + '?autoplay=1&enablejsapi=1&controls=1&loop=0&playsinline=1&color=white&rel=0&cc_load_policy=1&playlist=' + youTubeId + '" frameborder="0"  allow="autoplay" allowfullscreen></iframe>';
			Html.classList.add('no-scroll');
			Body.classList.add('no-scroll');
			Container.classList.add('blur');
			Header.classList.add('blur');
			OverlayDark.classList.add('show');
			gsap.to(".allvideo", { opacity: "1", duration: 1, display: 'block', ease: "power2", delay: 1 });

			Body.insertAdjacentHTML('beforeend', '<div class="loadx"></div>');
			var Loadx = document.querySelector('.loadx');
			Loadx.style.opacity = "1";
			VideoLoad(idx, Source);
		})
	})


	var Piczoom = document.querySelectorAll('.zoom-pic:not(.already)');
	if (Piczoom) {
		var AllPics = document.querySelector('.all-pics');
		Piczoom.forEach(function (el) {
			el.classList.add('already');
			el.addEventListener('click', function (element) {

				var thispic = el.querySelector('img') || el;
				Html.classList.add('no-scroll');
				Body.classList.add('no-scroll');
				OverlayDark.classList.add('show');
				AllPics.classList.add('show');
				Container.classList.add('blur');
				Header.classList.add('blur');
				var Full = document.createElement('div');
				var Close = document.createElement('div');

				Full.classList.add('full');
				Close.classList.add('close-pics');
				var TextElement = thispic.parentNode.parentNode.parentNode.querySelector('h3');
				if (TextElement) {
					var TextLength = document.createElement('div');
					var TextLengthTitle = document.createElement('h3');
					TextLength.className = 'text-length';
					TextLength.append(TextLengthTitle);
					AllPics.append(Full, TextLength);
					Body.append(Close);
					TextLengthTitle.textContent = TextElement.textContent;
					TextLength.classList.add('fadeindown');
				} else {
					AllPics.append(Full);
					Body.append(Close);
				}


				//APPEND PIC LARGE
				var IMG = thispic.dataset.datasrc;
				if (IMG) {
					var activePicLarge = IMG;
				} else {
					var activePicLarge = thispic.src;
				}

				var Large = document.createElement('img');
				var Span = document.createElement('span');
				Large.src = activePicLarge;
				AllPics.querySelector('.full').appendChild(Large);
				AllPics.querySelector('.full').appendChild(Span);

				AllPics.querySelector('img').addEventListener("load", function (thisImg) {
					Full.classList.add('pinch-zoom');
					new PinchZoom.default(Full, { draggableUnzoomed: false });

					Large.classList.add('fadein');
					gsap.fromTo(Close, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1 });
				});
				Span.addEventListener('click', function () {
					Close.click();
				})
				Close.addEventListener('click', function () {
					gsap.to(Close, {
						duration: 0.5, opacity: 0, ease: "none", onComplete: function () {
							Close.remove();
						}
					});
					OverlayDark.classList.remove('show');

					gsap.to(Full, {
						duration: 0.5, opacity: 0, ease: "none", onComplete: function () {
							AllPics.classList.remove('show');
							AllPics.innerHTML = '';
							Html.classList.remove('no-scroll');
							Body.classList.remove('no-scroll');
							Container.classList.remove('blur');
							Header.classList.remove('blur');
						}
					});

					return false;
				});
			});
		})
	}


	var ZoomBut = document.querySelectorAll('button.zoom:not(.already)');
	if (ZoomBut) {
		var AllPics = document.querySelector('.all-pics');
		ZoomBut.forEach(function (el) {
			el.classList.add('already');
			el.addEventListener('click', function (element) {
				var thispic = el.parentNode.querySelector('img');
				Html.classList.add('no-scroll');
				Body.classList.add('no-scroll');
				OverlayDark.classList.add('show');
				AllPics.classList.add('show');
				Container.classList.add('blur');
				Header.classList.add('blur');
				var Full = document.createElement('div');
				var Close = document.createElement('div');

				Full.classList.add('full');
				Close.classList.add('close-pics');
				var TextElement = thispic.parentNode.parentNode.parentNode.querySelector('h3');
				if (TextElement) {
					var TextLength = document.createElement('div');
					var TextLengthTitle = document.createElement('h3');
					TextLength.className = 'text-length';
					TextLength.append(TextLengthTitle);
					AllPics.append(Full, TextLength);
					Body.append(Close);
					TextLengthTitle.textContent = TextElement.textContent;
					TextLength.classList.add('fadeindown');
				} else {
					AllPics.append(Full);
					Body.append(Close);
				}

				//APPEND PIC LARGE
				var IMG = thispic.dataset.datasrc;
				if (IMG) {
					var activePicLarge = IMG;
				} else {
					var activePicLarge = thispic.src;
				}

				var Large = document.createElement('img');
				var Span = document.createElement('span');
				Large.src = activePicLarge;
				AllPics.querySelector('.full').appendChild(Large);
				AllPics.querySelector('.full').appendChild(Span);

				AllPics.querySelector('img').addEventListener("load", function (thisImg) {
					Full.classList.add('pinch-zoom');
					new PinchZoom.default(Full, { draggableUnzoomed: false });

					Large.classList.add('fadein');
					gsap.fromTo(Close, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1 });
				});
				Span.addEventListener('click', function () {
					Close.click();
				})
				Close.addEventListener('click', function () {
					gsap.to(Close, {
						duration: 0.5, opacity: 0, ease: "none", onComplete: function () {
							Close.remove();
						}
					});
					OverlayDark.classList.remove('show');

					gsap.to(Full, {
						duration: 0.5, opacity: 0, ease: "none", onComplete: function () {
							AllPics.classList.remove('show');
							AllPics.innerHTML = '';
							Html.classList.remove('no-scroll');
							Body.classList.remove('no-scroll');
							Container.classList.remove('blur');
							Header.classList.remove('blur');
						}
					});

					return false;
				});
			});
		})
	}

}

//------------------------------------------------------------------------------------------------------------------------

function detectBut() {
	var SubActive = document.querySelectorAll('.outer-nav .current');
	if (OuterNav) {
		if (OuterNav.classList.contains('oversize')) {
			SubActive.forEach(function (el) {
				var Left = el.parentNode.parentNode.parentNode.offsetLeft;
				var XLeft = el.parentNode.offsetLeft;
				var Middle = innerWidth / 2 - el.clientWidth / 2 - 40;
				el.parentNode.parentNode.parentNode.scrollLeft = (XLeft - Middle) - Left;
			})
		} else {
			Array.from(document.querySelectorAll('.sub-nav ul'), function (element) {
				element.removeAttribute('style');
			});
		}
	}
}

//---------------------------------------**/  POPUP LOAD  /**------------------------------------------------//

function LinkLoadPopup() {
	var LinkPopup = document.querySelectorAll('.link-popup:not(.already)');

	if (LinkPopup) {
		LinkPopup.forEach(function (el) {
			if (!el.classList.contains('already')) {
				el.classList.add('already');

				el.addEventListener('click', function (e) {
					e.preventDefault();
					var Hash = this.getAttribute("data-name");
					var url = this.getAttribute("href");
					var DetailsContent = document.querySelector('.details-content');
					if (DetailsContent) {
						DetailsContent.remove();
					}
					Body.classList.add('no-scroll');
					HTML.classList.add('no-scroll');
					OverlayDark.classList.add('show');
					Container.classList.add('blur');
					Header.classList.add('blur');

					//LOADX
					Body.insertAdjacentHTML('beforeend', '<div class="loadx" style="display:block"></div>');
					var Loadx = document.querySelector('.loadx');
					Loadx.style.opacity = "1";
					popupLoad(url);
					return false;
				});
			}
		})
	}
}

//------------------------------------------------------------------------------------------------------------------------

function SubOverSize() {
	var SubNavLiNotSecond = OuterNav.querySelectorAll('li');
	var SecondOuter = Header.querySelector('.outer-nav.second');
	var LengthWidth = 0;
	for (var i = 0; i < SubNavLiNotSecond.length; i++) {
		LengthWidth = LengthWidth + SubNavLiNotSecond[i].clientWidth;
		if (LengthWidth > innerWidth) {
			if (SecondOuter) {
				SecondOuter.classList.add('oversize');
			}
			addClass(OuterNav, 'oversize');
		} else {
			if (SecondOuter) {
				SecondOuter.classList.remove('oversize');
			}
			removeClass(OuterNav, 'oversize');
		}
	}
}

//-----------------------------//  SERVICE-WORKERS  //-----------------------------//
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('../sw.js').then(function (registration) {
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function (err) {
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}

