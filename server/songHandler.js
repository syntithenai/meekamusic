const NodeID3 = require('node-id3')
const MongoClient = require('mongodb').MongoClient
var config=global.gConfig
var ObjectId = require('mongodb').ObjectID;
let db;

var http = require('http');
var path = require('path');
var fs = require('fs');


var connect = function() {
    MongoClient.connect(config.databaseConnection, (err, client) => {
      if (err) return console.log(err)
      db = client.db(config.database) 
     // console.log(['DB',db]);
    })
}

//let samplePlaylists = require('./src/sample_playlists_meeka.js')

//console.log(['SAMPLE PLAYLISTS',samplePlaylists])

connect();

var search = function(searchType,query,cb) {
	let startTime = new Date().getTime();
   console.log(['SEARCH ',searchType,query]);
    let collection = searchType;
    let extraFilter = null;
    let aggregateSearch = false;
    
    if (!db) connect();
    let criteria=[];
    let limit=500;
    let skip=0;
    // TODO RESTORE THIS
    //if (query.limit && query.limit > 0) {
        //limit = parseInt(query.limit,10);
    //}
    if (query.skip && query.skip > 0) {
        skip = parseInt(query.skip,10);
    }
    // BUILD SEARCH CRITERIA
    let searchFor = query.search ? query.search : ''; //.trim()
    if (searchFor.length > 0) {
        let searchForParts = searchFor.split(" ");
        // REGEXP FOR PI VERSION
        //for (let spk in searchForParts) {
            //let val = searchForParts[spk]; //.trim();
           //// console.log(['SEARCHPART',val]);
            //if (val.length > 0) {
                //criteria.push({$or: [{title:{$regex:val,$options:'i'}},{album:{$regex:val,$options:'i'}},{albumArtist:{$regex:val,$options:'i'}},{artist:{$regex:val,$options:'i'}},{genre:{$regex:val,$options:'i'}}]});
            //}
            
        //}
        // INDEXES FOR INTEL VERSION
        criteria.push({$text: {$search: searchForParts.join(' ')}});
    }
    let searchForTag = query.tag ? query.tag.trim() : '';
    if (searchForTag.length > 0) {
        ////criteria.push({genre: new RegExp(searchForTag, 'i')});
        //criteria.push({$or:[{genre: new RegExp('^'+searchForTag+",", 'i')},{genre: new RegExp(","+searchForTag+",", 'i')},{genre: new RegExp(","+searchForTag+"$", 'i')},{genre:{$eq:searchForTag}}]});
        criteria.push({genre:[searchForTag]})
    }
    if (query.filterArtists && query.filterArtists.length > 0) {
        let artistsToFilter = query.filterArtists.split(",");
        artistsToFilter.map(function(artist) {
            criteria.push({groupByKey :{$ne:artist}});
        });
    }
    
    
    let sortConfig={}; //{score:{$meta:"textScore"}};
    if (query.sort && query.sort === "") {
        sortConfig={created:1};
    }
    let skipSearch = true;
    if (searchType === "history") {
        //console.log('ISHISTORY');
        collection = 'tracks';
        if (query.userId && query.userId.length > 0) {
            extraFilter = {}
            extraFilter["playedBy."+query.userId]={$exists :1};
            sortConfig={};
            sortConfig["playedBy."+query.userId] = -1;
            skipSearch = false;
        }
        
    } else if (searchType === "fresh") {
       // console.log('ISFRESh',query.userId);
        collection = 'tracks';
        aggregateSearch = true;
        if (query.userId && query.userId.length > 0) {
            extraFilter = {}
            extraFilter["playedBy."+query.userId]={$exists: 0 };
            skipSearch = false;
            //extraFilter['$not'] = {};
            //extraFilter['$not']["playedBy."+query.userId] = true;
            //$not:{"playedBy."+query.userId:true}};
        }
    } else if (searchType === "favorites") {
        collection = 'tracks';
        if (query.userId && query.userId.length > 0) {
            extraFilter = {}
            extraFilter["favoriteOf."+query.userId]=true;
            skipSearch = false;
            //extraFilter['$not'] = {};
            //extraFilter['$not']["playedBy."+query.userId] = true;
            //$not:{"playedBy."+query.userId:true}};
        }
    } else {
        if (searchForTag.length > 0 || searchFor.length > 0 ) {
            skipSearch = false;
        }
    }
    
    if (extraFilter !== null) {
        //console.log(['EXTRAFILTER',extraFilter]);
        criteria.push(extraFilter);
    }
    // where there is no search filter use previous tags as filter if possible
     if (aggregateSearch && searchForTag.length == 0 && searchFor.length == 0 ) {
         let genreCriteria = []
        let searchForTags = query.tags ? query.tags.trim().split(",") : [];
        if (searchForTags.length > 0) {
            searchForTags.map(function(searchForTag,key) {
                //genreCriteria.push({$or:[{genre: new RegExp('^'+searchForTag+",", 'i')},{genre: new RegExp(","+searchForTag+",", 'i')},{genre: new RegExp(","+searchForTag+"$", 'i')},{genre:{$eq:searchForTag}}]});
                genreCriteria.push({genre:[searchForTag]});
            });
            //criteria.push({genre: new RegExp(searchForTag, 'i')});
            criteria.push({$or:genreCriteria});
                
        }
     }
     

    let forQuery=null;
    if (criteria.length > 0) {
        forQuery={$and:criteria};
    }
   console.log(['FINAL QUERY',JSON.stringify(forQuery)]);
    // FINALLY DO THE DATABASE QUERY
    if (skipSearch) {
        cb([]);
    } else if (!aggregateSearch)  {
        db.collection(collection)
            .find(forQuery)
            .limit(limit)
            .skip(skip)
//            .project({score: {$meta: "textScore"}})
            .sort(sortConfig)
            .toArray(function(err, results) {
				let endTime = new Date().getTime();
               console.log('SEARCH RESULTS in '+(endTime - startTime)+' ms')
                if (err) {
					console.log(err);
					cb([])
				} else {
					cb(results);
				}
            });
     } else {
         db.collection(collection)
            .find(forQuery)
            .limit(limit*5)
            .toArray(function(err, results) {
            // console.log('SEARCH RESULTS')
                //console.log(err);
                console.log(results.length);
                if (err) {
					console.log(err);
					cb([])
				} else {
				//console.log('SEARCH RESULTS')
					results =getRandom(results,Math.min(limit,results.length));
					console.log(results.length);
					let endTime = new Date().getTime();
					console.log('AGG SEARCH RESULTS in '+(endTime - startTime)+' ms')
					cb(results);
				}
            });
         // MONGO 3.2  +
         //db.collection(collection).aggregate([
          //{$match: forQuery}, // filter the results
          //{$sample: {size: 100}} // You want to get 5 docs
        //]).toArray(function(err, results) {
               //// console.log('agg SEARCH RESULTS')
                ////console.log(results.length);
                //if (err) console.log(err);
                ////console.log('SEARCH RESULTS')
                //cb(results);
            //})
     }   
    //} else {
        //cb([]);
    //}
     
}

