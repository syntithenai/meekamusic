const express = require('express')
const bodyParser= require('body-parser')
const app = express()
var config=global.gConfig
var request = require('request')
var fs = require('fs')
const path = require('path');
var importer = require('./importer');
var songHandler = require('./songHandler');

var router = express.Router();
var authenticate = require('react-express-oauth-login-system/authenticate');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use('/login',require('./src/react-express-oauth-login-system/signup'));
//app.use('/oauth',require('./src/react-express-oauth-login-system/oauth.js'));


router.get('/tracks',authenticate,(req, res) => {
	console.log(['search tracks',req.query])
    songHandler.search('tracks',req.query,function(results) {
     //   console.log(['search results',results])
        res.send(results);
    });
})

router.post('/tracks',authenticate,(req, res) => {
    songHandler.search('tracks',req.body,function(results) {
        res.send(results);
    })
})

router.get('/tracksbyartist',authenticate,(req, res) => {
    songHandler.searchTracksByArtist(req.query,function(results) {
        res.send(results);
    })
})

router.get('/tracksbyalbum',authenticate,(req, res) => {
    songHandler.searchTracksByArtistAndAlbum(req.query.artist,req.query.album,function(results) {
        res.send(results);
    })
})

router.get('/tags',(req, res) => {
    songHandler.searchTags(req.query,function(results) {
        res.send(results);
    });
})


// FILTERED SEARCH
router.get('/fresh',authenticate,(req, res) => {
    songHandler.search('fresh',req.query,function(results) {
        res.send(results);
    })
})
router.get('/history',authenticate,(req, res) => {
    songHandler.search('history',req.query,function(results) {
        res.send(results);
    })
})
router.get('/favorites',authenticate,(req, res) => {
    songHandler.search('favorites',req.query,function(results) {
        res.send(results);
    })
})


// SAVE 
router.get('/togglefavorite',authenticate,(req, res) => {
    songHandler.toggleFavorite(req.query,function(results) {
        res.send(results);
    });
})
router.get('/isfavorite',authenticate,(req, res) => {
    songHandler.isFavorite(req.query,function(results) {
        res.send(results);
    });
})


router.get('/logseen',authenticate,(req, res) => {
    songHandler.logSeen(req.query,function(results) {
        res.send(results);
    });
})



// currentPlaylist,currentTrack
router.post('/saveplayer',(req, res) => {
    songHandler.savePlayer(req.body,function(results) {
        res.send(results);
    });
})


router.post('/saveplaylist',(req, res) => {
    songHandler.savePlaylist(req.body,function(results) {
        res.send(results);
    });
})

router.post('/addtracktoplaylist',authenticate,(req, res) => {
    songHandler.addTrackToPlaylist(req.body,function(results) {
        res.send(results);
    }); 
})

router.post('/addtrackstoplaylist',authenticate,(req, res) => {
    songHandler.addTracksToPlaylist(req.body,function(results) {
        res.send(results);
    });
})

router.post('/startplaytrackonplaylist',(req, res) => {
    songHandler.startPlayTrackOnPlaylist(req.body,function(results) {
    	res.send(results);
    });
})

router.post('/removetrackfromplaylist',authenticate,(req, res) => {
    songHandler.removeTrackFromPlaylist(req.body,function(results) {
        res.send(results);
    });
})

router.post('/deleteplaylist',authenticate,authenticate,(req, res) => {
    songHandler.deletePlaylist(req.body,function(results) {
        res.send(results);
    });
})

router.get('/playlist',authenticate,authenticate,(req, res) => {
    songHandler.getPlaylist(req.query,function(results) {
        res.send(results);
    });
})
router.get('/playlists',(req, res) => {
    songHandler.getPlaylists(req.query,function(results) {
        res.send(results);
    });
})





// PROXY AND FILE STREAMING
router.use('/proxy',authenticate,(req, res) => {
    if (req.query.url) {
        request.get(req.query.url).pipe(res);
    }
})



var cookieParser = require('cookie-parser');
router.use(cookieParser());

