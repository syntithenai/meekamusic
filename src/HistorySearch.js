import React from 'react';
import 'whatwg-fetch'
//import LibraryList from './LibraryList'
//import FlatTrackList from './FlatTrackList'
import HistoryList from './HistoryList'
//import {debounce} from 'throttle-debounce';
//import TagSearch from './TagSearch'
import SearchComponent from './SearchComponent'
//import LibrarySearch from './LibrarySearch'
//import Utils from './Utils'
//import Tags from './Tags'
 export default class HistorySearch extends SearchComponent {
    
    
    
    //componentDidMount() {
        //SearchComponent.prototype.componentDidMount.call(this);
    //};
 
    
    search() {
		let props = this.props.match.params;
		console.log(this.props);
		let filter = props.search ? props.search : '';
        let filterTag = props.tag ? props.tag : '';
        let filterArtist = props.artist ? props.artist : '';
        let filterAlbum = props.album ? props.album : '';
      
        let endPoint = 'history';
        let that = this;
        //console.log(['LS ',filter,filterTag]);
        let limit=1000;
        // prerequisites
        //if (this.props.artists && this.props.artists.length > 0) {
           // console.log('LS A');
            //console.log('LS A');
            //console.log(allArtistsIndex);
          //  if ((filter && filter.trim().length > 1) || (filterTag && filterTag.trim().length > 0 )) {
                //let allArtistsIndex = {};
                //for (let ai in this.props.artists) {
                    //allArtistsIndex[this.props.artists[ai].title] = this.props.artists[ai];
                //}
             //   console.log('LS F');
               // let that = this;
                let userId = this.props.user && this.props.user._id ? this.props.user._id : 'none';
            //    console.log(['LOCAL SERCH-' ,filter,filterTag]);
                this.props.startWaiting();
                this.props.fetchData(this.props.apiUrl+"/"+endPoint+'?userId='+userId+'&search='+filter+'&artist='+filterArtist+'&album='+filterAlbum+'&tag='+filterTag+'&limit='+limit)
                .then(function(json) {
                    // collate by day
                    let byDay={}
                   // console.log(['LOCALSEARCH groopu by day',json]);
                    json.map(function(val,key) {
                        if (val.playedBy && val.playedBy.hasOwnProperty(userId)) {
                            let day = parseInt(val.playedBy[userId]/86400000,10) * 86400000;
                     //       console.log(['LOCALSEARCH jave user',val.playedBy[userId],day]);
                            if (!Array.isArray(byDay[day])) {
                                
                                byDay[day] = []
                            }
                            byDay[day].push(val);
                        }
                        return null; 
                    });
                  //  console.log(['LOCALSEARCH groopu by day',byDay]);
                    
                    that.props.setSearchResults('history',byDay);
                    
                    //that.props.setSearchResultsScrollToIndex('artists',1);
                    that.props.stopWaiting();
                }).catch(function(ex) {
                    that.props.stopWaiting();
                    console.log(['song search failed', ex])
                })            
                
            //} else  {
                //that.props.setSearchResults('local',[]);
                ////that.props.setSearchResults('local',JSON.parse(JSON.stringify(this.props.artists)));
                ////return this.props.artists;
            //}
        //} else {
            //that.props.setSearchResults('local',[]);
        //}
        //let tagsRen = <Tags tags={this.props.tags} history={this.props.history} filterTags={this.props.filterTags} />
        //this.props.setRenderedTags(tagsRen)

    };
    
    
    render() {
       // let that = this;
        console.log('history render');
        console.log(this.props.searchResults.history);
        console.log('history render local');
        console.log(this.props.searchResults.local);
        
        //return (
        //<div>{JSON.stringify(this.props.searchResults.local)}</div>
        //)
        //let list = this.props.artists;
        //if (this.props.searchResults && this.props.searchResults.local && this.props.searchResults.local.length > 0) {
        
             let    list = this.props.searchResults && this.props.searchResults.history ? this.props.searchResults.history : {};
            //}
            let paddingTop= '0em'; //Utils.isMobile() ? '5em' : '3em';
            //if (this.props.hideHeader) paddingTop='0em'; 
            //style={{paddingTop:paddingTop}}
           
            return (
                <div style={{paddingTop:paddingTop}}> 
                     <HistoryList {...this.props}  items={list}  title="History" ></HistoryList>
                </div>
            )            
        

    }     

};
// <LibraryList {...this.props}  artists={list}  title="History" ></LibraryList>
//{this.state.tracks && this.state.tracks.length === 0 && <b>No matching tracks</b>}
