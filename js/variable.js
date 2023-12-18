//----------------// DETECT BROWSER DEVICES //--------------------------//
var UA = navigator.userAgent || navigator.userAgentData || navigator.appVersion || navigator.platform;
var HTML = document.documentElement;
var isFirefox = UA.match(/firefox|fxios/i);
var isSafari = /constructor/i.test(window.HTMLElement)||(function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
var isIE9 = /MSIE 9/i.test(UA); 
var isIE10 = /MSIE 10/i.test(UA);
var isIE11 = /rv:11.0/i.test(UA);
var isIE = false || !!document.documentMode;
var isEdge = UA.match(/edg/i) || !isIE && !!window.StyleMedia && !isIE11;
var isChrome = UA.match(/chrome|chromium|crios/i) || UA.indexOf("Chrome") > -1 || !!window.chrome && !!window.chrome.webstore;
var Mobile =  window.matchMedia('(max-width: 1100px)');	
var Touch = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(UA) || "ontouchstart" in document.documentElement; 
var iOS =  !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var MacBrowser = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

if(isMac || MacBrowser){
    document.documentElement.classList.add('is-mac');
}

//-----------------//VAR MAIN DIV //---------------------

var doWheel = true;
var doTouch = true;
var Body = document.body;
var Html = document.querySelector('html');
var timex, timer;
var windscroll = window.pageYOffset;
var Logo = document.querySelector('.logo');
var AllAlbum = document.querySelector('.all-album');
var OverlayDark = document.querySelector('.overlay-dark');
var Footer = document.querySelector('.footer');
var Header = document.querySelector('.header');
var Navigation = Header.querySelector('.navigation');
var Container = document.querySelector('.container');
var IDPage = Container.getAttribute('id');
var goTop = document.querySelector('.go-top');
var Wheel = document.querySelector('.wheel');
var rightHeader = document.querySelector('.right-header');
var TitlePage = document.querySelector('.title-page');
var NavClick = document.querySelector('.nav-click');
var Banner = Container.querySelector('.banner') || Container.querySelector('.banner-inner');
var BannerScroll = Container.querySelector('.banner-home');
var OuterNavSec = Container.querySelector('.section-outernav');
var OuterNav = Container.querySelector('.outer-nav');
var Details = 0;
var NextOfBanner = Banner.nextElementSibling;
var TileReveal = Banner.querySelector('.tile-reveal');


/*HOME PAGE*/
if (IDPage == "home-page") {
    var slideMask = Container.querySelector('.slide-mask');
    var StopMask = slideMask.querySelector('.stop-mask');
    var PlayMask = slideMask.querySelector('.play-mask');
    var HomeBusiness = Container.querySelector('.home-business');
}