var getRandom = function (arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

var searchTags = function(query,cb) {
    if (!db) connect();
   // console.log('SEARCH TAGS'+query.search);
    let criteria=null;
    if (query && query.search && query.search.trim().length > 0) {
        criteria={title: new RegExp(query.search.trim(), 'i')};
    } else {
        criteria={};
    }
    return db.collection('tags').find(criteria).sort({tally:-1}).limit(60).toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb([])
			} else {
				cb(results);
			}
        });     
}

var searchTracksByArtist = function (query,cb) {
   // console.log(['tracks by artist',query]);
if (query && query.search && query.search.trim().length > 0) {
    //{artistKey: {$eq:query.search}},
        return db.collection('tracks').find({$or:[{groupByKey: {$eq:query.search}}]}).toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb([])
			} else {
				cb(results);
			}
        });     
    } else {
        cb([]);
    } 
}

var searchTracksByArtistAndAlbum = function (artist,album,cb) {
    //console.log('sTba');
   // console.log([artist,album]);
    if (artist && artist.trim().length > 0 && album && album.trim().length > 0) {
        let query = {$and:[{albumKey: {$eq:album}}, {$or:[{artistKey: {$eq:artist}},{groupByKey: {$eq:artist}}]}]};
       // console.log(JSON.stringify(query));
        return db.collection('tracks').find(query).toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb([])
			} else {
				cb(results);
			}
        });     
     } else {
        cb([]);
    }
}

