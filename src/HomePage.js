import { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

export default  class HomePage extends Component {
    
    //constructor(props) {
        //super(props);
       
    //};
       
     
    render() {
       this.props.history.push("/meeka/menu");
       return '';
    };
}
