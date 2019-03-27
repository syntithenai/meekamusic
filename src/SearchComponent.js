import { Component } from 'react';
import 'whatwg-fetch'
//import TrackList from './TrackList'
import {debounce} from 'throttle-debounce';

//let config = require('./config');

export default class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state={}
        this.search = debounce(500,this.search.bind(this)); 
    };
    
    /*
     * Search for tracks by filter text and tag
    // collate tracks by groupByKey
    */
    search(filter,filterTag,limit) {
        let endPoint = this.props.endPoint;
        let that = this;
	    let userId = this.props.user && this.props.user._id ? this.props.user._id : 'none';
		let extraFilter='';
		// hack for fresh tracks to filter by user selected tags and expanded artists
		//if (endPoint==="fresh") {
			//extraFilter = "&tags="+(this.props.user && this.props.user.tags ? this.props.user.tags : '');
			//if (this.props.user && this.props.user.expandedArtists) {
				//extraFilter += "&filterArtists="+Object.keys(this.props.user.expandedArtists).join(",");
			//}
		//}
		this.props.startWaiting();
		that.props.fetchData(that.props.apiUrl+"/"+endPoint+'?userId='+userId+'&search='+encodeURI(filter)+'&tag='+filterTag+'&limit='+limit+'&rand='+new Date().getTime()+extraFilter)
		.then(function(json) {
			let collatedAlbumTracks= {};
			let artists={};
			let genres={};
			for (var key in json) {
				let groupByKey = json[key].groupByKey;
				if (groupByKey && groupByKey.length > 0) {
					let albumKey = json[key].albumKey;
					if (json[key].genre) {
						if (!genres.hasOwnProperty(groupByKey)) {
							genres[groupByKey]={};
						}
						if (!genres[groupByKey].hasOwnProperty(albumKey)) {
							genres[groupByKey][albumKey]={};
						}
						json[key].genre.map(function(genre,gKey) {
							genres[groupByKey][albumKey][genre] = 1;
							return null;
						});    
					}
					// ensure artist
					if (!artists[groupByKey]) {
							artists[groupByKey]={originalTitle:json[key].artist,title:groupByKey}
					}
					// ensure artist matching albums and tracks
					if (!artists[groupByKey].matchingAlbums) {
						artists[groupByKey].matchingAlbums = {};
					}
					if (!artists[groupByKey].albumTracks) {
						artists[groupByKey].albumTracks = {};
					}
					if (!artists[groupByKey].albumTracks.hasOwnProperty(albumKey)) {
						artists[groupByKey].albumTracks[albumKey]=[];
					}
					// append track to matching tracks
					if (!collatedAlbumTracks[groupByKey]) {
						collatedAlbumTracks[groupByKey] = {};
					}
					if (!Array.isArray(collatedAlbumTracks[groupByKey][albumKey])) {
						collatedAlbumTracks[groupByKey][albumKey] = [];
					}
					collatedAlbumTracks[groupByKey][albumKey].push(json[key]);
					// append album to matching albums if not already there
					if (!artists[groupByKey].matchingAlbums.hasOwnProperty()) {
						artists[groupByKey].matchingAlbums[albumKey] = json[key].album;
					} 
					
				}
			}
			//console.log(['GEMRES',genres]);
			for (let gKey in genres) {
				artists[gKey].genres = genres[gKey];
			}
			
			for (let artist in collatedAlbumTracks) {
				for (let album in collatedAlbumTracks[artist]) {
					artists[artist].albumTracks[album] = collatedAlbumTracks[artist][album].sort(function(a,b) {
						if (a.trackNumber && b.trackNumber) {
							let aParts = a.trackNumber.split("/");
							let bParts = b.trackNumber.split("/");
							if (parseInt(aParts[0],10) < parseInt(bParts[0],10)) {
								return -1;
							} else {
								return 1;
							}
						} else if (!a.trackNumber) {
							return -1;
						} else {
							return 1;
						}
					});
				}
			}
			
			let artistsArray = Object.values(artists);
				
			if (!that.props.skipArtistSort) {
				artistsArray.sort(function(a,b) {
					if (a.title < b.title) return -1;
					else return 1;
				});                        
			}
			//console.log(['LOCALSEARCH ERS',artists]);
			that.props.setSearchResults('local',artistsArray);
			//console.log(['LOCALSEARCH RESET SCROLL']);
			that.props.setSearchResultsScrollToIndex('artists',1);
			that.props.stopWaiting();
		}).catch(function(ex) {
			console.log(['song search failed', ex])
		})            
    };
    
    componentDidMount() {
        let that = this;
		let filter = that.props.searchFilter ? that.props.searchFilter : '';
		let filterTag = that.props.searchFilterTag ? that.props.searchFilterTag : '';
		that.props.setSearchResultsScrollToIndex('artists',1);
		that.search(filter,filterTag);
    }
    
    componentDidUpdate(props) {
        //console.log(['LOCAL SERCH CHANGE PROPS']);
        let that = this;
        let filter = props.searchFilter ? props.searchFilter : '';
        let filterTag = props.searchFilterTag ? props.searchFilterTag : '';
        //console.log(['LOCAL SERCH CHANGE PROPS',filter,filterTag,that.props.searchFilter,that.props.searchFilterTag]);

	   // if search filter changes, update results and scroll to top
	   if (((filter !== that.props.searchFilter) || (filterTag !== that.props.searchFilterTag))) {
		   //console.log(['LOCAL SERCH CHANGE',props.searchFilter,this.props.searchFilter]);
		   that.search(this.props.searchFilter,this.props.searchFilterTag,that.props.limit);
		   that.props.setSearchResultsScrollToIndex('artists',1);
	   } 

	   // if login user changes, update results and scroll to top
	   let userName = this.props.user && this.props.user.hasOwnProperty('username') ? this.props.user.username : null;
		let oldUserName = props.user && props.user.hasOwnProperty('username') ? props.user.username : null;
		if (userName !== oldUserName ) {
			that.search(this.props.searchFilter,this.props.searchFilterTag,that.props.limit);
		   that.props.setSearchResultsScrollToIndex('artists',1);
		   
		}
    }
    


};
     
     
