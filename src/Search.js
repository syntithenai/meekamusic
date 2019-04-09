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
import {debounce} from 'throttle-debounce';


export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state={};
        this.searchFilterChange = debounce(500,this.searchFilterChange.bind(this));
//        this.searchFilterChange = this.searchFilterChange.bind(this);
        this.getSearchUrl = this.getSearchUrl.bind(this)
    };
    
    //shouldComponentUpdate(props) {
		//return false;
	//}
   
    getSearchUrl(props,mode) { //,override,force,mode) {
		let parts = [];
		let filterProps = Object.assign({},{searchFilter:this.props.match.params.search,searchFilterTag:this.props.match.params.tag,searchFilterArtist:this.props.match.params.artist,searchFilterAlbum:this.props.match.params.album},props);
	//	console.log(['GETSEARCHURL',props,this.props.match.params,mode,filterProps])
		if (filterProps.searchFilterArtist && filterProps.searchFilterArtist.length > 0) {
			parts.push('artist')
			parts.push(filterProps.searchFilterArtist) 
			if (filterProps.searchFilterAlbum && filterProps.searchFilterAlbum.length > 0) {
				parts.push('album')
				parts.push(filterProps.searchFilterAlbum) 
			}
		}
		if (filterProps.searchFilterTag && filterProps.searchFilterTag.length > 0) {
			parts.push('tag')
			parts.push(filterProps.searchFilterTag)
		}
		if (filterProps.searchFilter && filterProps.searchFilter.length > 0) {
			parts.push(filterProps.searchFilter)
		}
		//console.log(['getsearchurl',this.props,parts,filterProps.searchFilterArtist,filterProps.searchFilterAlbum,filterProps.searchFilterTag,filterProps.searchFilter]);
		let pathString = this.props.match.path.replace('http://','').replace('https://','')
		if (pathString.startsWith('/')) {
			pathString = pathString.slice(1);
		}
		let pathParts = pathString.split("/");
		//console.log(['getsearchurlR',pathString,pathParts]);
		let a = pathParts.length > 0 ? pathParts[0] + '/' : '';
		let b = mode && mode.length > 0 ? mode+ '/' : (pathParts.length > 1 ? pathParts[1] + '/': '');
	//	console.log(['GETSEARCHURL','/' + a + b + encodeURI(parts.join("/"))]);
		return  '/' + a + b + encodeURI(parts.join("/"));
	}
    
    searchFilterChange(val) {
        // eslint-disable-next-line
        var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        //this.setState({searchFilter:filter.replace(punctRE, " ")}); 
        let a = val.replace(punctRE, " ")
        //this.props.setSearchFilter(a);
        //let queryParts=this.extractQueryParts();
        //let tag = queryParts.searchFilterTag && queryParts.searchFilterTag.length > 0 ? "tag/"+queryParts.searchFilterTag + "/" : '';
        //this.props.history.push("/meeka/search/"+tag+val.replace(punctRE, " "));
        console.log(this.getSearchUrl({searchFilter:a}));
        
        this.props.history.push(this.getSearchUrl({searchFilter:a})); //"/"+tag+encodeURI(val.replace(punctRE, " ")));
    };
            
    render() {
       console.log(['SEARCH RENDER']);
        //let searchLink = this.getSearchUrl() + "/";
        //if (this.props.searchFilterTag && this.props.searchFilterTag.length > 0) {
            //searchLink += "/tag/" + this.props.searchFilterTag;
        //}
        //if (this.props.searchFilter && this.props.searchFilter.length > 0) {
            //searchLink += "/" + this.props.searchFilter;
        //}
        //console.log(this.props);
        //let debugvals = JSON.stringify([this.props.searchFilter,this.props.searchFilterTag]);
        
        let props = Object.assign({},{getSearchUrl:this.getSearchUrl,enqueueTrack:this.props.addTrack,playTrack:this.props.startPlayTrack},this.props);
        let size=20;
       // let buttonStyle={marginLeft:'0.2em',float:'right',marginTop:'0.4em'};
        //let tag = this.props.location.pathname.replace(this.props.path,"");
        let tagButton = this.props.match.params.tag && this.props.match.params.tag.length > 0 ? <Link to={this.getSearchUrl({searchFilterTag:''})} ><button onClick={this.clearSearchFilterTag} className='btn'>{this.props.match.params.tag} <DeleteButton/></button></Link> : '' ;
        let artistButton = this.props.match.params.artist && this.props.match.params.artist.length > 0 ? <Link to={this.getSearchUrl({searchFilterArtist:'',searchFilterAlbum:''})} ><button  className='btn'>{this.props.match.params.artist} <DeleteButton/></button></Link>  : '';
		let albumButton = this.props.match.params.album && this.props.match.params.album.length > 0 ? <Link to={this.getSearchUrl({searchFilterAlbum:''})}><button  className='btn'>{this.props.match.params.album} <DeleteButton/></button></Link>  : '';

        
        // extract current view from path to determine button outline
        let matchParts = this.props.match.path.split("/");
        let style = {};
        if (matchParts.length > 1) style[matchParts[1]] = {borderBottom:"2px solid blue"};
        let inputsize=20;
        if (Utils.isMobile()) {
            inputsize=8;
        }
        let buttons = [];
        if (true || !this.props.hideHeader) {
            buttons =<div style={{zIndex:10,width:'100%',position:'fixed',top:60,left:0}}>
                    <span style={{float:'left',textAlign:'left'}}>
                    <form  style={{width:'100%',backgroundColor:'lightgrey'}} onSubmit={(e) => { e.preventDefault() ; return false}}>
                    
                    {this.props.isLoggedIn() && <span><Link style={{marginLeft:'0px',paddingLeft:'0px',textAlign:'left'}} to={this.getSearchUrl({},'search')}  ><button style={style.search} className='btn'><PlaylistButton size={size} /><span className="d-none d-md-inline"> All</span></button></Link>&nbsp;<Link style={{textAlign:'left'}} to={this.getSearchUrl({},'favorites')}  ><button  style={style.favorites} className='btn'><FavoritesButton   size={size} /><span className="d-none d-md-inline"> Favorites</span></button></Link> <Link style={{textAlign:'left'}} to={this.getSearchUrl({},'history')}  ><button  style={style.history}  className='btn'><HistoryButton size={size} /><span className="d-none d-md-inline"> History</span></button></Link> &nbsp;
                    <Link style={{marginLeft:'0px',paddingLeft:'0px',textAlign:'left'}} to={this.getSearchUrl({},'fresh')}  ><button  style={style.fresh}  className='btn'><FreshButton size={size} /><span className="d-none d-md-inline"> Fresh</span></button></Link>&nbsp;</span>}
                    

                    
                    <span style={{textAlign:'left'}}>
                    <SearchButton size={20} className="d-none d-md-inline" style={{marginTop:'0.4em',marginBottom:'0.4em',marginLeft:'0.4em'}}/>&nbsp;
                    <AutoFocusTextInput  value={this.props.match.params.search ? this.props.match.params.search : ''} setValue={this.searchFilterChange} setclassName="form-control" type="text"  size={inputsize}  placeholder="Search" aria-label="Search" />
                    &nbsp;{tagButton}  &nbsp;{artistButton}  &nbsp;{albumButton}
                    </span>
                    </form>
                    
                    </span>
                
                    
                </div>
        } 
                
        
        return <div className='search' style={{width:'100%'}}>
                <div style={{width:'100%', clear:'both'}}>
             		<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/:search" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/tag/:tag" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/tag/:tag/:search" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/:search" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/album/:album" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/album/:album/:search" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/album/:album/tag/:tag" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/album/:album/tag/:tag/:search" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/tag/:tag" component={LibrarySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/search/artist/:artist/tag/:tag/:search" component={LibrarySearch} />



					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/:search" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/tag/:tag" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/tag/:tag/:search" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/artist/:artist" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/artist/:artist/:search" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/artist/:artist/album/:album" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/artist/:artist/album/:album/:search" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/artist/:artist/album/:album/tag/:tag" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="favorites" path="/meeka/favorites/artist/:artist/album/:album/tag/:tag/:search" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/favorites/artist/:artist/tag/:tag" component={FavoritesSearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/favorites/artist/:artist/tag/:tag/:search" component={FavoritesSearch} />


					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/:search" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/tag/:tag" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/tag/:tag/:search" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/artist/:artist" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/artist/:artist/:search" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/artist/:artist/album/:album" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/artist/:artist/album/:album/:search" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/artist/:artist/album/:album/tag/:tag" component={HistorySearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="history" path="/meeka/history/artist/:artist/album/:album/tag/:tag/:search" component={HistorySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/history/artist/:artist/tag/:tag" component={HistorySearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/history/artist/:artist/tag/:tag/:search" component={HistorySearch} />

					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/:search" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/tag/:tag" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/tag/:tag/:search" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/artist/:artist" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/artist/:artist/:search" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/artist/:artist/album/:album" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/artist/:artist/album/:album/:search" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/artist/:artist/album/:album/tag/:tag" component={FreshSearch} />
					<PropsRoute {...props} exact={true}  buttons={buttons} endPoint="fresh" path="/meeka/fresh/artist/:artist/album/:album/tag/:tag/:search" component={FreshSearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/fresh/artist/:artist/tag/:tag" component={FreshSearch} />
					<PropsRoute {...props} exact={true} buttons={buttons} endPoint="tracks" path="/meeka/fresh/artist/:artist/tag/:tag/:search" component={FreshSearch} />

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
