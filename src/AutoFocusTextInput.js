import React from 'react';
import Utils from './Utils';
import {FaTimesCircle as EraserButton} from 'react-icons/fa';

export default class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state={value:String(this.props.value)}; //value:new String(this.props.value)};
    this.textInput = React.createRef();
    this.focusTextInput=this.focusTextInput.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
        
  }

    setFilter(e) {
       //console.log()
        //console.log(['EVENT',e.target.value,e.target,e])
        ////let title = this.textInput.current.value;
        let title = e.target.value;
        //// console.log(["AF SET FILTER",title,this.textInput.current.value]);
        //if (this.props.setValue) {
         ////       console.log(["SET SEARCH FILTER"]);
        this.setState({'value':title});
        this.props.setValue(title);
        //} else {
           //// console.log(["MISSING UPDATE FN"]);
        //}
        ////console.log([this.props.setSearchFilter,'setfilter',title]);
        ////let newState={'filter':title};
        ////this.setState(newState);
        ////this.filterItems(title);
        e.stopPropagation();
        e.preventDefault();
        return false;
    };
    
    clearFilter(e) {
        e.preventDefault();
      //  console.log(['clearfilter']);
        //this.setState({'filter':null,tracks:this.props.items});
        //this.setState({'value':''});
        //if (this.props.setValue)  {
          // console.log(['really']);
           this.props.setValue('');   
        //}
        return false;
    };
    

    focusTextInput() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput.current.focus();
    }

    shouldComponentUpdate(prevProps) {
       // console.log(['AUTOFOCUS shouldComponentUpdate??',prevProps.value,this.props.value]);
        //let queryParts=this.extractQueryParts();
        
        return true;    
    }

    componentDidMount() {
        if (!Utils.isMobile()) this.focusTextInput();
    }
  

  render() {
    //  console.log(['AF RENDER ',this.props]);
    return (
    <span >
      
      <input  size={this.props.size ? this.props.size : 10} value={this.state.value} onChange={this.setFilter} ref={this.textInput} /><span className='btn'   onClick={this.clearFilter}><EraserButton/></span>
      </span>
    );
  }
}
