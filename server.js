// load the things we need
var express = require('express');
var app = express();


// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Set to wherever your dev templates live
//var root_dir = './dev';
var root_dir = './'+process.env.ROOT_FOLDER;
app.set('views', root_dir);


// Add routes to your HTML templates as needed
app.get(['/', '/index.html'], function(req, res){
	res.render('index.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Home',
			location : 'delhi'
		}
	});
});

app.get('/index-new.html', function(req, res){
	res.render('index-new.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Index New'

		}
	});
});

app.get('/buy-jio.html', function(req, res){
	res.render('buy-jio.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Buy Jio'

		}
	});
});

app.get('/cart.html', function(req, res){
	res.render('cart.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Cart'
		}
	});
});

app.get('/store-locator.html', function(req, res){
	res.render('store-locator.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Store Locator'
		}
	});
});

app.get('/explore-jio.html', function(req, res){
	res.render('explore-jio.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Explore Jio'
		}
	});
});

app.get('/jio-social.html', function(req, res){
	res.render('jio-social.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Jio Social'
		}
	});
});

app.get('/explore-article.html', function(req, res){
	res.render('explore-article.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Explore Article'
		}
	});
});
app.get('/explore-article1.html', function(req, res){
	res.render('explore-article1.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Explore Article1'
		}
	});
});

app.get('/explore-topics.html', function(req, res){
	res.render('explore-topics.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Explore Topics'
		}
	});
});

app.get('/contact-us.html', function(req, res){
	res.render('contact-us.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Contact Us'
		}
	});
});

app.get('/self-help.html', function(req, res){
	res.render('self-help.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Self Help'
		}
	});
});

app.get('/self-help-details.html', function(req, res){
	res.render('self-help-details.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Self Help Details'
		}
	});
});

app.get('/guided-help.html', function(req, res){
	res.render('guided-help.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Guided Help'
		}
	});
});

app.get('/who-we-are.html', function(req, res){
	res.render('who-we-are.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Who We Are'

		}
	});
});

app.get('/privacy-policy.html', function(req, res){
	res.render('privacy-policy.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Privacy Policy'

		}
	});
});

app.get('/terms-and-conditions.html', function(req, res){
	res.render('terms-and-conditions.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Terms and Conditions'

		}
	});
});

app.get('/careers.html', function(req, res){
	res.render('careers.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Careers'

		}
	});
});

app.get('/career-opportunities.html', function(req, res){
	res.render('career-opportunities.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Career Opportunities'

		}
	});
});

app.get('/register-interest.html', function(req, res){
	res.render('register-interest.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Register Interest'

		}
	});
});

app.get('/share-stories.html', function(req, res){
	res.render('share-stories.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'share stories'

		}
	});
});

app.get('/buy-shop-device.html', function(req, res){
	res.render('buy-shop-device.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Buy Shop Device'

		}
	});
});
app.get('/register-interest-thankyou.html', function(req, res){
	res.render('register-interest-thankyou.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'register interest thankyou'

		}
	});
});

app.get('/buyshop-device-compare.html', function(req, res){
	res.render('buyshop-device-compare.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'buyshop device compare'

		}
	});
});


app.get('/buy-shop-device-details.html', function(req, res){
	res.render('buy-shop-device-details.html', {
		data : {
			env : process.env.ROOT_FOLDER,
			title : 'Buy Shop Device Details'

		}
	});
});


// Register a static route to the dev folder
app.use(express.static(root_dir));

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Hosting '+process.env.ROOT_FOLDER+'/');
console.log('http://localhost:'+port);