var searchTracksByTag = function(query,cb) {
    if (!db) connect();
   // console.log('SEARCH TAGS'+query.search);
    if (query && query.tag && query.tag.trim().length > 0) {
        // TODO NEED AN INDEX TO SEARCH HERE
        let criteria ={genre: [query.tag.trim().toLowerCase()]};
        if (query.search) {
            criteria.push({$text: {$search: query.search}});
            //criteria = {$and:[{$or:[{title: new RegExp(query.search.trim(), 'i')},{artist: new RegExp(query.search.trim(), 'i')},{album: new RegExp(query.search.trim(), 'i')}]},criteria]}
        }
        return db.collection('tracks').find(criteria).toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb([])
			} else {
				cb(results);
			}
        });     
    } else {
        cb([]);
    }
}

var artists = function(query,cb) {
    if (!db) connect();
    return db.collection('artists').find({}).sort({title:1}).toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb([])
			} else {
				cb(results);
			}
    });     
}

var recreateIndexes = function(query,cb) {
    if (!db) connect();
    db.collection('tracks').dropIndexes();
    db.collection('tracks').createIndex({
        title: "text",
        artist: "text",
        album: "text",
    });   
    cb([]);   
}
    
var albumArt = function (query,cb) {
    //console.log(['ALBUMART',query.album,query.artist]);
if (query && query.artist && query.artist.trim().length > 0 && query && query.album && query.album.trim().length > 0) {
        return db.collection('albumart').find({_id: query.artist+query.album}).toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb([])
			} else {
				cb(results);
			}
        });     
    } else {
        cb([]);
    } 
}   

var stream = function(query,req,res) {
    //
        
    try {
        if (!db) connect();
       // console.log(['stream',query]);
        //let searchFor = query.search = query.search ? query.search : '';
        let criteria=[];
        criteria.push({_id: new ObjectId(query.id)});
        db.collection('tracks')
            .find({$and:criteria})
            .toArray(function(err, results) {
                //console.log(err);
                //console.log('STREAM res');
                //console.log(results);
                if (err) console.log(err);
                //console.log(cb)
                if (results.length > 0) {
                    try {
                        let stat = fs.statSync(results[0].path);
                        returnMedia(results[0].path,req,res,stat,results[0].mime);
                    } catch (e) {
						console.log(['ERROR STREAMING',e]);
						res.send('')
                    }
                    //readcontent(results[0].path, serveWithRanges, req, res);
                    //var fs = require('fs');
                    //let file = results[0];
                    ////console.log(file);
                    //// local file
                    //if (file.path) {
                        ////console.log('local');
                        //fs.readFile(file.path, (err, data) => {
                          //if (err) console.log(err);
                          ////console.log(data);
                          //else cb(data);
                          
                        //});    
                    //} else if (file.url) {
                        ////console.log('URL');
                        //request.get(file.url).pipe(res);
                    //} else {
                        ////console.log('STREAM CB');
                        //if (cb) cb(results[0]);
                    //}
                    
                    //request.get(results[0].url).pipe(res);
                    //cb(results[0]);
                } else {
						res.send('')
                }
                
            });
    } catch (e) {
        console.log('ERROR STREAMING');
    }
}



 function returnMedia(fpath, req, res, stat,mime) {
        var total = stat.size;
        var ext = path.extname(fpath).slice(1);
        if (req.headers['range']) {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            var chunksize = (end - start) + 1;
            //console.log('RANGE: ' + start + ' - ' + end + ' = ' +chunksize);
            var file = fs.createReadStream(fpath, {
                start: start,
                end: end
            });
            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end +
                    '/' + total,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': mime
            });
            file.pipe(res);
        } else {
            //console.log('ALL: ' + total);
            res.writeHead(200, {
                'Content-Length': total,
                'Content-Type': mime
            });
            fs.createReadStream(fpath).pipe(res);
        }
    }



