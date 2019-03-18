import React from 'react';
import 'whatwg-fetch'
import LibraryList from './LibraryList'
//import {debounce} from 'throttle-debounce';
//import TagSearch from './TagSearch'
import SearchComponent from './SearchComponent'
import Tags from './Tags'
//import Utils from './Utils'

export default class LibrarySearch extends SearchComponent {
    
    constructor(props) {
        super(props);
        this.search = this.search.bind(this); //debounce(500,
        
    };
    
    componentDidMount() {
        // redirect to youtube search if not logged in
        if (this.props.isLoggedIn()) {
            SearchComponent.prototype.componentDidMount.call(this);
        } else {
            this.props.history.push("/meeka/jamendo");
        }
    };
    
   
    
    render() {
      //  let that = this;
        //console.log('local serch');
        //console.log(this.props);
        //return (
        //<div>{JSON.stringify(this.props.searchResults.local)}</div>
        //)
        //let list = this.props.artists;
        //if (this.props.searchResults && this.props.searchResults.local && this.props.searchResults.local.length > 0) {
        
        if ((this.props.hasOwnProperty('searchFilter') && this.props.searchFilter.trim().length > 1) || (this.props.hasOwnProperty('searchFilterTag') && this.props.searchFilterTag.length > 0)) {
            let    list = this.props.searchResults && Array.isArray(this.props.searchResults.local) ? this.props.searchResults.local : [];
            //}
            let paddingTop='0em';//Utils.isMobile() ? '5em' : '3em';
            //if (this.props.hideHeader) paddingTop='0em'; 
            //style={{paddingTop:paddingTop}}
            return (
                <div style={{paddingTop:paddingTop}}> 
                     <LibraryList {...this.props} buttons={this.props.buttons} artists={list}  title="Library Search" ></LibraryList>
                </div>
            )            
        } else {
            let tagsRen = <Tags tags={this.props.tags} history={this.props.history} setSearchFilterTag={this.props.setSearchFilterTag} filterTags={this.props.filterTags} />
            return <div>{!this.props.hideHeader && this.props.buttons}<br/><br/><br/> {tagsRen}</div>;
            //this.props.setRenderedTags(tagsRen)
            //return this.props.renderedTags;
        }

    }     

};

//{this.state.tracks && this.state.tracks.length === 0 && <b>No matching tracks</b>}
