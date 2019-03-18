import React, { Component } from 'react';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import {FaTimesCircle as DeleteButton} from 'react-icons/fa';
import AutoFocusTextInput from './AutoFocusTextInput'
import { VariableSizeList as List } from 'react-window';
//import {FaBook as LocalSearchButton} from 'react-icons/fa';
import {FaList as PlaylistButton} from 'react-icons/fa';
import {FaSearch as SearchButton} from 'react-icons/fa';
import {FaPlus as NewButton} from 'react-icons/fa';
import {FaTrash as TrashButton} from 'react-icons/fa';
import {FaRandom as ShuffleButton} from 'react-icons/fa';

import Utils from './Utils'          
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
// eslint-disable-next-line
Array.prototype.shuffle = function() {
    var input = this;
     
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}

let listRef = React.createRef();

export default class Playlist extends Component {

    constructor(props) {
        super(props);
        this.showNewPlaylist = this.showNewPlaylist.bind(this);
        this.saveNewPlaylist = this.saveNewPlaylist.bind(this);
        this.cancelNewPlaylist = this.cancelNewPlaylist.bind(this);
        this.updateNewPlaylistTitle = this.updateNewPlaylistTitle.bind(this);
        
        this.state = {
            showNewPlaylist:false,
            newPlaylistTitle:''
        }
        this.selectTrack = this.selectTrack.bind(this);
        this.clearPlaylist = this.clearPlaylist.bind(this);
        
        this.renderRow=this.renderRow.bind(this);
        this._noRowsRenderer=this._noRowsRenderer.bind(this);
        this._getRowHeight=this._getRowHeight.bind(this);
        this.setSearchFilterTag=this.setSearchFilterTag.bind(this);
        this.shufflePlaylist=this.shufflePlaylist.bind(this);
        this.onScroll=this.onScroll.bind(this);
        this.currentPlaylistItems = [];
    
    }
    

    componentWillMount() {
       console.log(['PLAYLIST will MOUNT ',this.props.match.params.id]);
        //let currentTrack = 0;
       //let that = this;
        //setTimeout(function() {
         //   console.log(['MTT',listRef,that.props.searchResultsScrollToIndex]);
        //},500);

        if (this.props.match.params.id) {
            let currentPlaylist = this.props.getPlaylistById(this.props.match.params.id);
          //  console.log(['PLAYLIST DID MOUNT real ',currentPlaylist,this.props.match.params.id]);     
            if (currentPlaylist >= 0) {
                
                this.props.setPlaylist(currentPlaylist);
               // let currentPlaylistObject = that.props.playlists[currentPlaylist] ? that.props.playlists : {}; 
            //    console.log(['PLAYLIST DID MOUNT real ']);     
                
               // that.props.selectTrack((currentPlaylistObject.currentTrack ? currentPlaylistObject.currentTrack : 0),currentPlaylist);
                     
                //this.setState({currentPlaylist:currentPlaylist}); //,currentTrack:currentTrack
            }    
        }
    };
    
    componentDidUpdate(oldProps) {
      //  let that = this;
        console.log(['PLAYLIST DID update ',oldProps.currentPlaylist,this.props.currentPlaylist,this.props.match]);
        if (oldProps.currentPlaylist !== this.props.currentPlaylist) {
         //   console.log('PLAYLIST DID update real');
            let currentPlaylist = this.props.getPlaylistById(this.props.match.params.id);
            
            if (currentPlaylist >= 0) {
                this.props.setPlaylist(currentPlaylist);
               // let initOffset = ((this.props.currentTrack+3) * 70) ;
                listRef.current && listRef.current.scrollToItem(parseInt(this.props.currentTrack,10),"center");
                //let currentPlaylistObject = that.props.playlists[currentPlaylist] ? that.props.playlists : {}; 
                     
               // that.props.selectTrack((currentPlaylistObject.currentTrack ? currentPlaylistObject.currentTrack : 0),currentPlaylist);
                     
                //this.setState({currentPlaylist:currentPlaylist}); //,currentTrack:currentTrack
            }    
        }
    }
    
