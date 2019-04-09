import React, { Component } from 'react';
import {FaPlusSquare as OpenCloseButton} from 'react-icons/fa';
import ObjectId from 'objectid-browser';    
import {FaMusic as Music} from 'react-icons/fa';
import {FaPlay as PlayButton} from 'react-icons/fa';
import {FaPlus as AddButton} from 'react-icons/fa';
import { VariableSizeList as List } from 'react-window';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import { List,AutoSizer } from 'react-virtualized';
import Utils from './Utils';
let listRef = React.createRef();


export default class LibraryList extends Component {

    constructor(props) {
        super(props);
        this.playArtist=this.playArtist.bind(this);
        this.addArtist=this.addArtist.bind(this);
        this.playAlbum=this.playAlbum.bind(this);
        this.loadAlbumTracks=this.loadAlbumTracks.bind(this);
        this.toggleAlbumTracks=this.toggleAlbumTracks.bind(this);
        this.addAlbum=this.addAlbum.bind(this);
        this.renderRow=this.renderRow.bind(this);
        this._noRowsRenderer=this._noRowsRenderer.bind(this);
        this._getRowHeight=this._getRowHeight.bind(this);
       // this.setSearchFilterTag=this.setSearchFilterTag.bind(this);
        this.onScroll=this.onScroll.bind(this);
        this.toggleExpandedArtist=this.toggleExpandedArtist.bind(this);
     //   this.getSearchUrl = this.getSearchUrl.bind(this)
    }
    
    
    //componentWillMount() {
       //// console.log('ART WILL MNT');
    //}
    
    componentDidMount() {
        //console.log('ART DID MNT');
        //let that = this;
         if (listRef && listRef.current)  {
             listRef.current.resetAfterIndex(0);
         }
        //} else {
            //console.log(['ART HAV ELISTREF WiLL reset',listRef,that.props.searchResultsScrollToIndex]);
            ////setTimeout(function() {
                //if (listRef && listRef.current) {
                    //console.log('ART HAV ELISTREF reset');
                    ////listRef.current.resetAfterIndex(0);
                     //if (that.props.searchResultsScrollToIndex.artists > 0) {
                        //console.log('ART scrollto');
                        //console.log(['SCROLL TO ',that.props.searchResultsScrollToIndex,parseInt(that.props.searchResultsScrollToIndex.artists,10)]);
                        ////listRef.current.scrollTo(parseInt(that.props.searchResultsScrollToIndex.artists,10),"center");
                    //}   
                    
                //}                     
            ////},500);
        //}
        //console.log('DONE');
        //setTimeout(function() {
            //console.log('TIMEOUT');
           
        //},1000);
        
        //setTimeout(function() {
            //console.log(['MTT',listRef,that.props.searchResultsScrollToIndex]);
                       
        //},500);
        
    };
    
    //componentDidUpdate(prevProps) {
      ////// Typical usage (don't forget to compare props):
      ////if (this.props.userID !== prevProps.userID) {
        ////this.fetchData(this.props.userID);
      ////}
      ////if (listRef && listRef.current) {
          ////listRef.current.resetAfterIndex(0);
          //////if (this.props.searchResultsScrollToIndex.artists !== prevProps.searchResultsScrollToIndex.artists) {
              //////listRef.current.scrollTo(this.props.searchResultsScrollToIndex.artists);
          //////}
          
      ////}
      
    //}
    
    shouldComponentUpdate(prevProps) {
        //return true;
        //console.log(['LIBLIST SHOULD UPDATE ???',prevProps.artists,this.props.artists]);
        if (prevProps.height !== this.props.height || prevProps.width !== this.props.width ) {
            return true;
        }
        let prevArtists = prevProps.artists ? JSON.stringify(prevProps.artists.map(function(artist) {
            let artistHash = {}
            artistHash[artist.title]=[];
            if (Array.isArray(artist.albumTracks)) {
                artist.albumTracks.map(function(val,key) {
                    artistHash[artist.title].push(val._id);
                    return null;
                });                
            }
            return artistHash ;
        })) : '';
        
        let newArtists = this.props.artists ? JSON.stringify(this.props.artists.map(function(artist) {
            let artistHash = {}
            artistHash[artist.title]=[];
            if (Array.isArray(artist.albumTracks)) {
                artist.albumTracks.map(function(val,key) {
                    artistHash[artist.title].push(val._id);
                    return null;
                });
            }
            return artistHash; 
        })) : '';;
        //console.log(['LIBLIST SHOULD UPDATE ???',prevArtists,newArtists]);
        //if (this.props.artists && prevProps.artists && this.props.artists.length != prevProps.artists.length) {
        if (prevArtists !== newArtists) {
            //console.log(['LIBLIST SHOULD UPDATE YES']);
            return true;
        } else {
            //console.log(['LIBLIST SHOULD UPDATE NO']);
            return false;
        }
    };
    