var toggleFavorite = function(query,cb) {
    let criteria=[];
    console.log('TOGGLE FAV');
    if (query.userId && query.userId.length > 0 && query.trackId && query.trackId.length > 0) {
        let childCriteria = {};
        childCriteria['favoriteOf.'+query.userId] = true;
        criteria.push(childCriteria);
        criteria.push({_id:ObjectId(query.trackId)});
        console.log(['TOGGLE FAV REAL',criteria]);
        db.collection('tracks')
        .find({$and:criteria})
        .toArray(function(err, results) {
            if (err) {
				cb({message:'error toggling favorite'});
           } else  if (results && results.length > 0) {
                // delete
                console.log('TOGGLE FAV del');
                let newCriteria = {};
                newCriteria['favoriteOf.'+query.userId] = false
                db.collection('tracks').updateOne({_id:ObjectId(query.trackId)},{$set:newCriteria});
                cb({status:'no'});
            } else {
                // insert
                console.log('TOGGLE FAV ins');
                let newCriteria = {};
                newCriteria['favoriteOf.'+query.userId] = true
                db.collection('tracks').updateOne({_id:ObjectId(query.trackId)},{$set:newCriteria});
                cb({status:'yes'});
            }
        })
    }
//    cb('');
}


var isFavorite = function(query,cb) {
    let criteria=[];
    if (query.userId && query.userId.length > 0 && query.trackId && query.trackId.length > 0) {
        criteria.push({userId:ObjectId(query.userId)});
        let childCriteria = {};
        childCriteria['favoriteOf.'+query.userId] = true;
        criteria.push({trackId:ObjectId(query.trackId)});
        criteria.push(childCriteria);
        
        db.collection('favorites')
        .find({$and:criteria})
        .toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb({message:'failed to determine favorite status'});
            } else if (results.length > 0) {
                cb({result:'yes'});
            } else {
                cb({result:'no'});
            }
        })
    } else {
		cb({message:'failed to determine favorite status'});
    }
}

var logSeen = function(query,cb) {
    let criteria=[]; 
    if (query.userId && query.userId.length > 0 && query.trackId && query.trackId.length > 0) {
        let userFilter = {};
        let userFilterKey = "playedBy."+query.userId;
        let setFilter = {};
        setFilter[userFilterKey] = new Date().getTime();
       // console.log('log SEEN',query.trackId);
        let updateUserTags = function() {
         //   console.log('update user tags');
            db.collection('usertags').find({userId:ObjectId(query.userId)}).sort({value:-1}).limit(5).toArray(function(err, results) {
           //     console.log(['update user tags',results]);
                let final=[];
               if (results)  {
                   results.map(function(val,key) {
                       final.push(val.tag);
                   });
             //      console.log(['update user tags',final]);
                   db.collection("users").updateOne({_id:ObjectId(query.userId)},{$set:{tags:final.join(",")}}).then(function() {
               //         console.log(['log seen user updated',query]);
                       // cb({message:'updated user pl'});
                    }).catch(function(e) {
                        console.log(['LOG SEEN ERR',e]);
                    });                   
               }
            });
        }
        
        
        db.collection('tracks').findOne({_id:ObjectId(query.trackId)}).then(function(track) {
             //console.log(['update user tags found track',track]);
            db.collection('tracks').updateOne({_id:ObjectId(query.trackId)},{$set:setFilter}).then(function() {
                let trackTags = track && track.genre ? track.genre.split(",") : [];
               // console.log(['update user tags update track',trackTags]);
                trackTags.map(function(val,key) {
                 //   console.log(['update user tags map',val]);
                    db.collection('usertags').findOne({userId:ObjectId(query.userId),tag:val}).then(function(usertag) {
                   //     console.log(['update user tags found usretag',usertag]);
                        if (usertag) {
                     //       console.log(['update ']);
                            let newValue = usertag.value ? parseInt(usertag.value,10) + 1 : 1;
                            db.collection('usertags').updateOne({userId:ObjectId(query.userId),tag:val},{$set:{value:newValue}}).then(updateUserTags);
                        } else {
                       //     console.log(['insert ']);
                            db.collection('usertags').insertOne({userId:ObjectId(query.userId),tag:val,value:0}).then(updateUserTags);
                        }
                    });
                });
                
            });
        });
    }
        cb('');
    
    
           //console.log('logged SEEN');
           //let setData = {};
            //if (query.playlistId && query.playlistId.length > 0) setData.playlistId = ObjectId(query.playlistId);
            //if (query.isPlaying === "true") setData.isPlaying = true;
            //if (query.isPlaying === "false") setData.isPlaying = false;
            //db.collection('tracks').findOne({_id:ObjectId(query.trackId)}).then(function(track)) {
                //db.collection("users").findOne({_id:ObjectId(query.userId)}).then(function(user) {
                    //if (user && track) {
                        //let collated={}
                        //let userTags = user.tags ;
                        //let trackTags = track.tags ? track.tags.split(",") : [];
                        
                        
                        //db.collection("users").updateOne({_id:ObjectId(query.userId)},{$set:setData}).then(function() {
                            //console.log(['log seen user updated',query]);
                            //cb('updated user pl');
                        //});                    
                    //}
                //});
                
            //})
            
   
}

