import React, { Component } from 'react';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import {BrowserRouter as Router,Route} from 'react-router-dom'
//import logo from './logo.svg';
import 'whatwg-fetch'
import './App.css';
//import samplePlaylists from './sample_playlists';
//import PropsRoute from './PropsRoute'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropsRoute from './PropsRoute'
import 'whatwg-fetch'
import Header from './Header'
import MeekaPlayer from './MeekaPlayer'
import HomePage from './HomePage'
//import Utils from './Utils'
import LoginSystem from 'react-express-oauth-login-system'
import ReactResizeDetector from 'react-resize-detector';
//import {debounce} from 'throttle-debounce';


 
class App extends Component {
    
    constructor(props) {
        //console.log('MeekaModelManager');
        //console.log(MeekaModelManager);
        super(props);
        //this.assignOptions = this.assignOptions.bind(this)
        this.state={
            waiting:false,
            user:null,
            width:window.innerWidth*0.9,
            height:window.innerHeight*0.97,
            hideHeader:false
        };
        
        //console.log([loadedUser,loadedToken,this.state.user,this.state.token]);
        this.getUser = this.getUser.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        //this.setUser = this.setUser.bind(this);
        //this.setToken = this.setToken.bind(this)
        this.startWaiting = this.startWaiting.bind(this)
        this.stopWaiting = this.stopWaiting.bind(this)
        this.onLogin = this.onLogin.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.onResize = this.onResize.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.showHeaderFooter = this.showHeaderFooter.bind(this)
        this.scrollTimeout = null;
        //this.options = this.assignOptions(this.state,this,true);
    }
    
  
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    nav = React.createRef();

    // any scroll down hides header
    showHeaderFooter() {
        this.setState({hideHeader:false,hideFooter:false});
    };
    
    // any scroll up shows the header
    handleScroll(event)  {
        //let that = this;
        //event.preventDefault();
        //event.stopPropagation();
        let lastScrollY = this.state.lastScroll ? this.state.lastScroll : 1;
        let scrollY = window.scrollY;
        let scrollDiff = lastScrollY - scrollY;
        if (scrollY < 20)  {
            this.showHeaderFooter(); 
        } else if (Math.abs(scrollDiff) > 3)  {
        
            this.setState({hideHeader:true,hideFooter:true,lastScroll:scrollY});
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(this.showHeaderFooter,1500); 
        }
        //let lastScrollY = this.state.lastScroll ? this.state.lastScroll : 1;
        ////let scrollTop = event.srcElement.body.scrollTop
       //// let itemTranslate = Math.min(0, scrollTop/3 - 60);
        //let scrollDiff = lastScrollY - scrollY;
      //  console.log(['SCROLL',scrollY,lastScrollY,lastScrollY - scrollY]);
        //if (scrollDiff > 5 || scrollY > 20) {
            //this.setState({hideHeader:true,lastScroll:scrollY,hideFooter:true});
            //let that = this;
            //setTimeout(function() {
                //that.setState({hideFooter:false});
            //},2000);
        //} else if (scrollDiff < -5 || scrollY < 20) {
            //this.setState({hideHeader:false,lastScroll:scrollY,hideFooter:false});
        //}
////        this.setState({hideHeader:!this.state.hideHeader,lastScroll:lastScrollY});
    //    return false;
    }
    
    onScroll(scrollDirection,scrollOffset,element) {
      //  let that = this;
        let lastScrollOffset = this.state.scrollOffset ? this.state.scrollOffset : 1;
        let scrollDiff = scrollOffset - lastScrollOffset;
        if (scrollOffset < 20)  {
            this.showHeaderFooter(); 
        } else if (Math.abs(scrollDiff) > 3)  {
            this.setState({hideHeader:true,hideFooter:true,scrollOffset:scrollOffset});
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(this.showHeaderFooter,1500)
        
        }
        
            
        //let lastScrollOffset = this.state.scrollOffset ? this.state.scrollOffset : 1;
        //let scrollDiff = scrollOffset - lastScrollOffset;
        //console.log(['ONSCROLL',scrollDirection,scrollOffset,lastScrollOffset,(scrollOffset - lastScrollOffset)]);
        //if ((scrollDirection=="forward" && (scrollDiff > 5 || scrollOffset > 20))  ) {  // && scrollOffset > 5
            //this.setState({hideHeader:true,scrollOffset:scrollOffset,hideFooter:true});
            //this.setState({hideHeader:true,lastScroll:scrollOffset,hideFooter:true});
            //setTimeout(function() {
                //that.setState({hideFooter:false});
 // eslint-disable-next-line           //},2000);
           //// this.setFullScreen(true,element);
        //} else if ((scrollDirection=="backward" && (scrollDiff < -5  || scrollOffset < 20))) {  //&& (scrollOffset < 20 || scrollDiff < -10)
            //this.setState({hideHeader:false,scrollOffset:scrollOffset,hideFooter:false});
            ////this.setFullScreen(false,element);
        //}
        
        
    };



  
  
