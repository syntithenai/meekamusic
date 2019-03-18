import React from 'react';
import AutoFocusTextInput from './AutoFocusTextInput'
import {Link} from 'react-router-dom'
import FmaSearch from './FmaSearch'
import {FaSearch as SearchButton} from 'react-icons/fa';
import {FaTimesCircle as DeleteButton} from 'react-icons/fa';
import Search from './Search'

import {FaList as PlaylistButton} from 'react-icons/fa';


export default class FmaSearcher extends Search {

    render() {
        let props = Object.assign({},{enqueueTrack:this.enqueueTrack,playTrack:this.playTrack},this.props);
        let size=20;
        //let buttonStyle={marginLeft:'0.2em',float:'right',marginTop:'0.4em'};
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
     
        
        return <div className='search' style={{width:'100%'}}>
                <div style={{width:'100%'}}>
                    
                    <span style={{float:'left',clear:'both',textAlign:'left'}}>
                       
                         
                         <Link to="/meeka/playlists"  ><button className='btn'><PlaylistButton size={size} /><span className="d-none d-md-inline"> Playlists</span></button>&nbsp;</Link>
                         
                      
                    </span>
                
                    <span style={{float:'right'}}>
                    <form  style={{float:'right',backgroundColor:'lightgrey'}} onSubmit={(e) => { e.preventDefault() ; return false}}><SearchButton size={20} style={{marginTop:'0.4em',marginBottom:'0.4em',marginLeft:'0.4em'}}/>&nbsp;<AutoFocusTextInput value={this.props.searchFilter} setValue={this.searchFilterChange} setclassName="form-control" type="text"  size="20"  placeholder="Search" aria-label="Search" />
                    &nbsp;{tag}
                    </form>
                    
                    </span>
                
                    
                </div>
                
                <div style={{width:'100%', clear:'both'}}>
                    <FmaSearch  {...props} playTrack={this.playTrack} enqueueTrack={this.enqueueTrack} defaultSearch=""/>
                </div>
                
        </div>
    };
}