var savePlayer = function(query,cb) {
   console.log(['savePLayer',query]);
    if (query.userId && query.userId.length > 0 ) {
        //console.log(['savePLayer reeally',query]);
        let setData = {};
        if (query.playlistId && query.playlistId.length > 0) setData.playlistId = ObjectId(query.playlistId);
        // use strings for booleans to ensure a value is passed over POST
        if (query.isPlaying === "true") setData.isPlaying = true;
        if (query.isPlaying === "false") setData.isPlaying = false;
        if (query.expandedArtists) setData.expandedArtists = query.expandedArtists;
        db.collection("users").updateOne({_id:ObjectId(query.userId)},{$set:setData}).then(function() {
            console.log(['savePLayer updated',setData   ,query]);
            cb({message:'updated user pl'});
        }).catch(function(e) {
			console.log(e);
			cb({message:'noop'});
		});
    } else {
        cb({message:'noop'});
    }
}



var savePlaylist = function(query,cb) {
    //console.log(['savePL',query]);
    if (query.userId && query.userId.length > 0 && ((query.title && query.title.length > 0) || (query.items && query.items.length > 0) || (query.currentTrack && !isNaN(query.currentTrack) && query.currentTrack >= 0)) ) {
       // console.log(['savePL real']);
        if (query.playlistId && query.playlistId.length > 0) {
            // update
            let setData = {}
            if (query.title) setData.title = query.title;
            if (query.items) setData.items = query.items;
            if (query.currentTrack) setData.currentTrack = query.currentTrack
            setData.userId = ObjectId(query.userId);
           // console.log(['savePL update',setData]);
            db.collection("playlists").updateOne({_id:ObjectId(query.playlistId)},{$set:setData},{upsert:true}).then(function() {
                cb({message:'update'});
            }).catch(function(e) {
				console.log(e);
				cb({message:'fail'});
			});
        } else {
            // insert
          //  console.log(['savePL insert']);
            db.collection("playlists").insertOne({userId:ObjectId(query.userId),title:query.title,items:(query.items ? query.items : []),currentTrack:0}).then(function() {
                cb({message:'insert'});
            }).catch(function(e) {
				console.log(e);
				cb({message:'fail'});
			});
        }
    } else {
        cb({message:'noop'});
    }
}

