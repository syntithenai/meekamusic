import ObjectId from 'objectid-browser';
import {debounce} from 'throttle-debounce';
//import samplePlaylists from './sample_playlists';
 
export default {
	
	redirectTo(url) {
		let that = this;
		console.log(['REDIR',url])
        //let lastPath = localStorage.get('lastPath')
        //if (false && lastPath && lastPath.length > 0) {
		  //localStorage.set('lastPath',null);	
		  //window.location= lastPath;
		//} else {
			window.location = url;
		//}
	},
 
	fetchData: function (url = ``) {
		let that = this;
      // Default options are marked with *
        let headers = {
                "Content-Type": "application/json; charset=utf-8",
        }
        if (that.props && that.props.user && that.props.user.token)       headers['Authorization'] = 'Bearer '+that.props.user.token.access_token 
        return new Promise(function(resolve,reject) {
			fetch(url, {
				method: "GET", // *GET, POST, PUT, DELETE, etc.
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				headers: headers,
			})
			.then(response => response.json())
			.then(function(json) {
				console.log('check auth fail',json)
				if (json.error && json.error.code === 401) {
					//console.log('auth fail')
					localStorage.setItem('lastPath',window.location.pathname)
					that.functions.redirectTo('/login/login')
					//resolve([])
					//window.location.reload()
				}
				resolve(json ? json : []);				
			})
			.catch(function(e) {
				console.log('Failed to fetch data '+url);
			})
		})
        //; // parses response to JSON
    },

    postData: function (url = ``, data = {}) {
      // Default options are marked with *
        let that = this;
        let headers = {
                "Content-Type": "application/json; charset=utf-8",
        }
        if (that.props && that.props.user && that.props.user.token)       headers['Authorization'] = 'Bearer '+that.props.user.token.access_token 
         
                  
        return new Promise(function(resolve,reject) {
			fetch(url, {
				method: "POST", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, cors, *same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "same-origin", // include, same-origin, *omit
				headers: headers,
				redirect: "follow", // manual, *follow, error
				referrer: "no-referrer", // no-referrer, *client
				body: JSON.stringify(data), // body data type must match "Content-Type" header
			})
			.then(response => response.json())
			.then(function(json) {
				console.log('check auth fail')
				if (json.error && json.error.code === 401) {
					localStorage.setItem('lastPath',window.location.pathname)
					that.functions.redirectTo('/login/login')
					//console.log('auth fail')
					//window.location.reload()
				}
				resolve(json);				
			}).catch(function(e) {
				console.log(['failed to post data',url,data]);
			})
		})	
        //; // parses response to JSON
    },
    
    play: function(e) {
        //console.log(['PLAY']);
        //let audioElement=this._player.current._audio.current;
        //if (audioElement) {
            //audioElement.play();
            //this.setState({isPlaying:!audioElement.paused});
        //}
        let that = this;
        //this.failCount = 0;
        if (this._player && this._player.current) {
            try {
                this.functions.startWaiting();
                this._player.current.play().catch(function(e) {
                    console.log(["PLAY ERR",e]);
                    that.functions.onError();
                }).then(function() {
                   // that.functions.clearErrors();
                });
                
            } catch (e) {
                that.functions.stopWaiting();
                that.functions.onError();
            }
            that.setState({isPlaying:true});
            if (that.props.user) that.functions.postData(that.props.apiUrl+'/saveplayer',{userId:that.props.user._id,playlistId:that.state.playlistId,isPlaying:'true'});
            that.setState({forceHideVideo:false});
        }
        
    },
    
    pause: function(e) {
        let that = this;
        //console.log(['PAUSE']);
        //let audioElement=this._player.current._audio.current;
        //if (audioElement) {
            //audioElement.pause();
            //this.setState({isPlaying:!audioElement.paused});
        //}
        if (this._player && this._player.current) {
            this.functions.stopWaiting();
            try {
                this._player.current.pause()().catch(function(e) {
                    console.log(["PAUSE ERR",e]);
                }).then(function() {
                   
                });
                ;
            } catch (e) {}
            that.setState({isPlaying:false, forceHideVideo:true});
                   // that.functions.clearErrors();
            if (that.props.user) that.functions.postData(that.props.apiUrl+'/saveplayer',{userId:that.props.user._id,playlistId:that.state.playlistId,isPlaying:'false'});
        }
    },
    
    togglePlayback: function(e) {
        let that = this;
        //console.log(['TOGGLE PLAY']);
        //let audioElement=this._player.current._audio.current;
        //if (audioElement) {
            ////console.log(['TOGGLE',this._player.current._audio.current]);
            //if (audioElement.paused) {
                //audioElement.play();
                //this.setState({isPlaying:!audioElement.paused});
            //}
            //else {
                //audioElement.pause();
                //this.setState({isPlaying:!audioElement.paused});
            //}            
        //}
        this.functions.clearErrors();
        
        if (this._player && this._player.current) {
           try {
                this._player.current.playPause().then(function() {
                   //this.functions.saveMeeka(); 
                   // that.functions.clearErrors();
                  
                }).catch(function(e) {
                    console.log(["PLAYPAUSE ERR",e]);
                });
            } catch (e) {}
            that.setState({isPlaying:!that._player.current.state.isPlaying, forceHideVideo:!that._player.current.state.isPlaying});
            if (that.props.user) that.functions.postData(that.props.apiUrl+'/saveplayer',{userId:that.props.user._id,playlistId:that.state.playlistId,isPlaying:(!that._player.current.state.isPlaying ? 'true' : 'false')});
                  
        }
    },
        
    loadPlaylists: function(title) {
        let that = this;
       console.log(['loadplaylists',that.props.user]);
        let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
        this.functions.startWaiting();
          return this.functions.fetchData(this.props.apiUrl+'/playlists?userId='+userId+'&rand='+(new Date().getTime()) )
          .then(function(json) {
              that.functions.stopWaiting();
              console.log((that.props.user && !isNaN(that.props.user.playlistId) ? that.props.user.playlistId : 0));
              //that.functions.setPlaylist((that.props.user && !isNaN(that.props.user.playlistId) ? that.props.user.playlistId : 0));
              let currentPlaylist = that.props.user && !isNaN(that.props.user.playlistId) ? that.props.user.playlistId : 0;
              //let currentTrack = (that.props.user && json[currentPlaylist]  && !isNaN(json[currentPlaylist].currentTrack) ) ? json[currentPlaylist].currentTrack : 0;
              ////console.log(['loaded playlists',{playlists:json,currentPlaylist:currentPlaylist,currentTrack:currentTrack}]);
              that.setState({playlists:json}); //,currentPlaylist:currentPlaylist,currentTrack:currentTrack});
              that.functions.setPlaylist(currentPlaylist);
              
              
          }).catch(function(ex) {
            console.log(['parsing failed', ex])
          })
    
    },
    
    
      // return the index of the playlist with matching name or -1
    //getPlaylistByName: function(name) {
        //for (let key in this.state.playlists) {
            //if (this.state.playlists[key].title === name) {
            ////    console.log('FOUND');
                //return key;
            //}
            ////          console.log(['PBN',id,key,val._id,val]);
        //}
        //return -1;
    //},
     getPlaylistById: function(id) {
        for (let key in this.state.playlists) {
            if (this.state.playlists[key]._id === id) {
            //    console.log('FOUND');
                return key;
            }
            //          console.log(['PBN',id,key,val._id,val]);
        }
        return -1;
    },
    
    
    //saveMeekaToLocalStorage:function() {
      //return;
      ////  console.log(['SAVEMEEKA',this.state.user]);
        //let state = this.state;
        //let userId='';
        //if (this.state.user && this.state.user._id) userId=this.state.user._id;
        //let mc = JSON.parse(localStorage.getItem('meeka'+userId));
        //mc = mc ? mc : {};
        ////mc.playlists = state.playlists;
        ////mc.currentPlaylist = state.currentPlaylist;
        ////mc.currentTrack = state.currentTrack;
        ////mc.playMode = state.playMode;
        ////mc.user = state.user;
        //mc.isPlaying = state.isPlaying;
       //// mc.searchFilter = state.searchFilter;
        //mc.expandedArtists = state.expandedArtists;
        //mc.searchResultsScrollToIndex = state.searchResultsScrollToIndex;
        //localStorage.setItem('meeka'+userId,JSON.stringify(mc));
        ////console.log('SAVED MEEKA'+userId);
        ////return new Promise(function (resolve,reject) {resolve();});
    //},
    
    //loadMeekaFromLocalStorage:function() {
      //return;
        //let that = this;
        //setTimeout(function() {
          ////  console.log('LOADMEEKA');
           //// let state = that.state;
            //let userId='';
            //if (that.state.user && that.state.user._id) userId=that.state.user._id;
            ////console.log('LOADMEEKA'+userId);
            //if (localStorage.getItem('meeka'+userId)) {
                //let mc = JSON.parse(localStorage.getItem('meeka'+userId));
               //// console.log(['LOADEDMEEKA',mc]);
                ////searchFilter:mc.searchFilter,
                ////,user:(mc.user? mc.user : {})
                ////playlists:mc.playlists,currentPlaylist:mc.currentPlaylist,currentTrack:mc.currentTrack,playMode:mc.playMode,
                //that.setState({isPlaying:mc.isPlaying,expandedArtists:mc.expandedArtists,searchResultsScrollToIndex:mc.searchResultsScrollToIndex,isLoaded:true});
                //return true;
            //} else {
                ////console.log('CREATE');
                //that.setState({playlists:samplePlaylists,isLoaded:true});
            //} 
        //},100);
        //return false;
        ////return new Promise(function (resolve,reject) {resolve();});
        
    //},
      
    //getFromMeekaLocalStorage:function(key) {
      //return;       
        //let userId='';
        //let that = this;
        //if (that.state.user && that.state.user._id) userId=that.state.user._id;
        ////console.log('LOADMEEKA'+userId);
        //if (localStorage.getItem('meeka'+userId)) {
            //let mc = JSON.parse(localStorage.getItem('meeka'+userId));
            //return mc[key];
        //}
        //return null;
    //},
    
    //resetMeekaLocalStorage:function() {
        ////let state = this.state;
        //let userId='';
        //if (this.state.user && this.state.user._id) userId=this.state.user._id;
        //localStorage.removeItem('meeka'+userId);
        //this.functions.loadMeekaFromLocalStorage();
        ////return new Promise(function (resolve,reject) {resolve();});
    //},

    toggleExpandedArtist: function(artistId,key) {
        let that = this;
       console.log(['TOGGLE EXP',artistId,key]);
       artistId = String(artistId)
        if (artistId && artistId.length > 0) {
            //hideSearchResults:true,
            //setTimeout(function() {
                let expandedArtists = that.state.expandedArtists;
                if (!expandedArtists) expandedArtists = {};
                if (expandedArtists.hasOwnProperty(artistId) && expandedArtists[artistId] !== null) {
                    delete expandedArtists[artistId] ;   
                } else {
                    expandedArtists[artistId] = {};
                }
                //,hideSearchResults:false
                that.setState({expandedArtists:expandedArtists});   
                //that.functions.saveMeekaToLocalStorage();             
                if (that.props.user) that.functions.postData(that.props.apiUrl+'/saveplayer',{userId:that.props.user._id,expandedArtists:expandedArtists});
           // },500)
        }
    },
    
    isArtistExpanded(artistId) {
        let expandedArtists = this.state.expandedArtists;
        if (!expandedArtists) expandedArtists = {};
        //console.log('expandedArtists');
        //console.log(expandedArtists);
        if (expandedArtists.hasOwnProperty(artistId) && expandedArtists[artistId] !== null) {
            //console.log(['IS EXP',artistId]);
            return false;
        } else {
            //console.log(['NOT EXP',artistId,expandedArtists]);
            return true;
        }
    },
    
    
    
    clearPlaylist: function(playlistKey) {
        if (!window.isNaN(playlistKey) && this.state.playlists.length > playlistKey) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
           // let oldTitle=this.state.playlists[playlistKey].title;
            let oldId=this.state.playlists[playlistKey]._id;
            let playlists=this.state.playlists;
            playlists[playlistKey].items=[];
            playlists[playlistKey].currentTrack=0;
            //={_id:oldId,title:oldTitle,items:[]};
            this.setState({playlists:playlists});
            //this.functions.saveMeekaToLocalStorage();
            this.functions.postData(this.props.apiUrl+'/saveplaylist',{userId:userId,playlistId:oldId,items:[],currentTrack:0});
        }
    },
    
    newPlaylist: function(title,items,id) {
        let that = this;
        if (title && title.length) {
            console.log(['NEWPL',this.props]);
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            let playlists=this.state.playlists;
            let newId = id ? id : new ObjectId().toString(); 
            let newItem={_id:newId,userId:userId,title:title,items:items?items:[],currentTrack:0};
            //console.log(['NEW PLAYLIST IteM',newItem]);
            playlists.push(newItem);
            this.setState({playlists:playlists});
            //this.functions.saveMeekaToLocalStorage();
            let p = new Promise(function(resolve,reject) {
                that.functions.postData(that.props.apiUrl+'/saveplaylist',{userId:userId,playlistId:newItem._id,items:newItem.items,title:newItem.title,currentTrack:0}).then(function() {
                    resolve(newId);
                });
            });
            return p;
            
            //this.functions.fetchData(this.props.apiUrl+'/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&title='+newItem.title+'&items=['+newItem.items.join(",")+']');
            //return newItem._id;            
        }
        //console.log(['NEW PLAYLIST',title,items]);
    },
    
    deletePlaylist: function(playlistKey) {
       // console.log(['DELETE PLAYLIST',playlistKey]);
        if (!window.isNaN(playlistKey) && this.state.playlists.length > playlistKey) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            //console.log(['DELETE PLAYLIST REALLY']);
            let playlistId = this.state.playlists && this.state.playlists[playlistKey] && this.state.playlists[playlistKey]._id ? this.state.playlists[playlistKey]._id : '';
            let playlists=this.state.playlists; //JSON.parse(JSON.stringify(this.state.playlists));
            //console.log(['DELETE PLAYLIST',JSON.parse(JSON.stringify(playlists))]);
            playlists.splice(playlistKey,1);
            //console.log(['DELETE PLAYLIST',JSON.parse(JSON.stringify(playlists))]);
            
            this.setState({playlists:playlists});
            //this.functions.saveMeekaToLocalStorage();
            //fetch('/deleteplaylist?userId='+userId+'&playlistId='+playlistId);
            this.functions.postData(this.props.apiUrl+'/deleteplaylist',{userId:userId,playlistId:playlistId});
           
        }
    },
    
    setPlaylist: function(playlistKey) {
        if (this.state.currentPlaylist !== playlistKey) {
            if (!window.isNaN(playlistKey) && this.state.playlists.length > playlistKey && this.state.playlists[playlistKey]) {
                
                
                //that.functions.setPlaylist((that.props.user && !isNaN(that.props.user.playlistId) ? that.props.user.playlistId : 0));
              //let currentPlaylist = that.props.user && !isNaN(that.props.user.playlistId) ? that.props.user.playlistId : 0;
              //let currentTrack = (that.props.user && json[currentPlaylist]  && !isNaN(json[currentPlaylist].currentTrack) ) ? json[currentPlaylist].currentTrack : 0;
              //console.log(['loaded playlists',{playlists:json,currentPlaylist:currentPlaylist,currentTrack:currentTrack}]);
              //that.setState({playlists:json,currentPlaylist:currentPlaylist,currentTrack:currentTrack});
                
                
                
                let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
                let playlistId = this.state.playlists[playlistKey]._id;
                let currentTrack = this.state.playlists[playlistKey].currentTrack ? this.state.playlists[playlistKey].currentTrack : 0;
                let playlists = this.state.playlists;
                playlists[playlistKey].currentTrack = currentTrack;
                this.setState({playlists:playlists,currentPlaylist:playlistKey,currentTrack:currentTrack});
                //this.functions.saveMeekaToLocalStorage();
               if (this.props.user) this.functions.postData(this.props.apiUrl+'/saveplayer',{userId:userId,playlistId:playlistId,isPlaying:(this.state.isPlaying ? 'true' : 'false')});
            }            
        }
    },

    nextTrack: function() {
       // console.log(['NEXT TRACK']);
        let that = this;
        let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
        let isPlaying = this._player && this._player.current && this._player.current.state && this._player.current.state.isPlaying ? this._player.current.state.isPlaying : false;
       // console.log([this._player.current.state]);
        let playlistKey = this.state.currentPlaylist;
        if (window.isNaN(playlistKey)) {
            playlistKey=0;
        }
        if (this.state.playlists.length > playlistKey && this.state.playlists[playlistKey].items.length > 0) {
            let trackKey = this.state.currentTrack;
            if (window.isNaN(playlistKey)) {
                trackKey=0;
            }
            let nextTrack=(trackKey + 1)% this.state.playlists[playlistKey].items.length;
            //console.log({currentPlaylist:playlistKey,currentTrack:nextTrack,pl:this.state.playlists});
            let playlists = this.state.playlists;
            playlists[playlistKey].currentTrack = nextTrack;
            this.setState({currentPlaylist:playlistKey,currentTrack:nextTrack,playlists:playlists});
            //fetch('/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&currentTrack='+nextTrack);
            this.functions.postData(that.props.apiUrl+'/saveplaylist',{userId:userId,playlistId:this.state.playlists[playlistKey]._id,currentTrack:nextTrack});
            
           
            //this.functions.saveMeekaToLocalStorage();
            if (isPlaying) {
                setTimeout(function() {
                    that.functions.play();
                },500);
            }
        }
    },
    
    previousTrack: function() {
       // console.log(['PREV TRACK']);
        let that = this;
        let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
        let playlistKey = this.state.currentPlaylist;
        let isPlaying = this._player && this._player.current && this._player.current.state && this._player.current.state.isPlaying ? this._player.current.state.isPlaying : false;
        if (window.isNaN(playlistKey)) {
            playlistKey=0;
        }
         let playlists = this.state.playlists;
        if (this.state.currentTrack===0 || window.isNaN(this.state.currentTrack)) {
            playlists[playlistKey].currentTrack = 0;
            this.setState({playlists:playlists,currentPlaylist:playlistKey,currentTrack:this.state.playlists[playlistKey].items.length > 0 ? this.state.playlists[playlistKey].items.length-1 : 0});
        } else if (this.state.playlists.length > playlistKey && this.state.playlists[playlistKey].items.length > 0) {
            let trackKey = this.state.currentTrack;
            if (window.isNaN(playlistKey)) {
                trackKey=0;
            }
            
            let nextTrack=parseInt(trackKey - 1,10);
            //console.log({currentPlaylist:playlistKey,currentTrack:nextTrack});
            let playlists = this.state.playlists;
            playlists[playlistKey].currentTrack = nextTrack;
            this.setState({currentPlaylist:playlistKey,currentTrack:nextTrack});
            //fetch('/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&currentTrack='+nextTrack);
            this.functions.postData(that.props.apiUrl+'/saveplaylist',{userId:userId,playlistId:this.state.playlists[playlistKey]._id,currentTrack:nextTrack});
            //this.functions.saveMeekaToLocalStorage();
            if (isPlaying) {
                setTimeout(function() {
                    that.functions.play();
                },500);
            }
            
        }     
    },
    
    addTrack: function(track,playlistKey) {
        //console.log(['ADD TRACK',track,playlistKey]);
        if (!window.isNaN(playlistKey) && this.state.playlists.length > playlistKey) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            if (!track._id) track._id=new ObjectId().toString();
            let playlists=this.state.playlists;
            //console.log(['ADD TRACK really ',track,playlistKey]);
            playlists[playlistKey].items.push(track);
            this.functions.postData(this.props.apiUrl+'/addtracktoplaylist',{userId:userId,playlistId:playlists[playlistKey]._id,item:track,trackKey:playlists.length - 1});
            //fetch('/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&tracks=['+playlists[playlistKey].items.join(",")+']');
            this.setState({playlists:playlists});
            //this.functions.saveMeekaToLocalStorage();
        }
    },
    
    addTracks: function(tracks,playlistKey) {
        //console.log(['ADD TRACK',track,playlistKey]);
        if (!window.isNaN(playlistKey) && this.state.playlists.length > playlistKey) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            let playlists=this.state.playlists;
            //console.log(['ADD TRACK really ',track,playlistKey]);
            for (let ii in tracks) {
                let track = tracks[ii];
                if (!track._id) track._id=new ObjectId().toString();
                playlists[playlistKey].items.push(track);
            }
            this.setState({playlists:playlists});
            //this.functions.saveMeekaToLocalStorage();
            //fetch('/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&tracks=['+playlists[playlistKey].items.join(",")+']');
            this.functions.postData(this.props.apiUrl+'/addtrackstoplaylist',{userId:userId,playlistId:playlists[playlistKey]._id,items:tracks});
        }
    },
    
    startPlayTrack: function(track,playlistKey) {
        console.log(['START PLAY TRACK',track,playlistKey,this.state.playlists]);
        this.functions.clearErrors();
        if (!window.isNaN(playlistKey) && this.state.playlists.length > playlistKey) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            if (!track._id) track._id=new ObjectId().toString();
            let playlists=this.state.playlists;
        //    console.log(['ADD TRACK really ',track,playlistKey]);
            if (!Array.isArray(playlists[playlistKey].items)) playlists[playlistKey].items = []
            let index = playlists[playlistKey].items.length;
            playlists[playlistKey].items.push(track);
            playlists[playlistKey].currentTrack = index;
            this.setState({playlists:playlists,currentPlaylist:playlistKey,currentTrack:index});
            this.functions.postData(this.props.apiUrl+'/startplaytrackonplaylist',{userId:userId,playlistId:playlists[playlistKey]._id,item:track});
            //fetch('/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&tracks=['+playlists[playlistKey].items.join(",")+']');
            //this.functions.saveMeekaToLocalStorage();
            let that=this;
            setTimeout(function() {
                that.functions.play();
                if (that.props.user) that.functions.postData(that.props.apiUrl+'/saveplayer',{userId:that.props.user._id,playlistId:that.state.playlistId,isPlaying:'true'});
            },1000)
            //window.location='/meeka/playlist';
            //playlists[playlistKey].length-1
        }
    },

    removeTrack: function(playlistKey,trackKey) {
    //  console.log(['REMOVE TRACK',playlistKey,trackKey,this.state.playlists]);
       if (!window.isNaN(playlistKey) && !window.isNaN(trackKey) && this.state.playlists.length > playlistKey && this.state.playlists[playlistKey].items[trackKey]) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            this.functions.pause();
            let playlists=this.state.playlists;
            playlists[playlistKey].items.splice(trackKey,1);
            this.setState({playlists:playlists});
            console.log(['REMOVETRACK',{userId:userId,playlistId:playlists[playlistKey]._id,items:playlists[playlistKey].items}]) //this.functions.postData('/saveplaylist',{userId:userId,playlistId:playlists[playlistKey]._id,items:playlists[playlistKey].items});
            //fetch(this.props.apiUrl+'/saveplaylist?userId='+userId+'&playlistId='+newItem._id+'&tracks=['+playlists[playlistKey].items.join(",")+']');
            //this.functions.saveMeekaToLocalStorage();
            //this.functions.play();
        }
          
    },

    selectTrack: function(playlistKey,trackKey) {
        //console.log(['SELECT TRACK',playlistKey,trackKey]);
        this.functions.clearErrors();
        if (!window.isNaN(playlistKey) && !window.isNaN(trackKey) && this.state.playlists.length > playlistKey && this.state.playlists[playlistKey].items && this.state.playlists[playlistKey].items[trackKey]) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            //console.log(['SELECT TRACK really',this.state.isPlaying]);
            let playlists = this.state.playlists;
            playlists[playlistKey].currentTrack = trackKey;
            this.setState({playlists:playlists,currentPlaylist:playlistKey,currentTrack:trackKey});
            this.functions.postData(this.props.apiUrl+'/saveplaylist',{userId:userId,playlistId:this.state.playlists[playlistKey]._id,currentTrack:trackKey});
            //this.functions.saveMeekaToLocalStorage();
            //if (this.state.isPlaying) {
                //this.functions.play();
            //}
        }
    },
    
    selectPlayTrack: function(playlistKey,trackKey) {
        //console.log(['SELECT TRACK',playlistKey,trackKey]);
        this.functions.clearErrors();
        if (!window.isNaN(playlistKey) && !window.isNaN(trackKey) && this.state.playlists.length > playlistKey && this.state.playlists[playlistKey].items && this.state.playlists[playlistKey].items[trackKey]) {
            let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            //console.log(['SELECT TRACK really',this.state.isPlaying]);
            let playlists = this.state.playlists;
            playlists[playlistKey].currentTrack = trackKey;
            this.setState({playlists:playlists,currentPlaylist:playlistKey,currentTrack:trackKey});
            this.functions.postData(this.props.apiUrl+'/saveplaylist',{userId:userId,playlistId:this.state.playlists[playlistKey]._id,currentTrack:trackKey});
            this.functions.play();
            //this.functions.saveMeekaToLocalStorage();
            //if (this.state.isPlaying) {
                //this.functions.play();
            //}
        }
    },

  
    // return the current playlist or find or create a playlist called default and return that
    getCurrentPlaylist: function() {
        // let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
           //console.log('GET CURRENT PLAYLIST');
        if (!window.isNaN(this.state.currentPlaylist) && this.state.playlists.length > this.state.currentPlaylist) {
            //console.log(this.state.playlists[this.state.currentPlaylist]);
            return this.state.playlists[this.state.currentPlaylist]
        }
        // else {
            //let newDefault = {_id:'default',title:"default",items:[],userId:userId,currentTrack:0};
            //this.functions.postData(this.props.apiUrl+'/saveplaylist',{newDefault});
            ////return null;
            //return newDefault;
        //}
    },
  
    // return current song
    getCurrentTrack: function() {
        //console.log('GET CURRENT track');
        if (!window.isNaN(this.state.currentPlaylist) && this.state.playlists.length > this.state.currentPlaylist && this.state.playlists[this.state.currentPlaylist] && this.state.playlists[this.state.currentPlaylist].items && this.state.playlists[this.state.currentPlaylist].items.length > this.state.currentTrack) {
            //console.log(this.state.playlists[this.state.currentPlaylist].items[this.state.currentTrack]);
            return this.state.playlists[this.state.currentPlaylist].items[this.state.currentTrack];
        }
    },
    
    toggleCurrentFavorite : function(userId) {
         console.log(['TOGGLE FAV',userId])
         if (userId && userId.length > 0) {
            let playlists = this.state.playlists;
            let track = this.functions.getCurrentTrack();
            track.favoriteOf = track.favoriteOf ? track.favoriteOf : {}
            track.favoriteOf[userId] = !track.favoriteOf[userId];
            playlists[this.state.currentPlaylist].items[this.state.currentTrack] = track;
            console.log(['TOGGLE set',track,playlists])
            // note mongosave in LikeButton
            this.setState({'playlists':playlists});
            
        }
    },
    
    setPlayMode: function(mode) {
        this.setState({playMode:mode});
       // this.functions.saveMeekaToLocalStorage();
    },
    
    seekTo(target) {
        if (this._player.current) {
            this._player.current.seekTo(target);
        }
    },
    
    onEnded() {
        let that=this;
        //console.log('ONENDED');
        this.functions.nextTrack();
        setTimeout(function() {
            try {
                that.functions.play();
                //that._player.current.play();
            } catch (e) {
                console.log(['PLAYBACK ERROR',e]);
            }
            //that.functions.saveMeekaToLocalStorage();
        },500);
    },
    
   
    
    onError() {
        let that=this;
       // console.log(['ONERROR',this.state.errorCount]);
        this.functions.stopWaiting();
        let failCount = this.state.errorCount;
        if (failCount < 10) {
            this.functions.addError();
            if (Math.random() >= 0.5) this.functions.nextTrack();
            setTimeout(function() {
                //that._player.current.play();
                that.functions.play();
               // that.functions.saveMeekaToLocalStorage();
            },500);            
        }
    },
    
    onStalled() {
        //this.functions.stopWaiting();
        //return this.onError();
    },
    
    
    onPlay() {
        //console.log('ONPLAY');
        
        let that=this;
        this.functions.showPlayControls();
        this.setState({isPlaying:true});
       // this.functions.saveMeekaToLocalStorage();
        setTimeout(this.functions.hidePlayControls,5000);
        // 10s delay on logging song into history
        debounce(1000,that.functions.logSeen)();
        debounce(1000,this.functions.stopWaiting)();
           
    },
    
    logSeen() {
        //let that = this;
          let currentTrack = this.functions.getCurrentTrack();
          this.functions.fetchData(this.props.apiUrl+'/logseen?userId='
          +((this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '')
          +'&trackId='
          +((currentTrack && currentTrack._id && currentTrack._id.length > 0) ? currentTrack._id : '') 
          );
          
    },
    
    onPause() {
        //console.log('ONPAUSE');
        this.functions.showPlayControls();
        this.setState({isPlaying:false});
        //this.functions.saveMeekaToLocalStorage();
        //console.log('SHOW COTNROLS');
        this.setState({showingPlayControls:true});
    },
    
    
    setSearchFilter(filter) {
      //  console.log(['set filter',filter]);
        // eslint-disable-next-line
        var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        this.setState({searchFilter:filter.replace(punctRE, " ")}); //
        
        //let tag = this.props.searchFilterTag ? "/"+this.props.searchFilterTag + "/" : '';
        //this.props.history.push("/meeka/search/"+tag+filter.replace(punctRE, " "));
        //this.functions.saveMeekaToLocalStorage();
    },
    
    setSearchFilterTag(filter) {
     //   console.log(['set filter tag',filter]);
        //var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        //let val = this.props.searchFilter ? this.props.searchFilter : '';
        //let tag = filter ? "/"+filter + "/" : '';
        this.setState({searchFilterTag:filter});
        //this.props.history.push("/meeka/search/"+tag+val.replace(punctRE, " "));
        //this.functions.saveMeekaToLocalStorage();
    },
    
    //setArtists(results) {
        ////let newResults = this.state.searchResults;
        ////// default library search rsults all artists
        ////newResults['local'] = results;
        ////searchResults:newResults,
        
        //let artistsIndex = {}
        //results.map(function(val,key) {
            //artistsIndex[val.groupByKey] = key; 
        //});
        //this.setState({artists:results,artistsIndex:artistsIndex});
    //},
    
    setSearchResults(type,results) {
        console.log(['set results',type]); 
        let newResults = this.state.searchResults;
        newResults[type] = results;
        this.setState({searchResults:newResults});
    },
     
    setSearchResultsScrollToIndex(type,index) {
     //   console.log(['set results scroll index',type,index]);
        let newResults = this.state.searchResultsScrollToIndex ? this.state.searchResultsScrollToIndex : {};
        newResults[type] = index;
        this.setState({searchResultsScrollToIndex:newResults});
        //this.functions.saveMeekaToLocalStorage();
    },
    
    setRenderedTags(tags) {
        this.setState({renderedTags:tags});
    },
    
    hidePlayControls() {
        //console.log('HIDE COTNROLS');
        let current = this.functions.getCurrentTrack();
        if (current && current.type && current.type==="video") {
            //console.log('HIDE COTNROLS real');
            this.setState({showingPlayControls:false});
        }
    },
    showPlayControls() {
        //console.log('SHOW COTNROLS');
        this.setState({showingPlayControls:true});
        
    }, 
    
        
    onProgress() {
       // this.stopWaiting();
        //console.log('progress');
    },
  
    onTimeUpdate() {
        //console.log('timeupdate');
      // this.functions.stopWaiting();
    },

    filterTags(title) {
        let that = this;
        this.functions.startWaiting();
          this.functions.fetchData(this.props.apiUrl+'/tags?search='+(title ? title.toLowerCase() : '') )
          .then(function(json) {
              ////console.log(['SET TAGS', json])
              let newTags=[];
              for (let a in json) {
                  let newTag={};
                  newTag.text = json[a].title;
                  newTag.value = json[a].tally;
                  newTags.push(newTag);
              }
              that.functions.stopWaiting();
              that.setState({'tags':newTags});
          }).catch(function(ex) {
            //console.log(['parsing failed', ex])
          })
    },
    
    addError() {
        let errors = this.state.errorCount;
        if (isNaN(errors)) errors = 0;
        this.setState({errorCount:errors+1});
    },
    clearErrors() {
        this.setState({errorCount:0});
    }


}
