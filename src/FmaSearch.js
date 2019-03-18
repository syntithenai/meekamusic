import React from 'react';
import 'whatwg-fetch'
import FlatTrackList from './FlatTrackList'
import SearchComponent from './SearchComponent'
import ObjectId from 'objectid-browser';

//let config = require('./config');


export default class FmaSearch extends SearchComponent {
	
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
	}
    
    search(filter,filterTag,limit) {
        limit=10;
        this.props.startWaiting();
        let that = this;
        
        
      //'https://freemusicarchive.org/api/get/tracks.json?limit=1&track_id=' + song.fma_id + '&api_key=' + freeMusicArchiveApiKey}
     // console.log(['FMA SEARCH'])
      
        this.props.fetchData(this.props.apiUrl+'/fmasearchproxy?filter='+filter+'&limit='+limit)
        .then(function(response) {
          //  console.log(['got response', response])
            return response.json()
        }).then(function(json) {
            let final=[];
           // console.log(json.aRows);
            let promises=[];
                            
            if (json.aRows) {
                for (let a in json.aRows) {
                    let line = json.aRows[a];
                 //   console.log(typeof line,line);
                    if (typeof line === "string" && line.length > 0) {
                        let idStart=line.lastIndexOf("(");
                        let idEnd=line.lastIndexOf(")");
                        let artistStart=line.indexOf("[");
                        let artistEnd=line.indexOf("]");
                        let artist=line.substring(artistStart+1,artistEnd);
                        let title = line.substring(artistEnd + 1,idStart -1);
                            
                        let id=line.substring(idStart+1,idEnd);
                        //console.log(idStart,idEnd,id,artistStart,artistEnd,artist,title);
                        let record={fmaId: id,title:title,artist:artist,url:'https://freemusicarchive.org/api/get/tracks.json/download?track_id='+id};
                        final.push(record);    
                        if (id && parseInt(id,10) > 0) {
                            promises.push( new Promise(function(resolve,reject) {
                                setTimeout(function() {
                        
                                    that.props.fetchData(that.props.apiUrl+'/fmadetailsproxy?id='+id)
                                    .then(function(response) {
                                        return response.json()
                                    }).then(function(json) {
                                      // console.log(['got details', json.dataset[0]])
                                       if (json.dataset && json.dataset.length > 0) {
                                           record.album = json.dataset[0].album_title;
                                           record.albumart = json.dataset[0].track_image_file;
                                           record.fmaUrl = json.dataset[0].track_url;
                                           record._id = new ObjectId().toString();
                                           let genres=[];
                                           if (json.dataset[0].track_genres) {
                                               for (let c in json.dataset[0].track_genres) {
                                                   genres.push(json.dataset[0].track_genres[c].genre_title.toLowerCase());
                                               }
                                               record.genre = genres.join(",");  
                                               
                                           }
                                           record.expanded = true;
                                            //record.url = '/fmadownloadproxy?url='+record.fmaUrl;
                                            record.url = record.fmaUrl+'/download';
                                            //console.log(record);
                                            resolve(record);                                                             
                                       } else {
                                           resolve(record);                                                             
                                       }
                                    }).catch(function(e) {
                                     //   console.log(e);
                                        resolve(record);
                                    });
                                },a*200);
                            }));
                        }
                        
                    }
                }
                // initial results
                that.props.setSearchResults('fma',final);
                that.props.stopWaiting();
                // detailed results
                Promise.all(promises).then(function(final) {
                    //console.log('FINAL');
                    //console.log(final);
                    that.props.setSearchResults('fma',final);
                    
                });       
            }
            
        }).catch(function(ex) {
            console.log(['song search failed', ex])
        })
        
    };
    
    render() {
        return (
            <div> 
                <h4>Free Music Archive Search</h4>
                {this.props.searchResults && this.props.searchResults.fma && this.props.searchResults.fma.length>0 && <FlatTrackList {...this.props}    items={this.props.searchResults.fma}   ></FlatTrackList>}
                
            </div>
        )
    }  
};
