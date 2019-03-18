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
    
    // search tracks by filter text and tag
    // collate tracks by groupByKey
    search(filter,filterTag,limit) {
        let endPoint = this.props.endPoint;
        let that = this;
        //console.log(['LS ',filter,filterTag]);
       // let limit=30;
        // prerequisites
        //if (this.props.artists && this.props.artists.length > 0) {
           // console.log('LS A');
            //console.log('LS A');
            //console.log(allArtistsIndex);
          //  if ((filter && filter.trim().length > 1) || (filterTag && filterTag.trim().length > 0 )) {
                //let allArtistsIndex = {};
                //for (let ai in this.props.artists) {
                    //allArtistsIndex[this.props.artists[ai].title] = this.props.artists[ai];
                //}
             //   console.log('LS F');
               // let that = this;
                let userId = this.props.user && this.props.user._id ? this.props.user._id : 'none';
            //    console.log(['LOCAL SERCH-' ,filter,filterTag]);
                let extraFilter='';
                if (endPoint==="fresh") {
                    extraFilter = "&tags="+(this.props.user && this.props.user.tags ? this.props.user.tags : '');
                    if (this.props.user && this.props.user.expandedArtists) {
                        extraFilter += "&filterArtists="+Object.keys(this.props.user.expandedArtists).join(",");
                    }
                }
                this.props.startWaiting();
                that.props.fetchData(that.props.apiUrl+"/"+endPoint+'?userId='+userId+'&search='+encodeURI(filter)+'&tag='+filterTag+'&limit='+limit+'&rand='+new Date().getTime()+extraFilter)
                
                .then(function(response) {
                    //console.log(['got response', response])
                    // iterate items, building list of artists and populating albumMatch and trackMatch arrays
                    return response.json()
                }).then(function(json) {
                    //that.setState({'tracks':json});
                ///    console.log(json);
                    let collatedAlbumTracks= {};
                    let artists={};
                    let genres={};
                    for (var key in json) {
                        let groupByKey = json[key].groupByKey;
                        if (groupByKey && groupByKey.length > 0) {
                            let albumKey = json[key].albumKey;
                            //console.log(['SE ITEM   ']);
                            //console.log([key,groupByKey,albumKey,json[key].genre,json[key]]);
                            // aggregate genres by artist
                            if (json[key].genre) {
                                if (!genres.hasOwnProperty(groupByKey)) {
                                    genres[groupByKey]={};
                                }
                                if (!genres[groupByKey].hasOwnProperty(albumKey)) {
                                    genres[groupByKey][albumKey]={};
                                }
                                let itemGenres = json[key].genre.trim().split(",");
                                //for (let gKey in itemGenres) {
                                Object.values(itemGenres).map(function(genre,gKey) {
                                    genres[groupByKey][albumKey][genre] = 1;
                                    return null;
                                });    
                                    //console.log(['GKEY',gKey,itemGenres[gKey]]);
                                    //genres[groupByKey][albumKey][itemGenres[gKey]] = 1;
                                //}
                            }
                            //console.log(genres);
                            // ensure artist
                            if (!artists[groupByKey]) {
                                //if (allArtistsIndex[groupByKey]) {
                                    //artists[groupByKey] = allArtistsIndex[groupByKey];
                                //} else {
                                    artists[groupByKey]={originalTitle:json[key].artist,title:groupByKey}
                                //}
                                //artists[groupByKey].matchingTracks = [];
                                //artists[groupByKey].matchingAlbums = {};
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
                            
                            //if (!artists[groupByKey].albumTracks[json[key].albumKey].hasOwnProperty('matchingTracks')) {
                                //artists[groupByKey].albumTracks[json[key].albumKey].matchingTracks = [];
                            //}
                            // append track to matching tracks
                            //artists[groupByKey].albumTracks[albumKey]
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
                    
                    
                    //console.log(['LOCALSEARCH ARTISTS',artists]);
                    //// sort album tracks by track numbers
                    //for (var ai in artists) {
                        //let sortArtist = artists[ai];
                        //for (var bi in sortArtist.albumTracks) {
                            //if (sortArtist.albumsTracks && sortArtist.albumsTracks.hasOwnProperty(bi) && sortArtist.albumsTracks[bi] && sortArtist.albumsTracks[bi].length > 0) {
                                //let albumTracks = sortArtist.albumTracks[bi];
                                //albumTracks.sort(function(a,b) {
                                    //if (a.trackNumber && b.trackNumber) {
                                        //let aParts = a.trackNumber.split("/");
                                        //let bParts = b.trackNumber.split("/");
                                        //if (parseInt(aParts[0],10) < parseInt(bParts[0],10)) {
                                            //return -1;
                                        //} else {
                                            //return 1;
                                        //}
                                    //} else if (!a.trackNumber) {
                                        //return -1;
                                    //} else {
                                        //return 1;
                                    //}
                                //});
                                
                            //}
                        //}
                        ////aiArtist.matchingAlbums.sort();
                    //}
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
                
            //} else  {
                //that.props.setSearchResults('local',[]);
                ////that.props.setSearchResults('local',JSON.parse(JSON.stringify(this.props.artists)));
                ////return this.props.artists;
            //}
        //} else {
            //that.props.setSearchResults('local',[]);
        //}
        //let tagsRen = <Tags tags={this.props.tags} history={this.props.history} filterTags={this.props.filterTags} />
        //this.props.setRenderedTags(tagsRen)

    };
    
    componentDidMount() {
        let that = this;
        
        //let urlParts = this.props.location.pathname.split("meeka/search");
        //let query = urlParts[urlParts.length - 1];
        
        //console.log(['LOCAL SERCH mnt',query,this.props.searchFilter,,this.props.searchFilterTag]);
        //if ((query && query.length > 0) || (this.props.searchFilterTag && this.props.searchFilterTag.length > 0)) {
            //that.search(query,this.props.searchFilterTag);
        //}
        //if ((that.props.searchFilter && that.props.searchFilter.length > 0) || (that.props.searchFilterTag && that.props.searchFilterTag.length > 0)) {
            //let lsSearchFilter = this.props.getFromMeekaLocalStorage('searchFilter');
            //console.log(['LSSEARCHFILTER',lsSearchFilter]);
            //if (false ) { //|| that.props.searchResults.local && that.props.searchResults.local.length > 0) {
                //console.log(['LOCAL SERCH mnt reuse results']);
            //} else {
                //console.log(['LOCAL SERCH mnt REALLY',this.props.searchFilter,this.props.searchFilterTag]);
                let filter = that.props.searchFilter ? that.props.searchFilter : '';
                let filterTag = that.props.searchFilterTag ? that.props.searchFilterTag : '';
                that.props.setSearchResultsScrollToIndex('artists',1);
                    
                that.search(filter,filterTag);
            //}
        //}
         //else if (that.props.defaultSearch) {
            //setTimeout(function() {
    
                //if (that.props.filter && that.props.filter.length > 0) {
                    //that.search(that.props.filter,that.props.limit);
                //} else if (that.props.defaultSearch) {
                    //that.search(that.props.defaultSearch,that.props.limit);
                //} else {
                    //that.setSearchResults([]);
                //}  
            //},2000);
        //}            

      
    }
    
    componentDidUpdate(props) {
        //console.log(['LOCAL SERCH CHANGE PROPS']);
        let that = this;
        let filter = props.searchFilter ? props.searchFilter : '';
        let filterTag = props.searchFilterTag ? props.searchFilterTag : '';
        //console.log(['LOCAL SERCH CHANGE PROPS',filter,filterTag,that.props.searchFilter,that.props.searchFilterTag]);
            
       //setTimeout(function() {
       //(filter.length > 0 || filterTag.length > 0) && (filter !== that.props.searchFilter || filterTag !== that.props.searchFilterTag )
       // && (filterTag.length > 0 || filter.length > 0)
           if (((filter !== that.props.searchFilter) || (filterTag !== that.props.searchFilterTag))) {
               //console.log(['LOCAL SERCH CHANGE',props.searchFilter,this.props.searchFilter]);
               that.search(this.props.searchFilter,this.props.searchFilterTag,that.props.limit);
               that.props.setSearchResultsScrollToIndex('artists',1);
                    
               //if (that.props.filter && that.props.filter.length > 0) {
                    //that.search(that.props.filter,that.props.limit);
                //} else if (that.props.defaultSearch) {
                    //that.search(that.props.defaultSearch,that.props.limit);
                //}
           } 
           let userName = this.props.user && this.props.user.hasOwnProperty('username') ? this.props.user.username : null;
            let oldUserName = props.user && props.user.hasOwnProperty('username') ? props.user.username : null;
            if (userName !== oldUserName ) {
                that.search(this.props.searchFilter,this.props.searchFilterTag,that.props.limit);
               that.props.setSearchResultsScrollToIndex('artists',1);
               
            }
            //if (props.searchResultsScrollToIndex.artists !== that.props.searchResultsScrollToIndex.artists) {
               
            //}
       // },500);
       //this.search(props.filter,props.limit);
    }
    


};
     
     
