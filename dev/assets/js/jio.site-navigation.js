(function(jio){

	jio.siteNavigation = function(){
		
		var self = this;

		var $el = $('.site-nav'),
			$mobileToggle = $('.mobile-menu-toggle'),
			$submenuLink = $el.find('.submenu-open'),
			//$submenu = $el.find('.submenu'),
			mobileMenuLevelsDeep = 0,
			$mainNav = $el.find('.main-nav'),
			$mobileBackBtn = $el.find('.mobile-menu-btn-back'),
			$search = $el.find('.search');

		this.init = function(){
			if( $el.length > 0){
				
				if( jio.viewport.currentBreakpoint === 'desktop' ){
					$el.addClass('no-transitions');
				}

				if( jio.viewport.currentBreakpoint === 'mobile' ){
					self.initMobileMenu();
				}

				$.subscribe('window_resize', self.onResize);
				self.onResize();
			}
		};	

		this.initMobileMenu = function(){
			console.log('hi mobile');

			$el.removeClass('no-transitions');
			var initialHeight = $mainNav.outerHeight();
			$mainNav.css({
				height: initialHeight
			});

			// Bind burger toggle click event
			$mobileToggle.on('click', function(){
				self.toggleMobileMenu();
				return false;
			});

			$submenuLink.on('click', function(e){
				e.preventDefault();

				mobileMenuLevelsDeep ++;

				$search.fadeOut();

			 	$mainNav.find('.submenu').removeClass('active-submenu');
			
				// hide all adjacent and child submenus
				// - Don't hide any parent menus
				$(this).parent().siblings().find('.submenu').hide();

				// Show the sibling submenu
				var $submenu = $(this).siblings('.submenu');
				$submenu.addClass('active-submenu').show();

				// Animate entire menu tree left
				// -(numLevels deep * width of viewport)
				$mainNav.css({
					left: -(mobileMenuLevelsDeep * jio.viewport.width)+'px',
					height: $submenu.outerHeight()
				});

				return false;
			});

			$mobileBackBtn.on('click', function(e){
				e.preventDefault();

				mobileMenuLevelsDeep --;

				if( mobileMenuLevelsDeep === 0 ){
					$search.fadeIn();
				}

				var $prevMenu = $mainNav.find('.active-submenu').removeClass('active-submenu');
				var newHeight;

				if( $prevMenu.parent().parent().hasClass('submenu') ){
					newHeight = $prevMenu.parent().parent().addClass('active-submenu').outerHeight();
				} else {
					newHeight = initialHeight;


				}

				$mainNav.css({
					left: -(mobileMenuLevelsDeep * jio.viewport.width)+'px',
					height: newHeight
				});

				return false;
			});

		};

		this.destroyMobileMenu = function(){
			console.log('bye mobile');

			// Revert styles
			$el.removeAttr('style');
			$el.addClass('no-transitions');
			$search.show();
			$mobileToggle.removeClass('active');
			$mainNav.removeAttr('style');
			$el.removeClass('mobile-menu-active');
			$mainNav.find('.submenu').removeClass('active-submenu').hide();

			// Unbind events
			$mobileToggle.off('click');
			$submenuLink.off('click');
			$mobileBackBtn.off('click');

			// Reset vars
			mobileMenuLevelsDeep = 0;

		};
		

		this.toggleMobileMenu = function(e){
			if( $el.hasClass('mobile-menu-active') ){
				$el.removeClass('mobile-menu-active');
				$mobileToggle.removeClass('active');

				// Reset back to initial submenu position
				mobileMenuLevelsDeep = 0;
				
				setTimeout(function(){
					$mainNav.css({
						left: '0',
						height: 'auto'
					});
					$search.show();
				}, 400);

			} else {
				$mainNav.css({
					height: $mainNav.height()
				});
					
				$el.addClass('mobile-menu-active');
				$mobileToggle.addClass('active');
			}
		};

		this.onResize = function(){
			
			// Disable transitions to stop dimension changes animating when changing breakpoints
			

			// Get height of menu for use by toggleMobileMenu animation
			self.mobileMenuHeight = $el.children('.container').height();

		
			//Resize from mobile to desktop
			if( jio.viewport.prevBreakpoint === 'mobile' && jio.viewport.currentBreakpoint === 'desktop' ){
				
				self.destroyMobileMenu();
			}

			// Resize from desktop to mobile
			if( jio.viewport.prevBreakpoint === 'desktop' && jio.viewport.currentBreakpoint === 'mobile' ){
				
				self.initMobileMenu();
			}

		};

		this.init();
	};

})(jio);