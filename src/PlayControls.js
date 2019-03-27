import React, { Component } from 'react';

import {FaForward as NextButton} from 'react-icons/fa';
import {FaBackward as PreviousButton} from 'react-icons/fa';
import {FaPlay as PlayButton} from 'react-icons/fa';
import {FaPause as PauseButton} from 'react-icons/fa';
import {FaList as ListButton} from 'react-icons/fa';
//import {FaBars as Bars} from 'react-icons/fa';
//import {FaSearch as SearchButton} from 'react-icons/fa';
//import {FaHeart as SearchButton} from 'react-icons/fa';
import LikeButton from './LikeButton'
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { withMediaProps } from 'react-media-player'

//import MusicButton from 'react-icons/lib/fa/music';
//import MicrophoneButton from 'react-icons/lib/fa/microphone';
//import HeadphonesButton from 'react-icons/lib/fa/headphones';
//import {FaRandom as ShuffleButton} from 'react-icons/fa';
//import {FaRedo as RepeatSingleButton} from 'react-icons/fa';
//import {FaSync as RepeatAllButton} from 'react-icons/fa';


export default withMediaProps(class PlayControls extends Component {

    constructor(props) {
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.showPlaylist = this.showPlaylist.bind(this);
    };
    
    clickProgress(e) {
        //console.log('CLICK PROG');
        if (this.props.media) {
            let percentage = (e.pageX - e.target.offsetLeft)/ e.target.offsetWidth;
           // console.log(percentage);
            let newPos = percentage * this.props.media.duration;
           // console.log(newPos);
            this.props.seekTo(newPos);
        }
    };
    
    showMenu() {
      //  console.log(this.props);
        let current = this.props.getCurrentTrack();
        if (current && current.type && current.type==="video") this.props.pause();
        this.props.history.push("/meeka/search");
    };
    
    showPlaylist() {
        let current = this.props.getCurrentTrack();
        if (current && current.type && current.type==="video") this.props.pause();
        this.props.history.push("/meeka/playlist");
    };
    

    render() {  
       // console.log(this.props.showingPlayControls);
        if (this.props.currentPlaylist >= 0 && this.props.playlists && this.props.playlists.length > this.props.currentPlaylist && this.props.playlists[this.props.currentPlaylist].items && this.props.playlists[this.props.currentPlaylist].items.length > 0 && this.props.showingPlayControls) {
            
            let currentTrack = this.props.getCurrentTrack();
            
            let buttonSize=33;
            let playBoost=15;
            let progressPercent=parseInt(this.props.media.currentTime/this.props.media.duration*10000,10)/100+'%';
            //console.log(progressPercent);
            return <div className="playcontrols" style={{zIndex:'999',position: 'fixed', bottom: '0', width:'100%', backgroundColor:'black', height: '7em',padding: '0.05em', border:'1px solid black'}}>
              <div className='progressbar' onClick={(e) => this.clickProgress(e)} style={{height: '0.8em',width:'100%', backgroundColor:'lightgrey', marginBottom: '0.2em'}} >
                <div className='progressbarinner' style={{height: '0.8em',width:progressPercent, backgroundColor:'green',opacity:'0.7'}} >&nbsp;</div>
              </div>
              
              <div className='titlebar' onClick={(e) => this.clickProgress(e)} style={{height: '0.8em',width:'100%', backgroundColor:'black',color:'white', marginBottom: '1.2em'}} >{currentTrack ? currentTrack.artist : ''} - {currentTrack ? currentTrack.title : ''} </div>
              
              <div className='meekaButtons' style={{paddingBottom: '0.2em'}} >
                  <LikeButton apiUrl={this.props.apiUrl} fetchData={this.props.fetchData} toggleCurrentFavorite={this.props.toggleCurrentFavorite} currentTrack={currentTrack} user={this.props.user} />
                  <button className='btn' style={{marginLeft:'0.7em', marginTop:'0.8em'}} ><PreviousButton onClick={this.props.previousTrack} size={buttonSize} /></button>
                  <button  className='btn'  onClick={this.props.togglePlayback} style={{marginLeft:'0.7em',marginRight:'0.7em'}} >
                    {!this.props.media.isPlaying && <PlayButton size={buttonSize+playBoost}/>}
                    {this.props.media.isPlaying && <PauseButton size={buttonSize+playBoost}/>}
                    </button>
                  <button  className='btn'style={{ marginTop:'0.8em'}} ><NextButton  onClick={this.props.nextTrack} size={buttonSize}/></button>
               
                  <button onClick={this.showPlaylist} className='btn'  style={{float:'right', marginTop:'0.8em'}} ><ListButton  size={buttonSize}/></button>
              </div>
            </div>
            
        } else return '';
    };
});

 //{(true || this.props.playMode==="shuffle" || this.props.playMode==="repeatsingle" || this.props.playMode==="repeat") && 
              //<button  className='btn'>
              //{this.props.playMode==="shuffle" && <ShuffleButton size={buttonSize}/>}
              //{this.props.playMode==="repeatsingle" && <RepeatSingleButton size={buttonSize}/>}
              //{this.props.playMode==="repeat" && <RepeatAllButton size={buttonSize}/>}  
              //<RepeatAllButton size={buttonSize}/>
              //</button>
            //}
            