var addTrackToPlaylist = function(query,cb) {
    //&& ((query.title && query.title.length > 0) || (query.items && query.items.length > 0) || (query.currentTrack && !isNaN(query.currentTrack) && query.currentTrack >= 0)) 
    if (query.userId && query.userId.length > 0 ) {
       // console.log(['savePL real']);
        if (query.playlistId && query.playlistId.length > 0) {
            if (query.item && query.item._id && query.item._id.length > 0) {
                let playlistKey = parseInt(query.playlistKey,10) > 0 ? query.playlistKey : 0;
                db.collection("playlists").findOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)}).then(function(playlist) {
                    if (playlist) {
                        let newPlaylistItems = Array.isArray(playlist.items) ? playlist.items : [];
                        newPlaylistItems.splice(playlistKey,0,query.item);
                        db.collection("playlists").updateOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)},{$set:{items:newPlaylistItems}}).then(function() {
                            console.log('ADDED ITEM TO PLAYLIST at '+playlistKey);
                            cb({message:'added to playlist'});
                        });
                    } else {
						cb({message:'failed'});
					}
                }).catch(function(e) {
					console.log(e);
					cb({message:'fail'});
				});
            } else {
				cb({message:'fail'});
			}  
        } else {
			cb({message:'fail'});
		} 
    } else {
		cb({message:'fail'});
	} 
}
// TODO ENSURE CALLBACK FROM HERE ON
var startPlayTrackOnPlaylist = function(query,cb) {
    //&& ((query.title && query.title.length > 0) || (query.items && query.items.length > 0) || (query.currentTrack && !isNaN(query.currentTrack) && query.currentTrack >= 0)) 
    if (query.userId && query.userId.length > 0 ) {
       // console.log(['savePL real']);
        if (query.playlistId && query.playlistId.length > 0) {
            if (query.item && query.item._id && query.item._id.length > 0) {
                let playlistKey = parseInt(query.playlistKey,10) > 0 ? query.playlistKey : 0;
                db.collection("playlists").findOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)}).then(function(playlist) {
                    if (playlist) {
                        let newPlaylistItems = Array.isArray(playlist.items) ? playlist.items : [];
                        newPlaylistItems.splice(playlistKey,0,query.item);
                        db.collection("playlists").updateOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)},{$set:{items:newPlaylistItems,currentTrack:(playlistKey + 1)}}).then(function() {
                          db.collection("users").updateOne({_id:ObjectId(query.userId)},{$set:{isPlaying:true}})  
                          console.log('ADDED ITEM TO PLAYLIST at '+playlistKey);
						  cb({message:'added item to playlist'});
                        }).catch(function(e) {
							console.log(e)
							cb({message:'fail'})
						})
                    } else {
						cb({message:'fail'})
					} 
                });
            } else {
				cb({message:'fail'})
			}   
        } else {
			cb({message:'fail'});
		} 
    } else {
		cb({message:'fail'});
	} 
}

var addTracksToPlaylist = function(query,cb) {
    //&& ((query.title && query.title.length > 0) || (query.items && query.items.length > 0) || (query.currentTrack && !isNaN(query.currentTrack) && query.currentTrack >= 0)) 
    if (query.userId && query.userId.length > 0 ) {
       // console.log(['savePL real']);
        if (query.playlistId && query.playlistId.length > 0) {
            if (query.items && query.items.length > 0) {
                let playlistKey = parseInt(query.playlistKey,10) > 0 ? query.playlistKey : 0;
                db.collection("playlists").findOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)}).then(function(playlist) {
                    if (playlist) {
                        let newPlaylistItems = Array.isArray(playlist.items) ? playlist.items : [];
                        newPlaylistItems.splice(playlistKey,0,...query.items);
                        db.collection("playlists").updateOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)},{$set:{items:newPlaylistItems}}).then(function() {
                            console.log('ADDED ITEMs TO PLAYLIST at '+playlistKey);
                            cb({message:'added item to playlist'});
                        });
                    } else {
						cb({message:'fail'});
					} 
                });
            } else {
				cb({message:'fail'});
			}    
        } else {
			cb({message:'fail'});
		} 
    } else {
		cb({message:'fail'});
	} 
}

var removeTrackFromPlaylist = function(query,cb) {
    if (query.userId && query.userId.length > 0 ) {
       // console.log(['savePL real']);
        if (query.playlistId && query.playlistId.length > 0) {
            let playlistKey = parseInt(query.playlistKey,10) > 0 ? query.playlistKey : 0;
            db.collection("playlists").findOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)}).then(function(playlist) {
                if (playlist) {
                    let newPlaylistItems = Array.isArray(playlist.items) ? playlist.items : [];
                    newPlaylistItems.splice(playlistKey,1);
                    db.collection("playlists").updateOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)},{$set:{items:newPlaylistItems}}).then(function() {
                        console.log('REMOVED ITEM FROM PLAYLIST at '+playlistKey);
                    });
                }
            });
           
        }
    }
    cb('invalidrequest');
}

