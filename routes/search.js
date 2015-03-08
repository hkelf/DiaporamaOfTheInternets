var express = require('express');
var router = express.Router();

var tumblr = require('tumblr.js');
	tumblrOptions = {
        consumer_key: '',
        consumer_secret: '',
        token: '',
        token_secret: ''
    },
	tumblrClient = createTumblrClient();

var Flickr = require("flickrapi"),
    flickrOptions = {
		api_key: "",
		secret: ""
    },
    flickr;

Flickr.tokenOnly(flickrOptions, function(error, f) {
	if (error) {
		throw error;
	} else {
		flickr = f;
	}
});

/* GET home page. */
router.get('/:value', function(req, res, next) {
	var value = req.params.value,	
		response = [],
		posts,
		mutex = false,
		i;

	tumblrClient.tagged(value, { before: 0, limit: 20}, function (err, data) {
    	if (err) {
    		res.send(err);
    	} else {
	    	tumblr_filterPhotos(data, response);

	    	if (mutex) {
		    	res.send(response);
	    	} else {
	    		mutex = true;
	    	}
    	}
	});

	flickr.photos.search({
		text: value,
		page: 1,
		per_page: 50
	}, function(err, result) {
		if (err) {
			res.send(err);
		} else {
			flickr_getUrls(result.photos.photo, response);

			if (mutex) {
	    		res.send(response);
			} else {
				mutex = true;
			}
		}
	});


});

function createTumblrClient() {
    return tumblr.createClient(tumblrOptions);
}

function createFlickrClient() {
	return new flickr({
		api_key: 'cfc6f214bae8c063648c4f6008e2ec24'
	});
}

function tumblr_filterPhotos(data, repsonse) {
	var i;

	for (i=0; i<data.length; ++i) {
		if (data[i].type === 'photo') {
    		repsonse.push(data[i].photos[0].original_size.url);
		}
    }
}

function flickr_getUrls(photos, repsonse) {
	var photo,
		i;

	for (i=0; i<photos.length; ++i) {
		photo = photos[i];
		repsonse.push("https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_z"+".jpg")
	}
}

module.exports = router;