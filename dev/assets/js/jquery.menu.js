var MainMenu = function () {
 $('.main-menu').css('display', 'block');
    var activated = false;

    var settings = {
        disabledClass: 'disabled',
        submenuClass: 'submenu'


        
    }

    var mask = '<div id="menu-top-mask" style="height: 0px; z-index:1001;"/>';
    var timeOut;
    this.init = function (p) {

        $.extend(settings, p);

        $mask = $('#menu-top-mask');
 
      




       
    var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
    if (agentID) {

        $('ul.main-menu > li').click(function (event) {
       



            
            var target = $(event.target);
            if (target.hasClass(settings.disabledClass) || target.parents().hasClass(settings.disabledClass) || target.hasClass(settings.submenuClass)) {
                return;
            }
              
            toggleMenuItem($(this));
            
            
        });

           $(function () {
    $('ul.main-menu > li a').on("click", function (e) {
       
        e.preventDefault();
    });
});




     
    }

    else{
  $('ul.main-menu > li').click(function (event) {
       



            
            var target = $(event.target);
            if (target.hasClass(settings.disabledClass) || target.parents().hasClass(settings.disabledClass) || target.hasClass(settings.submenuClass)) {
                return;
            }
              
            toggleMenuItem($(this));
            
            
        });


   $(function () {
    $('ul.main-menu > li a').on("click", function (e) {
       
        e.preventDefault();
    });
});

     $('ul.main-menu > li').mouseenter(function (event) {
            var target = $(event.target);
            if (target.hasClass(settings.disabledClass) || target.parents().hasClass(settings.disabledClass) || target.hasClass(settings.submenuClass)) {
                return;
            }
              
            toggleMenuItem($(this));
            
            
        });

    }
      

    



        $('ul.main-menu > li > ul li').click(function (event) {

			
			// Prevent click event to propagate to parent elements
			event.stopPropagation();

			// Prevent any operations if item is disabled
			if ($(this).hasClass(settings.disabledClass)) {
                return;
            }

            // If item is active, check if there are submenus (ul elements inside current li)
            if ($(this).has( "ul" ).length > 0) {
            	// Automatically toggle submenu, if any
                toggleSubMenu($(this));
            }
            else{
            	// If there are no submenus, close main menu.
            	closeMainMenu();
            }
        });



        $('ul.main-menu > li > ul li').mouseenter(function (e) {
            // Hide all other opened submenus in same level of this item
            $el = $(e.target);
            if ($el.hasClass('separator')) return;
            clearTimeout(timeOut);
            var parent = $el.closest('ul');
            parent.find('ul.active-sub-menu').each(function () {
                if ($(this) != $el)
                    $(this).removeClass('active-sub-menu').hide();
            });

            // Show submenu of selected item
            if ($el.children().size() > 0) {
                timeOut = setTimeout(function () { toggleSubMenu($el) }, 500);
            }
        });


/*
        $('ul.main-menu > li > ul').mouseleave(function(){
         closeMainMenu();
       
        });





     

 */ 

        $('.logo-container').mouseenter(function(){
         closeMainMenu();
     

        });

        $('.header-top-menu').mouseleave(function(){
         closeMainMenu();
     

        });





       
    
     
        $('ul.main-menu > li > ul li').each(function () {
            if ($(this).children('ul').size() > 0) {
                $(this).addClass(settings.submenuClass);
            }
        });



        $('ul.main-menu li.' + settings.disabledClass).bind('click', function (e) {
           
            e.preventDefault();
        });

        //#region - Toggle Main Menu Item -

        toggleMenuItem = function (el) {
        	



   

            // Hide all open submenus
            $('.active-sub-menu').removeClass('active-sub-menu').hide();

            $('#menu-top-mask').remove();
             /*if(!$('#nav').hasClass('fixed')){
	         $('#nav').addClass('fixed');
	      	 $(document).scrollTop($('.banner-home-img').height());
	      	 
	      	 }*/
            var submenu = el.find("ul:first");
            var top = parseInt(el.css('padding-bottom').replace("px", ""), 10) + parseInt(el.css('margin-top').replace("px", ""), 10) +
                        el.position().top +
                        el.height()-6;

            submenu.prepend($(mask));
            var $mask = $('#menu-top-mask');
            var maskWidth = el.width() +
                            parseInt(el.css('padding-left').replace("px", ""), 10) +
                            parseInt(el.css('padding-right').replace("px", ""), 10);

            $mask.css({ position: 'absolute',
                top: '-1px',
                width: (maskWidth) + 'px'
            });

            submenu.css({
                position: 'absolute',
                top: top + 'px',
                left: '0' + 'px',
                zIndex: 1,
                
            });

            submenu.stop().toggle();
            activated = submenu.is(":hidden") == false;

            !activated ? el.removeClass('active-menu') : el.addClass('active-menu');





            if (activated) {

  $(function () {
    $('ul.main-menu > li a').on("click", function (e) {
       
        e.preventDefault();
    });
});

                $('.active-menu').each(function () {
                    if ($(this).offset().left != el.offset().left) {
                        $(this).removeClass('active-menu');
                        $(this).find("ul:first").hide();
                    }
                    $(function () {
    if($('.nav1').hasClass('active-menu')){


                       
    $('.nav1 a').unbind('click');

  
    }
     if($('.nav2').hasClass('active-menu')){
                       
    $('.nav2 a').unbind('click');
 

    }
     if($('.nav3').hasClass('active-menu')){
                       
    $('.nav3 a').unbind('click');
    

    }

   
});
                });
                 

            }


   


        }

        //#endregion

        //#region - Toggle Sub Menu Item -

        toggleSubMenu = function (el) {

            if (el.hasClass(settings.disabledClass)) {
                return;
            }

            var submenu = el.find("ul:first");
            var paddingLeft = parseInt(el.css('padding-right').replace('px', ''), 10);
            var borderTop = parseInt(el.css('border-top-width').replace("px", ""), 10);
            borderTop = !isNaN(borderTop) ? borderTop : 1;
            var top = el.position().top - borderTop;

            submenu.css({
                position: 'absolute',
                top: '-10' + 'px',
              left: '30' + '%',
              width:'50%',
                zIndex: 9999999999999999999999999, background:'transparent'
            });

            submenu.addClass('active-sub-menu');

            submenu.show();

            el.mouseleave(function () {
        	submenu.hide();
           });
        }

        //#endregion

        closeMainMenu = function () {
            activated = false;
            $('.active-menu').find("ul:first").hide();
            $('.active-menu').removeClass('active-menu');
            $('.active-sub-menu').hide();
        };

        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                closeMainMenu();
            }
        });
		
		$(document).bind('click', function (event) {
            var target = $(event.target);
            if (!target.hasClass('active-menu') && !target.parents().hasClass('active-menu')) {
                closeMainMenu();
                
				
            }
        });

     
        
    }
}

$(document).ready(function () {

    new MainMenu().init();
   
});