import React, { Component } from 'react';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

  
let listRef = React.createRef();

export default class FlatTrackList extends Component {

    constructor(props) {
        super(props);
        this.setSearchFilterTag  = this.setSearchFilterTag.bind(this);
        this.addAll  = this.addAll.bind(this);
        this.playAll  = this.playAll.bind(this);
        this.toggleExpandedArtist=this.toggleExpandedArtist.bind(this);
        this.toggleExpandedAlbum=this.toggleExpandedAlbum.bind(this);
    };

    addAll(e,items) {
        //
        items.map((item,key) => {
            // add tracks to current playlist
            return this.props.addTrack(item,this.props.currentPlaylist);
        });
        //e.preventDefault();
        //return false;
    };

    playAll(e,items) {
        //e.preventDefault();
        //this.props
        let that=this;
        // add tracks to current playlist
        this.props.startPlayTrack(items[0],this.props.currentPlaylist);
        items.slice(1).map((item,key) => {
            return that.props.addTrack(item,that.props.currentPlaylist);
        });
        //e.preventDefault();
        //return false;
    };
    
    searchTracksByTag(tag) {
        //console.log(['SEARCH TRACKS BY TAG',tag]);
       // this.props.setSearchFilterTag(tag);
    };

    setSearchFilterTag(e,tag) {
        e.preventDefault();
        this.props.setSearchFilterTag(tag);
    };

    toggleExpandedArtist(artistId,index) {
       // console.log(['toggle',artistId,index,this.listRef]);
        this.props.toggleExpandedArtist(artistId,index)
        if (listRef && listRef.current) {
         //   console.log('TOGGLE RESET');
            listRef.current.resetAfterIndex(index);
        }
    };
    
    toggleExpandedAlbum(artistId,albumId,index) {
       // console.log(['toggle',artistId,index,this.listRef]);
        this.props.toggleExpandedAlbum(artistId,albumId,index)
        if (listRef && listRef.current) {
         //   console.log('TOGGLE RESET');
            listRef.current.resetAfterIndex(index);
        }
    };

    render() {
        //console.log('flat tracklist');
      //  console.log(this.props);
        let that=this;
       // let finalItems =  this.props.items;
       // let collation={};
       // let theRest=[];
        //let artists={};
        //let albums={}
        //let tags={}
        //let sortedArtists={}
        ////let sortedAlbums={}
        //// COLLATE LIST RESULTS
        //sortedArtists = Object.keys(artists).sort(function(a,b) {
            //if (a && b &&  a.toLowerCase().trim() < b.toLowerCase().trim()) {
                //return -1;
            //} else {
                //return 1;
            //}
        //});
        
        console.log(['RENder',this.props.items]);
        // RENDER
        if (this.props.items) {
            let finalList=null
            
            function renderItems(items,showArtist=true) {
                //console.log(['sINGLE RENder',items]);
                return items.map((item,key) => {
                   // console.log(['item',key,item]);
                    //console.log(item);
                    //console.log(key);
                    let artist='';
                   // let artistName = item.artist ? item.artist : '';
                    let artistSearchLink = "/meeka/search/"+encodeURI(item.artist);
                    
                    let userId = (that.props.user && that.props.user._id && that.props.user._id.length > 0) ? that.props.user._id : false;
                    
                    if (showArtist && item.artist && item.artist.length > 0) {
                        if (userId) {
                            artist=<span> by <Link to={artistSearchLink} ><b>{item.artist}</b></Link></span>;
                        } else {
                            artist=<span> by <b>{item.artist}</b></span>;
                        }
                    }
                    
                    
                        
                    let albumName = item.album ? item.album : '';
                    let album=''
                    let albumSearchLink = "/meeka/search/"+encodeURI(item.artist + ' ' + item.album);
                    if (albumName.length > 0) {
                        if (userId) {
                            album = <span> on <Link to={albumSearchLink} ><b>{item.album}</b></Link></span>
                        } else {
                            album = <span> on <b>{item.album}</b></span>
                        }
                    }
                    if (item) {
                        
                        let renderedTags=null;
                        //if (item.genre) {
                            //renderedTags=item.genre.split(",").map(function(tagName) {
                                //return <button style={{float:'right'}}  className='btn' onClick={that.searchTracksByTag} >{tagName}</button>
                            //});
                            
                        //}
                        
                        //let albumSearchLink = "/meeka/search/";
                        return <div className='list-group-item' key={item._id} >
                            <span style={{float:'left',width:'70%',marginRight:'1em'}}  ><span style={{float:'left'}} >{item.title}</span>&nbsp;&nbsp;&nbsp;{renderedTags}<br/>{artist} {album}</span>
                            <button className='btn btn-info' style={{marginRight:'0.3em',marginLeft:'0.3em',float:'right'}} onClick={() => that.props.enqueueTrack(item,that.props.currentPlaylist)}  >Add</button>&nbsp;
                            <button className='btn btn-info' style={{float:'right'}} onClick={() => that.props.playTrack(item,that.props.currentPlaylist)}   >Play</button>
                            </div>
                        
                    } else {
                        return [];
                    }
                 })
                
            };
            finalList = renderItems(that.props.items);
            
            return (
              <div className="songs list-group" style={{textAlign:'left'}}>
                  <div className='list-group-item' key="playallbuttonkey" >
                    {this.props.title && <h3 style={{float:'left'}}>{this.props.title}</h3>}
                  </div>
                  {
                    finalList
                  }
                
              </div>
            )

        } else {
            return null
        }
    }
}
 //<span style={{float:'right'}}>
                      //<button onClick={() => that.playAll.bind(that)(this.props.items)} className='btn' style={{ width: '5em',margin:'1em'}}>
                     //Play All
                    //</button></span>
                    //<span style={{float:'right'}}>
                      //<button onClick={() => that.playAll.bind(that)(this.props.items)} className='btn' style={{ width: '5em',margin:'1em'}}>
                     //Add All
                    //</button></span>
//onScroll={this.onScroll}
                          //initialScrollOffset={this.props.searchResultsScrollToIndex.playlist}
