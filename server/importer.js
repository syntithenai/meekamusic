const NodeID3 = require('node-id3')
const MongoClient = require('mongodb').MongoClient
const Binary = require('mongodb').Binary
var ObjectId = require('mongodb').ObjectID;
var config=require('./config')

// jamendo
//Request URL: https://mp3d.jamendo.com/download/track/475357/mp32/


let db;
MongoClient.connect(config.databaseConnection, (err, client) => {
  if (err) return console.log(err)
  db = client.db(config.database) 
})
const fileType = require('file-type');
const readChunk = require('read-chunk');
const fs = require("fs"); 
let filesProcessed=0        
let maxFilesProcessed = 70000;
let filelist = [];
        //,cb
        
        
		
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
		
 
var removeDiacritics = function(text) {
	// disabled for now to allow full diacritic in group by 
	return text;
	//let rmd = require('./diacritics')
	//return rmd(text)
}


    /*
     *  import a single audio file
     */
    function importAudioFile(stats,file,cbNoIncrement,cb,seenTrack = false) {  
        console.log(['IMPORdT FILE',file]);  
        const fileSizeInMegabytes = stats.size / 1000000.0;
        // LIMIT FILE SIZE
        if (fileSizeInMegabytes < 50) {
        //    console.log('sizeok');
        //console.log(file);
            // determine file mime type from header
            let buffer = readChunk.sync(file, 0, 4100);
            let meta=fileType(buffer);
            let metaParts = meta && meta.mime ? meta.mime.split("/") : null;
            try {
                // only MP3 for now
                if (metaParts && metaParts.length ==2 && (metaParts[0]==="audio"&&metaParts[1]==="mpeg")) {
                    // read ID3 tags
                   // console.log('ismpg');
                   filesProcessed++;
                   
                    let tag = NodeID3.read(file)
                    //console.log(['tag',tag]);
                    //console.log(tag);
                    let fileObject={
                        _id: new ObjectId(),
                        collection:'local',
                        path:file,
                        fileUpdated: stats.mtimeMs,
                        title:tag.title,
                        artist:tag.artist ? tag.artist : 'Unknown Artist',
                        album:tag.album ? tag.album : 'Unknown Album' ,
                        albumArtist: tag.performerInfo ? tag.performerInfo : '',
                        isCollection: (tag.raw && tag.raw.TCMP) ? 1 : null,
                        year:tag.year,
                        trackNumber:tag.trackNumber,
                        genre:tag.genre ? tag.genre.split(",") : [],
                        comment:tag.comment,
                        type: metaParts[0],
                        format: metaParts[1],
                        mime: meta.mime,
                        updated : new Date().getTime(),
                        score: {interest:0, listens:0,plays:0,favorites:0},
                        finalScore: 0
                    }
                    
                    
                    // fallback for missing meta data, use filename as title, album from containing folder
                    if (fileObject.title===undefined) {
                        let fileParts=file.split('/');
                        let nameParts=fileParts[fileParts.length - 1].split(".");
                        fileObject.title=nameParts.slice(0,-1).join(".");
                        if (!fileParts.album && fileParts.length > 2) {
                            fileParts.album = fileParts[fileParts.length - 2];
                        }
                    }
                    if (!fileObject.created) fileObject.created = new Date().getTime()
                    fileObject.url='/stream?id='+fileObject._id;
                    
                    // clean keys and assign primary grouping value
                    fileObject.artistKey = fileObject.artist ? removeDiacritics(fileObject.artist).replace(/[^\w\s,]+|\s+/gmi, "").trim().toLowerCase() : '';
                    
                    fileObject.albumArtistKey =  fileObject.albumArtist ? removeDiacritics(fileObject.albumArtist).replace(/[^\w\s,]+|\s+/gmi, "").trim().toLowerCase() : '';
                    fileObject.albumKey = fileObject.album ? removeDiacritics(fileObject.album).replace(/[^\w\s,]+|\s+/gmi, "").trim().toLowerCase() : '';
                    
                    if (fileObject.artistKey.length === 0 && fileObject.artist && fileObject.artist.length > 0) {
                        fileObject.artistKey = fileObject.artist.hashCode();
                    }
                    if (fileObject.albumArtistKey.length === 0 && fileObject.albumArtist && fileObject.albumArtist.length > 0) {
                        fileObject.albumArtistKey =  fileObject.albumArtist.hashCode();
                    }
                    if (fileObject.albumKey.length === 0 && fileObject.album && fileObject.album.length > 0) {
                        fileObject.albumKey =  fileObject.album.hashCode();
                    }
                    
                    
                    // use album artist or fallback to artist except for collections override as "various"
                    fileObject.groupByKey = fileObject.albumArtistKey ? fileObject.albumArtistKey : fileObject.artistKey;
                    if (!fileObject.albumArtistKey && fileObject.isCollection) fileObject.groupByKey = "variousartists"
                    
                    // ALBUM ART
                    if (tag.image && tag.image.imageBuffer) {
                       // console.log(['HAVE IMAGE FOR TRACK',tag.image]);
                        //var b64encoded = btoa(String.fromCharCode.apply(null, tag.image.imageBuffer));
                        //var dataurl = "data:"+tag.image.mime+";base64," + b64encoded;
                        //"data:"+tag.image.mime+";base64," +
                        var base64Image = new Binary(tag.image.imageBuffer); //.toString('base64');
                
                        db.collection('albumart').save({_id:fileObject.groupByKey+fileObject.albumKey,mime:tag.image.mime,artist:fileObject.groupByKey,album:fileObject.albumKey,image:base64Image}).then(function() { 
                           // console.log(['SAVED ART',fileObject.groupByKey])
                            
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
                    if (fileObject.genre && fileObject.genre.length > 0) {
						// make sure genres exist in tags collection and update tally
                        fileObject.genre = ensureGenreTags(fileObject.genre);
                    //    console.log(['GENRE',fileObject.genre]);
                        // collate tags first time  only
                        if (!seenTrack) {
                            let tParts = fileObject.genre;
                            for (let tKey in tParts) {
                                let tag = tParts[tKey];
                      //          console.log(['CHECK TAG '+tag]);
                                let thePromise = new Promise (function(resolve,reject) {
                                    db.collection('tags').find({title:tag}).toArray().then(function(tags) {
                                        let tallyType='local';
										if (tags!= null && tags.length > 0) {
                                            let tallies = tags[0].tallies ? tags[0].tallies : {};
											tallies[tallyType] = tallies.hasOwnProperty(tallyType) ? tallies[tallyType] + 1 : 0;
											let total = 0;
											Object.values(tallies).map(function(tally) {
												total += tally;
											});  
											console.log(['update tag',tally]);
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
                                                resolve(fileObject._id);
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
                    }
                    
                    //console.log(allTags);
                    //console.log(allTagsIndex);
                    //console.log(allArtistTags);
                    // COLLATE ARTIST
                    //if (fileObject && fileObject.groupByKey) {
                        //let title = fileObject.groupByKey;
                        //let artist=null;
                        //if (allArtists.hasOwnProperty(title)) {
                            //artist=allArtists[title];
                        //} else {
                            //let originalTitle = (fileObject.groupByKey === "variousartists") ? "Various Artists" : fileObject.artist;
                            //artist = {originalTitle:originalTitle,'title':title,albums:{},genre:[]};
                        //}
                       
                        //if (fileObject.album) {
                            //artist.albums[fileObject.albumKey]=fileObject.album;
                        //}
                        //allArtists[title]=artist;
                    //}
                    //// assign genres to allArtists from previous collated allArtistTags
                    //for (let key in allArtistTags) {
                        ////console.log(key);
                        //if (allArtists[key]) {
                            //allArtists[key].genre = Object.keys(allArtistTags[key]);
                        //}
                        
                    //};
                    //console.log(allArtists);
                    
                    // INSERT/UPDATE INTO MONGODB      
                    let thePromise = new Promise(function(resolve,reject) {
                        db.collection('tracks').find({title:fileObject.title,artist:fileObject.artist,album:fileObject.album}).toArray().then(function(songs) {
                            if (songs!= null && songs.length > 0) {
                                let id=songs[0]._id;
                                fileObject.url='/stream?id='+id;
                                delete fileObject._id;
                                db.collection ('tracks').updateOne({_id:id},{$set:fileObject}).then(function() {
                                    //console.log(['UPDATED ',id]);
                                    resolve(id);
                                }).catch(function(e) {
                                    console.log('Error updating track');
                                    console.log(e);
                                    resolve();
                                });
                            } else {
                                db.collection ('tracks').insertOne(fileObject).then(function() {
                                    //console.log(['INSERTED ',fileObject._id]);
                                    resolve(fileObject._id);
                                }).catch(function(e) {
                                    console.log('Error inserting track');
                                    console.log(e);
                                    resolve();
                                });
                            }
                        // promises.push(thePromise);
                        }).catch(function(e) {
                            console.log(['track find err',e]);
                        })
                    });
                    promises.push(thePromise);
                    Promise.all(promises).then(function() {
                        cb();
                    });
                    
                } else {
                   // console.log('Not MPG');
                    cbNoIncrement();
                }
            } catch (e) {
                console.log('File import failure');
                console.log(e);
                cbNoIncrement();
            }            
        } else {
            console.log(['FILE TOO LARGE',file]);
            cbNoIncrement();
        }
        //cbNoIncrement();
    }

/**
 * tree walk file system for mp3 files, reading id3 tags and writing db records

 */

function cleanFileName(root,name) {
    let newname = root+"/"+name;
    newname = newname.replace("//","/");
    return newname ;
}


    //        const stats = fs.statSync(path.join(dir, file) )
    
 // XML READ FIULE
//fs = require('fs');
//var parser = require('xml2json');

//fs.readFile( './data.xml', function(err, data) {
    //var json = parser.toJson(data);
    //console.log("to json ->", json);
 //});

function importFunction() {
     var config=require('./config')
	console.log('START IMPORT' + config.musicFolder);
	 console.log(config);
      var walk = require('walk');
      var fs = require('fs');
     var walker;
     let allTags=[];
     let count = 0;
    
    
      walker = walk.walk ('../'+config.musicFolder, {});
      
      walker.on("file", function (root, fileStats, next) {
         let nextI = function() {
              count++;
              // delay to prevent import impacting other services
              //setTimeout(function() {
				next();
			 //},20);
          };
          
        try {
           //console.log(['ONFILE',filesProcessed,root, fileStats.name,fileStats]);
            let stats=null;
            if (filesProcessed >= maxFilesProcessed) {
                console.log('No more allowed');
                //walker.end();
                //throw 'No more allowed EE';
                //walker = null;
                walker.emit('end');
            } else {
                try {
                    
                    stats = fs.statSync(cleanFileName(root,fileStats.name));
                    if (stats.isFile()) {
                      // console.log(['ISFILE',cleanFileName(root,fileStats.name)]);  
                        db.collection('tracks').find({path:cleanFileName(root,fileStats.name)}).toArray().then(function(tracks) {
                         //   console.log(['ISFILE tracks',tracks]);  
                            if (tracks && tracks.length > 0) {
                                // SEEN BEFORE
                                if (stats.mtimeMs > tracks[0].fileUpdated) {
                                    // FILE UPDATED
                                    // console.log(['updated',filesProcessed]);  
                                     // import file as previously seen (skip tag collation)
                                    importAudioFile(stats,cleanFileName(root,fileStats.name),nextI,next,true); 
                                    //count++; 
                    
                                    //cb(path.join(dir, file));
                                } else {
                                    // FILE UNCHANGED
                                    //console.log(['unchanged',filesProcessed]);  
                                    next();
                                }
                            } else { 
                                // FIRST TIME
                                //console.log(['firsttime',filesProcessed]);  
                                importAudioFile(stats,cleanFileName(root,fileStats.name),nextI,next); 
                                //count++; 
                                //filesProcessed++;
                                //cb(path.join(dir, file));
                            }
                        }).catch(function(e) {
                            console.log(['WALK ERR',e]);
                            next();
                        });              
                    }
                            
                    
                   // console.log(cleanFileName(root,fileStats.name));
                    
                } catch (e) {
                    console.log(e);
                    next();  
                } 
                
            }
        } catch (e) {
            console.log(e);
            //next();  
        } 
        //fs.readFile(fileStats.name, function (f) {
          //// doStuff
          
          //setTimeout(function() {
            //console.log(['read',root,stats,fileStats,fileStats.name]);
            //next();
          //},500);
          
        //});
      });
     
      walker.on("errors", function (root, nodeStatsArray, next) {
        next();
      });
     
      walker.on("end", function () {
        console.log('FINISH IMPORT');
        //console.log(allTags);
        filesProcessed = 0;
        db.collection('tracks').dropIndexes();
		db.collection('tracks').createIndex({
			title: "text",
			artist: "text",
			album: "text",
		});                     
      });
        
}

//function dimportFunction() {
    //let promises=[];
    //let allTags=[];
    //let allTagsIndex={};
    //let allArtists={};
    //let allArtistTags={};
    //console.log('IMPORT START' + config.musicFolder);
////console.log(config)

    ////let iterator = walkSync(config.musicFolder,[]);
    ////let data = iterator.next();
    ////while (data && !data.done) {
        ////console.log(['ITERATOR',data]);
        ////let data = iterator.next();
    ////}
    //// TREE WALK IMPORT FILES CALLING IMPORT FUNCTION WITH file
    //let files= walkSync(config.musicFolder,[],function(file) {
        ////let p = new Promise(function(resolve,reject) {
            ////setTimeout(function() {
               //// console.log(['WALK STEP',file]);
                ////resolve();
            ////},500);
       //// });
       //// return p;
    //})
    
    //console.log('ALL DONE',files);
    ////function(file) {
        ////const stats = fs.statSync(file)
        ////importFile(stats,file);
    ////});
        //////console.log(allTags);    
        ////console.log(allArtists);  
            
    ////Promise.all(promises).then(function(ids) {
        ////setTimeout(function() {
            ////// MONGODB SAVE TAGS, ARTISTS AND INDEXES (5s DELAY)
            ////db.collection('tags').deleteMany({}).then(function() { //path:{$exists:true}
                ////db.collection('tags').insertMany(allTags).then(function() { 
                    
                ////});
            ////});
            //////db.collection('artists').deleteMany({}).then(function() { //path:{$exists:true}
                //////db.collection('artists').insertMany(Object.values(allArtists)).then(function() { 
                    
                //////});
            //////});
            ////db.collection('tracks').deleteMany({_id:{$in:ids}}).then(function() { //path:{$exists:true}
                ////console.log('Finished cleanup');
                ////console.log('CREATE INDEXES');
            
                //////db.collection('tracks').dropIndexes();
                //////db.collection('tracks').createIndex({
                    //////title: "text",
                    //////artist: "text",
                    //////albumArtist: "text",
                    //////album: "text",
                    //////genre: "text"
                //////});                     
            ////});
        ////},5000);
    
    ////});                    
        
//}


module.exports = importFunction;

