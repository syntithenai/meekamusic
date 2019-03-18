import React, { Component } from 'react';
import PlayControls from './PlayControls'
import Playlists from './Playlists'
import Playlist from './Playlist'
import Stats from './Stats'
import Tags from './Tags'
import Search from './Search'
import Menu from './Menu'
import Help from './Help'
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { Media, Player } from 'react-media-player'
//, controls,utils
//import { withMediaProps } from 'react-media-player'
import PropsRoute from './PropsRoute'
import MeekaModelManager from './MeekaModelManager'

import YoutubeSearcher from './YoutubeSearcher'
import FmaSearcher from './FmaSearcher'
import JamendoSearcher from './JamendoSearcher'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//const {
  //PlayPause,
  //CurrentTime,
  //Progress,
  //SeekBar,
  //Duration,
  //MuteUnmute,
  //Volume,
  //Fullscreen,
//} = controls
//const { keyboardControls } = utils;

//withMediaProps(


export default class MeekaPlayer extends Component {
    constructor(props) {
        super(props);
        //console.log(props);
        this._player = React.createRef();
        this.failCount = 0;
        
        //this._audio = React.createRef();
        // ??? INITIALISE INTERNALLY IF NOT PROVIDED EXTERNALLY
        //if (!this.props.playlists || this.props.playlists.length == 0) this.props.playlists=[{title: 'default',items:[]}];
        //if (!this.props.isPlaying) this.props.isPlaying=false;
        //if (!this.props.playMode) this.props.playMode='repeat';
        //if (!this.props.viewMode) this.props.viewMode='playlist';
        //if (!window.isNan(this.props.currentPlaylist)) this.props.currentPlaylist=0;
        //if (!window.isNan(this.props.currentSong)) this.props.currentSong=0;
        //this.playSong=this.playSong.bind(this);
        //this.props
        this.state={
            viewMode: 'search',
            playMode: 'repeat',
            isPlaying: false,
            currentPlaylist:0,
            currentTrack:0,
            playlists:[], //'[{_id:'default',title:"default",items:[],currentTrack:0}], //{_id:'default',title:"default",items:[]}],
            searchFilter:'',
            searchFilterTag:'',
            searchResults:{},
            artists:[],
            expandedArtists:{},
            showingPlayControls:true,
            searchResultsScrollToIndex:{},
            tags : {},
            renderedTags:null,
            errorCount:0
        };
        // bind model manipulation function in from model manager
        this.functions={};
        for (let key in MeekaModelManager) {
            this.functions[key]=MeekaModelManager[key].bind(this);
        }
        this.functions.stopWaiting = this.props.stopWaiting.bind(this);
        this.functions.startWaiting = this.props.startWaiting.bind(this);
        //this.functions.loadMeekaFromLocalStorage();
    
    }

    componentDidMount() {
       // console.log('MOUNT MEEKAPLAYER');
       // console.log([this._player]);
        //this.props.setPlayer(this._player);
       // let that = this;
        this.functions.filterTags();
        //this.functions.loadPlaylists();
        //this.functions.setSearchFilter(this.props.searchFilter+' ');
        //this.functions.loadMeekaFromLocalStorage();
        //let userName = this.props.user && this.props.user.hasOwnProperty('username') ? this.props.user.username : null;
        //if (!this.state.artists || this.state.artists.length == 0) {
            //console.log('LOADING artists');
            //this.props.fetchData(this.props.apiUrl+'/artists')
            //.then(function(response) {
                //return response.json()
            //}).then(function(json) {
                //console.log(['LOADED artists',json]);
                //that.functions.setArtists(json);
                ////that.props.setSearchResults('local',JSON.parse(JSON.stringify(json)));
            //}).catch(function(ex) {
                //console.log(['artists load failed', ex])
            //})
          //} 
    };
    
