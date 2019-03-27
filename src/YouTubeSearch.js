import React from 'react';
import 'whatwg-fetch'
import FlatTrackList from './FlatTrackList'
//import {debounce} from 'throttle-debounce';
//import TagSearch from './TagSearch'
import SearchComponent from './SearchComponent'
import * as youtubeSearch from "youtube-search";

 //YTSearch({key: API_KEY, term: term}, videos => this.setState({videos: videos, selectedVideo: videos[0]}))
        
export default class YouTubeSearch extends SearchComponent {
    
    constructor(props) {
		super(props);
		this.search = this.search.bind(this);
	}
	
	componentDidMount() {
        SearchComponent.prototype.componentDidMount.call(this);
    };
 
    
    search(filter,filterTag,limit) {
        let that = this;
        if (filter && filter.length > 0) {
            this.props.startWaiting();
            var opts: youtubeSearch.YouTubeSearchOptions = {
              maxResults: limit,
              key: this.props.youTubeApiKey,
              type:'video'
            };

            this.props.startWaiting();
            youtubeSearch(filter, opts, (err, results) => {
                let finalResults=[];
                console.log(results);
                for (let a in results) {
                    let result = results[a];
                    let url = 'https://www.youtube.com/embed/'+result.id;
                    let newResult={title:result.title,artist:result.channelTitle,description:result.description,url:url, type:'video',albumart:result.thumbnails && result.thumbnails.default ? result.thumbnails.default.url : '',expanded:true};
                    finalResults.push(newResult);
                }
                //for (let a in results.items) {
                    //let result = results[a];
                    //let id = result.id ? result.id : {};
                    //let snippet = result.snippet ? result.snippet : {};
                    //let url = 'https://www.youtube.com/embed/'+id.videoId;
                    //let newResult={title:snippet.title,snippet:result.channelId,description:snippet.description,url:url, type:'video',albumart:result.thumbnails.default.url,expanded:true};
                    //finalResults.push(newResult);
                //}
                //<iframe width="560" height="315" src="https://www.youtube.com/embed/RVmG_d3HKBA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              if(err) return console.log(err);
              console.log('YTSEAR');
              console.log(finalResults);
              that.props.setSearchResults('youtube',finalResults);
              that.props.stopWaiting();
            });             
        } else {
            that.props.setSearchResults('youtube',[]);
        }
    };
       //for (let a in results.items) {
                    //let result = results[a];
                    //let id = result.id ? result.id : {};
                    //let snippet = result.snippet ? result.snippet : {};
                    //let url = 'https://www.youtube.com/embed/'+id.videoId;
                    //let newResult={title:snippet.title,snippet:result.channelId,description:snippet.description,url:url, type:'video',albumart:result.thumbnails.default.url,expanded:true};
                    //finalResults.push(newResult);
                //}
    render() {
        return (
            <div> 
                <h4>YouTube Search</h4>
                {this.props.searchResults && this.props.searchResults.youtube && this.props.searchResults.youtube.length>0 && <FlatTrackList {...this.props}   items={this.props.searchResults.youtube}  ></FlatTrackList>}
                
            </div>
        )
    }   
};
     
     
