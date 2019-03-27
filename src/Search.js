import React, { Component } from 'react';
import AutoFocusTextInput from './AutoFocusTextInput'
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import DefaultSearch from './DefaultSearch'
import PropsRoute from './PropsRoute'
import LibrarySearch from './LibrarySearch'
//import TagSearch from './TagSearch'
//import UrlSearch from './UrlSearch'
import FavoritesSearch from './FavoritesSearch'
import FreshSearch from './FreshSearch'
import HistorySearch from './HistorySearch'
import {FaSearch as SearchButton} from 'react-icons/fa';
import {FaTimesCircle as DeleteButton} from 'react-icons/fa';

import {FaList as PlaylistButton} from 'react-icons/fa';
import {FaHistory as HistoryButton} from 'react-icons/fa';
import {FaHeart as FavoritesButton} from 'react-icons/fa';
import {FaEnvira as FreshButton} from 'react-icons/fa';
import Utils from './Utils';
//import {debounce} from 'throttle-debounce';


export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state={};
        this.playTrack = this.playTrack.bind(this);
        this.enqueueTrack = this.enqueueTrack.bind(this);
        this.clearSearchFilterTag = this.clearSearchFilterTag.bind(this);
        this.searchFilterChange = this.searchFilterChange.bind(this);
        this.extractQueryParts = this.extractQueryParts.bind(this);
        this.pushHistory = this.pushHistory.bind(this);
    };
    
    extractQueryParts() {
        let searchFilter = '';
            let searchFilterTag = '';
            let urlParts = this.props.location.pathname.split(this.props.match.path);
            let query = urlParts[urlParts.length - 1].slice(1);
            let queryParts = query.split("/");
            if (queryParts.length === 2 && queryParts[0]==='tag') {
                searchFilterTag = queryParts[1];
            } else if (queryParts.length === 3 && queryParts[0]==='tag') {
                searchFilterTag = queryParts[1];
                searchFilter = queryParts[2];
            } else {
                searchFilter = queryParts[queryParts.length - 1];
            }
            return {searchFilter:searchFilter,searchFilterTag:searchFilterTag};
    };
    
    componentDidMount() {
        // SET SEARCH FILTERS FROM URL
        console.log(['SESARCHDIDMOUNT']);
            let queryParts=this.extractQueryParts();
          //  console.log([queryParts]);
            this.props.setSearchFilter(queryParts.searchFilter);
            this.props.setSearchFilterTag(queryParts.searchFilterTag);
    }
    componentDidUpdate(props) {
        //console.log(['SESARCHDID UDPATE',props,this.props]);
            //let queryParts=this.extractQueryParts();
            //console.log([queryParts]);
            //this.props.setSearchFilter(queryParts.searchFilter);
            //this.props.setSearchFilterTag(queryParts.searchFilterTag);
    }
     
    shouldComponentUpdate(prevProps) {
        return true;
       ////console.log(['SESARCH should UDPATE??']);
            //let queryParts=this.extractQueryParts();
           //// console.log([queryParts.searchFilter,prevProps.searchFilter,this.props.searchFilter]);
            //console.log([prevProps.searchResults.local,this.props.searchResults.local]);
            //let prevLocalResults = prevProps.searchResults && prevProps.searchResults.local ? prevProps.searchResults.local  : [];
            //let currentLocalResults = this.props.searchResults && this.props.searchResults.local ? this.props.searchResults.local  : [];
            //if (this.props.searchFilter != queryParts.searchFilter || this.props.searchFilterTag != queryParts.searchFilterTag) {
                //console.log('YES change filter A');
                //return true;
            //} else if (prevProps.searchFilter != queryParts.searchFilter || prevProps.searchFilterTag != queryParts.searchFilterTag) {
                //console.log('YES change filter B');
                //return true;
            //} else if (prevProps.tags != this.props.tags) {
                //console.log('YES newtags');
                //return true;
            //} else if (prevLocalResults.length != currentLocalResults.length) {
                //console.log('YES change results');
                //return true;
            //} else {
                //console.log('NO');
                //return false;
            //}
            //this.props.setSearchFilter(searchFilter);
            //this.props.setSearchFilterTag(searchFilterTag);
    }
    
    //searchResults(results) {
        //let foundSongs = this.state.foundSoungs;
        //for (let i in results) {
            //if (results[i]._id in foundSongs)
        //}
    //};
    
        
    playTrack(track,playlist) {
        //console.log(['PLAY',track,playlist]);
        if (!playlist)  playlist=this.props.currentPlaylist;
        this.props.startPlayTrack(track,playlist);
        //this.props.history.push("/meeka/playlist");
    };
    
    enqueueTrack(track,playlist) {
       // console.log(['ENQUEUE',track,playlist]);
        if (!playlist)  playlist=this.props.currentPlaylist;
        this.props.addTrack(track,playlist);
    };
    
    clearSearchFilterTag(e) {
        e.preventDefault();
        //this.props.setSearchFilterTag('');
        let filter = this.props.searchFilter ? "/"+this.props.searchFilter  : '';
        this.props.setSearchFilterTag('');
        this.props.history.push(this.props.match.path+filter);
    };
    
    searchFilterChange(val) {
       // console.log(val);
        // eslint-disable-next-line
        var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        //this.setState({searchFilter:filter.replace(punctRE, " ")}); 
        this.props.setSearchFilter(val.replace(punctRE, " "));
        let queryParts=this.extractQueryParts();
        let tag = queryParts.searchFilterTag && queryParts.searchFilterTag.length > 0 ? "tag/"+queryParts.searchFilterTag + "/" : '';
        //this.props.history.push("/meeka/search/"+tag+val.replace(punctRE, " "));
        this.pushHistory(this.props.match.path+"/"+tag+encodeURI(val.replace(punctRE, " ")));
    };
    
    pushHistory(url) {
        this.props.history.push(url);
    };
            
    render() {
       //console.log(['SEARCH RENDER']);
        let searchLink = "";
        if (this.props.searchFilterTag && this.props.searchFilterTag.length > 0) {
            searchLink += "/tag/" + this.props.searchFilterTag;
        }
        if (this.props.searchFilter && this.props.searchFilter.length > 0) {
            searchLink += "/" + this.props.searchFilter;
        }
        //console.log(this.props);
        //let debugvals = JSON.stringify([this.props.searchFilter,this.props.searchFilterTag]);
        
        let props = Object.assign({},{enqueueTrack:this.enqueueTrack,playTrack:this.playTrack},this.props);
        let size=20;
       // let buttonStyle={marginLeft:'0.2em',float:'right',marginTop:'0.4em'};
        //let tag = this.props.location.pathname.replace(this.props.path,"");
        let tag = this.props.searchFilterTag;
        if (tag && tag.length > 0)  {
            //let isTag = false;
            //let tagParts = tag.split("/");
            //if (tagParts.length > 1) {
                //tag = tagParts[tagParts.length - 1];
                //isTag = tagParts[tagParts.length - 2] === "tag";
            //}
            //if (isTag) {
                tag = <button onClick={this.clearSearchFilterTag} className='btn'>{tag} <DeleteButton/></button>
            //} else {
                //tag = [];
            //}
            
        }
        
              
                        //<Link to="/meeka/menu"   >&nbsp;<button className='btn'  ><MenuButton  size={size}/><span className="d-none d-md-inline"> More</span></button></Link>
     //<Link style={{marginLeft:'0px',paddingLeft:'0px',textAlign:'left'}} to="/meeka/playlists"  ><button className='btn'><PlaylistButton size={size} /><span className="d-none d-md-inline"> Playlists</span></button></Link>&nbsp;
        let matchParts = this.props.match.path.split("/");
        let style = {};
        style[matchParts[matchParts.length -1]] = {borderBottom:"2px solid blue"};
        let inputsize=20;
        if (Utils.isMobile()) {
            inputsize=8;
        }
        let buttons = [];
        if (true || !this.props.hideHeader) {
            buttons =<div style={{zIndex:10,width:'100%',position:'fixed',top:60,left:0}}>
                    
                   
                    <span style={{float:'left',textAlign:'left'}}>
                    <form  style={{width:'100%',backgroundColor:'lightgrey'}} onSubmit={(e) => { e.preventDefault() ; return false}}>
                    <Link style={{marginLeft:'0px',paddingLeft:'0px',textAlign:'left'}} to={"/meeka/search"+searchLink}  ><button style={style.search} className='btn'><PlaylistButton size={size} /><span className="d-none d-md-inline"> All</span></button></Link>&nbsp;
                    
                    
                     <Link style={{textAlign:'left'}} to={"/meeka/favorites"+searchLink}  ><button  style={style.favorites} className='btn'><FavoritesButton   size={size} /><span className="d-none d-md-inline"> Favorites</span></button></Link>&nbsp;
                     
                    <Link style={{textAlign:'left'}} to={"/meeka/history"+searchLink}  ><button  style={style.history}  className='btn'><HistoryButton size={size} /><span className="d-none d-md-inline"> History</span></button></Link>
                    &nbsp;
                    
                    <Link style={{marginLeft:'0px',paddingLeft:'0px',textAlign:'left'}} to={"/meeka/fresh"+searchLink}  ><button  style={style.fresh}  className='btn'><FreshButton size={size} /><span className="d-none d-md-inline"> Fresh</span></button></Link>&nbsp;

                    
                    <span style={{textAlign:'left'}}>
                    <SearchButton size={20} className="d-none d-md-inline" style={{marginTop:'0.4em',marginBottom:'0.4em',marginLeft:'0.4em'}}/>&nbsp;
                    <AutoFocusTextInput  value={this.props.searchFilter} setValue={this.searchFilterChange} setclassName="form-control" type="text"  size={inputsize}  placeholder="Search" aria-label="Search" />
                    &nbsp;{tag}
                    </span>
                    </form>
                    
                    </span>
                
                    
                </div>
        } 
                
        
        return <div className='search' style={{width:'100%'}}>
                <div style={{width:'100%', clear:'both'}}>
                   <PropsRoute  {...props} path="/meeka/search"  buttons={buttons} endPoint="tracks" component={LibrarySearch}/>
                   <PropsRoute  {...props} path="/meeka/history" buttons={buttons} endPoint="history" component={HistorySearch}  />
                   <PropsRoute  {...props} path="/meeka/favorites" buttons={buttons} endPoint="favorites" component={FavoritesSearch}/>
                   <PropsRoute  {...props} path="/meeka/fresh" buttons={buttons} skipArtistSort={true} endPoint="fresh" component={FreshSearch} />
                    
                </div>
                
        </div>
    };
}

 //<PropsRoute  exact={true} {...props} path="/meeka/search/query/:query" component={UrlSearch} />
                    
                    //<PropsRoute exact={true} {...props} path="/meeka/search/tag" component={TagSearch}  playTrack={this.playTrack} enqueueTrack={this.enqueueTrack} defaultSearch=""/>
                    
                    //<PropsRoute  {...props} path="/meeka/search/tag/:tag" component={TagSearch}  playTrack={this.playTrack} enqueueTrack={this.enqueueTrack} defaultSearch=""/>
//<PropsRoute  {...props} path="/meeka/search/youtube" component={YouTubeSearch}  playTrack={this.playTrack} enqueueTrack={this.enqueueTrack} defaultSearch=""/>
                    
                    //<PropsRoute  {...props} path="/meeka/search/fma" component={FmaSearch}  playTrack={this.playTrack} enqueueTrack={this.enqueueTrack} defaultSearch=""/>
                    
                    //<PropsRoute  {...props} path="/meeka/search/jamendo" component={JamendoSearch}  playTrack={this.playTrack} enqueueTrack={this.enqueueTrack} defaultSearch=""/>
