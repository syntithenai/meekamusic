import React from 'react';
import 'whatwg-fetch'
import FlatTrackList from './FlatTrackList'
//import {debounce} from 'throttle-debounce';
//import TagSearch from './TagSearch'
import SearchComponent from './SearchComponent'
import * as youtubeSearch from "youtube-search";

 //YTSearch({key: API_KEY, term: term}, videos => this.setState({videos: videos, selectedVideo: videos[0]}))
        
export default class YouTubeSearch extends SearchComponent {
    
    search(filter,filterTag,limit) {
        let that = this;
        if (filter && filter.length > 0) {
            this.props.startWaiting();
            var opts: youtubeSearch.YouTubeSearchOptions = {
              maxResults: limit,
              key: this.props.googleYouTubeApiKey,
              type:'video'
            };

            this.props.startWaiting();
            youtubeSearch(filter, opts, (err, results) => {
                let finalResults=[];
                for (let a in results) {
                    let result = results[a];
                    let newResult={title:result.title,artist:result.channelTitle,description:result.description,url:result.link, type:'video',albumart:result.thumbnails.default.url,expanded:true};
                    finalResults.push(newResult);
                }
              if(err) return console.log(err);
              //console.log('YTSEAR');
              //console.log(finalResults);
              that.props.setSearchResults('youtube',finalResults);
              that.props.stopWaiting();
            });             
        } else {
            that.props.setSearchResults('youtube',[]);
        }
    };
    
    render() {
        return (
            <div> 
                <h4>YouTube Search</h4>
                {this.props.searchResults && this.props.searchResults.youtube && this.props.searchResults.youtube.length>0 && <FlatTrackList {...this.props}   items={this.props.searchResults.youtube}  ></FlatTrackList>}
                
            </div>
        )
    }   
};
     
     
