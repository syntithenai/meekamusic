import React, { Component } from 'react';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import AutoFocusTextInput from './AutoFocusTextInput'
import {FaTimesCircle as DeleteButton} from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
//import Utils from './Utils'
//import {FaBook as LibraryButton} from 'react-icons/fa';

import {FaSearch as SearchButton} from 'react-icons/fa';
import samplePlaylists from './sample_playlists_meeka';

export default class Playlists extends Component {
    
    constructor(props) {
        super(props);
        this.showNewPlaylist = this.showNewPlaylist.bind(this);
        this.saveNewPlaylist = this.saveNewPlaylist.bind(this);
        this.cancelNewPlaylist = this.cancelNewPlaylist.bind(this);
        this.updateNewPlaylistTitle = this.updateNewPlaylistTitle.bind(this);
        this.selectSamplePlaylist = this.selectSamplePlaylist.bind(this);
        this.selectPlaylist = this.selectPlaylist.bind(this);
        
        this.state = {
            showNewPlaylist:false,
            newPlaylistTitle:''
        }
    }
    
    
    showNewPlaylist () {
        this.setState({showNewPlaylist:true,newPlaylistTitle:''});
    }
    
    saveNewPlaylist () {
        let that = this;
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
        //let title = event.target.value;
       // console.log('uptit'+title);
        let newState={'newPlaylistTitle':title};
        this.setState(newState);
    };
    
    deletePlaylist(e,playlistTitle,playlistKey) {
        e.preventDefault();
        confirmAlert({
          title: 'Delete the playlist - '+playlistTitle,
          message: 'Are you sure?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.props.deletePlaylist(playlistKey)
            },
            {
              label: 'No'
            }
          ]
        }) 
        return false;
    };
    
    selectPlaylist(e,item) {
        let that = this;
        that.props.history.push('/meeka/playlist/'+item._id);
        setTimeout(function() {
            that.props.play();
        },1000);
    };
    
    selectSamplePlaylist(e,item) {
        let that = this;
        console.log(['selectSamplePlaylist,',item])
        this.props.newPlaylist(item.title,item.items,item._id).then(function() {
            that.props.history.push('/meeka/playlist/'+item._id);
            setTimeout(function() {
                that.props.play();
            },1000);
            
        });
        
        
        //item.userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
        //this.props.postData(that.props.apiUrl+'/saveplaylist',item).then(function() {
            //let final = that.props.playlists;
            //final.push(item);
            //that.props.setPlaylists(final);
            //that.props.setPlaylist(final.length -1);
            
        //});
        //setTimeout(function() {
            
        //},1000);
        
    };
    
    //<Link to="/meeka/playlist"  ><button className='btn'><PlayButton size={size} /><span className="d-none d-md-inline"> Current Playlist</span></button>&nbsp;</Link> <Link to="/meeka/menu"   ><button className='btn'  ><MenuButton  size={size}/><span className="d-none d-md-inline"> More</span></button></Link>
    render() {
        let size=20;
        let searchLink = "/meeka/search";
        if (this.props.searchFilterTag && this.props.searchFilterTag.length > 0) {
            searchLink += "/tag/" + encodeURI(this.props.searchFilterTag);
        }
        if (this.props.searchFilter && this.props.searchFilter.length > 0) {
            searchLink += "/" + encodeURI(this.props.searchFilter);
        }
        
        //console.log(this.props);
        let newButton=<div   className='buttons' key="newbuttonkey" style={{textAlign:'left'}}>
            <span style={{ float: 'left',clear:'both'}}>
                       
                        {this.props.isLoggedIn() && <Link to={searchLink}   ><button className='btn'  ><SearchButton  size={size}/><span className="d-none d-md-inline"> Library</span></button>&nbsp;</Link>}
                        
                </span>        
                         
                <span style={{ float: 'right'}}>
                       
                        
                        {!this.state.showNewPlaylist && <button style={{float:'right'}} onClick={this.showNewPlaylist} className='btn btn-success' >
                        New
                        </button>} 
                         {this.state.showNewPlaylist && <span  style={{padding:'1em',position:'fixed',right:0,top:'5em',backgroundColor:'white',zIndex:'99999'}}><form onSubmit={(e) => {e.preventDefault() ; return false}} ><AutoFocusTextInput className="form-control" type="text" value={this.state.newPlaylistTitle} setValue={this.updateNewPlaylistTitle} placeholder="Search" aria-label="Search" /></form>
                         <button className='btn btn-success' onClick={this.saveNewPlaylist} >Save</button>
                         <button className='btn btn-danger' onClick={this.cancelNewPlaylist} >Cancel</button></span>}
                </span>
            </div>
                    
        if (this.props.playlists) { 
            let items = this.props.playlists.map((item, key) => {
               
                    let oddEven = (key%2===0) ? "even" : "odd";
                    let selected=(parseInt(this.props.currentPlaylist,10) === parseInt(key,10) ) ? 'item selected '+oddEven : 'item '+oddEven;
                
                    return <div className={selected} key={key}><button className='btn' style={{float:'right'}} onClick={(e) => this.deletePlaylist(e,item.title,key)}  ><DeleteButton/></button><div onClick={(e) => this.selectPlaylist(e,item)}   >{item.title}</div></div>
                
            })
            let sampleitems = samplePlaylists.map((item, key) => {
                    //let oddEven = (key%2===0) ? "even" : "odd";
                    //let selected=(this.props.currentTrack === key) ? 'item selected '+oddEven : 'item '+oddEven;
                
                    return <span  style={{marginLeft: '0.1em'}} key={key} onClick={(e) => this.selectSamplePlaylist(e,item)} ><button className='btn' >{item.title}</button></span>
                
              
            })
            let paddingTop='0em'; //Utils.isMobile() ? '5em' : '3em';
            
            //if (this.props.hideHeader) paddingTop='0em'; 
            //style={{paddingTop:paddingTop}}
           
            return (
            <div style={{paddingTop:paddingTop}}>
             {newButton}
                
              <div className="playlists tracks list"  style={{textAlign:'left',clear:'both'}}>
                {sampleitems.length  > 0 && <span>  <h3>Featured</h3>
                {sampleitems}</span>}
                <br/>
                   {
                    items
                  }
               
              </div>
            </div>
            )

        } else {
            return <div>{newButton}</div>
        }
    };
}
