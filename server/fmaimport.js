const {chain}  = require('stream-chain');
 
const {parser} = require('stream-csv-as-json');
const {asObjects} = require('stream-csv-as-json/AsObjects');
const {streamValues} = require('stream-json/streamers/StreamValues');
 
const fs   = require('fs');
const zlib = require('zlib');
 
const pipeline = chain([
  fs.createReadStream('../import/fma/raw_tracks.csv'),
  //fs.createReadStream('sample.csv.gz'),
  //zlib.createGunzip(),
  parser(),
  asObjects(),
  
  streamValues(),
  data => {
	 return data;
    //const value = data.value;
    //return value && value.department === 'accounting' ? data : null;
  }
]);
 
 
  
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
	// cleanup first
	db.collection('tracks').deleteMany({fma_id:{$exists:true}}).then(function(res) {
		
		let counter = 0;
		let tracks = [];
		let albumArt = [];
		pipeline.on('data', (data) => {
			let item = data.value; 
			console.log(counter);
			//console.log('---------ITEM START --------------') ;

			//console.log(item) ;

			++counter
			let genres = [];
			if (item.track_genres) {
			  JSON.parse(item.track_genres.replace(/'/g, '"')).map(function(tag) {
				 if (tag && tag.genre_title && tag.genre_title.length > 0) {
					 genres.push(tag.genre_title);
				 } 
			  });
			}
			
			let newItem = {
				fma_id : parseInt(item.track_id,10),
				duration: item.track_duration,
				collection:'fma',
				title:item.track_title,
				trackNumber:(item.track_number), //+(item.album_tracks ? '/'+item.album_tracks : '')),
				url:item.track_url+'/download',
				genre: genres,
				type: 'audio',
				format: 'mpeg',
				mime: 'audio/mpeg',
				updated : new Date().getTime(),
				license: item.license_url ,
				comment:'',
				languageCode: item.track_language_code,
				interest: parseInt(item.track_interest),
				listens: parseInt(item.track_listens),
				artist: item.artist_name,
				album: item.album_title,
				albumArtist: item.artist_name,
				//albumArt: item.track_image_file,
				year: new Date(item.track_date_recorded ? item.track_date_recorded : item.track_date_created).getFullYear()
			}
		
			// where score is missing (jamendo), randomly assign 0-5 value
			let interest = newItem.hasOwnProperty('interest') ? newItem.interest/1000000 : Math.random()*5;
			interest = (parseFloat(interest) !== NaN ? parseFloat(interest) : 0)
			let listens = newItem.hasOwnProperty('listens') ?  newItem.listens/100000 : Math.random()*5;
			listens = parseFloat(listens) !== NaN ? parseFloat(listens) : 0
			
			newItem.score = {interest:interest, listens:listens,plays:0,favorites:0};
			newItem.finalScore = interest + listens;
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
			if (item.track_image_file) {
				db.collection('albumart').insert({_id:newItem.artistKey+newItem.albumKey,url:item.track_image_file}).then(function() {
								
				}).catch(function(e) {
	//				console.log()
				});	
			}
			
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
				 
				 
		  //  console.log('pretags');
			if (newItem.genre && newItem.genre.length > 0) {
				// make sure genres exist in tags collection and update tally
				newItem.genre = ensureGenreTags(newItem.genre);
			//    console.log(['GENRE',fileObject.genre]);
				// collate tags first time  only
				//if (!seenTrack) {
					let tParts = newItem.genre;
					for (let tKey in tParts) {
						let tag = tParts[tKey];
			  //          console.log(['CHECK TAG '+tag]);
						let thePromise = new Promise (function(resolve,reject) {
							db.collection('tags').find({title:tag}).toArray().then(function(tags) {
								let tallyType='fma';
								if (tags!= null && tags.length > 0) {
									let tallies = tags[0].tallies ? tags[0].tallies : {};
									tallies[tallyType] = tallies.hasOwnProperty(tallyType) ? tallies[tallyType] + 1 : 0;
									let total = 0;
									Object.values(tallies).map(function(tally) {
										total += tally;
									});
				//                    console.log(['update tag',tally]);
									//delete fileObject._id;
									db.collection ('tags').updateOne({_id:tags[0]._id},{$set:{tallies: tallies,tally:total}}).then(function() {
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
				//}
			}
			

			
			tracks.push(newItem);			
			//console.log(newItem) ;
			
			if (tracks.length % 500 === 0) {
				console.log('save tracks '+tracks.length);
				db.collection('tracks').insertMany(tracks).then(function() {
							
				});
				tracks=[];
			}
		});
		pipeline.on('end', () => {
			console.log('FINISHED importing '+counter+' tracks ')
			db.collection('tracks').insertMany(tracks).then(function() {
				console.log('DONE')
			});
		});
	});
});


					