    getUser() {
        return this.state.user;
    };
  
    //assignOptions(state,that,withPlayer) {
        //that = this;
        ////state = this.state;
        //console.log(['assignOptions',state,that,withPlayer]);
        //return {  
            ////player ref
            ////_player:(withPlayer && that._player) ? that._player.current : null,   
            //// data
            ////isLoaded:state.isLoaded,
            ////playlists:state.playlists,
            ////currentPlaylist:state.currentPlaylist,
            ////currentTrack:state.currentTrack,
            ////isPlaying:state.isPlaying,
            ////playMode:state.playMode,
            ////viewMode:state.viewMode,
            ////user:state.user,
            ////searchFilter:state.searchFilter,
            ////searchFilterTag:state.searchFilterTag,
            ////searchResults:state.searchResults,
            ////artists:state.artists,
            ////showingPlayControls:state.showingPlayControls,
            ////expandedArtists:state.expandedArtists,
            ////hideSearchResults:state.hideSearchResults,
            ////searchResultsScrollToIndex:state.searchResultsScrollToIndex,
            //// methods
            //toggleExpandedArtist:that.toggleExpandedArtist,
           //isArtistExpanded:that.isArtistExpanded,
           //clearPlaylist:that.clearPlaylist,
           //newPlaylist:that.newPlaylist,
           //deletePlaylist:that.deletePlaylist,
           //setPlaylist:that.setPlaylist,
           //play:that.play,
           //pause:that.pause,
           //togglePlayback:that.togglePlayback,
           //nextTrack:that.nextTrack,
           //previousTrack:that.previousTrack,
           //addTrack:that.addTrack,
           //startPlayTrack:that.startPlayTrack,
           //removeTrack:that.removeTrack,
           //selectTrack:that.selectTrack,
           //getCurrentPlaylist:that.getCurrentPlaylist,
           //getCurrentTrack:that.getCurrentTrack ,
           //setPlayMode:that.setPlayMode,
           //getPlaylistByName:that.getPlaylistByName,
           //getPlaylistById:that.getPlaylistById,
           //seekTo:that.seekTo,
           //onEnded:that.onEnded,
           //onError:that.onError,
           //onPlay:that.onPlay,
           //onPause:that.onPause,
           //onProgress:that.onProgress,
           //onTimeUpdate:that.onTimeUpdate,
           //onStalled:that.onStalled,
           //loadMeekaFromLocalStorage:that.loadMeekaFromLocalStorage,
           //saveMeekaToLocalStorage:that.saveMeekaToLocalStorage,
           //resetMeekaLocalStorage:that.resetMeekaLocalStorage,
           //setSearchFilter:that.setSearchFilter,
           //setSearchFilterTag:that.setSearchFilterTag,
           //setSearchResults:that.setSearchResults,
           //setSearchResultsScrollToIndex:that.setSearchResultsScrollToIndex,
           //hidePlayControls:that.hidePlayControls,
           //showPlayControls:that.showPlayControls,
           //startWaiting:that.startWaiting,
           //stopWaiting:that.stopWaiting,
           //setPlayer:that.setPlayer,
           //setArtists:that.setArtists,
        //};
    //};
    
    //shouldComponentUpdate(nextProps, nextState) {
        ////isLoaded:state.isLoaded,
            ////playlists:state.playlists,
            ////currentPlaylist:state.currentPlaylist,
            ////currentTrack:state.currentTrack,
            ////isPlaying:state.isPlaying,
            ////playMode:state.playMode,
            ////viewMode:state.viewMode,
            ////user:state.user,
            ////searchFilter:state.searchFilter,
            ////searchFilterTag:state.searchFilterTag,
            ////searchResults:state.searchResults,
            ////artists:state.artists,
            ////showingPlayControls:state.showingPlayControls,
            ////expandedArtists:state.expandedArtists,
            ////hideSearchResults:state.hideSearchResults,
            ////searchResultsScrollToIndex:state.searchResultsScrollToIndex,
          ////  return false;
    //};

    
    //setPlayer(player) {
        //console.log(['set player',player]);
        //this._player = player;
    //};
    
    isLoggedIn() { 
      let user = this.getUser();
    //  let token = this.getToken();
       
      if (user && user.username  && user.username.length > 0 && user.token && user.token.access_token && user.token.access_token.length > 0) {
          return true;
      } else {
          return false;
      }
    }; 
    
    allowUser(user) {
        return true;
        //if (user && user.username && user.username in config.allowed) {
            //return true;
        //} else {
            //return false;
        //}
    };
    
