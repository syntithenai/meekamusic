var fs        = require('fs')
  , path      = require('path')
  , XmlStream = require('xml-stream')
  ;
  
var removeDiacritics = require('./diacritics');
var ObjectId = require('mongodb').ObjectID;
//const NodeID3 = require('node-id3')
const MongoClient = require('mongodb').MongoClient
//const Binary = require('mongodb').Binary
var config=require('./config')
		
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
	chr   = this.charCodeAt(i);
	hash  = ((hash << 5) - hash) + chr;
	hash |= 0; // Convert to 32bit integer
  }
  return String(hash);
};  

let db;
MongoClient.connect(config.databaseConnection, (err, client) => {
  if (err) return console.log(err)
  db = client.db(config.database) 

	let id3Genres = {}
	let genreText = fs.readFileSync(path.join(__dirname, './id3genres.txt'), 'utf8')
	//console.log(genreText)
	let genreLines = String(genreText).split('\n');
	genreLines.map(function(line) {
		let lineParts= line.split('-');
		if (lineParts.length === 2) {
			id3Genres['id_'+String(lineParts[0]).trim()] = String(lineParts[1]).trim();
		}
	});

	// delete all existing jamendo records
	db.collection('tracks').deleteMany({jamendo_id:{$exists:true}}).then(function(res) {
		
		// Create a file stream and pass it to XmlStream
		var stream = fs.createReadStream(path.join(__dirname, '../import/jamendodump.xml'));
		var xml = new XmlStream(stream);
		let tracks = [];
		let currentArtist = '';
		let currentAlbum = '';
		let currentAlbumDate = null;
		let currentAlbumArtwork = null;
		let currentAlbumGenre = ''; 

		//xml.preserve('Artists > artist', true);
		//xml.collect('Artists > artist');
		//xml.collect('Albums > album');
		//xml.collect('Tracks > track');
		//xml.collect('Tags > tag');

		xml.on('endElement: artist', function(item) {
		  //console.log('ARTIST');
		  //console.log(item);
			currentArtist = item.name;
		  
		  
		    // save all tracks for this artist
		    let updatedTracks = tracks.map(function(newItem) {
				newItem.artist = currentArtist
				newItem.album = currentAlbum 
				newItem.albumArtist = currentArtist
				newItem.albumArt = currentAlbumArtwork 
				newItem.year = new Date(currentAlbumDate).getFullYear()

				// clean keys and assign primary grouping value
				newItem.artistKey = newItem.artist ? removeDiacritics(newItem.artist).replace(/[^\w\s,]+|\s+/gmi, "").trim().toLowerCase() : '';

				newItem.albumArtistKey =  newItem.albumArtist ? removeDiacritics(newItem.albumArtist).replace(/[^\w\s,]+|\s+/gmi, "").trim().toLowerCase() : '';
				newItem.albumKey = newItem.album ? removeDiacritics(newItem.album).replace(/[^\w\s,]+|\s+/gmi, "").trim().toLowerCase() : '';

				if (newItem.artistKey.length === 0 && newItem.artist && newItem.artist.length > 0) {
					newItem.artistKey = newItem.artist.hashCode();
				}
				if (newItem.albumArtistKey.length === 0 && newItem.albumArtist && newItem.albumArtist.length > 0) {
					newItem.albumArtistKey =  newItem.albumArtist.hashCode();
				}
				if (newItem.albumKey.length === 0 && newItem.album && newItem.album.length > 0) {
					newItem.albumKey =  newItem.album.hashCode();
				}
				//// use album artist or fallback to artist except for collections override as "various"
				newItem.groupByKey = newItem.albumArtistKey ? newItem.albumArtistKey : newItem.artistKey;
				if (!newItem.albumArtistKey && newItem.isCollection) newItem.groupByKey = "variousartists"	
				
				return newItem;			
			});
			console.log('save tracks '+updatedTracks.length);

			db.collection('tracks').insertMany(updatedTracks);
			tracks=[];
			

		  
		});

		xml.on('endElement: album', function(item) {
		  //console.log('ALBUM');
		  //console.log(item);
		  currentAlbumDate = new Date(item.releasedate)
		  currentAlbumArtwork = 'https://cdn-img.jamendo.com/albums/s'+parseInt(item.id/1000,10)+'/'+item.id+'/covers/1.300.jpg'
		  currentAlbum = item.name;
		  currentAlbumGenre = item.id3genre ? item.id3genre : '';
		});

		xml.on('endElement: track', function(item) {
		 // if (tracks.length < 1100) {
			//console.log('TRACK');
		  //console.log(item);
		  
		  //item.album = currentAlbum;
		  //item.artist = currentArtist;
		  ////id: '1094234',
		  //name: 'Bannissement',
		  //duration: '269.0',
		  //numalbum: '10',
		  //filename: 'Bannissement',
		  //Tags: { tag: { idstr: 'instrumental', weight: '0.2499' } },
		  //mbgid: '',
		  //id3genre: '33',
		  //license: 'http://creativecommons.org/licenses/by-nc-nd/2.0/fr/',
		  //album: { '$text': 'The end of happiness' },
		  //artist: { '$text': 'Yohan Chardey' } }
		//let theGenre = ['fff'];
		//try {
			//let genreRaw = item.id3genre ? item.id3genre : currentAlbumGenre;
			//if (genreRaw && genreRaw.length > 0) {
				//let idLookup = 'id_'+String(genreRaw);
				//if (id3Genres.hasOwnProperty(idLookup)) {
					////genre = [];
					//console.log('GENRE');
					//console.log(id3Genres['id_'+String(item.id3genre ? item.id3genre : currentAlbumGenre)]);
					//genreFromId3 = 'ddd';
					////id3Genres[idLookup]; 
					////String(id3Genres[idLookup]))
				//}
			//}
		//} catch (e) {
			//console.log(e);
		//}
		let id3Genre = []
		let lookup = item.id3genre ? item.id3genre : currentAlbumGenre;
		if (lookup && id3Genres.hasOwnProperty(lookup)) {
			id3Genre.push(id3Genres[lookup])
		}
		let url ='https://mp3d.jamendo.com/download/track/'+item.id+'/mp32/'
		let newItem = {
		//	_id: new ObjectId(),
			jamendo_id : parseInt(item.id,10),
			duration: item.duration,
			collection:'jamendo',
			title:item.name,
			trackNumber:item.numalbum,
			//genre:'ddd',
			url:url,
			type: 'audio',
			format: 'mpeg',
			mime: 'audio/mpeg',
			updated : new Date().getTime(),
			license: item.license ,
			genre:id3Genre
		  }
		  let tags = [];
		  if (item.Tags) {
			  Object.values(item.Tags).map(function(tag) {
				 if (tag && tag.idstr && tag.idstr.length > 0) {
					 tags.push(tag.idstr);
				 } 
			  });
		  }
		  if (tags.length > 0) newItem.tags = tags;
		  
		  // COLLATE GENRES into
			// - genres with frequency score
			// - genres for each groupByKey
			let ensureGenreTags = function(fromGenre) {
				//console.log(['ENSURE GENRE ']);
				// if not already processed
				if (fromGenre && Array.isArray(fromGenre)) {
					return fromGenre.map(function(genre,key) {
						return removeDiacritics(genre).replace(/\//g,",").toLowerCase().replace(/[^a-z\s,]+|\s+/gmi, "");
					});
				 } else {
					return [];
				}
			}
			// only update the genre 
			let promises=[];
				 
				 
		    console.log(['pretags',newItem.genre]);
			if (newItem.genre && newItem.genre.length > 0) {
				// make sure genres exist in tags collection and update tally
				newItem.genre = ensureGenreTags(newItem.genre);
			    console.log(['GENRE',newItem.genre]);
				// collate tags first time  only
					let tParts = newItem.genre;
					for (let tKey in tParts) {
						let tag = tParts[tKey];
			            console.log(['CHECK TAG '+tag]);
						let thePromise = new Promise (function(resolve,reject) {
							db.collection('tags').find({title:tag}).toArray().then(function(tags) {
								let tallyType='jamendo';
								console.log(['INS OR UPDATE ',tags])
								if (tags!= null && tags.length > 0) {
									let tallies = tags[0].tallies ? tags[0].tallies : {};
									tallies[tallyType] = tallies.hasOwnProperty(tallyType) ? tallies[tallyType] + 1 : 0;
									let total = 0;
									Object.values(tallies).map(function(tally) {
										total += tally;
									});
								    //delete fileObject._id;
									db.collection ('tags').updateOne({_id:tags[0]._id},{$set:{tallies:tallies,tally:total}}).then(function() {
										//console.log(['UPDATED ',id]);
										resolve(tags[0]._id);
									}).catch(function(e) {
										console.log('Error updating tag');
										console.log(e);
										resolve();
									});
								} else {
								   // console.log(['insertt tag']);
								   let insertValue = {title:tag,tally:1,tallies:{}}
                                   insertValue.tallies[tallyType]=1;
                                    db.collection ('tags').insertOne(insertValue).then(function() {
										//console.log(['INSERTED ',fileObject._id]);
										resolve(newItem._id);
									}).catch(function(e) {
										console.log('Error inserting tag');
										console.log(e);
										resolve();
									});
								}
								
								
							}).catch(function(e) {
								console.log(['tag collate err',e]);
								resolve();
							})
						});
						promises.push(thePromise);
					
				}
			}
			
		  if (!newItem.created) newItem.created = new Date().getTime()
		
		  
		 // console.log(newItem);
		  tracks.push(newItem);
		  
	  //}
		});

		xml.on('endElement: Artists', function(item) {
		  db.collection('tracks').createIndex({
				title: "text",
				artist: "text",
				albumArtist: "text",
				album: "text",
				genre: "text"
			}); 
		  console.log('FINISHED');
		});	
	})


})




//var http = require('http');
//var XmlStream = require('../lib/xml-stream');
//let tracks = [];
//let currentArtist = {};
//let currentAlbum = {};


////// Pipe a stream to the parser
////let stream = fs.createReadStream('./jamendodump.xml');
////stream.pipe(parser);



//// Request an RSS for a Twitter stream
//var request = http.get({
  //host: 'api.twitter.com',
  //path: '/1/statuses/user_timeline/dimituri.rss'
//}).on('response', function(response) {
  //// Pass the response as UTF-8 to XmlStream
  //response.setEncoding('utf8');
  //var xml = new XmlStream(response);

  //// When each item node is completely parsed, buffer its contents
  //xml.on('updateElement: item', function(item) {
    //// Change <title> child to a new value, composed of its previous value
    //// and the value of <pubDate> child.
    //item.title = item.title.match(/^[^:]+/)[0] + ' on ' +
      //item.pubDate.replace(/ \+[0-9]{4}/, '');
  //});

  //// When <item>'s <description> descendant text is completely parsed,
  //// buffer it and pass the containing node
  //xml.on('text: item > description', function(element) {
    //// Modify the <description> text to make it more readable,
    //// highlight Twitter-specific and other links
    //var url = /\b[a-zA-Z][a-zA-Z0-9\+\.\-]+:[^\s]+/g;
    //var hashtag = /\b#[\w]+/g;
    //var username = /\b@([\w]+)/g;
    //element.$text = element.$text
      //.replace(/^[^:]+:\s+/, '') //strip username prefix from tweet
      //.replace(url, '<a href="$0">$0</a>')
      //.replace(hashtag, '<a href="https://twitter.com/search/$0">$0</a>')
      //.replace(username, '<a href="https://twitter.com/$1">$0</a>');
  //});

  //// When each chunk of unselected on unbuffered data is returned,
  //// pass it to stdout
  //xml.on('data', function(data) {
    //process.stdout.write(data);
  //});
//});


//let Parser = require('node-xml-stream');
//let fs = require('fs');

//let parser = new Parser();
//let tracks = [];
//let currentArtist = {};
//let currentAlbum = {};

//// <tag attr="hello">
//parser.on('opentag', (tag, attrs) => {
	//switch (tag) {
		//case 'artist':
			//console.log(tag)
			//console.log(attrs)
		//case 'album':
			//console.log(tag)
			//console.log(attrs)
		//case 'track':
			//console.log(tag)
			//console.log(attrs)
		//case 'tag':
			//console.log(tag)
			//console.log(attrs)		
	//}
    //// name = 'tag'
    //// attrs = { attr: 'hello' }
//});

//// </tag>
//parser.on('closetag', name => {
    //// name = 'tag'
//})


//// Only stream-errors are emitted.
//parser.on('error', err => {
    //console.log(err);
    //// Handle a parsing error
//});

//parser.on('finish', () => {
    //console.log('FINISH');
    //// Stream is completed
//});

//// Write data to the stream.
////parser.write('<root>TEXT</root>');

//// Pipe a stream to the parser
//let stream = fs.createReadStream('./jamendodump.xml');
//stream.pipe(parser);




//// <tag>TEXT</tag>
//parser.on('text', text => {
    //// text = 'TEXT'
//});

//// <[[CDATA['data']]>
//parser.on('cdata', cdata => {
    //// cdata = 'data'
//});

//// <?xml version="1.0"?>
//parser.on('instruction', (name, attrs) => {
    //// name = 'xml'
    //// attrs = { version: '1.0' }
//});