    componentDidMount() {
        //let that = this;
         console.log(['PLAYLIST DID mount ',this.props.currentPlaylist,this.props.match]);
        //setTimeout(function() {
            //console.log(['MTT',listRef,that.props.searchResultsScrollToIndex,that.props.playlistScrollToIndex]);
            //if (listRef && listRef.current && that.props.playlistScrollToIndex && that.props.playlistScrollToIndex > 0) {
                //console.log(['SCROLL TO ',that.props.playlistScrollToIndex,parseInt(that.props.playlistScrollToIndex,10)]);
                ////listRef.current.scrollToItem(parseInt(that.props.playlistScrollToIndex,10),"center");
            //} 
            //if (this.props.match.params.id) {
                //let currentPlaylist = this.props.getPlaylistById(this.props.match.params.id);
                //if (currentPlaylist >= 0) {
                    //console.log('PLAYLIST DID MOUNT '+currentPlaylist);
                    //this.props.setPlaylist(currentPlaylist);
                    //let currentPlaylistObject = that.props.playlists[currentPlaylist] ? that.props.playlists : {}; 
                         
                    //that.props.selectTrack((currentPlaylistObject.currentTrack ? currentPlaylistObject.currentTrack : 0),currentPlaylist);
                         
                    ////this.setState({currentPlaylist:currentPlaylist}); //,currentTrack:currentTrack
                //}    
            //}           
        //},500);
    };
    
    //componentWillReceiveProp(props) {
        //let that = this;
      ////  console.log(['MTTprops',props]); //,that.listRef.current,that.props.searchResultsScrollToIndex
    //};
       
    
    showNewPlaylist () {
        console.log(['SOWnewpl']);
        this.setState({showNewPlaylist:true,newPlaylistTitle:''});
    }
    
    saveNewPlaylist () {
        let that = this;
        //console.log(['savenewpl',this.state.newPlaylistTitle]);
        this.props.newPlaylist(this.state.newPlaylistTitle,[]).then(function(playlistId) {
            let newState={'newPlaylistTitle':'',showNewPlaylist:false};
            that.setState(newState);
            that.props.history.push("/meeka/playlist/"+playlistId);            
        });
    }
    cancelNewPlaylist () {
        this.setState({showNewPlaylist:false});
    }
    
    updateNewPlaylistTitle(title) {
        if (title && title.length > 0) {
            //let title = event.target.value;
           // console.log('uptit'+title);
            let newState={'newPlaylistTitle':title};
            this.setState(newState);            
        }
    };
    
    shufflePlaylist() {
        if (this.currentPlaylistItems && this.currentPlaylistItems) {
            this.props.startWaiting();
            let playlist = this.currentPlaylistItems  ? this.currentPlaylistItems : {items:[]};
            // allow for spacer elements
            let spacers = playlist.items.slice(0,2);
            let items = playlist.items.slice(2);
            items.shuffle();
            playlist.items = spacers.concat(items);
            this.props.setPlaylist(playlist); 
            listRef.current.scrollToItem(parseInt(this.props.playlistScrollToIndex,10) > 0 ? parseInt(this.props.playlistScrollToIndex,10) : 0,"center");    
            this.props.stopWaiting();       
        }
    };
    
    //componentWillReceiveProps(props) {
        //console.log('PLAYLIST WILL PROPS '+this.props.match.params.id);
        ////let currentTrack = 0;
        //let currentPlaylist = props.getPlaylistById(props.match.params.id);
        //if (currentPlaylist) {
            //console.log('PLAYLIST DID MOUNT '+currentPlaylist);
            //this.props.setPlaylist(currentPlaylist);
            ////this.setState({currentPlaylist:currentPlaylist}); //,currentTrack:currentTrack
        //}
    //};
    
    
    selectTrack(playlist,track) {
        //let that = this;
        //console.log(['SEL ECT TRACK',playlist,track,this.props]);
        this.props.selectPlayTrack(playlist,track);    
        
    };
    
