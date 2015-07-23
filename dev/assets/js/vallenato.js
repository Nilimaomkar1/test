
// Cart Page Accordion Start

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	$('.accordion-header').toggleClass('inactive-header');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header').width();
	$('.accordion-content').css({'width' : '100%' });
	
	//Open The First Accordion Section When Page Loads
	//$('.accordion-header').first().toggleClass('active-header').toggleClass('inactive-header');
	//$('.accordion-content').first().slideDown().toggleClass('open-content');

	
	
	// The Accordion Effect
	$('.accordion-header').click(function () {
		if($(this).is('.inactive-header')) {
			$('.active-header').toggleClass('active-header').toggleClass('inactive-header').next().slideToggle().toggleClass('open-content');
			$(this).toggleClass('active-header').toggleClass('inactive-header');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).toggleClass('active-header').toggleClass('inactive-header');
			$(this).next().slideToggle().toggleClass('open-content');
		}
	});
	
	return false;
});

// Cart Page Accordion End


// My Account Apps Page Accordion Start

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	$('.accordion-header1').toggleClass('inactive-header1');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header1').width();
	$('.accordion-content1').css({'width' : '100%' });
	
	//Open The First Accordion Section When Page Loads
	$('.accordion-header1').first().toggleClass('active-header1').toggleClass('inactive-header1');
	$('.accordion-content1').first().slideDown().toggleClass('open-content');
	
	// The Accordion Effect
	$('.accordion-header1').click(function () {
		if($(this).is('.inactive-header1')) {
			$('.active-header1').toggleClass('active-header1').toggleClass('inactive-header1').next().slideToggle().toggleClass('open-content');
			$(this).toggleClass('active-header1').toggleClass('inactive-header1');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).toggleClass('active-header1').toggleClass('inactive-header1');
			$(this).next().slideToggle().toggleClass('open-content');
		}
	});
	
	return false;
});

// My Account Apps Page Accordion End

// My Account Support Ticket

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	$('.accordion-header2').toggleClass('inactive-header2');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header2').width();
	$('.accordion-content2').css({'width' : '100%' });
	
	//Open The First Accordion Section When Page Loads
	$('.accordion-header2').first().toggleClass('active-header2').toggleClass('inactive-header2');
	$('.accordion-content2').first().slideDown().toggleClass('open-content');
	
	// The Accordion Effect
	$('.accordion-header2').click(function () {
		if($(this).is('.inactive-header2')) {
			$('.active-header2').toggleClass('active-header2').toggleClass('inactive-header2').next().slideToggle().toggleClass('open-content');
			$(this).toggleClass('active-header2').toggleClass('inactive-header2');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).toggleClass('active-header2').toggleClass('inactive-header2');
			$(this).next().slideToggle().toggleClass('open-content');
		}
	});
	
	return false;
});

// My Account Apps Page Accordion End

// Jio Money Accordion start

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	$('.accordion-header3').toggleClass('inactive-header3');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header3').width();
	$('.accordion-content3').css({'width' : '100%' });
	
	//Open The First Accordion Section When Page Loads
	$('.accordion-header3').first().toggleClass('active-header3').toggleClass('inactive-header3');
	$('.accordion-content3').first().slideDown().toggleClass('open-content');
	
	// The Accordion Effect
	$('.accordion-header3').click(function () {
		if($(this).is('.inactive-header3')) {
			$('.active-header3').toggleClass('active-header3').toggleClass('inactive-header3').next().slideToggle().toggleClass('open-content');
			$(this).toggleClass('active-header3').toggleClass('inactive-header3');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).toggleClass('active-header3').toggleClass('inactive-header3');
			$(this).next().slideToggle().toggleClass('open-content');
		}
	});
	
	return false;
});

// Jio Money Accordion end

// Caller Tunes Page Accordion Start

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	$('.accordion-header4').toggleClass('inactive-header4');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header4').width();
	$('.accordion-content4').css({'width' : '100%' });
	
	//Open The First Accordion Section When Page Loads
	//$('.accordion-header4').first().toggleClass('active-header4').toggleClass('inactive-header4');
	//$('.accordion-content4').first().slideDown().toggleClass('open-content');
	
	// The Accordion Effect
	$('.accordion-header4').click(function () {
		if($(this).is('.inactive-header4')) {
			$('.active-header4').toggleClass('active-header4').toggleClass('inactive-header4').next().slideToggle().toggleClass('open-content');
			$(this).toggleClass('active-header4').toggleClass('inactive-header4');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).toggleClass('active-header4').toggleClass('inactive-header4');
			$(this).next().slideToggle().toggleClass('open-content');
		}
	});
	
	return false;
});

// Caller Tunes Page Accordion End

// Caller Tunes Current Page Accordion Start

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	$('.accordion-header5').toggleClass('inactive-header5');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header5').width();
	$('.accordion-content5').css({'width' : '100%' });
	
	//Open The First Accordion Section When Page Loads
	$('.accordion-header5').first().toggleClass('active-header5').toggleClass('inactive-header5');
	$('.accordion-content5').first().slideDown().toggleClass('open-content');
	
	// The Accordion Effect
	$('.accordion-header5').click(function () {
		if($(this).is('.inactive-header5')) {
			$('.active-header5').toggleClass('active-header5').toggleClass('inactive-header5').next().slideToggle().toggleClass('open-content');
			$(this).toggleClass('active-header5').toggleClass('inactive-header5');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).toggleClass('active-header5').toggleClass('inactive-header5');
			$(this).next().slideToggle().toggleClass('open-content');
		}
	});
	
	return false;
});

// Caller Tunes Current Page Accordion End