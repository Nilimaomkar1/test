// Textfield Placeholder
function DoWaterMarkOnFocus(txt, text) {
	   if (txt.value == text) {
	   txt.value = "";
   }
}
function DoWaterMarkOnBlur(txt, text) {
   if (txt.value == "") {
	   txt.value = text;
   }
}

 
//Self Help Scroll Script Start -----------------------------------------------------------------------------

// Mousewheel start

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

}));


// Mousewheel end


(function () {
'use strict';

var $ = jQuery;
var $window = $(window);

var name = 'scrollpanel';

var defaults = {
        prefix: 'sp-'
    };


// Scrollpanel
// ===========
function ScrollPanel(element, options) {

    var self = this;

    // Main reference.
    self.$el = $(element);

    self.settings = $.extend({}, defaults, options);
    var prefix = self.settings.prefix;

    // Mouse offset on drag start.
    self.mouseOffsetY = 0;
    // Interval ID for automatic scrollbar updates.
    self.updateId = 0;

    // Proxy to easily bind and unbind this method.
    self.scrollProxy = $.proxy(self.scroll, self);

    // Make content space relative, if not already.
    if (!self.$el.css('position') || self.$el.css('position') === 'static') {
        self.$el.css('position', 'relative');
    }


    // Create scrollbar.
    self.$scrollbar = $('<div class="' + prefix + 'scrollbar"/>');
    self.$thumb = $('<div class="' + prefix + 'thumb"/>').appendTo(self.$scrollbar);

    // Wrap element's content and add scrollbar.
    self.$el
        .addClass(prefix + 'host')
        .wrapInner('<div class="' + prefix + 'viewport"><div class="' + prefix + 'container"/></div>')
        .append(self.$scrollbar);

    // // Get references.
    self.$viewport = self.$el.find('> .' + prefix + 'viewport');
    self.$container = self.$viewport.find('> .' + prefix + 'container');


    // Host
    // ----
    self.$el

        // Handle mouse wheel.
        .on('mousewheel', function (event, delta, deltaX, deltaY) {

            self.$viewport.scrollTop(self.$viewport.scrollTop() - 50 * deltaY);
            self.update();
            event.preventDefault();
            event.stopPropagation();
        })

        // Handle scrolling.
        .on('scroll', function () {

            self.update();
        });


    // Viewport
    // --------
    self.$viewport

        // Basic styling.
        .css({
            paddingRight: self.$scrollbar.outerWidth(true),
            height: self.$el.height(),
            overflow: 'hidden'
        });


    // Container
    // ---------
    self.$container

        // Basic styling.
        .css({
            overflow: 'hidden'
        });


    // Srollbar
    // --------
    self.$scrollbar

        // Basic styling.
        .css({
            position: 'absolute',
            top: 0,
            right: 0,
            overflow: 'hidden'
        })

        // Handle mouse buttons.
        .on('mousedown', function (event) {

            self.mouseOffsetY = self.$thumb.outerHeight() / 2;
            self.onMousedown(event);
        })

        // Disable selection.
        .each(function () {

            self.onselectstart = function () {

                return false;
            };
        });


    // Scrollbar Thumb
    // ---------------
    self.$thumb

        // Basic styling.
        .css({
            position: 'absolute',
            left: 0,
            width: '100%'
        })

        // Handle mouse buttons.
        .on('mousedown', function (event) {

            self.mouseOffsetY = event.pageY - self.$thumb.offset().top;
            self.onMousedown(event);
        });

    // Initial update.
    self.update();
}


// Scrollpanel methods
// ===================
$.extend(ScrollPanel.prototype, {

    // Rerender scrollbar.
    update: function (repeat) {

        var self = this;

        if (self.updateId && !repeat) {
            clearInterval(self.updateId);
            self.updateId = 0;
        } else if (!self.updateId && repeat) {
            self.updateId = setInterval(function() {
                self.update(true);
            }, 50);
        }

        self.$viewport.css('height', self.$el.height());

        var visibleHeight = self.$el.height();
        var contentHeight = self.$container.outerHeight();
        var scrollTop = self.$viewport.scrollTop();
        var scrollTopFrac = scrollTop / contentHeight;
        var visVertFrac = Math.min(visibleHeight / contentHeight, 1);
        var scrollbarHeight = self.$scrollbar.height();

        if (visVertFrac < 1) {
            self.$scrollbar
                .css({
                    height: self.$el.innerHeight() + scrollbarHeight - self.$scrollbar.outerHeight(true)
                })
                .fadeIn(50);
            self.$thumb
                .css({
                    top: scrollbarHeight * scrollTopFrac,
                    height: scrollbarHeight * visVertFrac
                });
        } else {
            self.$scrollbar.fadeOut(50);
        }
    },

    // Scroll content according to mouse position.
    scroll: function (event) {

        var self = this;
        var clickFrac = (event.pageY - self.$scrollbar.offset().top - self.mouseOffsetY) / self.$scrollbar.height();

        self.$viewport.scrollTop(self.$container.outerHeight() * clickFrac);
        self.update();
        event.preventDefault();
        event.stopPropagation();
    },

    // Handle mousedown events on scrollbar.
    onMousedown: function (event) {

        var self = this;

        self.scroll(event);
        self.$scrollbar.addClass('active');
        $window
            .on('mousemove', self.scrollProxy)
            .one('mouseup', function (event) {

                self.$scrollbar.removeClass('active');
                $window.off('mousemove', self.scrollProxy);
                self.scroll(event);
            });
    }
});


// Register the plug in
// --------------------
$.fn[name] = function (options, options2) {

    return this.each(function () {

        var $this = $(this);
        var scrollpanel = $this.data(name);

        if (!scrollpanel) {
            scrollpanel = new ScrollPanel(this, options);
            scrollpanel.update();
            $this.data(name, scrollpanel);
        }

        if (options === 'update') {
            scrollpanel.update(options2);
        }
    });
};

}());

//Self Help Page Scroll Script
if($(window).width() > 768)
{
	$('.ddlevel3').scrollpanel();
}

//Groups Page Scroll Script
$('.cug-table-scroll').scrollpanel();


//Self Help Scroll Script End -----------------------------------------------------------------------------


