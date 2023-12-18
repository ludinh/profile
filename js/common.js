//----------------//  UTILS //--------------------------//
function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function createClass(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }
function Extends() { Extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Extends.apply(this, arguments); }
function inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }
function instanceOf(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }
function classCallCheck(instance, Constructor) { if (!instanceOf(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
function toConsumableArray(arr) { return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread(); }
function arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }


//if (iOS) {
//	HTML.classList.add("is-iOS");
//}
if (Touch == true) {
	HTML.classList.add("is-touch");
}
if (isFirefox) {
	HTML.classList.add("is-Firefox");
} else if (isEdge) {
	HTML.classList.add('is-Edge');
} else if (isSafari) {
	HTML.classList.add('is-Safari');
} else if (isChrome) {
	HTML.classList.add('is-Chrome');
}

var NotSupport = isIE9 || isIE10 || isIE11 || isIE || isEdge;

//----------------//  REMOVE ACTIVE CURRENT //--------------------------//

function RemoveAllClass(elements) {
	for (var i = 0; i < elements.length; i++) {
		elements[i].classList.remove('active');
		elements[i].classList.remove('current');
		elements[i].classList.remove('show');
		elements[i].classList.remove('show-text');
	}
}

//------------------//RANDOM//----------------------------


function RanDom(min, max) {
	return Math.max(Math.random() * (max - min) + min);
}

//----------------// CLEAR TIMEOUT //--------------------------//
var debounce = function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

//FULLSCREEN SUPPORT
//---------------------------------------------------

function isFullScreenMode() {
	var el = document.body;
	var check = typeof el.requestFullscreen !== 'undefined' ||
		typeof el.mozRequestFullScreen !== 'undefined' ||
		typeof el.webkitRequestFullscreen !== 'undefined' ||
		typeof el.msRequestFullscreen !== 'undefined' ||
		typeof document.exitFullscreen !== 'undefined' ||
		typeof document.mozCancelFullScreen !== 'undefined' ||
		typeof document.webkitExitFullscreen !== 'undefined';

	if (check == true) {
		document.documentElement.classList.add('fullsreen-support');
	}
	return check;
};

isFullScreenMode();


//TOGGLE FULLSCREEN
function toggleFullScreen(element) {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else if (document.webkitFullscreenElement) {
		document.webkitExitFullscreen();
	} else {
		if (document.fullscreenEnabled) {
			element.requestFullscreen();
		} else if (document.webkitFullscreenEnabled) {
			element.webkitRequestFullscreen();
		}
	}
}

//----------------//  TOUCH DEVICES //--------------------------//

(function (window, document) {
	'use strict';
	if (typeof window.CustomEvent !== 'function') {

		window.CustomEvent = function (event, params) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};

		window.CustomEvent.prototype = window.Event.prototype;
	}

	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchmove', handleTouchMove, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('mousedown', handleTouchStart, false);
	document.addEventListener('mousemove', handleTouchMove, false);
	document.addEventListener('mouseup', handleTouchEnd, false);


	var xDown = null;
	var yDown = null;
	var xDiff = null;
	var yDiff = null;
	var timeDown = null;
	var startEl = null;

	function handleTouchEnd(e) {

		if (startEl !== e.target) return;
		var swipeThreshold = parseInt(startEl.getAttribute('data-swipe-threshold') || '20', 10);
		var swipeTimeout = parseInt(startEl.getAttribute('data-swipe-timeout') || '500', 10);
		var timeDiff = Date.now() - timeDown;
		var eventType = '';
		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
				if (xDiff > 0) {
					eventType = 'swipeleft';
				} else {
					eventType = 'swiperight';
				}
			}
		} else {
			if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
				if (yDiff > 0) {
					eventType = 'swipeup';
				} else {
					eventType = 'swipedown';
				}
			}
		}

		if (eventType !== '') {
			startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true }));
		}

		xDown = null;
		yDown = null;
		timeDown = null;
	}

	function handleTouchStart(e) {
		if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
		startEl = e.target;
		timeDown = Date.now();
		xDown = e.touches ? e.touches[0].clientX : e.clientX;
		yDown = e.touches ? e.touches[0].clientY : e.clientY;

		xDiff = 0;
		yDiff = 0;
	}

	function handleTouchMove(e) {
		if (!xDown || !yDown) return;
		var xUp = e.touches ? e.touches[0].clientX : e.clientX;
		var yUp = e.touches ? e.touches[0].clientY : e.clientY;
		xDiff = xDown - xUp;
		yDiff = yDown - yUp;
	}
}(window, document));