    //componentWillReceiveProps(props) {
        //let that = this;
        ////console.log(['MTTprops',props]); //,that.listRef.current,that.props.searchResultsScrollToIndex
    //};


    playArtist(filter) {
       console.log(['play art',filter]); 
        let limit=30;
        this.props.startWaiting();
        let that = this;
     //   console.log('LOCAL SERCH-' + filter);
        this.props.fetchData(this.props.apiUrl+'/tracksbyartist?search='+encodeURI(filter)+'&limit='+limit)
        .then(function(json) {
            // add tracks in 
            json.sort(that.sortTracksByAlbumAndTrackNumber);
            
            //that.setState({'tracks':json});
            //that.props.setSearchResults(json);
            //for (let track in json) {
               //console.log([track,json[track]]);  
               if (json.length > 0) {
                   that.props.startPlayTrack(json[0],that.props.currentPlaylist);
                   that.props.addTracks(json.slice(1),that.props.currentPlaylist);
               }
               
            //}
            that.props.stopWaiting();
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
    };

    addArtist(filter) {
       //console.log(['add art',filter]);  
        let limit=30;
        this.props.startWaiting();
        let that = this;
     //   console.log('LOCAL SERCH-' + filter);
        this.props.fetchData(this.props.apiUrl+'/tracksbyartist?search='+encodeURI(filter)+'&limit='+limit)
        .then(function(json) {
            json.sort(that.sortTracksByAlbumAndTrackNumber);
            //for (let track in json) {
               //that.props.addTrack(json[track],that.props.currentPlaylist);
            //}
            if (json.length > 0) {
               that.props.addTracks(json,that.props.currentPlaylist);
            }
            that.props.stopWaiting();
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
    };

    
    playAlbum(artist,album) {
        //console.log(['play alb',artist,album]); 
         let limit=30;
        this.props.startWaiting();
        let that = this;
        this.props.fetchData(this.props.apiUrl+'/tracksbyalbum?artist='+encodeURI(artist)+'&album='+encodeURI(album)+'&limit='+limit)
        .then(function(json) {
            json.sort(that.sortTracksByAlbumAndTrackNumber);
            //for (let track in json) {
               //if (parseInt(track,10) === 0) {
                   //that.props.startPlayTrack(json[track],that.props.currentPlaylist);
               //} else {
                   //that.props.addTrack(json[track],that.props.currentPlaylist);
               //}
            //}
            if (json.length > 0) {
               that.props.startPlayTrack(json[0],that.props.currentPlaylist);
               that.props.addTracks(json.slice(1),that.props.currentPlaylist);
            }
            that.props.stopWaiting();
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
    };

    addAlbum(artist,album) {
        //console.log(['add alb',artist,album]); 
        let limit=30;
        this.props.startWaiting();
        let that = this;
        this.props.fetchData(this.props.apiUrl+'/tracksbyalbum?artist='+encodeURI(artist)+'&album='+encodeURI(album)+'&limit='+limit)
        .then(function(json) {
            json.sort(that.sortTracksByAlbumAndTrackNumber);
            //that.setState({'tracks':json});
            //for (let track in json) {
           ////    console.log([track,json[track]]);  
               //that.props.addTrack(json[track],that.props.currentPlaylist);
            //}
            if (json.length > 0) {
               that.props.addTracks(json,that.props.currentPlaylist);
            }
            //that.props.setSearchResults(json);
            that.props.stopWaiting();
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
    };
    
    //countMatchingTracks(album,tracks) {
        //let count=0;
        //for (let a in tracks) {
            //if (tracks[a].albumKey === album) {
                //count  ++;
            //}
        //}
        //return count;
    //};
    
    //getMatchingTracks(album,tracks) {
        //let ret = [];
        //for (let a in tracks) {
            //if (tracks[a].albumKey === album) {
                //ret.push(tracks[a]);
            //}
        //}
        //return ret;
    //};
    
    //getNotMatchingTracks(album,tracks) {
        //let ret = [];
        //for (let a in tracks) {
            //if (tracks[a].albumKey !== album) {
                //ret.push(tracks[a]);
            //}
        //}
        //return ret;
    //};
    
    toggleAlbumTracks(e,key,artist,album) {
        //console.log(['toggl alb',e,key,artist,album]); 
        let that = this;
        let artists = that.props.searchResults.local;
        //console.log(searchResults);
          let artistsIndex = {};
            for (let ai in artists) {
                artistsIndex[artists[ai].title] = ai;
            }  
            //console.log(['track',artist,album,artistsIndex[artist]]);
            let artistRec = artists[artistsIndex[artist]]    
                
            if (artistRec && artistRec.albumTracks && artistRec.albumTracks.hasOwnProperty(album)) {
                //console.log(['have album tracks',artistRec.albumTracks[album]]);
                if (artistRec.albumTracks[album].length > 0) {
                    //console.log(['clear tracks from album']);
                    
                    artistRec.albumTracks[album] = [];
                    artists[artistsIndex[artist]]    = artistRec;
                    that.props.setSearchResults('local',artists);
                    //searchResults[key].albumTracks[album] = []
                    //that.props.setSearchResults('local',searchResults); 
                    let keya = (key > 0) ? key -1 : 0;
                    listRef.current.resetAfterIndex(keya);
                } else {
                    //console.log(['load']);
                    that.loadAlbumTracks(e,key,artist,album);
                }                
            } else {
                //console.log(['load tracks']);
                that.loadAlbumTracks(e,key,artist,album);
            }
            //// if we have tracks for this album
            //if (that.countMatchingTracks(album,searchResults[key].matchingTracks) > 0) {
                //// save and hide
                //console.log(['save and hide']);
                //if (!searchResults[key].oldMatchingTracks) searchResults[key].oldMatchingTracks = {};
                //searchResults[key].oldMatchingTracks[album] = searchResults[key].matchingTracks;
                //searchResults[key].matchingTracks = this.getNotMatchingTracks(album,searchResults[key].matchingTracks);
                //that.props.setSearchResults('local',searchResults); 
            //// no matches for this album so load them
            //} else {
                //// use old results if available
                //console.log(['use old results if available']);
                //if (searchResults[key].oldMatchingTracks && searchResults[key].oldMatchingTracks[album] && searchResults[key].oldMatchingTracks[album].length > 0) {
                    //// use already loaded tracks
                    //console.log(['use already loaded tracks']);
                    //searchResults[key].matchingTracks = searchResults[key].oldMatchingTracks[album];
                    //that.props.setSearchResults('local',searchResults); 
                //} else {
                    //// load tracks
                    //console.log(['load tracks']);
                    //that.loadAlbumTracks(e,key,artist,album);
                //}
            //} 
            
      //  }
        
        //console.log(['RESETAFTERINDEX',key]);
            //if (key > 0) {
                //listRef.current.resetAfterIndex(key-1);
            //} else {
                
            //}
        //listRef.current.resetAfterIndex(0);
        
        return false;       
    };
    
    sortTracksByAlbumAndTrackNumber(a,b) {
        if (a.albumKey < b.albumKey) {
            return -1;
        } else if (a.albumKey === b.albumKey) {
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
        } else {
            return 1;
        }
    };    
  
    /**
     * Load tracks for a given artist(groupByKey)/album
     * Collate results into  albums sorted by tracknumber
     * Remerge collation back into state/props.artist with setArtist
     */
    loadAlbumTracks(e,key,artist,album) {
        let that = this;
         if (e.target.preventDefault) e.target.preventDefault();
         //console.log(['load alb',e,key,artist,album]); 
         if (String(artist).length > 0 && String(album).length > 0) {
            let artists = that.props.searchResults.local;
            let artistsIndex = {};
            for (let ai in artists) {
                artistsIndex[artists[ai].title] = ai;
            }
            
            //console.log(['do fetch'])
            let limit=500;
            this.props.startWaiting();
            this.props.fetchData(this.props.apiUrl+'/tracksbyalbum?artist='+encodeURI(artist)+'&album='+encodeURI(album)+'&limit='+limit)
            .then(function(response) {
               //console.log(['got response', response])
                return response.json()
            }).then(function(json) {
                //json.sort(that);
                // backup searchResults
                //let other = that.getNotMatchingTracks(album,searchResults[key].matchingTracks);
                //other.concat(json);
                 console.log(['loaded alb',json]); 
                let collated={};
                // including already loaded Except this album
                //if (artists[artist].albumTracks) {
                    //for (let si in artists[artist].albumTracks)  {
                        //if (artists[artist].albumTracks[si].albumKey && artists[artist].albumTracks[si].albumKey !== album) {
                            //if (!collated.hasOwnProperty(json[si].albumKey)) {
                                //collated[json[si].albumKey]=[];
                            //}
                            //collated[json[si].albumKey].push( searchResults[key].albumTracks[si]) ;
                        //}
                    //}
                //} 
                // collate results by artist then album arrays 
                for (let i in json) {
                    if (!collated.hasOwnProperty(json[i].groupByKey)) {
                        // TODO THIS SHOULD ALLOW FOR ALREADY LOADED ALBUMS
                        collated[json[i].groupByKey] = (artistsIndex.hasOwnProperty(json[i].groupByKey) && artistsIndex[json[i].groupByKey].albumTracks) ? artistsIndex[json[i].groupByKey].albumTracks : {};
                    }
                    if (!collated[json[i].groupByKey].hasOwnProperty(json[i].albumKey)) {
                        collated[json[i].groupByKey][json[i].albumKey]=[];
                    }
                    collated[json[i].groupByKey][json[i].albumKey].push(json[i]);
                }
                // sort collated arrays
                for (let gbk in collated) {
                    for (let alk in collated[gbk]) {
                        collated[gbk][alk].sort(that.sortTracksByAlbumAndTrackNumber);
                    }
                    
                }
                //console.log(['set results loaded  real alb',collated,artists,artistsIndex]); 
                // assign collated results
                for (let gbk in collated) {
                    //let artist = artists[artistsIndex[gbk]];
                    //console.log(['SET',gbk,artists[artistsIndex[gbk]],'albumTracks   ',collated[gbk]]);
                    artists[artistsIndex[gbk]].albumTracks = collated[gbk];
                }
                 //.sort(that.sortTracksByAlbumAndTrackNumber);
                //if (!searchResults[key].hasOwnProperty('matchingAlbums')) {
                    //searchResults[key].matchingAlbums=[];
                //}
                //searchResults[key].matchingAlbums.push(album);
                that.props.setSearchResults('local',artists);
                //that.props.setArtists(artists);
               // let keya = (key > 0) ? key -1 : 0;
        
                listRef.current.resetAfterIndex(0);
                that.props.stopWaiting();
            })             
         }
         return false;
    };
    
    
    //toggleCollapse(e) {
        //console.log('TOGGLE COLLAPSE');
        //console.log(e);
        //console.log(this);
    //};
    
    
    toggleExpandedArtist(artistId,index) {
       // console.log(['toggle',artistId,index,this.listRef]);
        this.props.toggleExpandedArtist(artistId,index)
        if (listRef && listRef.current) {
            //console.log('TOGGLE RESET');
            listRef.current.resetAfterIndex(index);
        }
    };

     //toggleExpandedAlbum(artistId,album,index) {
        //console.log(['toggle alb',artistId,album]);
        ////this.props.toggleExpandedArtist(artistId,index)
        ////if (listRef && listRef.current) {
         //////   console.log('TOGGLE RESET');
            ////listRef.current.resetAfterIndex(index);
        ////}
    //};

    //renderRow({
      //key,         // Unique key within array of rows
      //index,       // Index of row within collection
      //isScrolling, // The List is currently being scrolled
      //isVisible,   // This row is visible within the List (eg it is not an overscanned row)
      //style        // Style object to be applied to row (to position it)
    //}) {
    
    //setSearchFilterTag(e,tag) {
        //e.preventDefault();
        //this.props.setSearchFilterTag(tag);
    //};
    
    renderItems(items,albumKey,showArtist=false) {
        let that = this;
        if (items) {
            return items.map((item,key) => {
               // console.log(['item',key,item]);
                //console.log(item);
                //console.log(key);
                let artist='';
                if (showArtist && item.artist) artist=<b>{item.artist}</b>;
                if (item) {
                    let oddEvenInner = key%2 ? 'oddinner' : 'eveninner';
                    if (!albumKey || albumKey === item.albumKey) {
                                            
                        let trackNumber='';
                        if (item.trackNumber) {
                            let trackNumberParts = item.trackNumber.split("/");
                            if (parseInt(trackNumberParts[0],10) > 0) {
                                trackNumber = trackNumberParts[0] + ". ";
                            }                    
                        }
                        //<span  style={{float:'right',clear:'both'}}>
                            //<button className='btn'  onClick={() => that.props.enqueueTrack(item,that.props.currentPlaylist)}  ><AddButton/><span className="d-none d-md-inline"> Add</span></button>&nbsp;
                            
                            //<button className='btn' onClick={() => that.props.playTrack(item,that.props.currentPlaylist)}  ><PlayButton/><span className="d-none d-md-inline"> Play</span></button>&nbsp;
                        //</span>
                        return <div style={{width: '100%',minHeight:'3em'}}  onClick={() => that.props.playTrack(item,that.props.currentPlaylist)} className={oddEvenInner} key={item._id} >
                        
                            <span style={{width:'70%',marginRight:'1em'}} href="#" ><b>{trackNumber}</b> {item.title}&nbsp;<span><b>({item.collection})</b></span><br/>{artist}</span>
                            </div>
 
                    } else {
                        return null;
                    }
                    
                }
                return null;
             })
            
        } else {
            return null; 
        }
        //console.log(['sINGLE RENder',items]);
        
    };
    
     
    //setFilterTagOnClick(tag) {
        //this.props.setSearchFilterTag(tag);
        //this.props.setSearchFilter('');
    //}
    
    //setFilterOnClick(filter) {
        //this.props.setSearchFilter(filter);
        //this.props.setSearchFilterTag('');
    //}
    
   
renderRow(index,style) {
	let that = this;
	let artist = this.props.searchResults && this.props.searchResults.local && this.props.searchResults.local[index] ? this.props.searchResults.local[index] : null; 
	console.log(['RENDER LIB ROW',artist,index,(this.props.searchResults ? this.props.searchResults.local: 'no local results')]);
	if (artist && artist.html) {
		//  console.log(['HTML OUT ROW',style]);
		return <div style={style} key={{index}}>{artist.html}</div>
	} else {
		//let artist = this.props.artists[index];
		//console.log(['RENDERROWQ',artist]);
		//return <div>row</div>
		let finalAlbums=[];
		let key = new ObjectId().toString();
		//let keyName='artist-'+key;
		let keyNameChildren='artist-'+key+'-children';
		let hashKeyNameChildren='#artist-'+key+'-children';
		//let keyNameParent='artist-'+key+'-parent';
		// let hashKeyNameParent='#artist-'+key+'-parent';  
		// render tags
		let tagsRendered=[];
		let oddEven = index%2 ? 'odd' : 'even';
		let indexA=0;
		if (artist) {
			if (artist.matchingAlbums) {
				for (let akey in artist.matchingAlbums) {
					let album = artist.matchingAlbums[akey];
					//console.log(['ROW',akey,artist.matchingAlbums]);
					//if (!artist.matchingAlbums || artist.matchingAlbums.indexOf(akey) !== -1) {
					let iskey = "sk"+akey+album+Math.random(5);

					let albumHashKeyNameChildren='#artist-'+key+'-children-'+akey;
					let albumKeyNameChildren='artist-'+key+'-children-'+akey;
					let tracks = (artist.albumTracks && artist.albumTracks.hasOwnProperty(akey)) ? artist.albumTracks[akey] : [];

					let renderedTags=null;
					if (artist.genres) {
						//console.log(['RENGENRES',artist.genres]);
						if (artist.genres.hasOwnProperty(akey)) {
							renderedTags=Object.keys(artist.genres[akey]).map(function(tagName) {
								let nKey = iskey + tagName;
								let tagLinkTo = that.props.getSearchUrl({searchFilterTag:tagName,searchFilterArtist:'',searchFilterAlbum:'',searchFilter:''},true);
								return <Link key={nKey} to={tagLinkTo} style={{float:'right'}} >&nbsp;<button style={{fontSize:'0.7em'}}  className='btn'  ><Music size={12}/>&nbsp;{tagName}</button></Link>
							});                                
						}

					}
					// console.log(['GSU',this.props.getSearchUrl,that.props.getSearchUrl])
					let linkTo = this.props.getSearchUrl({searchFilterTag:'',searchFilter:'',searchFilterArtist:artist.title,searchFilterAlbum:akey},true);
					//"url('/albumart?artist="+"greylarsonpaddyleague"+"&album="+"greylarsonpaddyleaguedarkofthemoon"+")"
					let bgImage = "url('"+that.props.apiUrl+"/albumart?artist="+encodeURI(artist.title)+"&album="+encodeURI(akey)+"')"
					//http://localhost:7001/albumart?artist=greylarsonpaddyleague&album=greylarsonpaddyleaguedarkofthemoon
					let imageSize = ((tracks.length + 1) * 2.2) + 'em';
					let albumArtStyle = {backgroundImage:bgImage, position:'absolute',opacity:'0.6',backgroundRepeat: 'no-repeat',backgroundSize: '100% 100%', right: '20px', top:'65px',width: imageSize,height: imageSize,maxWidth:'40%',backgroundPosition:'right',zIndex:0};
					let ikey = "k"+akey+album+Math.random(5);
					//if (!artist.matchingAlbums || artist.matchingAlbums.indexOf(akey) !== -1) {

					// eslint-disable-next-line
					finalAlbums.push(<div style={{backgroundColor:'white',width:'100%',position:'relative'}} key={album} className='list-group-item'  >

					{tracks && tracks.length > 0 && <div style={albumArtStyle}></div>}

					<span style={{float:'right'}}>
					<button onClick={(e) => that.playAlbum(artist.title,akey)}  className='btn' style={{marginTop:'-0.4em', marginLeft:'0.2em'}}>
					<PlayButton/><span className="d-none d-md-inline"> Play</span>
					</button>
					</span>

					<span style={{float:'right'}}>
					<button onClick={(e) => that.addAlbum(artist.title,akey)}  className='btn' style={{marginTop:'-0.4em', marginLeft:'0.2em'}}>
					<AddButton/><span className="d-none d-md-inline"> Add</span>
					</button>
					</span>

					<div  style={{width: '70%',fontSize:'1.1em',fontWeight:'bold'}}  >
					<button disdata-toggle="collapse" data-target={albumHashKeyNameChildren} onClick={(e) =>that.toggleAlbumTracks(e,indexA,artist.title,akey)} style={{float:'left',display:'inline'}} ><OpenCloseButton size='30' /></button><Link to={linkTo} key={ikey}     
					>&nbsp;&nbsp;{(album && album.length > 0) ? album : 'Unknown Album' }</Link>
					&nbsp;&nbsp;&nbsp;{renderedTags}
					</div>
					<div id={albumKeyNameChildren}  >
					<br/>
					{this.renderItems(tracks,akey)}
					</div>
					</div>);    

					//}
					//}
					indexA++;


				}
			}
			
			if (artist.genre && artist.genre.length > 0) {
				//console.log('artist.genre');
				//console.log(artist.genre);
				for (let k in artist.genre) {
					let artistTags=artist.genre[k];
					let aParts = artistTags.split(",");
					for (let tag in aParts) {
					//console.log([tag,aParts[tag]]);
						//if (!Array.isArray(tagsRendered[artist.title])) tagsRendered[artist.title]=[]
						let key=artist.title+"-"+aParts[tag];
						let linkTo=this.props.getSearchUrl({searchFilterTag:tag},true);  // tag/"+aParts[tag];
						let tagRendered=<Link to={linkTo} key={key} ><button  className='btn' style={{marginLeft:'0.5em'}} >{aParts[tag]}&nbsp;<Music/></button></Link>
						tagsRendered.push(tagRendered);
					}
				//tags[i] = Array.from(new Set(tags[i]))   
				}                    
			}
			//console.log('tagsRendered');
			//console.log(tagsRendered);
			//this.props.isArtistExpanded(artist.title) && 
			//} else {
			//return [];
			//}


			let collapseClass="tracks list-group";
			let linkToMain = this.props.getSearchUrl({searchFilterTag:'',searchFilterAlbum:'',searchFilter:'',searchFilterArtist: encodeURI(artist.title) });
			let akey  = artist ? "k"+artist.title : '';
			//if (this.props.isArtistExpanded(artist._id)) collapseClass="tracks list-group"
			return (<div className={oddEven} style={Object.assign({ border: '1px solid black'},style)}  key={key}  >
			{true && 

			<div style={{position:'relative', width: "100%"}}>

			<span style={{float:'right'}}>
			<button onClick={(e) => that.playArtist(artist.title)}   className='btn' style={{marginLeft:'0.2em'}}>
			<PlayButton/><span className="d-none d-md-inline" > Play</span>
			</button>
			</span>

			<span style={{float:'right'}}>
			<button onClick={(e) => that.addArtist(artist.title)}  className='btn' style={{marginLeft:'0.2em'}}>
			<AddButton/><span className="d-none d-md-inline" > Add</span>
			</button>
			</span>

			{artist.matchingAlbums && Object.keys(artist.matchingAlbums).length > 0 && <div style={{ width: '80%',textAlign:'left'}} ><button  data-toggle="collapse" data-target={hashKeyNameChildren} onClick={(e) =>that.toggleExpandedArtist(artist.title,index)} style={{float:'left',display:'inline'}} ><OpenCloseButton size='30' /></button><span className="d-none d-md-inline" >&nbsp;&nbsp;</span><span style={{marginLeft:'0.2em'}}><b style={{fontSize:'1.2em'}}>&nbsp;<Link to={linkToMain} key={akey}  >{artist.originalTitle}</Link></b>  <br/> {tagsRendered}</span></div>}



			{this.props.isArtistExpanded(artist.title) && <div  id={keyNameChildren} style={{textAlign:'left',width:'100%', zIndex:1500,'backgroundColor':'white'}} className={collapseClass} >    
			{finalAlbums} 
			</div>}


			</div>

			}
			</div>);

		} else {
			return 'empty row';
		}

	} 
}
   //{(!artist.albums || Object.keys(artist.albums).length === 0) && <div style={{ width: '80%',textAlign:'left'}} ><span className='d-none d-md-inline' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style={{marginLeft:'0.2em', textAlign:'left'}}><b style={{fontSize:'1.2em'}}>{artist.originalTitle}</b> <br/>  {tagsRendered}</span></div>}
                            
    _noRowsRenderer(styles) {
        return <div >No artists</div>;
    }
    
    _getRowHeight(index) {
        const single=70;
        let height = single;
        if ( this.props.searchResults && this.props.searchResults.local) {
			//console.log('GRH',index,this.props.artists);
			 let artist =this.props.searchResults.local[index] ? this.props.searchResults.local[index] : null; 
			//return 300;
			if (artist) {
				if (this.props.isArtistExpanded(artist.title)) {
					//console.log(['expanded',height]);
					//return 300;
					//console.log(this.props.artists[index]);
					if (this.props.artists && this.props.artists.hasOwnProperty(index)) {
						//console.log(['art jas omdex',index]);
						if (this.props.artists[index].matchingAlbums && Object.keys(this.props.artists[index].matchingAlbums).length > 0) {
							//console.log(['album offset',Object.keys(this.props.artists[index].albums).length]);
							height += (Object.keys(this.props.artists[index].matchingAlbums).length) * (single);
						}
						if (this.props.artists[index].albumTracks) {
							let sum=0;
							for (let ti in this.props.artists[index].albumTracks) {
								let album = this.props.artists[index].albumTracks[ti];
								if (Array.isArray(album)) {
									sum += album.length;
								}
							}
							//console.log(['track offset',this.props.artists[index].albumTracks]);
							height += sum * (single*0.7);
						}
							//let a = (this.props.artists[index].matchingAlbums.length + 1) * (single) + ;
							//console.log(['GETROWH',a]);
							//return a;
						//} else {
							//let a =(Object.keys(this.props.artists[index].albums).length + 1) * (single);
							//console.log(['GETROWHb',a]);
							//return a;
						//}
					}
				}
			}
			let spacer = (index  >= this.props.searchResults.local.length - 1 ) ? 400 : 0
					
			//console.log(['height',height]);
			return height +  spacer;
		} else {
			
			return 400;
		}
    }

    onScroll({scrollDirection,scrollOffset,scrollUpdateWasRequested}) {
        	this.props.onScroll(scrollDirection,scrollOffset,listRef);
		 //console.log(['onscroll',scrollDirection,scrollOffset,scrollUpdateWasRequested,this.props.searchResultsScrollToIndex.artists,parseInt(scrollOffset,10),parseInt(this.props.searchResultsScrollToIndex.artists ? this.props.searchResultsScrollToIndex.artists : 1,10)]);
        //if (scrollOffset > 10 && scrollDirection === 'forward') {
			//let offset = parseInt(this.props.searchResultsScrollToIndex.artists ? this.props.searchResultsScrollToIndex.artists : 1,10) + parseInt(scrollOffset,10);
			//this.props.setSearchResultsScrollToIndex('artists',offset);
			//this.props.onScroll(scrollDirection,offset,listRef);
		//} else  if (scrollOffset > 10 && scrollDirection === 'backward') {
			//let offset = parseInt(this.props.searchResultsScrollToIndex.artists ? this.props.searchResultsScrollToIndex.artists : 1,10) - parseInt(scrollOffset,10);
			//this.props.setSearchResultsScrollToIndex('artists',offset);
			//this.props.onScroll(scrollDirection,offset,listRef);
		//}
    };

   
        

    render() {
        let that=this;
        console.log('LL LIST');
        console.log(this.props.buttons);
        let items = this.props.searchResults.local; // = this.props.artists;
       // let initOffset = 0; //this.props.searchResultsScrollToIndex && this.props.searchResultsScrollToIndex.artists > 0 ? this.props.searchResultsScrollToIndex.artists : 0;
       // console.log(['artists ren',items,this.props.buttons]);
        
        //let paddingTop='3.8em';
        ////if (this.props.hideHeader) paddingTop='0em';
        ////if (artists ) {
          //return JSON.stringify(artists);   
        //} else {
            //return <b>empty</b>
        //}
        //
        let height = this.props.height*0.9;
        if (Utils.isMobile()) height = height * 1.8;
        //if (!Array.isArray(items)) items = [];
        console.log(['SHOULD SHOW BUTTONS',this.props.buttons,items])
        if (!Array.isArray(items) || items.length === 0) {
            items=[];
            console.log(['no tracks push buttons',this.props.buttons]);
            items.unshift({html:this.props.buttons});   
            items.unshift({html:<b>&nbsp;</b>});
           //items.push({html:<b>&nbsp;</b>,height:200});      
        } else if ((items && items.length > 0 && !items[0].html)) {
            console.log(['have tracks push buttons',this.props.buttons]);
            items.unshift({html:this.props.buttons});   
            items.unshift({html:<b>&nbsp;</b>});   
            //items.push({html:<b>&nbsp;</b>,height:200});   
            //items.unshift({html:<b>&nbsp;</b>});   
            //items.unshift({html:<b>&nbsp;</b>});   
            
        } 
        if (items && items.length > 2) { // allow for html elements
            //let paddingTop=Utils.isMobile() ? '5em' : '3em';
            //if (this.props.hideHeader) paddingTop='0em'; 
            //style={{paddingTop:paddingTop}}
            return   <div>
                <List
                  style={{position:'fixed',top:'0px',left:'0px'}}
                  ref={listRef}
                  height={height}
                  itemCount={items.length}
                  itemSize={this._getRowHeight}
                  width={'100%'}
                  onScroll={this.onScroll}
                >
                  {({ index, style }) => {return that.renderRow(index,style)}}
                </List>
            </div>
          //     initialScrollOffset={initOffset}
             
             //return JSON.stringify(artists);   
        }
         else {
            //return <div></div>
            return <div><br/><br/><br/><br/>{this.props.buttons}<div className='nomatch'>No matches</div></div>
        }
        
        
        
       // if (artists && artists.length > 0 && !this.props.hideSearchResults) {
            //let finalList = this.props.artists.map(function(artist,bkey) {
            //this.props.artists.length
            // console.log(['ARTISTS',index,this.props.artists]);
                           
            //return <AutoSizer disableHeight  idstamp={JSON.stringify(that.props.expandedArtists)} >
                    //{({width}) => (
                        //<List
                        //ref={this.listRef}
                        //width={width}
                        //height={400}
                        //rowCount={that.props.artists.length}
                        //rowHeight={that._getRowHeight}
                        //rowRenderer={that.renderRow}
                        //noRowsRenderer={that._noRowsRenderer}
                        //dscrollToIndex={that.props.searchResultsScrollToIndex}
                        ///>
                    //)}
                    //</AutoSizer>
         
          
         //if (artists ) {
           
        //} else {
            //return <div>noe</div>;
        //}
            ////<div className="songs list-group" style={{textAlign:'left',width:'100%'}}>
                  //{
                    //finalList
                  //}
                
              //</div>
        //} else {
            //return <div></div>;
        //}
    };
}


  
       //idstamp={JSON.stringify(that.props.expandedArtists)} 
                                             
                            


          //let artist = this.props.artists[index];
                        //console.log(['RENDER',index,this.props.artists.hasOwnProperty(index) ? this.props.artists[index]] : 'none');
                        
                        
                    //}
                 