//Self Help Carousel Start -----------------------------------------------------------------------------
(function ($) {
	$.widget("ui.rcarousel", {
		_create: function() {
			var data,
				$root = $( this.element ),
				_self = this,
				options = this.options;

			// if options were default there should be no problem
            // check if user set options before init: $('element').rcarousel({with: "foo", visible: 3});
            // in above example exception will be thrown because 'with' should be a number!
            this._checkOptionsValidity( this.options );

			// for every carousel create a data object and keeps it in the element
			this._createDataObject();
			data = $root.data( "data" );

			// create wrapper inside root element; this is needed for animating
			$root
				.addClass( "ui-carousel" )
				.children()
				.wrapAll( "<div class='wrapper'></div>" );
			
			// save all children of root element in 'paths' array
			this._saveElements();

			// make pages using paginate algorithm
			this._generatePages();		
			
			this._loadElements();
				
			this._setCarouselWidth();
			this._setCarouselHeight();
			
			// handle default event handlers
			$( options.navigation.next ).click(
				function( event ) {
					_self.next();
					event.preventDefault();
				}
			);
			
			$( options.navigation.prev ).click(
				function( event ) {
					_self.prev();
					event.preventDefault();
				}
			);			
			
			data.navigation.next = $( options.navigation.next );
			data.navigation.prev = $( options.navigation.prev );
			
			// stop on hover feature
			$root.hover(
				function() {
					if ( options.auto.enabled ) {
						clearInterval( data.interval );
						data.hoveredOver = true;
					}
				},
				function() {
					if ( options.auto.enabled ) {
						data.hoveredOver = false;
						_self._autoMode( options.auto.direction );
					}
				}
			);
			
			this._setStep();
			
			// if auto mode is enabled run it
			if ( options.auto.enabled ) {
				this._autoMode( options.auto.direction );
			}
			
			// broadcast event
			this._trigger( "start" );
		},
		
		_addElement: function( jQueryElement, direction ) {
			var $root = $( this.element ),
				$content = $root.find( "div.wrapper" ),
				options = this.options;

			jQueryElement
				.width( options.width )
				.height( options.height );
				
			if ( options.orientation === "horizontal" ) {
				$( jQueryElement ).css( "marginRight", options.margin );
			} else {
				$( jQueryElement ).css({
					marginBottom: options.margin,
					"float": "none"
				});
			}
			
			if ( direction === "prev" ) {
				
				// clone event handlers and data as well
				$content.prepend( jQueryElement.clone(true, true) );
			} else {
				$content.append( jQueryElement.clone(true, true) );
			}			
		},
		
		append: function( jqElements ) {
			var $root = $( this.element ),
				data = $root.data( "data" );
				
			// add new elements
			jqElements.each(
				function( i, el ) {
					data.paths.push( $(el) );
				}
			);
			
			data.oldPage = data.pages[data.oldPageIndex].slice(0);
			data.appended = true;
			
			// rebuild pages
			this._generatePages();
		},
		
		_autoMode: function( direction ) {
			var options = this.options,
				data = $( this.element ).data( "data" );

			if ( direction === "next" ) {
				data.interval = setTimeout( $.proxy(this.next, this), options.auto.interval );
			} else {
				data.interval = setTimeout( $.proxy(this.prev, this), options.auto.interval );
			}
		},
		
		_checkOptionsValidity: function( options ) {
			var i,
				self = this,
				_correctSteps = "";
			
			// for every element in options object check its validity
			$.each(options,
				function( key, value ) {

					switch ( key ) {
						case "visible":
							// visible should be a positive integer
							if ( !value || typeof value !== "number" || value <= 0 || (Math.ceil(value) - value > 0) ) {
								throw new Error( "visible should be defined as a positive integer" );
							}
							break;
	
						case "step":
							if ( !value || typeof value !== "number" || value <= 0 || (Math.ceil(value) - value > 0) ) {
								throw new Error( "step should be defined as a positive integer" );
							} else if ( value > self.options.visible )  {
								// for example for visible: 3 the following array of values for 'step' is valid
								// 3 <= step >= 1 by 1 ==> [1,2,3]
								// output correct values
								for ( i = 1; i <= Math.floor(options.visible); i++ ) {
									_correctSteps += ( i < Math.floor(value) ) ? i + ", " : i;
								}
								
								throw new Error( "Only following step values are correct: " + _correctSteps );
							}
							break;
	
						case "width":
							// width & height is defined by default so you can omit them to some extent
							if ( !value || typeof value !== "number" || value <= 0 || Math.ceil(value) - value > 0 ) {
								throw new Error( "width should be defined as a positive integer" );
							}
							break;
		
						case "height":
							if ( !value || typeof value !== "number" || value <= 0 || Math.ceil(value) - value > 0 ) {
								throw new Error("height should be defined as a positive integer");
							}
							break;
		
						case "speed":
							if ( !value && value !== 0 ) {
								throw new Error("speed should be defined as a number or a string");
							}
		
							if ( typeof value === "number" && value < 0 ) {
								throw new Error( "speed should be a positive number" );
							} else if ( typeof value === "string" && !(value === "slow" || value === "normal" || value === "fast") ) {
								throw new Error( 'Only "slow", "normal" and "fast" values are valid' );
							}
							break;
		
						case "navigation":
							if ( !value || $.isPlainObject(value) === false ) {
								throw new Error( "navigation should be defined as an object with at least one of the properties: 'prev' or 'next' in it");
							}
		
							if ( value.prev && typeof value.prev !== "string" ) {
								throw new Error( "navigation.prev should be defined as a string and point to '.class' or '#id' of an element" );
							}
		
							if ( value.next && typeof value.next !== "string" ) {
								throw new Error(" navigation.next should be defined as a string and point to '.class' or '#id' of an element" );
							}
							break;
		
						case "auto":
							if ( typeof value.direction !== "string" ) {
								throw new Error( "direction should be defined as a string" );
							}
		
							if ( !(value.direction === "next" || value.direction === "prev") ) {
								throw new Error( "direction: only 'right' and 'left' values are valid" );
							}
		
							if ( isNaN(value.interval) || typeof value.interval !== "number" || value.interval < 0 || Math.ceil(value.interval) - value.interval > 0 ) {
								throw new Error( "interval should be a positive number" );
							}
							break;
		
						case "margin":
							if ( isNaN(value) || typeof value !== "number" || value < 0 || Math.ceil(value) - value > 0 ) {
								throw new Error( "margin should be a positive number" );
							}
							break;
						}
				}
			);
		},
		
		_createDataObject: function() {
			var $root = $( this.element );

			$root.data("data",
				{
					paths: [],
					pathsLen: 0,
					pages: [],
					lastPage: [],
					oldPageIndex: 0,
					pageIndex: 0,
					navigation: {},
					animated: false,
					appended: false,
					hoveredOver: false
				}
			);
		},
		
		_generatePages: function() {
			var self = this,
				options = this.options,
				data = $( this.element ).data( "data" ),
				_visible = options.visible,
				_pathsLen = data.paths.length;
				
			// having 10 elements: A, B, C, D, E, F, G, H, I, J the algorithm
			// creates 3 pages for 'visible: 5' and 'step: 4':
			// [ABCDE], [EFGHI], [FGHIJ]

			function _init() {
				// init creates the last page [FGHIJ] and remembers it

				data.pages = [];
				data.lastPage = [];
				data.pages[0] = [];

				// init last page
				for ( var i = _pathsLen - 1; i >= _pathsLen - _visible; i-- ) {
					data.lastPage.unshift( data.paths[i] );
				}
				
				// and first page
				for ( var i = 0; i < _visible; i++ ) {
					data.pages[0][data.pages[0].length] = data.paths[i];
				}				
			}

			function _islastPage( page ) {
				var _isLast = false;

				for ( var i = 0; i < data.lastPage.length; i++ ) {
					if ( data.lastPage[i].get(0) === page[i].get(0) ) {
						_isLast = true;
					} else {
						_isLast = false;
						break;
					}
				}
				
				return _isLast;
			}

			function _append( start, end, atIndex ) {
				var _index = atIndex || data.pages.length;

				if ( !atIndex ) {
					data.pages[_index] = [];
				}

				for ( var i = start; i < end; i++ ) {
					data.pages[_index].push( data.paths[i] );
				}
				return _index;
			}

			function _paginate() {
				var _isBeginning = true,
					_complement = false,
					_start = options.step,
					_end, _index, _oldFirstEl, _oldLastEl;

				// continue until you reach the last page
				// we start from the 2nd page (1st page has been already initiated)
				while ( !_islastPage(data.pages[data.pages.length - 1]) || _isBeginning ) {
					_isBeginning = false;

					_end = _start + _visible;

					// we cannot exceed _pathsLen
					if ( _end > _pathsLen ) {
						_end = _pathsLen;
					}
					
					// when we run ouf of elements (_end - _start < _visible) we must add the difference at the begining
					// in our example the 3rd page is [FGHIJ] and J element is added in the second step
					// first we add [FGHI] as old elements
					// we must assure that we have always 'visible' (5 in our example) elements
					if ( _end - _start < _visible ) {
						_complement = true;
					} else {
						_complement = false;
					}

					if ( _complement ) {
						
						// first add old elemets; for 3rd page it adds [FGHI…]
						// remember the page we add to (_index)
						_oldFirstEl = _start - ( _visible - (_end - _start) );
						_oldLastEl = _oldFirstEl + ( _visible - (_end - _start) );
						_index = _append( _oldFirstEl, _oldLastEl );
						
						// then add new elements; for 3th page it is J element:
						// [fghiJ]
						_append( _start, _end, _index );

					} else {
						
						// normal pages like [ABCDE], [EFGHI]
						_append( _start, _end );
						
						// next step
						_start += options.step;
					}
				}
			}

			// go!
			_init();
			_paginate();
		},
		
		getCurrentPage: function() {
			var data = $( this.element ).data( "data" );
			return data.pageIndex + 1;
		},
		
		getTotalPages: function() {
			var data = $( this.element ).data( "data" );
			return data.pages.length;
		},
		
		goToPage: function( page ) {
			var	_by,
				data = $( this.element ).data( "data" );

			if ( !data.animated && page !== data.pageIndex ) {
				data.animated = true;

				if ( page > data.pages.length - 1 ) {
					page = data.pages.length - 1;
				} else if ( page < 0 ) {
					page = 0;
				}
				
				data.pageIndex = page;
				_by = page - data.oldPageIndex;
				
				if ( _by >= 0 ) {
					//move by n elements from current index
					this._goToNextPage( _by );
				} else {
					this._goToPrevPage( _by );
				}
				
				data.oldPageIndex = page;
			}
		},
		
		_loadElements: function(elements, direction) {
			var options = this.options,
				data = $( this.element ).data( "data" ),
				_dir = direction || "next",
				_elem = elements || data.pages[options.startAtPage],
				_start = 0,
				_end = _elem.length;

			if ( _dir === "next" ) {
				for ( var i = _start; i < _end; i++ ) {
					this._addElement( _elem[i], _dir );
				}
			} else {
				for ( var i = _end - 1; i >= _start; i-- ) {
					this._addElement( _elem[i], _dir );
				}
			}
		},
		
		_goToPrevPage: function( by ) {
			var _page, _oldPage, _dist, _index, _animOpts, $lastEl, _unique, _pos, _theSame,
				$root = $( this.element ),
				self = this,
				options = this.options,
				data = $( this.element ).data( "data" );

			// pick pages
			if ( data.appended ) {
				_oldPage = data.oldPage;
			} else {				
				_oldPage = data.pages[data.oldPageIndex];
			}
			
			_index = data.oldPageIndex + by;			
			_page = data.pages[_index].slice( 0 );

			// For example, the first time widget was initiated there were 5
			// elements: A, B, C, D, E and 3 pages for visible 2 and step 2:
			// AB, CD, DE. Then a user loaded next 5 elements so there were
			// 10 already: A, B, C, D, E, F, G, H, I, J and 5 pages:
			// AB, CD, EF, GH and IJ. If the other elemets were loaded when
			// CD page was shown (from 5 elements) '_theSame' is true because
			// we compare the same
			// pages, that is, the 2nd page from 5 elements and the 2nd from
			// 10 elements. Thus what we do next is to decrement the index and
			// loads the first page from 10 elements.			
			$( _page ).each(
				function( i, el ) {
					if ( el.get(0) === $(_oldPage[i]).get(0) ) {
						_theSame = true;
					} else {
						_theSame = false;
					}
				}
			);
			
			if ( data.appended && _theSame ) {
				if ( data.pageIndex === 0 ) {
					_index = data.pageIndex = data.pages.length - 1;
				} else {
					_index = --data.pageIndex;
				}
				
				_page = data.pages[_index].slice( 0 );
			}			

			// check if last element from _page appears in _oldPage
			// for [ABCDFGHIJ] elements there are 3 pages for 'visible' = 6 and
			// 'step' = 2: [ABCDEF], [CDEFGH] and [EFGHIJ]; going from the 3rd
			// to the 2nd page we only loads 2 elements: [CD] because all
			// remaining were loaded already
			$lastEl = _page[_page.length - 1].get( 0 );
			for ( var i = _oldPage.length - 1; i >= 0; i-- ) {
				if ( $lastEl === $(_oldPage[i]).get(0) ) {
					_unique = false;
					_pos = i;
					break;
				} else {
					_unique = true;
				}
			}

			if ( !_unique ) {
				while ( _pos >= 0 ) {
					if ( _page[_page.length - 1].get(0) === _oldPage[_pos].get(0) ) {
						// this element is unique
						_page.pop();
					}
					--_pos;
				}
			}			

			// load new elements
			self._loadElements( _page, "prev" );

			// calculate the distance
			_dist = options.width * _page.length + ( options.margin * _page.length );

			if (options.orientation === "horizontal") {
				_animOpts = {scrollLeft: 0};
				$root.scrollLeft( _dist );
			} else {
				_animOpts = {scrollTop: 0};
				$root.scrollTop( _dist );
			}

			$root
				.animate(_animOpts, options.speed, function () {
					self._removeOldElements( "last", _page.length );
					data.animated = false;

					if ( !data.hoveredOver && options.auto.enabled ) {
						// if autoMode is on and you change page manually
						clearInterval( data.interval );
						
						self._autoMode( options.auto.direction );
					}

					// scrolling is finished, send an event
					self._trigger("pageLoaded", null, {page: _index});
				});
				
			// reset to deafult
			data.appended = false;				
		},
		
		_goToNextPage: function( by ) {
			var _page, _oldPage, _dist, _index, _animOpts, $firstEl, _unique, _pos, _theSame,
				$root = $( this.element ),
				options = this.options,
				data = $root.data( "data" ),				
				self = this;

			// pick pages
			if ( data.appended ) {
				_oldPage = data.oldPage;
			} else {				
				_oldPage = data.pages[data.oldPageIndex];
			}
			
			_index = data.oldPageIndex + by;			
			_page = data.pages[_index].slice( 0 );
			
			// For example, the first time widget was initiated there were 5
			// elements: A, B, C, D, E and 2 pages for visible 4 and step 3:
			// ABCD and BCDE. Then a user loaded next 5 elements so there were
			// 10 already: A, B, C, D, E, F, G, H, I, J and 3 pages:
			// ABCD, DEFG and GHIJ. If the other elemets were loaded when
			// ABCD page was shown (from 5 elements) '_theSame' is true because
			// we compare the same
			// pages, that is, the first pages from 5 elements and the first from
			// 10 elements. Thus what we do next is to increment the index and
			// loads the second page from 10 elements.
			$( _page ).each(
				function( i, el ) {
					if ( el.get(0) === $(_oldPage[i]).get(0) ) {
						_theSame = true;
					} else {
						_theSame = false;
					}
				}
			);
	
			if ( data.appended && _theSame ) {
				_page = data.pages[++data.pageIndex].slice( 0 );
			}

			// check if 1st element from _page appears in _oldPage
			// for [ABCDFGHIJ] elements there are 3 pages for 'visible' = 6 and
			// 'step' = 2: [ABCDEF], [CDEFGH] and [EFGHIJ]; going from the 2nd
			// to the 3rd page we only loads 2 elements: [IJ] because all
			// remaining were loaded already
			$firstEl = _page[0].get( 0 );
			for ( var i = 0; i < _page.length; i++) {
				if ( $firstEl === $(_oldPage[i]).get(0) ) {
					_unique = false;
					_pos = i;
					break;
				} else {
					_unique = true;
				}
			}

			if ( !_unique ) {
				while ( _pos < _oldPage.length ) {
					if ( _page[0].get(0) === _oldPage[_pos].get(0) ) {
						_page.shift();
					}
					++_pos;
				}
			}
			
			// load new elements			
			this._loadElements( _page, "next" );

			// calculate the distance
			_dist = options.width * _page.length + ( options.margin * _page.length );
			
			if ( options.orientation === "horizontal" ) {
				_animOpts = {scrollLeft: "+=" + _dist};
			} else {
				_animOpts = {scrollTop: "+=" + _dist};
			}
			
			$root
				.animate(_animOpts, options.speed, function() {
					self._removeOldElements( "first", _page.length );
					
					if ( options.orientation === "horizontal" ) {
						$root.scrollLeft( 0 );
					} else {
						$root.scrollTop( 0 );
					}
					
					data.animated = false;

					if ( !data.hoveredOver && options.auto.enabled ) {
						// if autoMode is on and you change page manually
						clearInterval( data.interval );
						
						self._autoMode( options.auto.direction );
					}

					// scrolling is finished, send an event
					self._trigger( "pageLoaded", null, {page: _index});

			});
				
			// reset to deafult
			data.appended = false;
		},
		
		next: function() {
			var	options = this.options,
				data = $( this.element ).data( "data" );

			if ( !data.animated ) {
				data.animated = true;
				
				if ( !data.appended  ) {
					++data.pageIndex;
				}				
				
				if ( data.pageIndex > data.pages.length - 1 ) {
					data.pageIndex = 0;
				}

				// move by one element from current index
				this._goToNextPage( data.pageIndex - data.oldPageIndex );
				data.oldPageIndex = data.pageIndex;
			}
		},
		
		prev: function() {
			var	options = this.options,
				data = $( this.element ).data( "data" );

			if ( !data.animated ) {
				data.animated = true;

				if ( !data.appended ) {
					--data.pageIndex;
				}
				
				if ( data.pageIndex < 0 ) {
					data.pageIndex = data.pages.length - 1;
				}

				// move left by one element from current index
				this._goToPrevPage( data.pageIndex - data.oldPageIndex );
				data.oldPageIndex = data.pageIndex;
			}
		},
		
		_removeOldElements: function(position, length) {
			// remove 'step' elements
			var	$root = $( this.element );

			for ( var i = 0; i < length; i++ ) {
				if ( position === "first" ) {
					$root
						.find( "div.wrapper" )
							.children()
							.first()
							.remove();
				} else {
					$root
						.find( "div.wrapper" )
							.children()
							.last()
							.remove();
				}
			}
		},
		
		_saveElements: function() {
			var $el,
				$root = $( this.element ),
				$elements = $root.find( "div.wrapper" ).children(),
				data = $root.data( "data" );
				
			$elements.each(
				function( i, el ) {
					$el = $( el );
					
					// keep element's data and events
					data.paths.push( $el.clone(true, true) );
					$el.remove();
				}
			);		
		},
		
		_setOption: function( key, value ) {
			var _newOptions,
				options = this.options,
				data = $( this.element ).data( "data" );

			switch (key) {
				case "speed":
					this._checkOptionsValidity({speed: value});
					options.speed = value;
					$.Widget.prototype._setOption.apply( this, arguments );
					break;
	
				case "auto":
					_newOptions = $.extend( options.auto, value );
					this._checkOptionsValidity({auto: _newOptions});
	
					if ( options.auto.enabled ) {
						this._autoMode( options.auto.direction );
					}
				}

		},
		_setStep: function(s) {
			// calculate a step
			var _step,
				options = this.options,
				data = $( this.element ).data( "data" );

			_step = s || options.step;

			options.step = _step;
			data.step = options.width * _step;
		},
		
		_setCarouselHeight: function() {
			var _newHeight,
				$root = $( this.element ),
				data = $( this.element ).data( "data" ),			
				options = this.options;

			if ( options.orientation === "vertical" ) {
				_newHeight = options.visible * options.height + options.margin * (options.visible - 1);
			} else {
				_newHeight = options.height;
			}

			$root.height(_newHeight);
		},
		
		_setCarouselWidth: function() {
			var _newWidth,
				$root = $( this.element ),
				options = this.options,
				data = $( this.element ).data( "data" );

			if ( options.orientation === "horizontal" ) {
				_newWidth = options.visible * options.width + options.margin * (options.visible - 1);
			} else {
				_newWidth = options.width;
			}

			// set carousel width and disable overflow: auto
			$root.css({
				width: _newWidth,
				overflow: "hidden"
			});
		},
		
		options: {
			visible: 7,
			step: 3,
			width: 255,
			height: 42,
			speed: 1000,
			margin: 0,
			orientation: "horizontal",
			auto: {
				enabled: false,
				direction: "next",
				interval: 5000
			},
			startAtPage: 0,
			navigation: {
				next: "#ui-carousel-next",
				prev: "#ui-carousel-prev"
			}
		}
	});
}(jQuery));
//Self Help Carousel End -----------------------------------------------------------------------------


