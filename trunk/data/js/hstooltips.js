if(typeof Bnet == 'undefined') var Bnet = {};
if(typeof Bnet.Hearthstone == 'undefined') Bnet.Hearthstone = {};

if(typeof Bnet.Hearthstone.Tooltips == 'undefined') Bnet.Hearthstone.Tooltips = new function() { 
	var URL_QUERY_BASE = 'http://www.hsdeck.com/tooltip/';

	var TYPES = {
		card: {
			type: 'card',
			url: 'cards/{key}'
		},
		deck: {
			type: 'deck',
			url: 'deck/{folder}/{key}'
		}
	};

	/*
		Extract (region), (locale), and (rest) of the URL

		{region}.battle.net/d3/{locale}/{rest}
	*/
	var URL_PATTERN_BASE = new RegExp('^http://www\\.hsdeck\\.com/(.+)');	
	
	var REQ_DOMAIN = "hsdeck.com";

	/*
		Each regex below extracts a (folder) and (key).
	*/
	var URL_PATTERNS = [
		/*
		Notes:
			- Using [^#\\?]+ below to ignore URL parameters or hashes
		*/

		// cards/{itemSlug}
		{
			regex: new RegExp('^cards/()([^#\\?]+)$'),			
			params: {
				type: 'card'
			}
		},
		// deck/(druid|hunter|mage|paladin|priest|rogue|shaman|warlock|warrior)/{deckSlug}
		{
			regex: new RegExp('^deck/([^/]+)/([^#\\?]+)$'),			
			params: {
				type: 'deck'
			}
		}
	];

	var DELAY_LOADING = 500; // ms
	var dataCache = {};

	// State
	var loadingTimer;
	var currentLink;
	var currentParams;

	

	function construct() {
		$.documentReady(initialize);
	}

	function initialize() {
		setTimeout(getCss, 1);
		setTimeout(bindEvents, 1);				
	}

	function getCss() {
		$.getStyle('http://static.hsdeck.com/css/tooltips.css');
	}

	function bindEvents() {

		$.bindEvent(document, 'mouseover', function(e) {

			var link = getLinkFromEvent(e);
			if(link) {
				linkMouseOver(link);
			}
		});

		$.bindEvent(document, 'mouseout', function(e) {

			var link = getLinkFromEvent(e);
			if(link) {
				linkMouseOut(link);
			}
		});								
	}

	function getLinkFromEvent(e) {

		e = $.normalizeEvent(e);

		var target = e.target;
		var tries = 0;

		while(target && ++tries <= 5) {

			if(target.nodeName.toUpperCase() == 'A') {
				return target;
			}
			target = target.parentNode;
		}

		return null;
	}

	function linkMouseOver(link) {

		var params = {};

		parseUrl(link, params);
		parseOptions(link, params);

		if(!params.key || currentLink == link) {
			return;
		}
		
		currentLink = link;
		currentParams = params;		

		var data = getTooltip(params);		
		
		if(data != null) {
			showTooltip(data);
		}
	}

	function linkMouseOut(link) {

		if(link != currentLink) {
			return;
		}

		Tooltip.hide();

		currentLink = null;
		currentParams = null;
	}

	function parseUrl(link, params) {
		if(!link.href.match(URL_PATTERN_BASE)) {			
			return;			
		} else {
			REQ_DOMAIN = "hsdeck.com";
		}
		

		var rest = RegExp.$1;

		for(var i = 0; i < URL_PATTERNS.length; ++i) {

			var urlPattern = URL_PATTERNS[i];

			if(!rest.match(urlPattern.regex)) {
				continue;
			}						

			var folder = RegExp.$1;
			var key = RegExp.$2;
			key=key.replace("/","-");

			if(folder.indexOf('/') != -1 || key.indexOf('/') != -1) { // Folder and key shouldn't contain any slashes				 
				continue;
			}

			params.folder = folder;
			params.key = key;			

			// Copy pattern's params
			for(var i in urlPattern.params) {
				params[i] = urlPattern.params[i];
			}

			params.tooltipType = getTooltipType(params.type);
			return;
		}
	}

	function parseOptions(link, params) {

		// TBD

	}

	function requestTooltip(params) {
		var uqb = URL_QUERY_BASE;
				
		if (params.tooltipType.type == "rune") {
			params.key = params.key.replace(/-([^-]*)$/, '/$1')
		}

		var url = (uqb + params.tooltipType.url)
			.replace('{folder}', params.folder)
			.replace('{key}',    params.key);					

		$.getScript(url + '?format=jsonp');
	}

	function registerData(data) {

		clearTimeout(loadingTimer);

		var params = data.params;

		saveData(params, data);

		if(currentParams != null && getCacheKeyFromParams(params) == getCacheKeyFromParams(currentParams)) {
			showTooltip(data);
		}
	}

	function getTooltip(params) {

		var data = loadData(params);

		if(data == null) { // Fetch data if not already cached

			clearTimeout(loadingTimer);
			loadingTimer = setTimeout(showLoading, DELAY_LOADING);
			requestTooltip(params);
			return null;
		}

		return data;
	}

	function showLoading() {

		if(currentLink != null) {
			Tooltip.show(currentLink, '<div class="hs-tooltip"><div class="loading"></div></div>');
		}
	}

	function showTooltip(data) {

		if(currentLink != null) {
			Tooltip.show(currentLink, data.tooltipHtml);
		}
	}

	// Utilities
	function getTooltipType(type) {
		return TYPES[type];
	}

	function saveData(params, data) {

		var cacheKey = getCacheKeyFromParams(params);
		dataCache[cacheKey] = data;
	}

	function loadData(params) {

		var cacheKey = getCacheKeyFromParams(params);
		return dataCache[cacheKey];
	}

	function getCacheKeyFromParams(params) {
		return [
			params.type,
			params.key
		].join('-');
	}
	
	function hideDiabloTooltip() {		
		Tooltip.hide();
		currentLink = null;
		currentParams = null;
	}

	// Public methods
	this.registerData = registerData;
	this.hideDiabloTooltip = hideDiabloTooltip;



	// HTML Helpers
	var $ = {

		create: function(nodeName) {
			return document.createElement(nodeName);
		},

		getScript: function(url) {

			var script = $.create('script');
			script.type = 'text/javascript';
			script.src = url;

			document.body.appendChild(script);
		},

		getStyle: function(url) {

			var link = $.create('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;

			document.body.appendChild(link);
		},

		documentReady: function(callback) {

			if(document.readyState == 'complete') {
				callback();
				return;
			}

			var occurred = false;

			$.bindEvent(document, 'DOMContentLoaded', function() {

				if(!occurred) {
					occurred = true;
					callback();
				}
			});

			$.bindEvent(document, 'readystatechange', function() {

				if(document.readyState == 'complete' && !occurred) {
					occurred = true;
					callback();
				}
			});

		},

		bindEvent: function(node, eventType, callback) {
			if(node.addEventListener) {
				node.addEventListener(eventType, callback, true); // Must be true to work in Opera
			} else {
				node.attachEvent('on' + eventType, callback);
			}
		},

		normalizeEvent: function(e) {
			var ev = {};
			ev.target = (e.target ? e.target : e.srcElement);
			ev.which = (e.which ? e.which : e.button);
			return ev;
		},

		getWindowSize: function() {

			var w = 0;
			var h = 0;

			if(document.documentElement && document.documentElement.clientHeight) {
				w = document.documentElement.clientWidth;
				h = document.documentElement.clientHeight;
			} else if (document.body && document.body.clientHeight) {
				w = document.body.clientWidth;
				h = document.body.clientHeight;
			} else if(window.innerHeight) {
				w = window.innerWidth;
				h = window.innerHeight;
			}

			return {
				w: w,
				h: h
			};
		},

		getScrollPosition: function () {

			var x = 0;
			var y = 0;

			if(window.pageXOffset || window.pageYOffset) {
				x = window.pageXOffset;
				y = window.pageYOffset;
			} else if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
				x = document.body.scrollLeft;
				y = document.body.scrollTop;
			} else if(document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
				x = document.documentElement.scrollLeft;
				y = document.documentElement.scrollTop;
			}

			return {
				x: x,
				y: y
			};
		},

		getOffset: function(node) {

			var x = 0;
			var y = 0;

			while(node) {
				x += node.offsetLeft;
				y += node.offsetTop;

				var p = node.parentNode;

				while(p && p != node.offsetParent && p.offsetParent) {
					if(p.scrollLeft || p.scrollTop) {
						x -= (p.scrollLeft | 0);
						y -= (p.scrollTop | 0);
						break;
					}
					p = p.parentNode;
				}
				node = node.offsetParent;
			}

			return {
				x: x,
				y: y
			};
		},

		getViewport: function() {
			var windowSize = $.getWindowSize();
			var scroll = $.getScrollPosition();

			return {
				l: scroll.x,
				t: scroll.y,
				r: scroll.x + windowSize.w,
				b: scroll.y + windowSize.h
			};
		}
	};

	$.Browser = {};
	$.Browser.ie = !!(window.attachEvent && !window.opera);
	$.Browser.ie6 = $.Browser.ie && navigator.userAgent.indexOf("MSIE 6.0") != -1;



	// Helper class that handles displaying tooltips
	var Tooltip = new function() {

		var PADDING = 5;

		var tooltipWrapper;
		var tooltipContent;

		function initialize() {

			tooltipWrapper = $.create('div');
			tooltipWrapper.className = 'hs-tooltip-wrapper';

			tooltipContent = $.create('div');
			tooltipContent.className = 'hs-tooltip-wrapper-inner';

			tooltipWrapper.appendChild(tooltipContent);
			document.body.appendChild(tooltipWrapper);

			hide();
		}

		function show(node, html) {

			if(tooltipWrapper == null) {
				initialize();
			}

			tooltipWrapper.style.visibility = 'hidden';
			tooltipWrapper.style.display = 'block';
			tooltipContent.innerHTML = html;

			var viewport = $.getViewport();
			var offset = $.getOffset(node);

			var x = offset.x + node.offsetWidth + PADDING;
			var y = offset.y - tooltipWrapper.offsetHeight - PADDING;

			if(y < viewport.t) {
				y = viewport.t;
			}

			if(x + tooltipWrapper.offsetWidth > viewport.r) {
				x = offset.x - tooltipWrapper.offsetWidth - PADDING;
			}

			reveal(x, y);
		}

		function hide() {

			if(tooltipWrapper == null) {
				return;
			}

			tooltipWrapper.style.display = 'none';
		}

		function reveal(x, y) {

			tooltipWrapper.style.left = x + 'px';
			tooltipWrapper.style.top  = y + 'px';

			tooltipWrapper.style.visibility = 'visible';
		}

		// Public methods
		this.show = show;
		this.hide = hide;

	};

	construct();

};