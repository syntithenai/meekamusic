const NodeID3 = require('node-id3')
const MongoClient = require('mongodb').MongoClient
var config=require('./config')
var ObjectId = require('mongodb').ObjectID;
let db;

var http = require('http');
var path = require('path');
var fs = require('fs');


var connect = function() {
	MongoClient.connect(config.databaseConnection, (err, client) => {
		if (err) return console.log(err)
		db = client.db(config.database) 
		let count = 0;
		db.collection('tracks').find({}).forEach(function(theCollection) {
			count = count + 1;
			// where score is missing (jamendo), randomly assign 0-5 value
			let interest = theCollection.hasOwnProperty('interest') ? theCollection.interest/1000000 : Math.random()*5;
			interest = (parseFloat(interest) !== NaN ? parseFloat(interest) : 0)
			let listens = theCollection.hasOwnProperty('listens') ?  theCollection.listens/100000 : Math.random()*5;
			listens = parseFloat(listens) !== NaN ? parseFloat(listens) : 0
			let favoriteCount = 0;
			if (typeof theCollection.favoriteOf === 'object') {
				Object.values(theCollection.favoriteOf).map(function(val) {
					if (val === true) favoriteCount ++;
					return;
				})
			} 
			
			theCollection.score = {
					interest:interest, 
					listens:listens,
					plays:(theCollection.playedBy && theCollection.playedBy.length > 0 ? theCollection.playedBy.length : 0),
					favorites:favoriteCount
			}
			
			theCollection.finalScore = theCollection.score.interest + theCollection.score.listens + theCollection.score.plays + theCollection.score.favorites; 
			db.collection('tracks').save(theCollection);
			console.log(['track '+count + ':' + theCollection.finalScore])
		});
		console.log('DONE')
	})
}

connect();