//Guided Help Float Div Script Start -----------------------------------------------------------------------------

(function($){
	"use strict";

    var w = window,
        doc = document,
        maxTopPos, minTopPos,
        defaults = {
			scrollArea      : w,
            duration        : 200,
            lockBottom      : true,
            delay           : 0,
            easing          : 'linear',
            stickToBottom   : false,
            cssTransition   : false
        },
        // detect CSS transitions support
        supportsTransitions = (function() {
            var i,
				s = doc.createElement('p').style,
				v = ['ms','O','Moz','Webkit'],
				prop = 'transition';

            if( s[prop] == '' ) return true;
                prop = prop.charAt(0).toUpperCase() + prop.slice(1);
            for( i = v.length; i--; )
                if( s[v[i] + prop] == '' )
                    return true;
            return false;
        })(),

        Sticky = function(settings, obj){
            this.settings = settings;
            this.obj = $(obj);
        };

        Sticky.prototype = {
            init : function(){
				// don't bind an event listener if one is already attached
				if( this.obj.data('_stickyfloat') )
					return false;

                var that = this,
					raf = w.requestAnimationFrame
				       || w.webkitRequestAnimationFrame
				       || w.mozRequestAnimationFrame
				       || w.msRequestAnimationFrame
				       || function(cb){ return w.setTimeout(cb, 1000 / 60); };


                // bind the events
                $(w).ready(function(){
                    that.rePosition(true); // do a quick repositioning without any duration or delay

					$(that.settings.scrollArea).on('scroll.sticky', function(){
						raf( $.proxy(that.rePosition, that) );
					});

                    $(w).on('resize.sticky', function(){
						raf( that.rePosition.bind(that) )
					});
                });
                // for every element, attach it's instanced 'sticky'
                this.obj.data('_stickyfloat', that);
            },
            /**
            * @quick - do a quick repositioning without any duration
            * @force - force a repositioning
            **/
            rePosition : function(quick, force){
                var $obj      = this.obj,
                    settings  = this.settings,
					objBiggerThanArea,
					objFartherThanTopPos,
					pastStartOffset,
                    duration  = quick === true ? 0 : settings.duration,
                    //wScroll = w.pageYOffset || doc.documentElement.scrollTop,
                    //wHeight = w.innerHeight || doc.documentElement.offsetHeight,

                    // "scrollY" for modern browsers and "scrollTop" for IE
					areaScrollTop = this.settings.scrollArea == w ? w.scrollY ? w.scrollY : doc.documentElement.scrollTop : this.settings.scrollArea.scrollTop,
                    areaHeight    = this.settings.scrollArea == w ? doc.documentElement.offsetHeight : this.settings.scrollArea.offsetHeight;

				this.areaViewportHeight = this.settings.scrollArea == w ? doc.documentElement.clientHeight : this.settings.scrollArea.clientHeight;
				this.stickyHeight = $obj[0].clientHeight;

                $obj.stop(); // stop any jQuery animation on the sticky element

                if( settings.lockBottom )
                    maxTopPos = $obj[0].parentNode.clientHeight - this.stickyHeight - settings.offsetBottom; // get the maximum top position of the floated element inside it's parent

                if( maxTopPos < 0 )
                    maxTopPos = 0;

                // Define the basics of when should the object be moved
                pastStartOffset      = areaScrollTop > settings.startOffset;   // check if the window was scrolled down more than the start offset declared.
                objFartherThanTopPos = $obj.offset().top > (settings.startOffset + settings.offsetY);    // check if the object is at it's top position (starting point)
                objBiggerThanArea    = this.stickyHeight > this.areaViewportHeight;  // if the window size is smaller than the Obj size, do not animate.

                // if window scrolled down more than startOffset OR obj position is greater than
                // the top position possible (+ offsetY) AND window size must be bigger than Obj size
                if( ((pastStartOffset || objFartherThanTopPos) && !objBiggerThanArea) || force ){
                    this.newpos = settings.stickToBottom ?
                                areaScrollTop + areaHeight - this.stickyHeight - settings.startOffset - settings.offsetY :
                                areaScrollTop - settings.startOffset + settings.offsetY;

                    // made sure the floated element won't go beyond a certain maximum bottom position
                    if( this.newpos > maxTopPos && settings.lockBottom )
                        this.newpos = maxTopPos;
                    // make sure the new position is never less than the offsetY so the element won't go too high (when stuck to bottom and scrolled all the way up)
                    if( this.newpos < settings.offsetY )
                        this.newpos = settings.offsetY;
                    // if window scrolled < starting offset, then reset Obj position (settings.offsetY);
                    else if( areaScrollTop < settings.startOffset && !settings.stickToBottom )
                        this.newpos = settings.offsetY;

                    // if duration is set too low OR user wants to use css transitions, then do not use jQuery animate
                    if( duration < 5 || (settings.cssTransition && supportsTransitions) )
                        $obj[0].style.top = this.newpos + 'px';
                    else
                        $obj.stop().delay(settings.delay).animate({ top: this.newpos }, duration, settings.easing );

					this.settings.onReposition && this.settings.onReposition(this);
                }
            },

            // update the settings for the instance and re-position the floating element
            update : function(opts){
                if( typeof opts === 'object' ){
                    if( !opts.offsetY || opts.offsetY == 'auto' )
                        opts.offsetY = getComputed(this.obj).offsetY;
                    if( !opts.startOffset || opts.startOffset == 'auto' )
                        opts.startOffset = getComputed(this.obj).startOffset;

                    this.settings = $.extend( {}, this.settings, opts);

                    this.rePosition(false, true);
                }
                return this.obj;
            },

            destroy : function(){
                $(that.settings.scrollArea).off('scroll.sticky');
				$(w).off('resize.sticky');
                this.obj.removeData();
                return this.obj;
            }
        };
        // find the computed startOffset & offsetY of a floating element
        function getComputed($obj){
            var p = $obj.parent(),
                ob = parseInt(p.css('padding-bottom')),
                oy = parseInt(p.css('padding-top')),
                so = p.offset().top;

            return{ startOffset:so, offsetBottom:ob, offsetY:oy };
        }

    $.fn.stickyfloat = function(option, settings){
        // instatiate a new 'Sticky' object per item that needs to be floated
        return this.each(function(){
            var $obj = $(this);

            if( typeof document.body.style.maxHeight == 'undefined' )
                return false;
            if(typeof option === 'object')
                settings = option;
            else if(typeof option === 'string'){
                if( $obj.data('_stickyfloat') && typeof $obj.data('_stickyfloat')[option] == 'function' ){
                    var sticky = $obj.data('_stickyfloat');
                    return sticky[option](settings);
                }
                else
                    return this;
            }

            var $settings = $.extend( {}, defaults, getComputed($obj), settings || {} );

            var sticky = new Sticky($settings, $obj);
            sticky.init();
        });
    };
})(jQuery);