// proxy access for files with streaming support
router.get('/stream',(req, res) => {
 //   console.log(['STREAM',req.cookies]);
    if (req.cookies && req.cookies.user) {
		let user = JSON.parse(req.cookies.user);
		if (user && user.token && user.token.access_token) {
			try {
				// extract 
				songHandler.stream(req.query,req,res);
			} catch (e) {
				console.log([e]);
			}
		} else {
			res.send({error:'no access'});
		}
	} else {
		res.send({error:'no access'});
	}
})

//  access for albumart
router.get('/albumart',(req, res) => {
    console.log('STREAM');
    songHandler.albumArt(req.query,function(results) {
        console.log(['STREAM',results]);
		if (results && results.length > 0) {
            var result = results[0];
            if (result.url) {
				console.log(['REDIRECT '+result.url]);
				res.redirect(result.url);
			} else if (result.image) {
				var mime = (result.mime ? result.mime : "image/jpg");
				var mimeParts = mime.split("/");
				if (mimeParts.length < 2)  {
					mime = "image/"+mime;
				}
				//nodconsole.log(['STREAMART',result._id,mime]);
				//mime = "image/jpeg";
				res.set('Content-Type', mime);
				//res.contentType(mime);    
				var decodedImage = Buffer.from(result.image); //new Buffer(result.image, 'base64').toString('binary');
		
				////res.writeHead(200, {'Content-Type': mime});
				//res.status(200).send(decodedImage);
				////res.end();
				res.end(result.image.buffer, "binary");
			} else {
				res.end();
			}
        }
        else {
            res.end();
        }
    });
})

// JAMENDO PROXY
router.use('/jamendosearchproxy',(req, res) => {
	console.log(['JAM PROXY',req.query]);
    let limit = req.query.limit ? req.query.limit : 20;
    if (req.query.filter && req.query.filter.length > 0) {
        let url = "https://api.jamendo.com/v3.0/tracks/?client_id="+config.jamendoKey+"&format=json&limit="+limit+"&include=musicinfo&namesearch="+req.query.filter;
        console.log(url);
        request.get(url).pipe(res);
    } else {
		res.end();
	}
})

// FMA PROXY
router.use('/fmasearchproxy',(req, res) => {
	console.log(['FMAsEARCH',req.query]);
    let limit = req.query.limit ? req.query.limit : 20;
    if (req.query.filter && req.query.filter.length > 0) {
        let url =  'https://freemusicarchive.org/api/trackSearch?q='+req.query.filter+'&limit='+limit+'&api_key='+config.fmaKey;
        request.get(url).pipe(res);
    } else {
		res.send([]);
	}
})

router.use('/fmadetailsproxy',(req, res) => {
    //console.log('FMADETAILS');
    if (req.query.id && req.query.id.length > 0) {
        let url =  'https://freemusicarchive.org/api/get/tracks.json?limit=1&track_id='+req.query.id+'&api_key='+config.fmaKey
        request.get(url).pipe(res);
    } else {
		res.send({});
	}
})

router.use('/fmadownloadproxy',(req, res) => {
    if (req.query.url && req.query.url > 0) {
         //let url = req.query.url+'/download?api_key='+config.fmaKey;
        //request.get(url).pipe(res);
        res.send({url:res.query.url});
    } else {
		res.send({message:'missing required url'});
	}
})

	//// ADMIN CALLS FOR IMPORT
	//router.get('/recreateindexes',authenticate,(req, res) => {
		//songHandler.recreateIndexes(req.query,function(results) {
			//res.send(results);
		//});
	//})
	//router.use('/import',authenticate,(req, res) => {
		////console.log('IMPORT');
		////res.send('import');
		//importer();
		
	//})

	// error handlers
	router.use((req, res, next) => {
	  const err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	router.use((err, req, res, next) => {
	  // not authorized
	  //if (err.code === 401) {
		  //res.redirect('/login/login')
	  //// other errors
	  //} else {	
		  res.status(err.status || 500);
		  res.json({
			message: err.message,
			error: err
		  });
	  //}
	});



module.exports = router;
