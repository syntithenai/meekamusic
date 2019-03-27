import React from 'react';
import 'whatwg-fetch'
import FlatTrackList from './FlatTrackList'
import SearchComponent from './SearchComponent'
import ObjectId from 'objectid-browser';
//let config = require('./config');
import Utils from './Utils'

export default class JamendoSearch extends SearchComponent {
      
    componentDidMount() {
        SearchComponent.prototype.componentDidMount.call(this);
    };
 
      
      search(filter,filterTag,limit) {
        limit=20;
        this.props.startWaiting();
        let that = this;
         let extra='';
        if (filterTag) {
            extra='&fuzzytags='+filterTag;
        }
         
        this.props.fetchData(this.props.apiUrl+"/jamendosearchproxy?limit="+limit+"&filter="+filter+extra)
        .then(function(json) {
            let final=[];
            if (json.results) {
                for (let a in json.results) {
                    let song = json.results[a];
                 //   console.log(typeof line,line);
                   //if (typeof line === "string" && line.length > 0) {
                        //let idStart=line.lastIndexOf("(");
                        //let idEnd=line.lastIndexOf(")");
                        //let artistStart=line.indexOf("[");
                        //let artistEnd=line.indexOf("]");
                        //let artist=line.substring(artistStart+1,artistEnd);
                        //let title = line.substring(artistEnd + 1,idStart -1);
                            
                        //let id=line.substring(idStart+1,idEnd);
                        ////console.log(idStart,idEnd,id,artistStart,artistEnd,artist,title);
                        let htmldecode = Utils.htmldecode
                        let genres=''
                        if (song.musicinfo && song.musicinfo.tags && song.musicinfo.tags.genres) {
							genres = song.musicinfo.tags.genres.join(",")
						}
                        let record={_id: new ObjectId().toString(),jamendoId: song.id,title:htmldecode(song.name),artist:htmldecode(song.artist_name),url:song.audiodownload,albumart:song.image,genre:genres,expanded: true}
                        final.push(record)    
                }
                that.props.setSearchResults('jamendo',final)
                that.props.stopWaiting()
            }
            
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
        
    };
    
    render() {
        return (
            <div> 
                <h4>Jamendo Search</h4>
                {this.props.searchResults && this.props.searchResults.jamendo && this.props.searchResults.jamendo.length>0 && <FlatTrackList {...this.props}  tagSearchType="jamendo"  items={this.props.searchResults.jamendo}  ></FlatTrackList>}
                
            </div>
        )
    }  
};