$('#floatMenu').stickyfloat();

//Guided Help Float Div Script End -----------------------------------------------------------------------------


//Bundle Row selection script

function bundleappsClick(theone1select) {
		 $('.bundle-apps-row').each(function(index) {
			 //alert("test");
			  if ($(this).attr("id") == theone1select) {
				   $(this).toggleClass("table-striped-select");
			  }
			  else{
				  $(this).removeClass("table-striped-select");
			  }
		 });
	};
	
	$('#bundle-apps tr').click(function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });

	function bundleplanClick(theoneselect) {
		 $('.bundle-plan-row').each(function(index) {
			 //alert("test");
			  if ($(this).attr("id") == theoneselect) {
				   $(this).toggleClass("table-striped-select");
			  }
		 });
	};
	
	$('#bundle-plans tr').click(function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });
	
	//New Recharge plan selction script
	$('.recharge-list li').click( function() {
		$(".recharge-list li").removeClass('selected-plan');
		$(this).addClass('selected-plan');
	});
	

	$('.bundle-row-wrap .main-row').click(function (event) {
        $(this).toggleClass('row-selected');
    });


//Custom Checkbox Script Start

function customCheckbox(checkboxName){
	
        var customcheckBox = $('input[name="'+ checkboxName +'"]');
        $(customcheckBox).each(function(){
            $(this).wrap( "<span class='custom-checkbox'></span>" );			 
            if($(this).is(':checked')){
                $(this).parent().addClass("selected");
            }
        });
        $(customcheckBox).click(function(){
            $(this).parent().toggleClass("selected");
        });
    }
    $(document).ready(function (){
		
        customCheckbox("cus-checkbox");

		$(".submenu-slider").show('slide', {direction: 'right'}, 700);
    });
	
	// Compare Page carousel Start
	  var owl = $("#compare-menu1");

      owl.owlCarousel({

      items : 4, //10 items above 1000px browser width
      itemsDesktop : [1024,3.5], //5 items between 1000px and 901px
      itemsDesktopSmall : [768,2.5], // 3 items betweem 900px and 601px
      itemsTablet: [640,2], //2 items between 600 and 0;
      itemsMobile : [480,1.5] // itemsMobile disabled - inherit from itemsTablet option
      });
	  
	  $(".next2").click(function(){
        owl.trigger('owl.next');
      })
      $(".prev2").click(function(){
        owl.trigger('owl.prev');
      })
	// Compare Page carousel End


//Custom Checkbox Script End	

