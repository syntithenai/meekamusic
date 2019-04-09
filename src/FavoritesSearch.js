import React from 'react';
import 'whatwg-fetch'
import LibraryList from './LibraryList'
//import Utils from './Utils'
//import {debounce} from 'throttle-debounce';
//import TagSearch from './TagSearch'
import SearchComponent from './SearchComponent'
//import Tags from './Tags'
import LibrarySearch from './LibrarySearch'

export default class FavoritesSearch extends LibrarySearch {
   
    componentDidMount() {
		console.log(['fav lSEARCH COMPONENT MOUNT']);
        SearchComponent.prototype.componentDidMount.call(this);
    };
    componentDidUpdate(props) {
		console.log(['fav  lSEARCH COMPONENT UPDATE']);
		SearchComponent.prototype.componentDidUpdate.call(this,props);
    };
    
    
   
    render() {
     //   return null;
         let    list = this.props.searchResults && Array.isArray(this.props.searchResults.local) ? this.props.searchResults.local : [];
            //}
            let paddingTop='0em'; //Utils.isMobile() ? '5em' : '3em';
            //if (this.props.hideHeader) paddingTop='0em'; 
            //style={{paddingTop:paddingTop}}
           return (
                <div style={{paddingTop:paddingTop}}> 
                   <LibraryList {...this.props}  artists={list}  title="Favorite Tracks"   ></LibraryList>
             </div>
            )  

    }     

};
//     <LibraryList {...this.props}  artists={list}  title="Favorites" ></LibraryList>
                
//{this.state.tracks && this.state.tracks.length === 0 && <b>No matching tracks</b>}