    componentDidUpdate(oldProps) {
        //this.props
        let that = this
         //console.log('UPDATE MEEKAPLAYER',this.props,oldProps,this.props.user,oldProps.user);
         let userName = this.props.user && this.props.user.hasOwnProperty('username') ? this.props.user.username : null;
         let oldUserName = oldProps.user && oldProps.user.hasOwnProperty('username') ? oldProps.user.username : null;
         if (userName !== oldUserName ) {
             this.setState({expandedArtists:(this.props.user && this.props.user.expandedArtists ? this.props.user.expandedArtists : {})});
            // console.log('CHANGE USER ON UPDATE MEEKAPLAYER',JSON.stringify(this.props.user));
             //this.functions.loadMeekaFromLocalStorage();
             //if (userName && userName.length > 0) 
             this.functions.loadPlaylists().then(function(playlists) {
                 if (that.props.user && that.props.user.playlistId && that.props.user.playlistId.length > 0) {
                     let currentPlaylistKey = that.functions.getPlaylistById(that.props.user.playlistId);
                   //  let currentPlaylist = that.state.playlists[currentPlaylistKey]
                     that.functions.setPlaylist(currentPlaylistKey);
                     //that.functions.selectTrack((currentPlaylist.currentTrack ? currentPlaylist.currentTrack : 0),currentPlaylistKey);
                     if (that.props.user.isPlaying) {
                         that.functions.play();
                         that.setState({isPlaying:true});
                     }
                 }
             });
             
        
         }
    };
   
   
    render() {
        //console.log('MEEKA PLAYER');
         //console.log('this._player');
         //if (this.props._player) {
             //console.log(this.props._player);
            //console.log(this.props._player.state);
         //}
         
       
        //console.log(this._audio);
        // only show play controls if I have songs in the current playlist
        let options = Object.assign(this.functions,this.state);
        options.height = this.props.height;
        options.width = this.props.width;
        options.isLoggedIn = this.props.isLoggedIn;
        options.user = this.props.user;
        options.onScroll = this.props.onScroll;
        options.hideHeader = this.props.hideHeader;
        options.apiUrl = this.props.apiUrl;
        //console.log(options);
       // let playControls=null;
        //if (this.props.currentPlaylist >= 0 && this.props.playlists.length > this.props.currentPlaylist && this.props.playlists[this.props.currentPlaylist].items.length > 0) {
            //playControls=<PlayControls {...this.props}  />
        //}
        let currentUrl=null;
        let currentTrack=options.getCurrentTrack();
        if (currentTrack && currentTrack.url) {
            currentUrl = currentTrack.url;
        } 
        let trackType='audio';
        if (currentTrack && currentTrack.type) {
            trackType = currentTrack.type;
        } 
        
        let wrapperTag="media-wrapper media-wrapper-"+trackType;
        let autoPlay="";
        if (this.state.isPlaying) autoPlay="yes"
        //console.log('CURRENT  UR'+currentUrl);
        //let props=this.props;
        //let md = this.props._player ? "MED::"+JSON.stringify(this.props._player.state): 'no media';
        let playerStyle={height:'100%',width:'100%'};
        //<span>{md}</span>
        //console.log(this.props.showPlayControls);
        
        
        
        //const playerBlockTemplate = withMediaProps(function(props) {
           //return <div className={wrapperTag} onClick={options.showPlayControls} style={{visibility:props.media.isPlaying?'visible':'hidden'}} >
                    //<Player style={{height:'100%',width:'100%'}} height="800px" src={currentUrl} autoPlay={autoPlay} className="media-player" onPlay={options.onPlay} onPause={this.onPause} onError={options.onError} onEnded={options.onEnded} onStalled={this.onStalled} onProgress={this.onProgress} onTimeUpdate={options.onTimeUpdate} style={playerStyle} />
                //</div>;
        //});
        //let playerBlock = [new playerBlockTemplate()];
        
        
       
        
        //let playerBlock = 
        return <div style={{width:'100%'}}>
            <PropsRoute {...options} path="/meeka/playlists" component={Playlists} />
            <PropsRoute exact={true} {...options} path="/meeka/playlist/:id" component={Playlist}/>
            <PropsRoute exact={true} {...options} path="/meeka/playlist" component={Playlist}/>
            <PropsRoute {...options} path="/meeka/stats" component={Stats}/>
            <PropsRoute {...options} path="/meeka/tags" component={Tags}/>
            <PropsRoute {...options} path="/meeka/search" component={Search} />
            <PropsRoute {...options} path="/meeka/favorites" component={Search} />
            <PropsRoute {...options} path="/meeka/history" component={Search} />
            <PropsRoute {...options} path="/meeka/fresh" component={Search} />
            <PropsRoute {...options} path="/meeka/youtube" component={YoutubeSearcher} />
            <PropsRoute {...options} path="/meeka/fma" component={FmaSearcher} />
            <PropsRoute {...options} path="/meeka/jamendo" component={JamendoSearcher} />
            <PropsRoute {...options} path="/meeka/menu"  isLoggedIn={this.props.isLoggedIn} component={Menu}/>
            <PropsRoute {...options} path="/meeka/help" component={Help}/>
            <Media ref={this._player} >
                { mediaProps => <div>
                {!this.props.hideFooter && options.showingPlayControls && <PropsRoute {...options}   path="/"  component={PlayControls}  />}
                {currentUrl &&  <div className={wrapperTag} onClick={options.showPlayControls} style={{visibility:mediaProps.isPlaying?'visible':'hidden'}} >
                    <Player  height="800px" src={currentUrl} autoPlay={autoPlay} className="media-player" onPlay={options.onPlay} onPause={this.onPause} onError={options.onError} onEnded={options.onEnded} onStalled={this.onStalled} onProgress={this.onProgress} onTimeUpdate={options.onTimeUpdate} style={playerStyle} />
                </div>}
                </div> }
           </Media>
           
        
        </div>
    };
}
//            <PropsRoute {...this.props} path="/meeka/youtube" component={YouTubeSearch}/>

//{mediaProps => (
          //<div
            //className="media"
            //onKeyDown={keyboardControls.bind(null, mediaProps)}
          //>
          //</div>
        //)}

//<audio src={currentUrl} autoPlay={autoPlay} ref={this._audio} />
//<button onClick={this.playSong} >PME</button>
           
//<Player src={currentUrl} autoPlay={autoPlay} className="media-player" />
            //<div className="media-controls">
              //<PlayPause />
              //<CurrentTime />
              
              //<Fullscreen />
            //</div>