var deletePlaylist = function(query,cb) {
    if (query.playlistId && query.playlistId.length > 0 && query.userId && query.userId.length > 0) {
        db.collection("playlists").deleteOne({_id:ObjectId(query.playlistId),userId:ObjectId(query.userId)}).then(function() {
			cb({message:'playlist deleted'})
		}).catch(function(e) {
			console.log(e);
			cb({message:'fail'})
		});
    } else {
		cb({message:'fail'})
	}
}

var getPlaylist = function(query,cb) {
    let criteria=[];
    if (query.playlistId && query.playlistId.length > 0) {
        criteria.push({_id:ObjectId(query.playlistId)});
        db.collection('playlists')
        .find({$and:criteria})
        .toArray(function(err, results) {
            if (err) {
				console.log(err);
				cb({message:'fail'})
			} else {
				let defaultPlaylist=null;
				let defaultPlaylistKey=null;
				let final= json && json.length > 0 ? json : JSON.parse(JSON.stringify(samplePlaylists)); 
				if (results && results.length > 0) {
					cb(results[0]);
				} else {
					let newDefault = {_id:new ObjectId(),title:"default",items:[],userId:ObjectId(query.userId),currentTrack:0};
				    cb(newDefault);
				}
			}
        })
    } else {
		cb({message:'fail'})
	}
}

var getPlaylists = function(query,cb) {
    let criteria=[];
    let that = this;
        
    if (query.userId && query.userId.length > 0) {
    //    console.log('GET PLylists real');
        criteria.push({userId:ObjectId(query.userId)});
        db.collection('playlists')
        .find({$and:criteria})
        .toArray(function(err, json) {
            if (err) {
				console.log(err);
				cb({message:'fail'})
			} else {
				//console.log('GOT PLylists');
				//console.log(json);
				// ensure default playlist
				let defaultPlaylist=null;
				let defaultPlaylistKey=null;
				let final= json && json.length > 0 ? json : []; //JSON.parse(JSON.stringify(samplePlaylists)); 
		
				json.map(function(val,key) {
				  //console.log(['IS DEFAULT ??',JSON.stringify(val)]);
				  if (val.title && val.title.trim().toLowerCase(val.title)==="default") {
					//  console.log(['YES']);
					  defaultPlaylist = val;
					  defaultPlaylistKey = key;
				  }
				  //final.push(val);
				});
				
				if (defaultPlaylist === null) {
				  let newDefault = {_id:new ObjectId(),title:"default",items:[],userId:ObjectId(query.userId),currentTrack:0};
				  db.collection('playlists').insertOne(newDefault);
				 // console.log(['create DEFAULT ',JSON.stringify(newDefault)]);
				  final.unshift(newDefault);
				}
			  //  console.log(['final ??',JSON.stringify(final.length)]);
				cb(final);
			}
        })
    } else {
        let final= [] ; //samplePlaylists ? JSON.parse(JSON.stringify(samplePlaylists)) : [];
    
        let newDefault = {_id:new ObjectId(),title:"default",items:[],userId:ObjectId(),currentTrack:0};
        final.unshift(newDefault);
        
        cb(final);
    }
}

 
module.exports = {search:search,stream:stream,searchTags:searchTags,artists:artists,searchTracksByArtistAndAlbum:searchTracksByArtistAndAlbum,searchTracksByArtist:searchTracksByArtist,searchTracksByTag:searchTracksByTag,recreateIndexes:recreateIndexes,albumArt:albumArt,isFavorite:isFavorite,toggleFavorite:toggleFavorite,logSeen:logSeen,savePlayer:savePlayer,savePlaylist:savePlaylist,getPlaylists:getPlaylists,deletePlaylist:deletePlaylist,addTrackToPlaylist:addTrackToPlaylist,startPlayTrackOnPlaylist:startPlayTrackOnPlaylist,removeTrackFromPlaylist:removeTrackFromPlaylist,addTracksToPlaylist:addTracksToPlaylist};