    //setUser(user) {
        ////console.log(['setuser',user]);
        //if (typeof user !== 'object') {
            //user={}
        //}
        ////this.setState({user:user});
        ////localStorage.setItem('user',JSON.stringify(user));
    //};

    //setToken(token) {
        ////console.log(['token',token]);
        //if (typeof token !== 'object') {
            //token={}
        //}
        ////this.setState({token:token});
        ////localStorage.setItem('token',JSON.stringify(token));
        
    //};
    
    startWaiting() {
        if (!this.state.waiting) this.setState({waiting:true});
        //this.waiting = true;
    };
    
    stopWaiting() {
        if (this.state.waiting)  this.setState({waiting:false});
        //this.waiting = false;
    };
    
    //componentWillMount() {
        //let that=this;
        
       //// this.setState({options : that.assignOptions(this.state,this,true)}); 
    //};
    
    onResize(height,width) {
       // console.log(['ONRESIZE',height,width]);
        this.setState({height:parseInt(height,10),width:parseInt(width,10)});
    };
    
    onLogin(user) {
       console.log(['ONLOGIN',user]);
        //that.props.loadMeekaFromLocalStorage();
        this.setState({user:user});
    };
    
    onLogout() {
       // console.log(['ONLOGout']);
        this.setState({user:null});
    };
 
    render() {
       // let that = this;
        
       // console.log('APP RENDER');
        //let options = {
         //isLoaded:this.state.isLoaded,
            //playlists:this.state.playlists,
            //currentPlaylist:this.state.currentPlaylist,
            //currentTrack:this.state.currentTrack,
            //isPlaying:this.state.isPlaying,
            //playMode:this.state.playMode,
            //viewMode:this.state.viewMode,
            //user:this.state.user,
            //searchFilter:this.state.searchFilter,
            //searchFilterTag:this.state.searchFilterTag,
            //searchResults:this.state.searchResults,
            //artists:this.state.artists,
            //showingPlayControls:this.state.showingPlayControls,
            //expandedArtists:this.state.expandedArtists,
            //hideSearchResults:this.state.hideSearchResults,
            //searchResultsScrollToIndex:this.state.searchResultsScrollToIndex,
         //};   
        ////this.assignOptions(this.state,this,true) //  //this.state.options; //
        //console.log(options);
        
        // loadMeekaFromLocalStorage={this.loadMeekaFromLocalStorage} resetMeekaLocalStorage={this.resetMeekaLocalStorage} 
        //<PropsRoute  path='/' exact={true} component={HomePage}  />
                //
             
        //let user = this.getUser();
        //let token = this.getToken();
        
        let mainStyle={paddingTop:'0em'}
        //if (!this.state.hideHeader) {
            //mainStyle.paddingTop = '4em'
        //}
        let marginTop =  '4em'; //Utils.isMobile() ? '4em' :
        return (
          <Router>
                          
          <div className="App" style={{backgroundColor:'white',minHeight:800,marginTop:marginTop}} >
                <div >
                    <MeekaPlayer apiUrl='/api/meeka' user={this.state.user}  startWaiting={this.startWaiting} stopWaiting={this.stopWaiting}  isLoggedIn={this.isLoggedIn} width={this.state.width} height={this.state.height} onScroll={this.onScroll} hideHeader={this.state.hideHeader} hideFooter={this.state.hideFooter} />
                    <div style={mainStyle}>
                        <Route exact path='/' component={HomePage}/>
                        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} >
                        </ReactResizeDetector>
                        <PropsRoute path='/' component={LoginSystem} authServer={'/api/login'}  setUser={this.onLogin}  onLogin={this.onLogin} onLogout={this.onLogout} startWaiting={this.startWaiting} stopWaiting={this.stopWaiting} allowUser={this.allowUser} loginButtons={['google','twitter','facebook','github']} />
                   </div>
                </div>
                
                {!this.state.hideHeader && <Header isLoggedIn={this.isLoggedIn} />}
                
          {(this.state.waiting) && <div className='waiting-overlay' onClick={this.stopWaiting} ><img style={{marginTop: '10em', width: '80px'}} src="/loading.gif" alt="waiting" /></div>}  
           </div>
         
          </Router>
          
          
        );
    }
}

// onClick={(e) => Utils.setFullScreen(true) }

//{JSON.stringify(this.state.expandedArtists)}
             //{JSON.stringify([this.state.searchResultsScrollToIndex])}
             
 //{JSON.stringify(this.state.user)}
            //{JSON.stringify(this.state.token)}
           
//
//<div>{this.state.currentPlaylist}-{this.state.currentTrack}</div>
            
//{JSON.stringify(this.state.playlists)} 
export default App;
