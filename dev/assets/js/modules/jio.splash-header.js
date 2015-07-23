(function(jio){

	jio.splashHeader = function(){
		
		var $el = $('#splash_header'),
			$elContent = $el.find('.content'),
			$siteContainer = $('#site_container'),
			$btn = $el.find('.btn-splash'),
			headerVisible = false;

		if( $el.length > 0){
			
			var onResize = function(){
				
				// Set element height to window height
				$el.outerHeight(jio.viewport.height);

				// Reset content height
				$elContent.css({
					height : 'auto'
				});

				// Get content's natural height
				var contentHeight = $elContent.height();

				// Set the height, and top margin to vertically centre
				$elContent.css({
					height : contentHeight+'px',
					marginTop : -(contentHeight / 2 + 40)+'px'
				});

				// Fade in the header on page load
				if( !headerVisible ){
					$el.addClass('fade-in-active');
					headerVisible = true;
				}

				
			};

			// Force scrollbar to top of page, prevents waypoint bug if landing on page past the waypoint
			$("html, body").scrollTop(0);

			// Make header sticky when scrolling past the splash header
			// And back again when scroll back to top
			$siteContainer.waypoint(function(direction){
				switch(direction){
					case 'down':
						$siteContainer.removeClass('splash');
						break;

					case 'up':
						$siteContainer.addClass('splash');
						break;
				}
			});

			$btn.on('click', function(e){
				e.preventDefault();
				var href = $(this).attr('href');
				$("html, body").animate({ 
					scrollTop: $(href).offset().top 
				}, {
					duration : 1000,
					easing : 'easeInOutCubic'
					//easing : 'easeInOutQuart',
					//easing : 'easeInOutCirc'
				});
				return false;
			});
			
			$.waypoints('refresh');
			$.subscribe('window_resize', onResize);
		}
	};

})(jio);