jQuery(document).ready(function($) {
	
	
	

	
	
	
 	$('#vc_check').click(function() {
	  
		$("#vc_code").toggle('slow');
    });
	
	// Shortlist Page carousel Start
	  var owl = $("#owl-demo");

      owl.owlCarousel({

      items : 3, //10 items above 1000px browser width
      itemsDesktop : [1000,3], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // 3 items betweem 900px and 601px
      itemsTablet: [640,1], //2 items between 600 and 0;
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
      });
	  
	  $(".next").click(function(){
        owl.trigger('owl.next');
      })
      $(".prev").click(function(){
        owl.trigger('owl.prev');
      })
	// Shortlist Page carousel End
	
	// Header Sub Menu carousel Start
	  var owl = $("#header-menu");

      owl.owlCarousel({

      items : 6.5, //10 items above 1000px browser width
      itemsDesktop : [900,6], //5 items between 1000px and 901px
      itemsDesktopSmall : [768,4], // 3 items betweem 900px and 601px
      itemsTablet: [480,3], //2 items between 600 and 0;
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
      });
	  
	  $(".next1").click(function(){
        owl.trigger('owl.next');
      })
      $(".prev1").click(function(){
        owl.trigger('owl.prev');
      })
	  
	  
	// Header Sub Menu carousel End
	
	
	// Mobile Header Sub Menu carousel Start
	  var owl = $("#mobile-header-menu");

      owl.owlCarousel({

      items : 6.5, //10 items above 1000px browser width
      itemsDesktop : [900,6], //5 items between 1000px and 901px
      itemsDesktopSmall : [768,4], // 3 items betweem 900px and 601px
      itemsTablet: [480,3], //2 items between 600 and 0;
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
      });
	  
	  
	// Mobile Header Sub Menu carousel End
   

    _.extend(jio, {
        viewport: {
            desktopBreakpoint: 720,
            onResize: function() {
                jio.viewport.prevBreakpoint = (jio.viewport.width >= jio.viewport.desktopBreakpoint) ? 'desktop' : 'mobile';

                jio.viewport.width = $(window).width();
                jio.viewport.height = $(window).height();

                jio.viewport.currentBreakpoint = (jio.viewport.width >= jio.viewport.desktopBreakpoint) ? 'desktop' : 'mobile';

                $.publish('window_resize');
            }
        }
    });

    FastClick.attach(document.body);
   
    $(window).on('resize', _.debounce(function() {
        jio.viewport.onResize();
    }, 500));
    jio.viewport.onResize();


    //jio.splashHeader();

   // jio.siteNavigation();

    //jio.siteNavigation();

	
	
	// Index Splash Banner Change Script
	 $('#indiaCity li a').click(function(){
		
		
		if($(window).width() > 768)
    {
          var imgbg = $(this).attr('dir1');		
		$('.ChangeImage').attr('src', imgbg);
    } else if ($(window).width() < 768 && $(window).width() > 320){
        
        var imgbg = $(this).attr('dir2');		
		$('.ChangeImage').attr('src', imgbg);
       
    }
	else if ($(window).width() == 320){
		var imgbg = $(this).attr('dir3');		
		$('.ChangeImage').attr('src', imgbg);
	}
	 });
	
    // PRODUCT PLANS
    if ($('.product-plans').length > 0) {
        $('.product-plans').find('.plan-item > a').on('click', function(e) {
            e.preventDefault();
            $('.product-plans').find('.plan-item > a').removeClass('selected');
            $(this).addClass('selected');
        });
    }

    // PRODUCT APP SELECTION
    if ($('.select-tiles').length > 0) {
        $('.select-tiles').find('.tile > a').on('click', function(e) {
            e.preventDefault();
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
            }
        });
    }
	
	
    $(document).scroll(function(){
    	$(".search-result").getNiceScroll().resize(); 	
	});

    $(window).trigger('resize'); // Trigger a resize on page load

    // TODO - migrate this code from FE team into modules wherever possible

   


    $('#searchicon2').click(function() {
        $("#search-textbox").toggle("slide");
    });

    $(".copyright-text").click(function() {
        $("#footer").slideToggle( function(){
			 $('html, body').animate({
                scrollTop: $(document).height()});
			});
        $(".copyright-icon").toggleClass("copyright-icon1");
    });
	


var count = 0; 
 $(".mobile-btn").click(function() { 
count++
        $(".compactanchor1").show();
        $(".mobile-btn").hide();
        $("ul.active").show(); 
		 $(".header-sub-menu").hide();
		if(count==1){
		 $(".mobile-menu-container").fadeIn();
		 $('#mobile-header-menu li').css('left', '-200px');
		 $('#mobile-header-menu li').animate({"left":"0px"}, 1000);
		
	   }
	else{
		$(".mobile-menu-container").fadeIn();
	}
    });
	
	if($('#checklanding').hasClass('check-landing-page')){
		$('.check-landing-page .submenu-slider li').css('right', '-800px');
      $('.check-landing-page .submenu-slider li').animate({"right":"0px"}, 1000);
		
	}
	


if($('.header-sub-menu').hasClass('group1')==true){
			$('.nav1').addClass('activemenu');
	}
	else if($('.header-sub-menu').hasClass('group2')==true){
			$('.nav2').addClass('activemenu');
	}
	else if($('.header-sub-menu').hasClass('group3')==true){
			$('.nav3').addClass('activemenu');
	}

    $(".compactanchor1").click(function() {
        $(".compactanchor1").hide();
        $(".mobile-btn").show();
        $("#mobile-menu").hide();
        $("ul.active").hide();
		$(".mobile-menu-container").hide();
		$(".header-sub-menu").show();
		
	
    });
	
	
   $(".recharge-mobile-icon").click(function() {

	   $(".mobile-menu-container").hide();
	   $(".recharge-menu").show('slide', {direction: 'right'}, 500);
	  
        	
	
    });
	
	
	
	

    $('#mobile-language').click(function() {
        $(".mobile-language").slideToggle();
    });


    /*onclick slide page*/
    $('a[href^="#"]').on('click', function(event) {
        var target = $($(this).attr('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
			
			
        }
    });
    /*onclick slide page end*/





    $("#menu2").menu({
        theme: 'theme-theme2'
    });





    /*Top Header Links Events*/
$(".declaration-container").niceScroll({touchbehavior:false,cursorcolor:"#ccc",cursoropacitymax:0.7,cursorwidth:11,cursorborder:"1px solid #ccc",cursorborderradius:"8px",background:"#fff",autohidemode:false});

    $("#cart").click(function() {
        $('.to-fix').find(".active-link").removeClass("active-link");
        $('.desktop-search-box').hide();
        $(".login-box").hide();
        $(".divider4").css("border-right", "1px solid #E3E3E3");
        $('#added-cart-detail').fadeToggle();
    });

    $("#search-link, #testpr").click(function() {
        
    if($('.lightbox-overlay').css('display') == 'none'){
            
        $('.to-fix').find(".active-link").removeClass("active-link");
        $('.lightbox-overlay').hide();
        $('#added-cart-detail').hide();
        $('#desktop-search-box').css('display','block');
		$('#desktop-search-box1').css('display','none');
        $('#desktop-search-box').appendTo('.lightbox-overlay .overlay-content-container');
		$(".search-result").show(); 
		 
		//$(".search-result").removeClass("scrollbar-hide");   
		$('.lightbox-overlay').fadeIn();
        $('.search-input').focus();
        $('.search-result').scrollpanel(); 
      }
      else{
        $('.desktop-search-box').hide();
        $('.lightbox-overlay').fadeOut();
        $(".search-result").getNiceScroll().remove();
		$(".search-result").hide();
        
      }

    });
	

    $(".close-btn-img").click(function() {
        $('.desktop-search-box').fadeOut();
        $('.lightbox-overlay').fadeOut();
            $(".search-result").getNiceScroll().remove();
		$(".search-result").hide();
       
    });

   $(".search-result").click(function() {
        $('#self-help-section').show();
    });

    $("#language").click(function() {

        hideAll();
        
		 if ($('.dropdown').hasClass('open')){
			 $(this).removeClass('active-link'); 
		 }
		 else{
			  $(this).addClass('active-link'); 
		 }
		
         
    });

   

    function hideAll() {
        $('.to-fix').find(".active-link").removeClass("active-link");
        $('.desktop-search-box').hide();
        $(".contact-box").hide();
        $('#added-cart-detail').hide();
        $(".login-box").hide();
        $(".divider4").css("border-right", "1px solid #E3E3E3");
        $('.desktop-search-box').fadeOut();
        $('.lightbox-overlay').fadeOut();
    }

    $(".city-menu li a").click(function() {

       var selText = $(this).text();
       $(this).parents('.city-dropdown').find('.dropdown-toggle').html(selText + ' <span class="caret1"></span>');
       $(' step1').css("display", "none");
       $('.step2').css("display", "block");
    });

	 $(".plan-menu li a").click(function() {
 		   var selText = $(this).text();
 		   $(this).parents('.plan-product').find('.dropdown-toggle').html(selText + ' <span class="caret2"></span>');
              });
	
//Bundle Page Filter Script	
	$('.hiding').css("display", "none");
    $('.toggle-icon').click(function() {

      if (!$(this).hasClass("active-toggle")) {
            $(this).toggleClass("active-toggle");
            $('.step1').css("display", "block");
			$('.showing').css("display", "none");
			$('.hiding').css("display", "block");
        } else {
           $(this).toggleClass("active-toggle");
           $('.step1').css("display", "none");
		   $('.showing').css("display", "block");
		   $('.hiding').css("display", "none");
        }

    });
	
	//Bundle Page Slide Navigation Script Start

	$('#bundle_step_1').click(function() {
			
		$("#bundle-step2").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$("#bundle-step1").slideUp("slow");
		$("#successMessage1").show().delay(2000).fadeOut('slow');
    });

	$('#bundle_step_2').click(function() {
			
		$("#bundle-step3").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$("#bundle-step2").slideUp("slow");
		$("#successMessage2").show().delay(2000).fadeOut('slow');
    });	
	
	$('#bundle_step_3').click(function() {
			
		$("#bundle-step4").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$("#bundle-step3").slideUp("slow");
		$("#successMessage3").show().delay(2000).fadeOut('slow');
    });
	
	$('.bundle-back1').click(function() {
		$("#bundle-step1").slideDown("slow");
		$("#bundle-step2").slideUp("slow");
		$("#bundle-step3").slideUp("slow");
        $("#bundle-step4").slideUp("slow");
    });
	
	$('.bundle-back2').click(function() {
		$("#bundle-step1").slideUp("slow");
		$("#bundle-step2").slideDown("slow");
		$("#bundle-step3").slideUp("slow");
        $("#bundle-step4").slideUp("slow");
    });
	
	$('.bundle-back3').click(function() {
		$("#bundle-step1").slideUp("slow");
		$("#bundle-step2").slideUp("slow");
		$("#bundle-step3").slideDown("slow");
        $("#bundle-step4").slideUp("slow");
    });
	
	
	
	//Bundle Page Slide Navigation End
	
	// Product Page Slide Navigation Start
	$('#step_1').click(function() {
		
		$("#jio-settings").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$("#product-step1").slideUp("slow");
    });
	
	$('#step_1').click(function() {
			
		$("#product-step2").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$("#product-step1").slideUp("slow");
    });
	
	$('#accessories-step1').click(function() {
			
		$(".accessories-step2").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
			 
		});
		
		$("#product-step1").slideUp("slow");
		
    });
	
  $('#accessories-step1').click(function() {
	  
		$("#successMessage3").show().delay(2000).fadeOut('slow');
    });
	
	
	
	$('#step_2').click(function() {
	
		$("#product-step3").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$("#product-step2").slideUp("slow");
		$("#product-step1").slideUp("slow");
    });
	
	$('#accessories-step2a').click(function() {
		$(".accessories-step2a").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$(".accessories-step2").slideUp("slow");
		$("#product-step1").slideUp("slow");
    });
	 $('#accessories-step2a').click(function() {
	  
		$("#successMessage4").show().delay(2000).fadeOut('slow');
    });
	
	
	
	$('#step_3').click(function() {
		
$("#successMessage7").show().delay(2000).fadeOut('slow');
    });
	
	
	$('#accessories-step3a').click(function() {
		$(".accessories-step3").slideDown("slow",function(){
   			 $('html, body').animate({scrollTop: '0px'}, 1000);
		});
		$(".accessories-step2a").slideUp("slow");
		$(".accessories-step2a").slideUp("slow");
    });
	
	 $('#accessories-step3a').click(function() {
	  
		$("#successMessage5").show().delay(2000).fadeOut('slow');
    });
	$('#step2-item tr').click(function(){
		$clicked_tr = $('.table-striped-odd');
			$clicked_tr.parent().children().each(function() {
			$(this).removeClass('table-striped-select')
		});
			$clicked_tr.addClass('table-striped-select');
			
			$clicked_tr = $('.table-striped-even');
			$clicked_tr.parent().children().each(function() {
			$(this).removeClass('table-striped-select')
		});
			$clicked_tr.addClass('table-striped-select');
			
			$clicked_tr = $(this);
			$clicked_tr.parent().children().each(function() {
			$(this).removeClass('table-striped-select')
		});
			$clicked_tr.addClass('table-striped-select');
	});
 

   $("input[name=radiog_lite21]:radio").change(function () {

$('.accordion-header').removeClass('active-header').addClass('inactive-header');
    
       $("#product-step4").slideDown("slow",function(){
             $('html, body').animate({scrollTop: '0px'}, 1000);
        });
       $("#product-step3").slideUp("slow");
        $("#product-step2").slideUp("slow");
        $("#product-step1").slideUp("slow");
    });

   $("input[name=radiog_lite31]:radio").change(function () {

$('.accordion-header').removeClass('active-header').addClass('inactive-header');
 $(".jio-product .accordion-content").slideUp('slow');
 $('html, body').animate({scrollTop: '0px'}, 1000);
       });

		$('#add-plan tr').click(function(){
		 	
			$clicked_tr = $('.table-striped-odd');
			$clicked_tr.parent().children().each(function() {
			$(this).removeClass('table-striped-select')
		});
			$clicked_tr.addClass('table-striped-select');
			
			$clicked_tr = $(this);
			$clicked_tr.parent().children().each(function() {
			$(this).removeClass('table-striped-select')
		});
			$clicked_tr.addClass('table-striped-select');
		 
		$(this).find('input[type=radio]').prop('checked', true);
        $(".successMessage3").show().delay(2000).fadeOut('slow');
		$('.jio-plans-added').empty();
			var value = $("#add-plan input[type='radio']:checked").val();
			if($("#add-plan input[type='radio']").is(':checked')) 
			
			{ 
			//$(this).css('background-color','#ffe04c');
			$('.jio-plans-added').append(value);
				
				}
				else{
				alert(" Please Select any Option "); 
				 }	
        $('.accordion-header').removeClass('active-header').addClass('inactive-header');
            $('html, body').animate({scrollTop: '0px'}, 1000);
            $(".jio-product .accordion-content").slideUp('slow');
            
       });

   /* $("input[name=radiog_lite1]:radio").change(function () {
 
       $("#product-step3").slideDown("slow",function(){
             $('html, body').animate({scrollTop: '0px'}, 1000);
        });
        $("#product-step1").slideUp("slow");
    }); */

      $("input[class=css-label]:radio").change(function () {
    
       $("#product-step4").slideDown("slow",function(){
             $('html, body').animate({scrollTop: '0px'}, 1000);
        });
        $("#product-step2").slideUp("slow");
        $("#product-step1").slideUp("slow");
    });
