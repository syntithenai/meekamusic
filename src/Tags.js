import React, { Component } from 'react';
//import WordCloud from 'react-d3-cloud';
//import {FaSearch as SearchButton} from 'react-icons/fa';
//import AutoFocusTextInput from './AutoFocusTextInput';
//import {debounce} from 'throttle-debounce';
import {FaMusic as Music} from 'react-icons/fa';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

  
export default class Tags extends Component {
    
    constructor(props) {
        super(props);
        this.state={'tags':[],'titleFilter':'',showTextInput:true};
        // 
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.filterTags = this.filterTags.bind(this); //debounce(500,);
        this.searchTags = this.searchTags.bind(this);
        this.setFilterTagOnClick = this.setFilterTagOnClick.bind(this);
    };
    
    componentDidMount() {
        //console.log('tags mount');
       // this.filterTags();
    };
    
    setTitleFilter(title) {
        //let that = this;
        ////this.setState({showTextInput:false});
        ////let title = event.target.value;
        //let newState={'titleFilter':title};
        ////console.log(['SETITLTEFIL',title]);
        //this.setState(newState);
        //this.props.filterTags(title);
        ////debounce(100,function() {
            ////that.setState({showTextInput:true});
        ////});
        
    };
    
    searchTags(tag) {
        
        //console.log('search tag');
        //console.log(tag);
       // this.props.setSearchFilter("");
        this.props.history.push("/meeka/search/tag/"+tag.text);
    };
    
    filterTags(title) {
        this.props.filterTags(title);
        //let that = this;
        //this.props.startWaiting();
          //this.props.fetchData(this.props.apiUrl+'/tags?search='+(title ? title.toLowerCase() : '') )
          //.then(function(response) {
            //return response.json()
          //}).then(function(json) {
              //////console.log(['SET TAGS', json])
              //let newTags=[];
              //for (let a in json) {
                  //let newTag={};
                  //newTag.text = json[a].title;
                  //newTag.value = json[a].tally;
                  //newTags.push(newTag);
              //}
              //that.props.stopWaiting();
            //that.setState({'tags':newTags});
          //}).catch(function(ex) {
            ////console.log(['parsing failed', ex])
          //})
        
        
        //let tags = [];
        //let tagsCollation = {};
        
        
        //if (title.length > 0) {
            //let that = this;   
            ////console.log(['filter tags',this.props.tags]);     
            ////Object.keys(this.props.tags).forEach(function(tagKey) {
            //for (var w in this.props.tags) {
                //let word = this.props.tags[w];
                //let tag = word.text;
                //////console.log(word);
                //// collate on tag
                //if (tag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    //word.value *= 20;
                    //tagsCollation[tag]=word;
                //}
                //// check related
                ////Object.keys(that.props.relatedTags[tag]).forEach(function(reltag) {
                    
                    //////if (reltag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    //////    tagsCollation[reltag.trim().toLowerCase()]={text:reltag.trim().toLowerCase(),value:word.value /30};
                    //////}    
                ////});
                   
            //};
            ////console.log(['TAGS collation',tagsCollation]);
            //for (var theTag in tagsCollation) {
                //tags.push(tagsCollation[theTag]);
            //}
            ////console.log(['TAGS',tags]);
        //} else {
            //tags = this.props.tags;
        //}
//        this.setState({'tags':tags});
    };
    
    
    setFilterTagOnClick(tag) {
        this.props.setSearchFilterTag(tag);
        //let that = this;
       //// this.setState({showTextInput:false});
        //let title = e.target.value;
       //// let newState={'titleFilter':title};
        //console.log(['setFilterTagOnClick',title]);
        //return false;
    };
    
    render() {
        let that = this;
        //const fontSizeMapper = word => 2* Math.log2(word.value+1) * 2;
        //const rotate = word => 0; //word.value % 360;
        //const wordCloudWidth = window.innerWidth * 0.9;
        //const wordCloudHeight = window.innerHeight * 0.5;
        ////console.log(this.state.tags);
        let tagList=null;
       // let titleFilter = this.state.titleFilter;
        if (this.props.tags && this.props.tags.length > 0) {
            tagList = this.props.tags.map(function(val,key) {
                //console.log(['RENTAG',val,key]);
                if (val && val.text && val.text.length > 0) {
                    let linkTo="/meeka/search/tag/"+val.text;
                     return (
                     <Link to={linkTo}  key={key} onClick={() => that.setFilterTagOnClick(val.text)} ><button onClick={() => that.setFilterTagOnClick(val.value)} style={{border:'1px solid blue',margin:'0.2em',fontSize:'0.9em',minHeight:'2em',minWidth:'2em',backgroundColor:'aliceblue'}} className='tag btn' key={key} ><Music/> {val.text} <span style={{backgroundColor:'lightblue',borderRadius:'20px',padding:'0.2em'}} >{val.value}</span></button></Link>
                     )                    
                } else {
                    return '';
                }
            });
        }
        //console.log(['RENDERTAGS',tagList]);
        return (
            <div className='tagList' >
                { tagList}
            </div>

        )
    }
};
                //<form  onSubmit={(e) => {e.preventDefault() ; return false}}>
                    //{false && <span><SearchButton size={33} style={{marginTop:'0.4em',marginBottom:'0.4em',marginLeft:'0.4em'}}/>&nbsp;<AutoFocusTextInput className="form-control" type="text"    placeholder="Search" aria-label="Search" value={titleFilter} setValue={this.setTitleFilter} /></span>}
                //</form>
//<WordCloud 
                    //height={wordCloudHeight}
                    //width={wordCloudWidth}
                    //data={this.props.tags} 
                    //fontSizeMapper={fontSizeMapper} 
                    //rotate={rotate}
                    //onWordClick={this.searchTags} 
                //>
                //</WordCloud>

//<form className="form">
                  //<input className="form-control col-sm-8" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
