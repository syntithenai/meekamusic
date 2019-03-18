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
    songHandler.search('tracks',req.query,function(results) {
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
router.post('/saveplayer',authenticate,(req, res) => {
    songHandler.savePlayer(req.body,function(results) {
        res.send(results);
    });
})


router.post('/saveplaylist',authenticate,(req, res) => {
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

router.post('/startplaytrackonplaylist',authenticate,(req, res) => {
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
router.get('/playlists',authenticate,authenticate,(req, res) => {
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


// proxy access for files with streaming support
router.get('/stream',authenticate,(req, res) => {
    //console.log('STREAM');
    try {
        songHandler.stream(req.query,req,res);
    } catch (e) {
        console.log([e]);
    }
    
})

//  access for albumart
router.get('/albumart',authenticate,(req, res) => {
    //console.log('STREAM');
    songHandler.albumArt(req.query,function(results) {
        if (results && results.length > 0) {
            var result = results[0];
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
        }
        else {
            res.send('');
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
    }
})

// FMA PROXY
router.use('/fmasearchproxy',(req, res) => {
    let limit = req.query.limit ? req.query.limit : 20;
    if (req.query.filter && req.query.filter.length > 0) {
        let url =  'https://freemusicarchive.org/api/trackSearch?q='+req.query.filter+'&limit='+limit+'&api_key='+config.fmaKey;
        request.get(url).pipe(res);
    }
})

router.use('/fmadetailsproxy',(req, res) => {
    //console.log('FMADETAILS');
    if (req.query.id && req.query.id.length > 0) {
        let url =  'https://freemusicarchive.org/api/get/tracks.json?limit=1&track_id='+req.query.id+'&api_key='+config.fmaKey
        request.get(url).pipe(res);
    }
})

router.use('/fmadownloadproxy',(req, res) => {
    if (req.query.url && req.query.url > 0) {
         //let url = req.query.url+'/download?api_key='+config.fmaKey;
        //request.get(url).pipe(res);
        res.send({url:res.query.url});
    }
})

// ADMIN CALLS FOR IMPORT
router.get('/recreateindexes',authenticate,(req, res) => {
    songHandler.recreateIndexes(req.query,function(results) {
        res.send(results);
    });
})
router.use('/import',authenticate,(req, res) => {
    //console.log('IMPORT');
    //res.send('import');
    importer();
    
})

module.exports = router;