$('#subscribe-textbox').keyup(function () {

 $("button").removeAttr("disabled");

});

    $('#step_2').click(function() {
        $("#product-step3").slideDown("slow",function(){
             $('html, body').animate({scrollTop: '0px'}, 1000);
        });
        $("#product-step2").slideUp("slow");
        $("#product-step1").slideUp("slow");
    });
	
	$('.back-step1').click(function() {
		$("#product-step1").slideDown("slow");
		$("#product-step2").slideUp("slow");
		$("#product-step3").slideUp("slow");
        $("#product-step4").slideUp("slow");
    });
	
	$('.back-step2').click(function() {
		$("#product-step2").slideDown("slow");
		$("#product-step1").slideUp("slow");
		$("#product-step3").slideUp("slow");
    });
	
	$('#step_1').click(function() {
		$("#successMessage1").show().delay(2000).fadeOut('slow');
    });
	
	$('.accessories-step1').click(function() {
		
		$("#successMessage1").show().delay(2000).fadeOut('slow');
    });
	
	$('#step_2').click(function() {
		$("#successMessage2").show().delay(2000).fadeOut('slow');
    });
	
	$('.active1').click(function() {
		$("#active-successMessage").show().delay(2000).fadeOut('slow');
    });

	// Product Page Slide Navigation End
	
	// Contact Us Change Value Script
	$('#phone_number').click(function(){
		$('#phone_number').val('+91');
	});
	
	// Bundles Page Slide Navigation Start
	
	$('#bundle_step1').click(function() {
		$("#product-step2").slideDown("slow",function(){
		});
    });
	
	// Bundles Page Slide Navigation End
	
	// Guide Help Page Slide Navigation Start
	
	
	
	$('#Quiz_01 .guided-help-content li').click(function() {
		
		$(this).find('input[type=radio]').prop('checked', true);
		$("#Quiz_02").slideDown("slow");
		$("#Quiz_01 .guided-help-content").slideUp("slow");
		$('#Quiz_01 .heading').css('color','#999');
		$("#Quiz_01 .answer").fadeIn("slow");
		$('#Quiz_01 #result').empty();
		$('html, body').animate({scrollTop: '100px'}, 1000);
		var value = $("#Quiz_01 input[type='radio']:checked").val();
		if($("#Quiz_01 input[type='radio']").is(':checked')) 
		{ 
		$('#Quiz_01 #result').append(value);
			}
			else{
			alert(" Please Select any Option "); 
			 };
		
    });
	
	$('#Quiz_02 .guided-help-content li').click(function() {
		$(this).find('input[type=radio]').prop('checked', true);
		$("#Quiz_03").slideDown("slow");
		$("#score1").hide();
		$("#score2").fadeIn("slow");
		$("#Quiz_02 .guided-help-content").slideUp("slow");
		$('#Quiz_02 .heading').css('color','#999');
		$("#Quiz_02 .answer").fadeIn("slow");
		$('#Quiz_02 #result').empty();
		$('html, body').animate({scrollTop: '200px'}, 1000);
		var value = $("#Quiz_02 input[type='radio']:checked").val();
		if($("#Quiz_02 input[type='radio']").is(':checked')) 
		{ 
		$('#Quiz_02 #result').append(value);
			}
			else{
			alert(" Please Select any Option "); 
			 }	
    });
	
	$('#Quiz_03 .guided-help-content li').click(function() {
		$(this).find('input[type=radio]').prop('checked', true);
		$("#Quiz_04").slideDown("slow");
		$("#Quiz_03 .guided-help-content").slideUp("slow");
		$('#Quiz_03 .heading').css('color','#999');
		$("#Quiz_03 .answer").fadeIn("slow");
		$('#Quiz_03 #result').empty();
		$('html, body').animate({scrollTop: '300px'}, 1000);
		var value = $("#Quiz_03 input[type='radio']:checked").val();
		if($("#Quiz_03 input[type='radio']").is(':checked')) 
		{ 
		$('#Quiz_03 #result').append(value);
			}
			else{
			alert(" Please Select any Option "); 
			 }	
    });
	
	$('#Quiz_04 .guided-help-content li').click(function() {
		$(this).find('input[type=radio]').prop('checked', true);
		$("#Quiz_05").slideDown("slow");
		$("#Quiz_04 .guided-help-content").slideUp("slow");
		$('#Quiz_04 .heading').css('color','#999');
		$("#Quiz_04 .answer").fadeIn("slow");
		$('#Quiz_04 #result').empty();
		$('html, body').animate({scrollTop: '400px'}, 1000);
		var value = $("#Quiz_04 input[type='radio']:checked").val();
		if($("#Quiz_04 input[type='radio']").is(':checked')) 
		{ 
		$('#Quiz_04 #result').append(value);
			}
			else{
			alert(" Please Select any Option "); 
			 }	
    });
	
	$('#Quiz_01 a').click(function() {
		$("#Quiz_01 .guided-help-content").slideDown("slow");
		$('#Quiz_01 .heading').css('color','#58585c');
    });
	
	$('#Quiz_02 a').click(function() {
		$("#Quiz_02 .guided-help-content").slideDown("slow");
		$('#Quiz_02 .heading').css('color','#58585c');
    });
	
	$('#Quiz_03 a').click(function() {
		$("#Quiz_03 .guided-help-content").slideDown("slow");
		$('#Quiz_03 .heading').css('color','#58585c');
    });
	
	$('#Quiz_04 a').click(function() {
		$("#Quiz_04 .guided-help-content").slideDown("slow");
		$('#Quiz_04 .heading').css('color','#58585c');
    });
	
	
	
	// Guide Help Page Slide Navigation End
	
	// My Account Page Slide Navigation Start
	
	$(".successMessage6").show().delay(10000).fadeOut('slow');
	
	$('.count').click(function() {
		$(".tabcount-container").slideDown("slow");
		$(".count").fadeOut("slow");
    });
	
	$('#close-count').click(function() {
		$(".tabcount-container").slideUp("slow");
		$(".count").fadeIn("slow");
    });
	
	$('.resp-tabs-list li:first-child').find(".selected-pic").show();
	$('.resp-tabs-list li:first-child').find(".non-selected-pic").hide();
	$('.resp-tabs-list li').click(function() {
		$(this).parent().find(".selected-pic").hide();
		$(this).parent().find(".non-selected-pic").show();
		$(this).find(".non-selected-pic").hide();
		$(this).find(".selected-pic").show();
    });
	
		$('.chat-butt').click(function() {
		$('.email-banner').hide();
		$('.phone-banner').hide();
		$('.chat-banner').show();
		
    });
	
	$('.address-butt').click(function() {
		$('.email-banner').show();
		$('.phone-banner').hide();
		$('.chat-banner').hide();
		
    });
	
	$('.phone-butt').click(function() {
		$('.email-banner').hide();
		$('.phone-banner').show();
		$('.chat-banner').hide();
		
    });
	
	// Plan Finder Detail Page Slide Navigation Start
	
	$('#more-plan').click(function() {
		$('.hide-div').slideToggle(500);	
		$( '.btn-moreview' ).toggleClass( "btn-moreless" );
    });
	
	$('#more-plan1').click(function() {
		$('.hide-div1').slideToggle(500);	
		$( '.btn-moreview' ).toggleClass( "btn-moreless" );
    });
	

	var checkboxes1 = $("#wifi-plan :radio"),
    submitButt1 = $("#wifibtn");
	checkboxes1.click(function() {
		submitButt1.attr("disabled", !checkboxes1.is(":checked"));
	});
	
	var checkboxes2 = $("#mifi-plan :radio"),
    submitButt2 = $("#mifibtn");
	checkboxes2.click(function() {
		submitButt2.attr("disabled", !checkboxes2.is(":checked"));
	});
	
	// Plan Finder Detail Page Slide Navigation End
	
	
	// CUG Page click on checkbox button enable
	var checkboxes3 = $("#cug :checkbox"),
    submitButt3 = $("#cugbtn");
	checkboxes3.click(function() {
		submitButt3.attr("disabled", !checkboxes3.is(":checked"));
	});

	
	// My Account Page Slide Navigation Start


    $(".header-language-space a").click(function() {

        var selText = $(this).text();
        $(this).parents('.header-language-drp').find('.dropdown-toggle').html(selText + ' <span class="caret3"></span>');
        
    });


    $(".footer-city-dropup a").click(function() {
        var selText = $(this).text();
        $(this).parents('.footer-city-drp').find('.dropdown-toggle').html(selText + ' <span class="caret4"></span>');

    });

    var chkLength = $(".step input[type=checkbox]").length;

    for (var i = 1; i <= chkLength; i++) {
        $('#CheckboxGroup1_' + i).click(function() {

            $('.showing-Device').hide();
            var isChecked = $(this).is(':checked');
            var checked = document.querySelectorAll('.step input:checked');
            $('.compare-strip').css("display", "block");
            if (checked.length === 0) {
                $('.compare-strip').css("display", "none");
            }
            var str = $(this).attr('id');
            var res = new Number();
            res = str.slice(15);
            var ProductDisplayParent = document.getElementById("compare-add");
            var newspan = document.createElement('div');
            if (isChecked) {
                if (checked.length <= 6) {
                    newspan.setAttribute("class", "compareTab " + res);
                    newspan.innerHTML = '<div id="compare-close-button"></div>&nbsp;&nbsp;' + $(this).val() + '';
                    newspan.style.display = "none";
                    ProductDisplayParent.appendChild(newspan);
                    $(newspan).fadeIn(500);
                    for (var k = 1; k <= chkLength; k++) {
                        $('#CheckboxGroup1_' + k).prop('disabled', false);
                    }
                }
            } else {
                $("." + res).fadeOut(500);
            }
            if (checked.length == 6) {
                for (var k = 1; k <= chkLength; k++) {
                    $('#CheckboxGroup1_' + k).prop('disabled', true);
                }
            }
            newspan.onmouseover = function() {
                $(this).find('#compare-close-button').click(function() {
                    $(this).parent().fadeOut(500);
                    $('#CheckboxGroup1_' + res).prop('checked', false);

                    if (checked.length === 1) {
                        $('.compare-strip').css("display", "none");
                    }
                    for (var k = 1; k <= chkLength; k++) {
                        $('#CheckboxGroup1_' + k).prop('disabled', false);

                    }

                });
            };
        });
    }

});

// Browser Window Open Function
function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
};

// ReadMore Button Function for Show Hide Content
function showonlyone(thechosenone) {
     $('.showmore').each(function(index) {
          if ($(this).attr("id") == thechosenone) {
               $(this).slideToggle(500);
			   $( '.btn-readMore' ).toggleClass( "btn-readless" );	
			   $( '.btn-moreoffers' ).toggleClass( "btn-lessoffers" );	
			   $( '.btn-moreapps' ).toggleClass( "btn-lessapps" );			   
			    $( '.btn-moreview' ).toggleClass( "btn-moreless" );
				$( '.btn-loadmore' ).toggleClass( "btn-loadless" );
				$( '.btn-morefilter' ).toggleClass( "btn-lessfilter" );		
				$( '.btn-morefilter1' ).toggleClass( "btn-lessfilter" );
				$( '.btn-morefilter2' ).toggleClass( "btn-lessfilter2" );
				$( '.btn-viewmore' ).toggleClass( "btn-viewless" );
				$( '.btn-showmore' ).toggleClass( "btn-showless" );		
          }
     });
};

$(".btn-moreview").click(function() {
	if ($(this).val() == "Less Plans") {
      $(this).val("More Plans");
   }
   else {
      $(this).val("Less Plans");
   }
});

$(".btn-showmore").click(function() {
	if ($(this).val() == "Show Less") {
      $(this).val("Show More");
   }
   else {
      $(this).val("Show Less");
   }
});

$(".btn-viewmore").click(function() {
	if ($(this).val() == "View Less") {
      $(this).val("View More");
   }
   else {
      $(this).val("View Less");
   }
});

$(".btn-loadmore").click(function() {
	if ($(this).val() == "Load Less") {
      $(this).val("Load More");
   }
   else {
      $(this).val("Load Less");
   }
});

$(".btn-morefilter").click(function() {
	if ($(this).val() == "Less Filter") {
      $(this).val("More Filter");
   }
   else {
      $(this).val("Less Filter");
   }
});


$(".btn-readMore").click(function() {
	if ($(this).val() == "Read Less") {
      $(this).val("Read More");
   }
   else {
      $(this).val("Read Less");
   }
});

$(".btn-moreoffers").click(function() {
	if ($(this).val() == "Less Offers") {
      $(this).val("More Offers");
   }
   else {
      $(this).val("Less Offers");
   }
});

$(".btn-moreapps").click(function() {
	if ($(this).val() == "Less Apps") {
      $(this).val("More Apps");
   }
   else {
      $(this).val("Less Apps");
   }
});


function starrating(rating,feedback) {
	var nfeedback= feedback;

     $('.changer img').each(function(index) {
		 
          if ($(this).attr("id") == rating) {
			  
			   $(this).attr("src", "assets/images/feedback-fill-star.jpg");
			  
              $(this).parent().parent().parent().find('.feedback-txt').text(nfeedback);
			  
			  
          }
		  else {
			   $(this).attr("src", "assets/images/feedback-empty-star.jpg");
		  }
     });
};


// Connection Device Filter Accordion Script
	
function filterboxClick(thisselectnone) {
     $('.filter-area').each(function(index) {
          if ($(this).attr("id") == thisselectnone) {
			   $(this).slideDown();
			   $(this).prev().addClass("filter-title1");
          }
		  else {
				$(this).slideUp();
				$(this).prev().removeClass("filter-title1");
			}
     });
};
 	 

