import React, { Component } from 'react';
import {FaHeart} from 'react-icons/fa';

export default class LikeButton extends Component {

    constructor(props) {
        super(props);
        this.state={isFavorite:false,currentTrack:null}
        this.toggleFavorite = this.toggleFavorite.bind(this);
    };
        

    static getDerivedStateFromProps(props,state) {
       // console.log(['getDerivedStateFromProps']);
        //let that = this;
        let userId = (props.user && props.user._id && props.user._id.length > 0) ? props.user._id : '';
        let currentTrack = props.currentTrack;
        //let trackId = (currentTrack && currentTrack._id && currentTrack._id.length > 0) ? currentTrack._id : '';
        if (currentTrack && currentTrack.favoriteOf && currentTrack.favoriteOf[userId]) {
            //that.setState({isFavorite:true});
            return {isFavorite:true};
        } else {
            return {isFavorite:false};
        }
        //fetch('/isfavorite?userId='+userId+'&trackId='+trackId)
        //.then(function(response) {
            //return response.text()
        //})
        //.then(function(res) {
            //console.log(['UPDATE mount LIKE YES',res]);
             //if (res==="yes") {
                 //that.setState({isFavorite:true,currentTrack:currentTrack._id});
             //}
        //});
    };
        
        //componentWillUpdate() {
            ////let that = this;
            ////let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
            ////let currentTrack = this.props.currentTrack;
            ////let trackId = (currentTrack && currentTrack._id && currentTrack._id.length > 0) ? currentTrack._id : '';
            ////if (currentTrack && currentTrack.favoriteOf && currentTrack.favoriteOf[userId]) {
                ////that.setState({isFavorite:true});
            ////} else {
                ////that.setState({isFavorite:false});
            ////}
        ////let that = this;
            ////let currentTrack = this.props.currentTrack ;
            ////let trackId = (currentTrack && currentTrack._id && currentTrack._id.length > 0) ? currentTrack._id : '';
            ////if (this.state.currentTrack != trackId) {
                ////let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
                ////fetch('/isfavorite?userId='+userId+'&trackId='+trackId)
                ////.then(function(response) {
                    ////return response.text()
                ////})
                ////.then(function(res) {
                    ////console.log(['UPDATE LIKE YES',res]);
                     ////if (res==="yes") {
                         ////that.setState({isFavorite:true,currentTrack:trackId});
                     ////}
                ////});
            ////}
        //};
    
    //shouldComponentUpdate(prevProps) {
        ////if (prevProps.isFavorite != this.props.isFavorite || prevProps.isFavorite != this.props.isFavorite ) {
            ////return true;
        ////} else {
            ////return false;
        ////}
        //let that = this;
        //let currentTrack = this.props.currentTrack;
        //let trackId = (currentTrack && currentTrack._id && currentTrack._id.length > 0) ? currentTrack._id : '';
        //if (this.state.currentTrack != trackId) {
            //return true;
        //} else {
            //return Component.prototype.shouldComponentUpdate(prevProps);
        //}
        
    //}
 
    toggleFavorite() {
        
        let that = this;
        let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : '';
        let currentTrack = this.props.currentTrack;
        let trackId = (currentTrack && currentTrack._id && currentTrack._id.length > 0) ? currentTrack._id : '';
        console.log(['TOGGLE FAVE',userId,trackId]);
        //currentTrack.favoriteOf[userId] = !currentTrack.favoriteOf[userId]; 
        
        this.props.fetchData(this.props.apiUrl+'/togglefavorite?userId='+userId+'&trackId='+trackId)
        .then(function(res) {
            console.log(['TOGGLE FAVE res',res]);
            //that.setState({isFavorite:(res==="yes" ? true : false)});
            that.props.toggleCurrentFavorite(userId);
        });
        
    };


    //
    render() {
        let style={float:'left', marginTop:'0.8em'}
        //let userId = (this.props.user && this.props.user._id && this.props.user._id.length > 0) ? this.props.user._id : 'none';
        //let currentTrack = this.props.currentTrack;
        let isFavorite = this.state.isFavorite; //currentTrack && currentTrack.favoriteOf && currentTrack.favoriteOf[userId];
        if (isFavorite) {
            style.color = 'red'
        }
        let isVisible = (this.props.user && this.props.user._id && this.props.user._id.length > 0);
        return <div>{isVisible && <button onClick={this.toggleFavorite}  className='btn'  style={style} ><FaHeart size='32' style={{margin:'0.1em',padding:'0.1em'}} /></button>}</div>
    };
    

    
}
