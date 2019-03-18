import React from 'react';
import 'whatwg-fetch'
import LibraryList from './LibraryList'
//import {debounce} from 'throttle-debounce';
//import TagSearch from './TagSearch'
import SearchComponent from './SearchComponent'
//import Tags from './Tags'
//import Utils from './Utils'
import LibrarySearch from './LibrarySearch'

export default class FreshSearch extends LibrarySearch {
    
    //constructor(props) {
        //super(props);
      ////  this.search = this.search.bind(this); //debounce(500,
    //};
    
    componentDidMount() {
        // redirect to youtube search if not logged in
        if (this.props.isLoggedIn()) {
            SearchComponent.prototype.componentDidMount.call(this);
        } else {
            this.props.history.push("/meeka/jamendo");
        }
    };
    
    
    render() {
        let paddingTop='0em'; //=Utils.isMobile() ? '7em' : '5em';
        //if (this.props.hideHeader) paddingTop='0em'; 
         let    list = this.props.searchResults && Array.isArray(this.props.searchResults.local) ? this.props.searchResults.local : [];
            //}
            return (
                <div style={{paddingTop:paddingTop}}> 
                     <LibraryList {...this.props}  artists={list}  title="Fresh Tracks"   ></LibraryList>
                </div>
            )  

    }     

};

//{this.state.tracks && this.state.tracks.length === 0 && <b>No matching tracks</b>}