// Product Matrix - on click checkbox change BG
function chqboxClick(theselectnone) {
     $('.selected-box').each(function(index) {
          if ($(this).attr("id") == theselectnone) {
			   $(this).toggleClass("deselected-box");
          }
     });
};

// Coverage Checker - Coverage Area tab
$(document).ready(function () {
	$('btn-morefilter').css('display','block');
        $('#horizontalTab').easyResponsiveTabs({
            type: 'default',         
            width: 'auto', 
            fit: true,   
            closed: 'accordion', 
            activate: function(event) { 
                var $tab = $(this);
                var $info = $('#tabInfo');
                var $name = $('span', $info);


                $name.text($tab.text());


                $info.show();
            }
        });

        $('.footer-city-btn').click(function (){

            $(".scrollable-menu").niceScroll({touchbehavior:false,cursorcolor:"#ccc",cursoropacitymax:1,cursorwidth:11,cursorborder:"1px solid #fff",cursorborderradius:"8px",background:"transparent",autohidemode:false});
             if($('.dropdown.active-link').hasClass('open')){

             $('.scrollable-menu').getNiceScroll().remove();
             }

        });

        $('.footer-city-btn1').click(function (){
            $(".scrollable-menu1").niceScroll({touchbehavior:false,cursorcolor:"#ccc",cursoropacitymax:1,cursorwidth:11,cursorborder:"1px solid #ccc",cursorborderradius:"8px",background:"transparent",autohidemode:false});
             if($('.dropdown').hasClass('open')){
            

             $('.scrollable-menu1').niceScroll().hide();
             }

        });




  $(document).click(function(){
         $('.scrollable-menu').getNiceScroll().remove();
         $('.scrollable-menu1').getNiceScroll().remove();
      $('#language').removeClass('active-link');

          
  });




        $('#verticalTab').easyResponsiveTabs({
            type: 'vertical',
            width: 'auto',
            fit: true
        });

        $('.shortlist-view').click(function(){
         $(this).css('background','none');
         $(this).find('.view-shortlist').css('display','block');
         $(this).find('.view-shortlist a').css('display','block');

        });

         $("#mobile-number").on('change keyup paste', function() {

        $('.edit-number').show();
       
       });


      
            $("#generate").click(function(){
              $("#generate").hide();
              $("#resend").show();
            });
     
         function btn_enable()
                   {
                     document.getElementById("btn_en").disabled=false;
                     document.getElementById("btn_en").className="submit-btn"
                      
                   }

     

    });

 

		 
		 




//acordion for cart

    function checkform(){
        var f = document.forms["loginform"].elements;
        var cansubmit = true;

        for (var i = 0; i < f.length; i++) {
            if (f[i].value.length == 0) cansubmit = false;
        }

        if (cansubmit) {
            document.getElementById('submitbutton').disabled = false;
        }
    }


//Unsubscribe

$(".unsubscribe-step2").hide();
$(".unsubscribe-step3").hide();
$(".unsubscribe-step4").hide();
$(".unsubscribed-text").css("visibility", "hidden");
$(".unsubscribed").click(function() {
    if($(this).is(":checked")) {
        $(".unsubscribed-text").css("visibility", "visible");
		 document.getElementById('submitbutton').disabled = false;
    } else {
        $(".unsubscribed-text").css("visibility", "hidden");
		document.getElementById('submitbutton').disabled = true;
    }
	
$(".unsubscribe-btn").click(function(){
$(".unsubscribe-step1").hide();
$(".unsubscribe-step2").show();
$(".unsubscribe-step4").show();
});

$(".unsubscribe-btn1").click(function(){
$(".unsubscribe-step1").hide();
$(".unsubscribe-step2").hide();
$(".unsubscribe-step3").show();
$(".unsubscribe-step4").show();
});


});











function showProduct(num)
	{
		$( "a" );
		for(var i=1; i<=10; i++)
		{
			
			$("#rechare"+i).css("display","none");
		}
	
		$("#rechare"+num).css("display","block");s
		 
	}

// toggle 
function toggle_visibility(id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
		   
    }

// Page back script 
function goBack() {
    window.history.back()
}
// about me page script
 


      $(".change-number").click(function(){
          $(".none-edit").hide();
          $(".edit").show();          
        });
        
    $(".edit-number").click(function(){
           $('#mobile-number').attr('readonly', 'readonly');
           $(this).hide();
           $('.one-time-password').slideDown();

    });


 $("#email-send-butt").click(function(){
   // $(".email-form-cont").hide();
    $(".email-thanks-mass").show().delay(2000).fadeOut('slow');
	
});


$("#new-number").click(function(){
    $(".change-btn").show();
    $(".reclaim-btn").hide();
});
$("#same-number").click(function(){
    $(".change-btn").hide();
    $(".reclaim-btn").show();
});



/*store locator page load more script*/
$("#data-toggle").click(function(){
    $("#show-nxt-row").slideDown(2000);
});