//---------------------//SPLITTING BREAK TEXT//------------------------------


(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.Splitting = factory());
}(this, (function () {
	'use strict';

	var root = document;
	var createText = root.createTextNode.bind(root);
	function appendChild(el, child) {
		return el.appendChild(child);
	}

	function createElement(parent, key, text, whitespace) {
		var el = root.createElement('span');
		key && (el.className = key);
		if (text) {
			!whitespace;
			el.textContent = text;
		}
		return (parent && appendChild(parent, el)) || el;
	}

	function $(e, parent) {
		return !e || e.length == 0 ? [] : e.nodeName ? [e] : [].slice.call(e[0].nodeName ? e : (parent || root).querySelectorAll(e));
	}

	function each(items, fn) {
		items && items.some(fn);
	}

	function selectFrom(obj) {
		return function (key) {
			return obj[key];
		}
	}

	var plugins = {};
	function resolvePlugins(by, parent, deps) {
		var index = deps.indexOf(by);
		if (index == -1) {
			deps.unshift(by);
			each(plugins[by].depends, function (p) {
				resolvePlugins(p, by, deps);
			});
		} else {
			var indexOfParent = deps.indexOf(parent);
			deps.splice(index, 1);
			deps.splice(indexOfParent, 0, by);
		}
		return deps;
	}

	function createPlugin(by, depends, key, split) {
		return {
			by: by,
			depends: depends,
			key: key,
			split: split
		}
	}
	function resolve(by) {
		return resolvePlugins(by, 0, []).map(selectFrom(plugins));
	}
	function add(opts) {
		plugins[opts.by] = opts;
	}

	function splitText(el, key, splitOn, includePrevious, preserveWhitespace) {
		el.normalize();
		var elements = [];
		var F = document.createDocumentFragment();

		if (includePrevious) {
			elements.push(el.previousSibling);
		}

		var allElements = [];
		$(el.childNodes).some(function (next) {
			if (next.tagName && !next.hasChildNodes()) {
				allElements.push(next);
				return;
			}
			if (next.childNodes && next.childNodes.length) {
				allElements.push(next);
				elements.push.apply(elements, splitText(next, key, splitOn, includePrevious, preserveWhitespace));
				return;
			}
			var wholeText = next.wholeText || '';
			var contents = wholeText.trim();
			if (contents.length) {
				if (wholeText[0] === ' ') {
					allElements.push(createText(' '));
				}
				each(contents.split(splitOn), function (splitText, i) {
					if (i && preserveWhitespace) {
						allElements.push(createElement(F, "whitespace", " ", preserveWhitespace));
					}
					var splitEl = createElement(F, key, splitText);
					elements.push(splitEl);
					allElements.push(splitEl);
				});
				if (wholeText[wholeText.length - 1] === ' ') {
					allElements.push(createText(' '));
				}
			}
		});

		each(allElements, function (el) {
			appendChild(F, el);
		});
		el.innerHTML = "";
		appendChild(el, F);
		return elements;
	}
	var _ = 0;

	function copy(dest, src) {
		for (var k in src) {
			dest[k] = src[k];
		}
		return dest;
	}

	var WORDS = 'words';
	var wordPlugin = createPlugin(
		WORDS, _, 'word', function (el) {
			return splitText(el, 'word', /\s+/, 0, 1)
		}
	);
	var CHARS = "chars";
	var charPlugin = createPlugin(
		CHARS, [WORDS], "char", function (el, options, ctx) {
			var results = [];
			each(ctx[WORDS], function (word, i) {
				results.push.apply(results, splitText(word, "char", "", options.whitespace && i));
			});
			return results;
		}
	);

	function Splitting(opts) {
		opts = opts || {};
		var key = opts.key;

		return $(opts.target || '[data-splitting]').map(function (el) {
			var ctx = el['ðŸŒ'];
			if (!opts.force && ctx) {
				return ctx;
			}

			ctx = el['ðŸŒ'] = { el: el };
			var items = resolve(opts.by || CHARS);
			var opts2 = copy({}, opts);
			each(items, function (plugin) {
				if (plugin.split) {
					var pluginBy = plugin.by;
					var key2 = (key ? '-' + key : '') + plugin.key;
					var results = plugin.split(el, opts2, ctx);
					key2
					ctx[pluginBy] = results;
					el.classList.add(pluginBy);
				}
			});

			el.classList.add('splitting');
			return ctx;
		})
	}

	function html(opts) {
		opts = opts || {};
		var parent = opts.target = createElement();
		parent.innerHTML = opts.content;
		Splitting(opts);
		return parent.outerHTML
	}

	Splitting.html = html;
	Splitting.add = add;
	add(wordPlugin);
	add(charPlugin);
	return Splitting;
})));



