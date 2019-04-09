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
    
    //componentDidMount() {
		//console.log(['lSEARCH COMPONENT MOUNT']);

        //SearchComponent.prototype.componentDidMount.call(this);
    //};
    //componentDidUpdate(props) {
		//console.log(['lSEARCH COMPONENT UPDATE']);
		//SearchComponent.prototype.componentDidUpdate.call(this,props);
    //};
    
   
    
    render() {
		//console.log('LS');
		let props = this.props.match.params;
		console.log(this.props);
		let filter = props.search ? props.search : '';
        let filterTag = props.tag ? props.tag : '';
        let filterArtist = props.artist ? props.artist : '';
        let filterAlbum = props.album ? props.album : '';
        
		
	    //if search filter changes, update results and scroll to top
	   if (filter.length > 0 || filterTag.length > 0 || filterArtist.length > 0 || filterAlbum.length > 0) {
	//	
      //  let that = this;
        console.log('local serch');
        //console.log(this.props);
        //return (
        //<div>{JSON.stringify(this.props.searchResults.local)}</div>
        //)
        //let list = this.props.artists;
        //if (this.props.searchResults && this.props.searchResults.local && this.props.searchResults.local.length > 0) {
        
        //if ((this.props.hasOwnProperty('searchFilter') && this.props.searchFilter && this.props.searchFilter.trim().length > 1) || (this.props.hasOwnProperty('searchFilterTag') && this.props.searchFilterTag && this.props.searchFilterTag.length > 0) || (this.props.hasOwnProperty('searchFilterArtist') && this.props.searchFilterArtist && this.props.searchFilterArtist.length > 0) || (this.props.hasOwnProperty('searchFilterAlbum') && this.props.searchFilterAlbum && this.props.searchFilterAlbum.length > 0)) {
            let list = this.props.searchResults && Array.isArray(this.props.searchResults.local) ? this.props.searchResults.local : [];
            //if (list && list.length > 0) {
				//if (endPoint==="fresh") {
				//extraFilter = "&tags="+(this.props.user && this.props.user.tags ? this.props.user.tags : '');
				//if (this.props.user && this.props.user.expandedArtists) {
					//extraFilter += "&filterArtists="+Object.keys(this.props.user.expandedArtists).join(",");
				//}
			//}//}
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