    clearPlaylist() {
        // e.preventDefault();
        confirmAlert({
          title: 'Clear all tracks from the playlist ? ',
          message: 'Are you sure?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.props.clearPlaylist(this.props.currentPlaylist)
            },
            {
              label: 'No'
            }
          ]
        }) 
        return false;
        
    };
    
    setSearchFilterTag(e,tag) {
        e.preventDefault();
        this.props.setSearchFilterTag(tag);
    };
    
    renderRow(key,style) {
        let that = this;
        let citems=this.currentPlaylistItems;
      //  console.log(['RR items ',citems]);
        
        if (citems && citems.items.length > key) {
            let item = citems.items[key];
        //    console.log(['RR PL ',item,item.html]);
        
            if (item.html) {
                return <div style={style} key={{key}}>{item.html}</div>
            } else {
                let artist='';
                //let artistName = item.artist ? item.artist : '';
                let artistSearchLink = "/meeka/search/"+encodeURI(item.artist);
                
                let userId = (that.props.user && that.props.user._id && that.props.user._id.length > 0) ? that.props.user._id : false;
                
                if (item.artist && item.artist.length > 0) {
                    if (false && userId) {
                        artist=<span> by <Link to={artistSearchLink} ><b>{item.artist}</b></Link></span>;
                    } else {
                        artist=<span> by <b>{item.artist}</b></span>;
                    }
                }
                
                
                    
                let albumName = item.album ? item.album : '';
                let album=''
                let albumSearchLink = "/meeka/search/"+encodeURI(item.artist + ' ' + item.album);
                if (albumName.length > 0) {
                    if (false && userId) {
                        album = <span> on <Link to={albumSearchLink} ><b>{item.album}</b></Link></span>
                    } else {
                        album = <span> on <b>{item.album}</b></span>
                    }
                }
                //console.log(item);
                //return '';
                //console.log(['CHECK SEL',this.props.currentTrack,key]);
                let oddEven = (key%2===0) ? "even" : "odd";
                
                let selected = (this.props.currentTrack === key) ? 'item selected '+oddEven : 'item '+oddEven;
                let newStyle = JSON.parse(JSON.stringify(style));
               // console.log(newStyle);
              //  if (this.props.currentTrack === key)  newStyle.backgroundColor = 'darkseagreen';
                
                //let artist='';
                let searchLink = Utils.getSearchLink(item);
                if (item) {
                    //if (item.artist) artist=<b>{item.artist}</b>;
                    return (
                        <div className={selected} key={item._id+"-"+key} style={newStyle} >
                            
                            <button className='btn' style={{float:'right'}} onClick={() => this.props.removeTrack(this.props.currentPlaylist,key)}  ><DeleteButton/></button>
                            <Link to={searchLink} ><button className='btn' style={{float:'right'}}   ><SearchButton/></button></Link>
                            <div style={{width:'90%' ,height:'100%'}} onClick={() => this.selectTrack(this.props.currentPlaylist,key)} ><span  >{item.title}</span> <span  >{artist}</span> <span  >{album}</span> 
                            </div>
                        </div>
                    );            
                } else {
                    return '';
                }
                
            }
            
        } else {
            return ''
        }
    }
    
    
    _noRowsRenderer(styles) {
        return <div style={{textAlign:'center'}}>Nothing on your playlist<br/>
                <br/>
                {!this.props.isLoggedIn() && <Link to="/meeka/jamendo" ><button>Add some tracks</button></Link>}
                {this.props.isLoggedIn() && <Link to="/meeka/search" ><button>Add some tracks</button></Link>}
                </div>
    }
    
    _getRowHeight(index) {
        let height = 70;
        let citems=this.currentPlaylistItems;
        if (citems && Array.isArray(citems.items) && citems.items.length > index) {
            let item = citems.items[index];
           // console.log(['getrowhieght',item,item.height,item.html]);
            if (item.height > 0) {
             //   console.log(['getrowhieght set',item.height]);
              return item.height;   
            }
        }
        let spacer = 0; //(index  >= this.currentPlaylistItems.items.length - 1 ) ? 300 : 0
        return height + spacer;
    }

    onScroll({scrollDirection,scrollOffset,scrollUpdateWasRequested}) {
       // this.props.setSearchResultsScrollToIndex('playlist',scrollOffset);
        this.props.onScroll(scrollDirection,scrollOffset);
    };