//---------------------------------------------------

//PINCHZOOM DEVICES //

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.PinchZoom = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	if (typeof Object.assign != 'function') {
		Object.defineProperty(Object, "assign", {
			value: function assign(target, varArgs) {
				if (target == null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}
				var to = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var nextSource = arguments[index];
					if (nextSource != null) {
						for (var nextKey in nextSource) {
							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
								to[nextKey] = nextSource[nextKey];
							}
						}
					}
				}
				return to;
			},
			writable: true,
			configurable: true
		});
	}

	if (typeof Array.from != 'function') {
		Array.from = function (object) {
			return [].slice.call(object);
		};
	}

	var buildElement = function (str) {
		var tmp = document.implementation.createHTMLDocument('');
		tmp.body.innerHTML = str;
		return Array.from(tmp.body.children)[0];
	};

	var triggerEvent = function (el, name) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent(name, true, false);
		el.dispatchEvent(event);
	};

	var definePinchZoom = function () {

		var PinchZoom = function (el, options) {
			this.el = el;
			this.zoomFactor = 1;
			this.lastScale = 1;
			this.offset = {
				x: 0,
				y: 0
			};
			this.initialOffset = {
				x: 0,
				y: 0,
			};
			this.options = Object.assign({}, this.defaults, options);
			this.setupMarkup();
			this.bindEvents();
			this.update();

			if (this.isImageLoaded(this.el)) {
				this.updateAspectRatio();
				this.setupOffsets();
			}

			this.enable();

		},
			sum = function (a, b) {
				return a + b;
			},
			isCloseTo = function (value, expected) {
				return value > expected - 0.01 && value < expected + 0.01;
			};



		PinchZoom.prototype = {

			defaults: {
				tapZoomFactor: 2,
				zoomOutFactor: 1.3,
				animationDuration: 300,
				maxZoom: 4,
				minZoom: 0.5,
				draggableUnzoomed: true,
				lockDragAxis: false,
				setOffsetsOnce: false,
				use2d: true,
				zoomStartEventName: 'pz_zoomstart',
				zoomUpdateEventName: 'pz_zoomupdate',
				zoomEndEventName: 'pz_zoomend',
				dragStartEventName: 'pz_dragstart',
				dragUpdateEventName: 'pz_dragupdate',
				dragEndEventName: 'pz_dragend',
				doubleTapEventName: 'pz_doubletap',
				verticalPadding: 0,
				horizontalPadding: 0,
				onZoomStart: null,
				onZoomEnd: null,
				onZoomUpdate: null,
				onDragStart: null,
				onDragEnd: null,
				onDragUpdate: null,
				onDoubleTap: null
			},
			handleDragStart: function (event) {
				triggerEvent(this.el, this.options.dragStartEventName);
				if (typeof this.options.onDragStart == "function") {
					this.options.onDragStart(this, event)
				}
				this.stopAnimation();
				this.lastDragPosition = false;
				this.hasInteraction = true;
				this.handleDrag(event);
			},
			handleDrag: function (event) {
				var touch = this.getTouches(event)[0];
				this.drag(touch, this.lastDragPosition);
				this.offset = this.sanitizeOffset(this.offset);
				this.lastDragPosition = touch;
			},
			handleDragEnd: function () {
				triggerEvent(this.el, this.options.dragEndEventName);
				if (typeof this.options.onDragEnd == "function") {
					this.options.onDragEnd(this, event)
				}
				this.end();
			},
			handleZoomStart: function (event) {
				triggerEvent(this.el, this.options.zoomStartEventName);
				if (typeof this.options.onZoomStart == "function") {
					this.options.onZoomStart(this, event)
				}
				this.stopAnimation();
				this.lastScale = 1;
				this.nthZoom = 0;
				this.lastZoomCenter = false;
				this.hasInteraction = true;
			},
			handleZoom: function (event, newScale) {
				var touchCenter = this.getTouchCenter(this.getTouches(event)),
					scale = newScale / this.lastScale;
				this.lastScale = newScale;

				this.nthZoom += 1;
				if (this.nthZoom > 3) {

					this.scale(scale, touchCenter);
					this.drag(touchCenter, this.lastZoomCenter);
				}
				this.lastZoomCenter = touchCenter;
			},
			handleZoomEnd: function () {
				triggerEvent(this.el, this.options.zoomEndEventName);
				if (typeof this.options.onZoomEnd == "function") {
					this.options.onZoomEnd(this, event)
				}
				this.end();
			},
			handleDoubleTap: function (event) {
				var center = this.getTouches(event)[0],
					zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
					startZoomFactor = this.zoomFactor,
					updateProgress = (function (progress) {
						this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
					}).bind(this);

				if (this.hasInteraction) {
					return;
				}

				this.isDoubleTap = true;

				if (startZoomFactor > zoomFactor) {
					center = this.getCurrentZoomCenter();
				}

				this.animate(this.options.animationDuration, updateProgress, this.swing);
				triggerEvent(this.el, this.options.doubleTapEventName);
				if (typeof this.options.onDoubleTap == "function") {
					this.options.onDoubleTap(this, event)
				}
			},
			computeInitialOffset: function () {
				this.initialOffset = {
					x: -Math.abs(this.el.offsetWidth * this.getInitialZoomFactor() - this.containPinch.offsetWidth) / 2,
					y: -Math.abs(this.el.offsetHeight * this.getInitialZoomFactor() - this.containPinch.offsetHeight) / 2,
				};
			},
			resetOffset: function () {
				this.offset.x = this.initialOffset.x;
				this.offset.y = this.initialOffset.y;
			},
			isImageLoaded: function (el) {
				if (el.nodeName === 'IMG') {
					return el.complete && el.naturalHeight !== 0;
				} else {
					return Array.from(el.querySelectorAll('img')).every(this.isImageLoaded);
				}
			},
			setupOffsets: function () {
				if (this.options.setOffsetsOnce && this._isOffsetsSet) {
					return;
				}

				this._isOffsetsSet = true;
				this.computeInitialOffset();
				this.resetOffset();
			},
			sanitizeOffset: function (offset) {
				var elWidth = this.el.offsetWidth * this.getInitialZoomFactor() * this.zoomFactor;
				var elHeight = this.el.offsetHeight * this.getInitialZoomFactor() * this.zoomFactor;
				var maxX = elWidth - this.getContainerX() + this.options.horizontalPadding,
					maxY = elHeight - this.getContainerY() + this.options.verticalPadding,
					maxOffsetX = Math.max(maxX, 0),
					maxOffsetY = Math.max(maxY, 0),
					minOffsetX = Math.min(maxX, 0) - this.options.horizontalPadding,
					minOffsetY = Math.min(maxY, 0) - this.options.verticalPadding;

				return {
					x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
					y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
				};
			},
			scaleTo: function (zoomFactor, center) {
				this.scale(zoomFactor / this.zoomFactor, center);
			},
			scale: function (scale, center) {
				scale = this.scaleZoomFactor(scale);
				this.addOffset({
					x: (scale - 1) * (center.x + this.offset.x),
					y: (scale - 1) * (center.y + this.offset.y)
				});
				triggerEvent(this.el, this.options.zoomUpdateEventName);
				if (typeof this.options.onZoomUpdate == "function") {
					this.options.onZoomUpdate(this, event)
				}
			},
			scaleZoomFactor: function (scale) {
				var originalZoomFactor = this.zoomFactor;
				this.zoomFactor *= scale;
				this.zoomFactor = Math.min(this.options.maxZoom, Math.max(this.zoomFactor, this.options.minZoom));
				return this.zoomFactor / originalZoomFactor;
			},
			canDrag: function () {
				return this.options.draggableUnzoomed || !isCloseTo(this.zoomFactor, 1);
			},
			drag: function (center, lastCenter) {
				if (lastCenter) {
					if (this.options.lockDragAxis) {
						if (Math.abs(center.x - lastCenter.x) > Math.abs(center.y - lastCenter.y)) {
							this.addOffset({
								x: -(center.x - lastCenter.x),
								y: 0
							});
						}
						else {
							this.addOffset({
								y: -(center.y - lastCenter.y),
								x: 0
							});
						}
					}
					else {
						this.addOffset({
							y: -(center.y - lastCenter.y),
							x: -(center.x - lastCenter.x)
						});
					}
					triggerEvent(this.el, this.options.dragUpdateEventName);
					if (typeof this.options.onDragUpdate == "function") {
						this.options.onDragUpdate(this, event)
					}
				}
			},
			getTouchCenter: function (touches) {
				return this.getVectorAvg(touches);
			},
			getVectorAvg: function (vectors) {
				return {
					x: vectors.map(function (v) { return v.x; }).reduce(sum) / vectors.length,
					y: vectors.map(function (v) { return v.y; }).reduce(sum) / vectors.length
				};
			},
			addOffset: function (offset) {
				this.offset = {
					x: this.offset.x + offset.x,
					y: this.offset.y + offset.y
				};
			},
			sanitize: function () {
				if (this.zoomFactor < this.options.zoomOutFactor) {
					this.zoomOutAnimation();
				} else if (this.isInsaneOffset(this.offset)) {
					this.sanitizeOffsetAnimation();
				}
			},
			isInsaneOffset: function (offset) {
				var sanitizedOffset = this.sanitizeOffset(offset);
				return sanitizedOffset.x !== offset.x ||
					sanitizedOffset.y !== offset.y;
			},
			sanitizeOffsetAnimation: function () {
				var targetOffset = this.sanitizeOffset(this.offset),
					startOffset = {
						x: this.offset.x,
						y: this.offset.y
					},
					updateProgress = (function (progress) {
						this.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x);
						this.offset.y = startOffset.y + progress * (targetOffset.y - startOffset.y);
						this.update();
					}).bind(this);

				this.animate(
					this.options.animationDuration,
					updateProgress,
					this.swing
				);
			},
			zoomOutAnimation: function () {
				if (this.zoomFactor === 1) {
					return;
				}

				var startZoomFactor = this.zoomFactor,
					zoomFactor = 1,
					center = this.getCurrentZoomCenter(),
					updateProgress = (function (progress) {
						this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
					}).bind(this);

				this.animate(
					this.options.animationDuration,
					updateProgress,
					this.swing
				);
			},
			updateAspectRatio: function () {
				this.unsetContainerY();
				var C = document.querySelector('.pinch-zoom-container');
				if (C !== null) {
					this.setContainerY(this.containPinch.parentNode.offsetHeight);
				}

			},
			getInitialZoomFactor: function () {
				var xZoomFactor = this.containPinch.offsetWidth / this.el.offsetWidth;
				var yZoomFactor = this.containPinch.offsetHeight / this.el.offsetHeight;

				return Math.min(xZoomFactor, yZoomFactor);
			},
			getAspectRatio: function () {
				return this.el.offsetWidth / this.el.offsetHeight;
			},
			getCurrentZoomCenter: function () {
				var offsetLeft = this.offset.x - this.initialOffset.x;
				var centerX = -1 * this.offset.x - offsetLeft / (1 / this.zoomFactor - 1);

				var offsetTop = this.offset.y - this.initialOffset.y;
				var centerY = -1 * this.offset.y - offsetTop / (1 / this.zoomFactor - 1);

				return {
					x: centerX,
					y: centerY
				};
			},
			getTouches: function (event) {
				var rect = this.containPinch.getBoundingClientRect();
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
				var posTop = rect.top + scrollTop;
				var posLeft = rect.left + scrollLeft;

				return Array.prototype.slice.call(event.touches).map(function (touch) {
					return {
						x: touch.pageX - posLeft,
						y: touch.pageY - posTop,
					};
				});
			},
			animate: function (duration, framefn, timefn, callback) {
				var startTime = new Date().getTime(),
					renderFrame = (function () {
						if (!this.inAnimation) { return; }
						var frameTime = new Date().getTime() - startTime,
							progress = frameTime / duration;
						if (frameTime >= duration) {
							framefn(1);
							if (callback) {
								callback();
							}
							this.update();
							this.stopAnimation();
							this.update();
						} else {
							if (timefn) {
								progress = timefn(progress);
							}
							framefn(progress);
							this.update();
							requestAnimationFrame(renderFrame);
						}
					}).bind(this);
				this.inAnimation = true;
				requestAnimationFrame(renderFrame);
			},
			stopAnimation: function () {
				this.inAnimation = false;
			},
			swing: function (p) {
				return -Math.cos(p * Math.PI) / 2 + 0.5;
			},
			getContainerX: function () {
				return this.containPinch.offsetWidth;
			},
			getContainerY: function () {
				return this.containPinch.offsetHeight;
			},
			setContainerY: function (y) {
				return this.containPinch.style.height = y + 'px';
			},
			unsetContainerY: function () {
				this.containPinch.style.height = null;
			},
			setupMarkup: function () {
				this.containPinch = buildElement('<div class="pinch-zoom-container"></div>');
				this.el.parentNode.insertBefore(this.containPinch, this.el);
				this.containPinch.appendChild(this.el);
				this.containPinch.style.overflow = 'hidden';
				this.containPinch.style.position = 'relative';
				this.el.style.webkitTransformOrigin = '0% 0%';
				this.el.style.mozTransformOrigin = '0% 0%';
				this.el.style.msTransformOrigin = '0% 0%';
				this.el.style.oTransformOrigin = '0% 0%';
				this.el.style.transformOrigin = '0% 0%';
				this.el.style.position = 'absolute';
			},
			end: function () {
				this.hasInteraction = false;
				this.sanitize();
				this.update();
			},
			bindEvents: function () {
				var self = this;
				detectGestures(this.containPinch, this);

				window.addEventListener('resize', this.update.bind(this));
				Array.from(this.el.querySelectorAll('img')).forEach(function (imgEl) {
					imgEl.addEventListener('load', self.update.bind(self));
				});

				if (this.el.nodeName === 'IMG') {
					this.el.addEventListener('load', this.update.bind(this));
				}
			},
			update: function (event) {
				if (this.updatePlaned) {
					return;
				}
				this.updatePlaned = true;
				window.setTimeout((function () {
					this.updatePlaned = false;

					if (event && event.type === 'resize') {
						this.updateAspectRatio();
						this.setupOffsets();
					}

					if (event && event.type === 'load') {
						this.updateAspectRatio();
						this.setupOffsets();
					}

					var zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
						offsetX = -this.offset.x / zoomFactor,
						offsetY = -this.offset.y / zoomFactor,
						transform3d = 'scale3d(' + zoomFactor + ', ' + zoomFactor + ',1) ' +
							'translate3d(' + offsetX + 'px,' + offsetY + 'px,0px)',
						transform2d = 'scale(' + zoomFactor + ', ' + zoomFactor + ') ' +
							'translate(' + offsetX + 'px,' + offsetY + 'px)',
						removeClone = (function () {
							if (this.clone) {
								this.clone.parentNode.removeChild(this.clone);
								delete this.clone;
							}
						}).bind(this);
					if (!this.options.use2d || this.hasInteraction || this.inAnimation) {
						this.is3d = true;
						removeClone();
						this.el.style.webkitTransform = transform3d;
						this.el.style.mozTransform = transform2d;
						this.el.style.msTransform = transform2d;
						this.el.style.oTransform = transform2d;
						this.el.style.transform = transform3d;
					} else {
						if (this.is3d) {
							this.clone = this.el.cloneNode(true);
							this.clone.style.pointerEvents = 'none';
							this.containPinch.appendChild(this.clone);
							window.setTimeout(removeClone, 100);
						}
						this.el.style.webkitTransform = transform2d;
						this.el.style.mozTransform = transform2d;
						this.el.style.msTransform = transform2d;
						this.el.style.oTransform = transform2d;
						this.el.style.transform = transform2d;
						this.is3d = false;
					}
				}).bind(this), 0);
			},
			enable: function () {
				this.enabled = true;
			},
			disable: function () {
				this.enabled = false;
			}
		};
		var detectGestures = function (el, target) {
			var interaction = null,
				fingers = 0,
				lastTouchStart = null,
				startTouches = null,
				setInteraction = function (newInteraction, event) {
					if (interaction !== newInteraction) {
						if (interaction && !newInteraction) {
							switch (interaction) {
								case "zoom":
									target.handleZoomEnd(event);
									break;
								case 'drag':
									target.handleDragEnd(event);
									break;
							}
						}

						switch (newInteraction) {
							case 'zoom':
								target.handleZoomStart(event);
								break;
							case 'drag':
								target.handleDragStart(event);
								break;
						}
					}
					interaction = newInteraction;
				},
				updateInteraction = function (event) {
					if (fingers === 2) {
						setInteraction('zoom');
					} else if (fingers === 1 && target.canDrag()) {
						setInteraction('drag', event);
					} else {
						setInteraction(null, event);
					}
				},
				targetTouches = function (touches) {
					return Array.from(touches).map(function (touch) {
						return {
							x: touch.pageX,
							y: touch.pageY
						};
					});
				},
				getDistance = function (a, b) {
					var x, y;
					x = a.x - b.x;
					y = a.y - b.y;
					return Math.sqrt(x * x + y * y);
				},
				calculateScale = function (startTouches, endTouches) {
					var startDistance = getDistance(startTouches[0], startTouches[1]),
						endDistance = getDistance(endTouches[0], endTouches[1]);
					return endDistance / startDistance;
				},
				cancelEvent = function (event) {
					event.stopPropagation();
					event.preventDefault();
				},
				detectDoubleTap = function (event) {
					var time = (new Date()).getTime();
					if (fingers > 1) {
						lastTouchStart = null;
					}
					if (time - lastTouchStart < 300) {
						cancelEvent(event);

						target.handleDoubleTap(event);
						switch (interaction) {
							case "zoom":
								target.handleZoomEnd(event);
								break;
							case 'drag':
								target.handleDragEnd(event);
								break;
						}
					} else {
						target.isDoubleTap = false;
					}

					if (fingers === 1) {
						lastTouchStart = time;
					}
				},
				firstMove = true;
			el.addEventListener('touchstart', function (event) {
				if (target.enabled) {
					firstMove = true;
					fingers = event.touches.length;
					detectDoubleTap(event);
				}
			});
			el.addEventListener('touchmove', function (event) {
				if (target.enabled && !target.isDoubleTap) {
					if (firstMove) {
						updateInteraction(event);
						if (interaction) {
							cancelEvent(event);
						}
						startTouches = targetTouches(event.touches);
					} else {
						switch (interaction) {
							case 'zoom':
								if (startTouches.length == 2 && event.touches.length == 2) {
									target.handleZoom(event, calculateScale(startTouches, targetTouches(event.touches)));
								}
								break;
							case 'drag':
								target.handleDrag(event);
								break;
						}
						if (interaction) {
							cancelEvent(event);
							target.update();
						}
					}
					firstMove = false;
				}
			});
			el.addEventListener('touchend', function (event) {
				if (target.enabled) {
					fingers = event.touches.length;
					updateInteraction(event);
				}
			});
		};
		return PinchZoom;
	};
	var PinchZoom = definePinchZoom();
	exports.default = PinchZoom;
});

