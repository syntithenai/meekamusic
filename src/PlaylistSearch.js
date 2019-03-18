 import React, { Component } from 'react';
import 'whatwg-fetch'
import TrackList from './TrackList'

export default class PlaylistSearch extends Component {
    constructor(props) {
        super(props);
        this.state={}
        this.search = this.search.bind(this);
    };
    
    search(filter) {
        //console.log(['PL SERCH'+filter,this.props]);
        if (!filter) filter='';
        let combined={};
        for (let key in this.props.playlists) {
            if (this.props.playlists[key] && this.props.playlists[key].items) {
                for (let ikey in this.props.playlists[key].items) {
                    if (this.props.playlists[key].items[ikey] && this.props.playlists[key].items[ikey]._id) {
                        combined[this.props.playlists[key].items[ikey]._id] = this.props.playlists[key].items[ikey];
                    }
                    
                }
            }
        }
        //console.log(combined);
        let tracks=[];
        for (let key in combined) {
            if ((combined[key].title && combined[key].title.toLowerCase().indexOf(filter.toLowerCase()) >= 0 )
                || (combined[key].artist && combined[key].artist.toLowerCase().indexOf(filter.toLowerCase()) >= 0 )
                || (combined[key].album && combined[key].album.toLowerCase().indexOf(filter.toLowerCase()) >= 0 )
                || (combined[key].tags && combined[key].tags.toLowerCase().indexOf(filter.toLowerCase()) >= 0 )
            ) {
               tracks.push(combined[key]); 
            }
        }
        //this.setState({tracks:tracks});
        this.props.setSearchResults('playlist',tracks);
    };
        
    
    componentDidMount() {
        //console.log(['PL SERCH mnt',this.props.filter]);
        this.search(this.props.filter);
    }
    
    componentWillReceiveProps(props) {
        //console.log(['PL SERCH rcv',props.filter]);
      this.search(this.props.filter);
    }
    

    render() {
       
        return (
            <div > 
                {this.props.searchResults && this.props.searchResults.length>0 && <TrackList {...this.props} items={this.props.searchResults} ></TrackList>}
                
            </div>
        )
    }
};
//{(!this.state.tracks || this.state.tracks.length === 0) && <b>No matching tracks</b>}