// <Link to="/meeka/menu"   ><button className='btn'  ><MenuButton  size={size}/><span className="d-none d-md-inline"> More</span></button></Link>



    render() {
        let that=this;
        let size=20;
        let searchLink = "/meeka/search";
        if (this.props.searchFilterTag && this.props.searchFilterTag.length > 0) {
            searchLink += "/tag/" + encodeURI(this.props.searchFilterTag);
        }
        if (this.props.searchFilter && this.props.searchFilter.length > 0) {
            searchLink += "/" + encodeURI(this.props.searchFilter);
        }
        
      // console.log('PL ren');
        let citems = this.props.getCurrentPlaylist();
        //JSON.parse(
                        //JSON.stringify(
                            //this.props.getCurrentPlaylist()
                        //)
                    //);
        
        
        
        //citems.unshift({html:<b>blank row</b>});
        //!this.props.hideHeader && 
         let buttons=(<div className='item' key="backbutton" >
                {
                    <span style={{width:'99%',zIndex:'9'}}>
                    <span style={{ float: 'right',marginRight:'1em'}}>
                        <button style={{marginRight:'1em'}} onClick={this.shufflePlaylist} className='btn btn-info' ><ShuffleButton  size={size}/><span className="d-none d-md-inline" > Shuffle</span></button>
                       
                       
                        <button style={{marginRight:'1em'}} onClick={this.clearPlaylist} className='btn btn-danger' ><TrashButton  size={size}/><span className="d-none d-md-inline" > Clear</span></button>
                        
                        {!this.state.showNewPlaylist && <button onClick={this.showNewPlaylist} className='btn btn-success' >
                            <NewButton  size={size}/><span className="d-none d-md-inline"> New</span>
                            </button>} 
                        
                    </span>
                   <span style={{float:'left',textAlign:'left'}}>
                             
                             <Link to="/meeka/playlists"  ><button className='btn'><PlaylistButton size={size} /><span className="d-none d-md-inline"> Playlists</span></button>&nbsp;</Link>
                             
                            {that.props.isLoggedIn() && <Link to={searchLink}   ><button className='btn'  ><SearchButton  size={size}/><span className="d-none d-md-inline"> Library</span></button>&nbsp;</Link>}
                    
                           
         
                    </span>
                     {citems && citems.items && <span  ><h3 style={{ clear:'both'}}>Playlist - <b>{citems.title}</b></h3></span>}
                
                </span>}
                    
                
                 
            </div>);
            if (!citems || !citems.items || citems.items.length === 0) {
                citems={};
                citems.items=[];
                citems.items.unshift({html:buttons,height:80});   
                citems.items.unshift({html:<b>&nbsp;</b>,height:70});   
             //   citems.items.push({html:<b>&nbsp;</b>,height:200});   
               // citems.items.push({html:<b>&nbsp;</b>,height:70});      
            } 
        else if (citems && citems.items && citems.items.length > 0 && !citems.items[0].html) {
            citems.items.unshift({html:buttons,height:80});   
             citems.items.unshift({html:<b>&nbsp;</b>,height:70});   
           // citems.items.push({html:<b>&nbsp;</b>,height:200});   
            //citems.items.push({html:<b>&nbsp;</b>,height:70});   
        }  
         this.currentPlaylistItems = citems;      
       // console.log(['PL ren',citems.items]);
        if (citems && citems.items && citems.items.length > 2 ) {   // allow for buttons
            //console.log([window.innerHeight,window.innerWidth,citems.items.length,that._getRowHeight()]);
            //let initOffset = (this.props.searchResultsScrollToIndex && this.props.searchResultsScrollToIndex.hasOwnProperty('playlist')) ? this.props.searchResultsScrollToIndex.playlist : 0;
            let initOffset = ((this.props.currentTrack+3) * 70) ;
           // console.log(['OFFSET',this.props.currentTrack,initOffset]);
            //let paddingTop='0em'; //Utils.isMobile() ? '2em' : '2em';
            //if (this.props.hideHeader) paddingTop='0em'; 
            //style={{paddingTop:paddingTop}}
           let height = this.props.height*0.9;
            if (Utils.isMobile()) height = height * 1.7;
            
            return (
             
                <div className='playlist' style={{textAlign:'left',clear:'both',paddingTop:'0px',marginTop:'2em'}}>
                {this.state.showNewPlaylist && <span style={{position:'fixed',right:0,top:'5em',backgroundColor:'white',zIndex:'99999',padding:'1em'}}><form onSubmit={(e) => {e.preventDefault() ; return false}} ><AutoFocusTextInput className="form-control" type="text" value={this.state.newPlaylistTitle} setValue={this.updateNewPlaylistTitle} placeholder="Search" aria-label="Search" /></form>
                             <button className='btn btn-success' onClick={this.saveNewPlaylist} >Save</button>
                             <button className='btn btn-danger' onClick={this.cancelNewPlaylist} >Cancel</button></span>}
                  <div className="tracks"  >
                      <List
                          style={{position:'fixed',top:'0px',left:'0px'}}
                          ref={listRef}
                          height={height}
                          itemCount={citems.items.length}
                          itemSize={that._getRowHeight}
                          width={window.innerWidth*0.99}
                          onScroll={this.onScroll}
                          initialScrollOffset={initOffset}
                        >
                          {({ index, style }) => {return that.renderRow(index,style)}}
                        </List>
                  </div>
                 
                 </div>
                )
            
        } else {
         //   console.log(['EMPTY PL',citems]);
            if (citems) {
                return <div style={{textAlign:'left',clear:'both'}}>{buttons}
                {this._noRowsRenderer()}
                </div>;
            } else  {
                return [];
            }
        }
        // this.currentPlaylistItems = citems;
       
    };

    //render() {
        ////console.log(['PLAYLIST RENDER ',this.props.getCurrentPlaylist()]);
        ////console.log();
        ////let currentTrack = 0;
        ////let currentPlaylist = this.props.getPlaylistById(this.props.match.params.id);
        //////if (currentPlaylist < 0 || window.isNaN(currentPlaylist)) currentPlaylist=0;
        ////let that=this;
        ////console.log(this.props.match.params.id,currentPlaylist,currentTrack);
        ////let citems=this.props.playlists[currentPlaylist];
       
                        
        //let citems=this.props.getCurrentPlaylist();
        
        //if (citems && citems.items && citems.items.length > 0 ) { 
        ////if (true) {    
          ////if (citems.items.length) { 
            //let items = citems.items.map((item, key) => {
               //// console.log(['CHECK SEL',this.props.currentTrack,key]);
                //let selected=(this.props.currentTrack === key) ? {backgroundColor:'lightgrey'} : {};
                //let artist='';
                //if (item.artist) artist=<b>{item.artist}</b>;
                //return (<li className='list-group-item' key={item._id+"-"+key} style={selected} >
                
                //<div style={{float:'left',width:'70%', height: '3em' }} onClick={() => this.selectTrack(this.props.currentPlaylist,key)} ><span>{artist}  {item.title}  </span>
                //</div>
                //<button className='btn' style={{float:'right',width:'6em'}} onClick={() => this.props.removeTrack(this.props.currentPlaylist,key)}  ><DeleteButton/></button></li>);
              
            //})
            //return (
                //<div>
                  //<ul className="tracks list-group"  style={{marginLeft: '0px', paddingLeft: '0px', textAlign:'left'}}>
                    
                    //{buttons}
                     //<div className='list-group-item' ><h3>Playlist - <b>{citems.title}</b></h3></div>
                      //{items}
                  //</ul>
                 //</div>
                //)
                
            
          //} else {
                //return <div>
                //{buttons}
                //<br/>
                //<br/>
                //<Link to="/meeka/search" ><button>Add some tracks</button></Link>
                
                //</div>
          //}
        ////} 
    //};
}