// jQuery for page scrolling 
$(function() {
    $('.address a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Index Page Video play/pause script

function vidplay() {
       var video = document.getElementById("Video1");
	   		video.play();
			video.setAttribute("controls","controls");
			$('.video-title').hide();
	}
	
	function vidhide() {
		
       var video = document.getElementById("Video1");
	   		video.removeAttribute("controls");
			
			
	}

/*faq page related question section load more script*/
$(".expand-questions").click(function(){
    $("#show-nxt-row").slideDown(2000);
	$('.expand-questions').hide();
});
/*faq page related question section load more script end*/


	$('.arrow-pic a').click(function() {
		$('.arrow-pic').hide();
		$('.arrow-pic').fadeOut();
		$('.non-arrow-pic').show();
	
    });
	
		$('.non-arrow-pic a').click(function() {
		$('.arrow-pic').show();
		$('.arrow-pic').fadeIn();
		$('.non-arrow-pic').hide();
    });
		

//Cart page add Apps Code Start

$('#add-apps tr').click(function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });

 for (var i = 1; i <= 2; i++) {
     $('.apps-plan-added').css('display','none');	
        $('#app-checkbox' + i).click(function() {    
		$(".successMessage4").show().delay(2000).fadeOut('slow');   
         $('html, body').animate({scrollTop: '0px'}, 1000);   
            var isChecked = $(this).is(':checked');
             $(this).parent().addClass('selected');
            
            $(this).parent().parent().parent().parent().parent().parent().parent().hide();
            var checked = document.querySelectorAll('.app-selection input:checked');
           
             $('.apps-plan-added').css('display','block');
            if (checked.length == 2) {

                $('.app-selection').hide();
            }
            var str = $(this).attr('id');
            var res = new Number();
            res = str.slice(12);
            var ProductDisplayParent = document.getElementById("added-apps");
            var newspan = document.createElement('div');
            if (isChecked) {
                if (checked.length <= 100) {
                    newspan.setAttribute("class", "apps-plan " + res);
                    
                   newspan.innerHTML ='<div class="row no-space"><div class="app-checked"><a href="#"><img src="assets/images/close.png"></a></div><div class="col-lg-2 col-md-2 col-sm-4 col-xs-4 no-space"><img src="assets/images/step2a-icon.png"/></div><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 no-space step-1-product-header">'+$(this).val()+'</div><div class="col-lg-3 col-md-3 col-sm-8 col-xs-8 no-space step-1-product-header"></div><div class="col-lg-3 col-md-3 col-sm-4 col-xs-4 text-right  no-space step-1-product-header">'+$(this).attr('price');+'</div></div>'
                    newspan.style.display = "none";

                    ProductDisplayParent.appendChild(newspan);
                   $('.apps-plan.'+res).find('#app-checkbox3').parent().addClass('selected')
                    $(newspan).fadeIn(500);
                   
                }
            } else {
                $("." + res).fadeOut(500);
            }
            if (checked.length == 6) {
                for (var k = 1; k <= chkLength; k++) {
                    $('#CheckboxGroup1_' + k).prop('disabled', true);
                }
            }

            newspan.onmouseover = function() {
              
                $(this).find('.app-checked').click(function() {
                    $('#app-checkbox' + res).prop('checked', false);
                    $('.apps-plan.'+res).remove();
                    $('.app-selection').show(function(){
                          $('#add-apps .table'+res).fadeIn(500);

                    });
                 
                    
                });
            };
        });
    }

//Cart page add Apps Code End	

//Cart page add Accessories Code Start

$('#add-accessories tr').click(function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });

 for (var i = 1; i <= 20; i++) {
     $('.accessories-added').css('display','none');	
        $('#accessories-checkbox' + i).click(function() {    
		$(".successMessage5").show().delay(2000).fadeOut('slow');   
        $('html, body').animate({scrollTop: '0px'}, 1000);     
            var isChecked = $(this).is(':checked');
             $(this).parent().addClass('selected');
            
            $(this).parent().parent().parent().parent().parent().parent().parent().hide();
            var checked = document.querySelectorAll('.accessories-selection input:checked');
           
             $('.accessories-added').css('display','block');
            if (checked.length == 2) {

                $('.accessories-selection').hide();
            }
            var str = $(this).attr('id');
            var res = new Number();
            res = str.slice(20);
            var ProductDisplayParent = document.getElementById("added-accessories");
            var newspan = document.createElement('div');
            if (isChecked) {
                if (checked.length <= 100) {
                    newspan.setAttribute("class", "accessories-plan " + res);
                    
                   newspan.innerHTML ='<div class="row no-space"><div class="accessories-checked"><a href="' +$(this).attr("data-removeonclick")+ '"><img src="assets/images/close.png"></a></div><div class="col-lg-2 col-md-2 col-sm-4 col-xs-4 no-space"><img src="'+$(this).attr('src')+'"/></div><div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 no-space step-1-product-header">'+$(this).val()+'</div><div class="col-lg-3 col-md-3 col-sm-8 col-xs-8 no-space step-1-product-header"></div><div class="col-lg-3 col-md-3 col-sm-4 col-xs-4 text-right  no-space step-1-product-header">'+$(this).attr('price');+'</div></div>'
                    newspan.style.display = "none";

                    ProductDisplayParent.appendChild(newspan);
                   $('.accessories-plan.'+res).find('#accessories-checkbox3').parent().addClass('selected')
                    $(newspan).fadeIn(500);
                   
                }
            } else {
                $("." + res).fadeOut(500);
            }
            if (checked.length == 100) {
                for (var k = 1; k <= chkLength; k++) {
                    $('#CheckboxGroup1_' + k).prop('disabled', true);
                }
            }

            newspan.onmouseover = function() {
              
                $(this).find('.accessories-checked').click(function() {
					//alert("test");
                    $('#accessories-checkbox' + res).prop('checked', false);
                    $('.accessories-plan.'+res).remove();
                    $('.accessories-selection').show(function(){
                          $('#add-accessories .table'+res).fadeIn(500);

                    });
                 
                    
                });
            };
        });
    }
	
//Cart page add Accessories Code End	

$('#aadons-message').click(function(){		 
        $(".successMessage3").show().delay(2000).fadeOut('slow');
		$(".hide-div").show().delay(2000).fadeOut('slow');
         
    });
	$('#addons-plan tr').click(function(){
		  
		 $(this).css('background-color','#ffe04c !important');
		   }); 
		   
		  

function subscribenow(){
$('.subscribe-form').fadeOut(function(){$('.subscribe-confirm').fadeIn();});
  
};


$(document).ready(function (){
if (window.location.href.indexOf("#anchor1")<=-1 ) {


$('.splash-container').css('display','block');

}
else {

  
	 
	 $(document).scrollTop(0); 
                  $('.to-fix').addClass('fixed');
                  $('.mini-header').addClass('fixed');  
				  
                             
                
                //$(window).off("scroll");
               
               $('.header-top-menu').css('position','relative')
               $('.start-content1').css('height','57px');
         
          
}
 var navpos = $('#nav').offset();
 var max = $(window).height() - $('#nav').height();
 var new_height =  $('.banner-home-img').height();

 $('.index-body-container').css('height',new_height+'px');


$('.splash-container').css("margin-bottom", $('.banner-home-img').height() + 'px');
//Global mobile sticky header starts
if ($('.splash-container').css('display') == undefined && $(window).width()< 1024){       
           $('.to-fix').addClass('fixed');
           $('.start-content1').css('height','56px');
             
}


    if ($('.splash-container').css('display') == undefined && $(window).width()> 1024) {
	
				  $('.mini-header').addClass('fixed');
           $('.start-content1').css('height','56px');
           // $('.header-top-menu').slideUp('1');
		   	$("#feedback").css('display', 'block');

        }
		

if ($('.splash-container').css('display') == "none" && $(window).width()< 640){
     
           $('.to-fix').addClass('fixed');
           $('.start-content1').css('height','63px');
             
}
//Global mobile sticky header Ends


    $(window).bind('scroll', function() {
	
	
        var scrollPos = $(window).scrollTop();
        var max1 = ($('.banner-home-img').height()) - ($('#nav').height() + 100);
		
        var header = $(".banner-home-img");
        var imgwidth = 1 + (scrollPos / 5000);
   

        $(".search-result").getNiceScroll().resize(); 
        $('.dropdown').removeClass('open') 
        $(".scrollable-menu1").getNiceScroll().remove();  

      if ($('.splash-container').css('display') == "none" && $(window).width()< 640){
     
           $('.to-fix').addClass('fixed');
           $('.start-content1').css('height','63px');
             
}
        if ($('.splash-container').css('display') == "block") {
            if ($(window).scrollTop() > $('.banner-home-img').height()) {
                $(document).scrollTop(0);
                  $('.to-fix').addClass('fixed');
                $('.mini-header').addClass('fixed');               
                $('.splash-container').hide();                
                
                //$(window).off("scroll");
               
               $('.header-top-menu').css('position','relative')
               $('.start-content1').css('height','56px');
               	$("#feedback").css('display', 'block');
        }

        }

          
       



        $('.banner-home-img').css("opacity", 1.6 - (scrollPos / max1));

        $('.banner-home-img').css({
            '-webkit-transform': 'scale(' + imgwidth + ')',
            '-moz-transform': 'scale(' + imgwidth + ')',
            '-ms-transform': 'scale(' + imgwidth + ')',
            '-o-transform': 'scale(' + imgwidth + ')',
            'transform': 'scale(' + imgwidth + ')'
        });

        $('.inner-banner').css("opacity", 1.6 - (scrollPos / max1));

        $('.inner-banner').css({
            '-webkit-transform': 'scale(' + imgwidth + ')',
            '-moz-transform': 'scale(' + imgwidth + ')',
            '-ms-transform': 'scale(' + imgwidth + ')',
            '-o-transform': 'scale(' + imgwidth + ')',
            'transform': 'scale(' + imgwidth + ')'
        });



    });






  

  $(function(){
        var deviceAgent = navigator.userAgent.toLowerCase();
     var agentID = deviceAgent.match(/(iphone|ipod|ipad|mac)/);  
       var lastScroll = 0;
      $(window).scroll(function(event){
         
          var st = $(this).scrollTop();
                    if (st > lastScroll){
        if ($('.splash-container').css('display') == undefined && !$(".container" ).hasClass( "check-sticky" ) &&!agentID ){  
            $('.mini-header').addClass('fixed'); 
			//$('.header-top-menu').slideUp('1');  

			/*if ($(document).scrollTop() > 200) {
           	  $('.header-top-menu').slideUp('1');
        	}*/
			
			
            }


             if ($('.splash-container').css('display') == "none" && $(window).width()> 768 &&!agentID ) {
				  $('.mini-header').addClass('fixed');
				 // $('.header-top-menu').slideUp('1');
           

			/*if ($(document).scrollTop() > 200) {
           	  $('.header-top-menu').slideUp('1');
        	}*/

        }
		
		
		else if ($('.splash-container').css('display') == undefined && $(window).width()> 768 &&!agentID ) {
			
				  $('.mini-header').addClass('fixed');
				  //$('.header-top-menu').slideUp('1');
           

		 /* if ($(document).scrollTop() > 200) {
           	  $('.header-top-menu').slideUp('1');
        	}*/
			

        }
       
          }
          else {

       if ($('.splash-container').css('display') == undefined && !$(".container" ).hasClass( "check-sticky" )&&!agentID ){
		   
		   /*if ($(document).scrollTop() == 200) {
           	  $('.header-top-menu').fadeIn('fast');
        	  }*/
			   $('.header-top-menu').fadeIn('fast');
			  $('.header-top-menu').css('position','relative')
			  $('.start-content1').css('height','56px');
           }

		  /* if ($(document).scrollTop() == 200) {
           	  $('.header-top-menu.header-top-menu').fadeIn('fast');
        	}*/
			 $('.header-top-menu').fadeIn('fast');
      }
	
    if (agentID) {
		 $('.header-top-menu').css('position','relative')
		
	}
	


          lastScroll = st;

      });
$(window).bind('scroll', function() {
         if ($(".container" ).hasClass( "check-sticky" )) {
            
            $('.mini-header').removeClass('fixed');
        if ($(window).scrollTop() > 120) {
            $('.my-account-tab').css('position','fixed');
            $('.my-account-tab').css('top','0px');
            $('.my-account-tab').css('z-index','9999999'); 
        

        }
        else if ($(window).scrollTop() < 50) {
             $('.my-account-tab').css('position','relative');
             $('.my-account-tab').css('z-index','9');
             $('.top-header').css('position','relative');
			 $('.start-content1').css('height','0px');
           }
        }
    });
    });


$('.splash-container').ready(function(){
	$('.index-body-container').css('display','none');

});

        
$('.logo-container-mobile').ready(function(){
	
	$('#menu2 ul li').css('display','block');
})
$('.logo-container a').click(function(){
	
	$('.splash-container').css('display','none');
})



});


// Mega Menu Script - onclick menu item selected
$(document).ready(function(){
	var splashtime
	if ($('.splash-container').css('display') == "block"){
		$("#feedback").css('display', 'none');
	splashtime = setTimeout(function(){ $("html, body").animate({ scrollTop: $('#anchor1').offset().top }, 1000); }, 3000);  


	}
	else{

		$("#feedback").css('display', 'block');
	}
	
	
	var clicked=false;
	
	$(window ).scroll(function() {
	
clearTimeout(splashtime);
});
	
	
$(".pull_feedback").click(function(){
	
	if (clicked){
		$("#feedback").animate({right:"-640px"});	
		$("#feedback").removeClass('feedback-clicked');
		clicked=false;	
		
	}
	else{
		$("#feedback").animate({right:"0px"});
		$("#feedback").addClass('feedback-clicked');
        clicked=true;		
	}
	
});
	
	var str=location.href.toLowerCase();
	$('#menu-bar li.activenav span a').each(function() {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
		$(this).parent().parent().removeClass("activenav").addClass("activemenu"); 
		}
	}); 
	
	$('#menu-bar li.activenav li.submenu a').each(function() {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
		$(this).parent().parent().parent().parent().parent().removeClass("activenav").addClass("activemenu"); 
		}
	});
	
	$('#menu-bar li.activenav .submenu a').each(function() {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
		$(this).parent().parent().parent().removeClass("activenav").addClass("activemenu"); 
		}
	});
	if (document.documentMode== 9){
		
		 $("div").removeClass("wow");
	}
   wow = new WOW(
      {
        animateClass: 'animated',
        offset:       100,
        callback:     function(box) {
          console.log("WOW: animating <" + box.tagName.toLowerCase() + ">")
        }
      }
    );
    wow.init();

	
}) 
 
 function toggle(){
    $('.box').fadeToggle(function() { // add callback for once the toggle has occured
        if ($('.box').css("display")=="block") { // is the div showing?
            $(".icon").attr("src", "assets/images/overlay-close.png ");
        }else{ // is the div hidden?
            $(".icon").attr("src", "assets/images/overlay-question-grey.png");
        }
    });
}
 function toggle2(){
    $('.box2').fadeToggle(function() { // add callback for once the toggle has occured
        if ($('.box2').css("display")=="block") { // is the div showing?
            $(".icon2").attr("src", "assets/images/overlay-close.png ");
        }else{ // is the div hidden?
            $(".icon2").attr("src", "assets/images/overlay-question-grey.png");
        }
    });
}
 function toggle3(){
    $('.box3').fadeToggle(function() { // add callback for once the toggle has occured
        if ($('.box3').css("display")=="block") { // is the div showing?
            $(".icon3").attr("src", "assets/images/overlay-close.png ");
        }else{ // is the div hidden?
            $(".icon3").attr("src", "assets/images/overlay-question-grey.png");
        }
    });
}
$('#mapaddress').click(function() {
        $("#address1").show();
		 
    });
 

$('#filter-menu').click(function() {
        $("#filter-show").slideToggle();
		$( '.btn-morefilter' ).toggleClass( "btn-lessfilter" );
    });

$('.device-compare.compare-btn1').click(function() {
        $(this).toggleClass('active');	
		 $('html, body').animate({scrollTop: '0px'}, 1000);
		$('.compare-device-list').show();
 $('.compare-menu .product1').fadeToggle();
});	

$('.device-compare.compare-btn2').click(function() {
        $(this).toggleClass('active');
 $('html, body').animate({scrollTop: '0px'}, 1000);		
		$('.compare-device-list').show();
 $('.compare-menu .product2').fadeToggle();
});	

$('.device-compare.compare-btn3').click(function() {
        $(this).toggleClass('active');
		 $('html, body').animate({scrollTop: '0px'}, 1000);
$('.compare-device-list').show();		
 $('.compare-menu .product3').fadeToggle();
});	

$('.device-compare.compare-btn4').click(function() {
        $(this).toggleClass('active');
		 $('html, body').animate({scrollTop: '0px'}, 1000);
		$('.compare-device-list').show();
		
 $('.compare-menu .product4').fadeToggle();
});	

$('.close-compare-icon').click(function() {
        $(this).parent().parent().hide();

});	

$('.compare-container-close').click(function() {
        $('.compare-device-list').hide();
		$('.device-compare').removeClass('active');

});	




$(".submenu-slider").show('slide', {direction: 'right'}, 700);


