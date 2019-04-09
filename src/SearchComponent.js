import { Component } from 'react';
import 'whatwg-fetch'
//import TrackList from './TrackList'
//import {debounce} from 'throttle-debounce';

//let config = require('./config');

export default class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state={}
       //this.search = debounce(500,
        this.search =this.search.bind(this); 
     //    this.extractQueryParts = this.extractQueryParts.bind(this);
   };
   
  
    componentDidMount() {
        console.log(['SEARCH COMPONENT MOUNT']);
        this.search();
    }
    
    componentDidUpdate(previousProps) {
        let that = this;
        let props = previousProps.match.params ? previousProps.match.params : {};
        let newProps = that.props.match.params ? that.props.match.params : {}
        console.log(['SEARCH COMPONENT UPDATE',newProps,props]);
        
        let filter = props.search ? props.search : '';
        let filterProps = newProps.search ? newProps.search : '';
        let filterTag = props.searchTag ? props.searchTag : '';
        let filterTagProps = newProps.searchTag ? newProps.searchTag : '';
        let filterArtist = props.searchArtist ? props.searchArtist : '';
        let filterArtistProps = newProps.searchArtist ? newProps.searchArtist : '';
        let filterAlbum = props.searchAlbum ? props.searchAlbum : '';
        let filterAlbumProps = newProps.searchAlbum ? newProps.searchAlbum : '';
        
	    //if search filter changes, update results and scroll to top
	   if (((filter !== filterProps) || (filterTag !== filterTagProps) || (filterArtist !== filterArtistProps) || (filterAlbum !== filterAlbumProps))) {
	//	if (props !== previousProps) {
		   console.log(['LOCAL SERCH CHANGE',props,newProps]);
		   this.search();
		 //  that.props.setSearchResultsScrollToIndex('artists',1);
	 //  } 
		}
	   //// if login user changes, update results and scroll to top
	   //let userName = this.props.user && this.props.user.hasOwnProperty('username') ? this.props.user.username : null;
		//let oldUserName = props.user && props.user.hasOwnProperty('username') ? props.user.username : null;
		//if (userName !== oldUserName ) {
			//console.log(['LOCAL SERCH user CHANGE',props,newProps]);
		   //this.search();
	////	   that.props.setSearchResultsScrollToIndex('artists',1);
		   
		//}
    }
    
 
      
    //extractQueryParts() {
		////console.log(['EXTRACT',this.props]);
			
			//let searchFilter = this.props.match.params.search;
            //let searchFilterTag = this.props.match.params.tag;
            //let searchFilterArtist = this.props.match.params.artist;
            //let searchFilterAlbum = this.props.match.params.album;
            
            //////let urlParts = this.props.location.pathname.split(this.props.match.path);
            ////let query = urlParts[urlParts.length - 1].slice(1);
            ////let queryParts = query.split("/");
            ////if (queryParts.length === 2 && queryParts[0]==='tag') {
                ////searchFilterTag = queryParts[1];
            ////} else if (queryParts.length === 3 && queryParts[0]==='tag') {
                ////searchFilterTag = queryParts[1];
                ////searchFilter = queryParts[2];
            ////} else {
                ////searchFilter = queryParts[queryParts.length - 1];
            ////}
            //return {searchFilter:searchFilter,searchFilterArtist:searchFilterArtist,searchFilterAlbum:searchFilterAlbum,searchFilterTag:searchFilterTag};
    //};
    
  
    
    /*
     * Search for tracks by filter text and tag
    // collate tracks by groupByKey
    */
    search() {
		console.log(['REQ SEARCH',this.props.match.params])
		let limit = 1000;
		let props = this.props.match.params;
		let filter = props.search ? props.search : '';
        let filterTag = props.tag ? props.tag : '';
        let filterArtist = props.artist ? props.artist : '';
        let filterAlbum = props.album ? props.album : '';
        
		console.log(['SEARCh',filter,filterTag,filterArtist,filterAlbum,limit]);
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
		that.props.fetchData(that.props.apiUrl+"/"+endPoint+'?userId='+userId+'&search='+encodeURI(filter)+'&tag='+filterTag+'&artist='+filterArtist+'&album='+filterAlbum+'&limit='+limit+extraFilter)
		//+'&rand='+new Date().getTime()
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
			//that.props.setSearchResultsScrollToIndex('artists',1);
			that.props.stopWaiting();
		}).catch(function(ex) {
			console.log(['song search failed', ex])
		})            
    };
    

};
     
     
