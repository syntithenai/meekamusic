import React, { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import {FaSearch as SearchButton} from 'react-icons/fa';
import {FaYoutube as YoutubeButton} from 'react-icons/fa';
import {FaListUl as PlaylistsButton} from 'react-icons/fa';
import {FaUser as ProfileButton} from 'react-icons/fa';
//import {FaSignOutAlt as LogoutButton} from 'react-icons/fa';
//import {FaFire as FMAButton} from 'react-icons/fa';
//import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {FaHistory as HistoryButton} from 'react-icons/fa';
import {FaHeart as FavoritesButton} from 'react-icons/fa';
import {FaEnvira as FreshButton} from 'react-icons/fa';

export default class Menu extends Component {

    //resetPlaylists() {
        //confirmAlert({
          //title: 'Clear all your playlists',
          //message: 'Are you sure?',
          //buttons: [
            //{
              //label: 'Yes',
              //onClick: () => this.props.resetMeekaLocalStorage()
            //},
            //{
              //label: 'No'
            //}
          //]
        //}) 
    //};


    render() {
        let size=28 ;
        let buttonStyle={marginLeft:'0.2em'};
        let searchExtra='';
        if (this.props.searchFilterTag && this.props.searchFilterTag.length > 0) {
            searchExtra += "/tag/" + this.props.searchFilterTag;
        }
        if (this.props.searchFilter && this.props.searchFilter.length > 0) {
            searchExtra += "/" + this.props.searchFilter;
        }
        searchExtra = ''; //encodeURI(searchExtra);
        let searchLink = "/meeka/search" + searchExtra;
        let freshLink = "/meeka/fresh" + searchExtra;
        let historyLink = "/meeka/history" + searchExtra;
        let favoritesLink = "/meeka/favorites" + searchExtra;
        let youtubeLink = "/meeka/youtube" + searchExtra;
       // let jamendoLink = "/meeka/jamendo" + searchExtra;
        //let fmaLink = "/meeka/fma" + searchExtra;
        return <div className='menu' style={{textAlign:'left',width:'100%'}} >
            <br/>
            <div className='list'  style={{width:'100%',clear:'both'}} >
                <div className='item' style={{width:'100%'}}>
                   
                   
                    {
                   <Link to={searchLink}   ><button className='btn' style={buttonStyle} ><SearchButton  size={size}/> Library</button></Link>
                    
                    }
                    
                    <Link to="/meeka/playlists"   ><button className='btn' style={buttonStyle} ><PlaylistsButton  size={size}/> Playlists</button></Link>
                    
                    {this.props.isLoggedIn() && <Link to="/login/profile"   ><button className='btn' style={buttonStyle} ><ProfileButton  size={size}/> Profile</button></Link>}
                    {!this.props.isLoggedIn() && <Link to="/login/login"   ><button className='btn' style={buttonStyle} ><ProfileButton  size={size}/> Login</button></Link>}
                    
                    
                
                </div>
                
                {this.props.isLoggedIn() && 
                    
                <div className='item'>
                <br/>
                   <Link to={favoritesLink}   ><button className='btn' style={buttonStyle} ><FavoritesButton  size={size}/> Favorites</button></Link>
                    <Link to={historyLink}   ><button className='btn' style={buttonStyle} ><HistoryButton  size={size}/> History</button></Link>
                    <Link to={freshLink}   ><button className='btn' style={buttonStyle} ><FreshButton  size={size}/> Fresh</button></Link>
                    
                </div>}
                
               <br/>
               <br/>
                <h3 className="d-none d-md-inline" >Search the Web</h3>
                <div className='item'>
                    <Link to={youtubeLink}   ><button className='btn' style={buttonStyle} ><YoutubeButton  size={size}/> Youtube</button></Link>
                    
                </div>
                
            </div>
        </div>
    };
}
//<Link to="/meeka/search/audio"   ><button className='btn' style={buttonStyle} ><MusicButton  size={size}/> Music</button></Link>
                    //<Link to="/meeka/search/video"   ><button className='btn' style={buttonStyle} ><VideoButton  size={size}/> Video</button></Link>


                    //<Link to={jamendoLink}   ><button className='btn'  style={buttonStyle} ><img alt="Jamendo" src='/jamendo.png' style={{height:'2.2em'}} /> Jamendo</button></Link>
                    
                    //<Link to={fmaLink}   ><button className='btn'  style={buttonStyle} ><FMAButton  size={size} /> FMA</button></Link>
                    
//
      //{false && !this.props.isLoggedIn() && <button className='btn btn-danger' style={{width:'8em',float:'right',marginLeft:'0.5em'}} onClick={this.resetPlaylists.bind(this)}  >Reset Playlists</button> }
                   

//<Link to="/meeka/help"   ><button className='btn' style={buttonStyle} ><HelpButton  size={size}/> Help</button></Link>
                    
 //<Link to="/meeka/search/playlists"   ><button className='btn' style={buttonStyle} ><SearchButton  size={size}/> Playlists</button></Link>
                   
