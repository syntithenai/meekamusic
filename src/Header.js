import React, { Component } from 'react';
//import {FaBars as Bars} from 'react-icons/fa';
// eslint-disable-next-line
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import Utils from './Utils';  
  
export default class Header extends Component {

	
	constructor(props) {
		super(props);
		this.state = {homeClicked:false}
		this.menuButtonClick = this.menuButtonClick.bind(this);
	}

    menuButtonClick(e) {
		console.log('CLICK')
		if (!this.state.homeClicked) {
			this.setState({homeClicked:true});
		} else {
			this.setState({homeClicked:false});
		}
    };

    render() {
        return <header style={{ zIndex:'10',position: 'fixed',top:0,left:0, float:'left',width: '100%',  backgroundColor:'black', height: '4em',  color:'white'}} >
            {<Link to="/meeka/menu" onClick={this.menuButtonClick} className='btn'  style={{float:'left'}}><img alt="Meeka Music" src='/catfiddle-100.png' style={{height: '3.4em',float:'left'}} /></Link>}
            
            <h5 style={{marginLeft: '3em',float:'left'}}>Meeka Music</h5>       
            
           
        </header>
    };
}
//           <span style={{float:'left'}} ><Link to="/meeka/menu" className='btn'  ><Bars size='32' style={{margin:'0.1em',padding:'0.1em'}} /></Link></span>
 
