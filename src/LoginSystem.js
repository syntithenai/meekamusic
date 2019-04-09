/* global document */
/* dis-eslint-disable */
import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import {LoginSystem as SystemLoginSystem, Logout, Profile, Login, Register, LoginRedirect, ForgotPassword, OAuth,getCookie,getAxiosClient} from 'react-express-oauth-login-system'  
import PropsRoute from './PropsRoute'


export default  class LoginSystem extends SystemLoginSystem {
    
    
    render() {
		let that = this;
        let callBackFunctions = {
            submitSignUp : this.submitSignUp,
            submitSignIn : this.submitSignIn,
            recoverPassword : this.recoverPassword,
            onLogin : this.props.onLogin,
            refreshLogin : this.refreshLogin,
            logout : this.logout,
            isLoggedIn : this.isLoggedIn,
            saveUser : this.saveUser,
            setUser:  this.setUser,
            submitWarning : this.submitWarning,
            user:this.state.user,
            warning_message: this.state.warning_message,
            authServer: this.props.authServer,
            loginButtons: this.props.loginButtons
        };
        
		// route for /login/
        const DefaultRedirect = function(props) {
            if (props.location.pathname==='/login' || props.location.pathname==='/login/') {
               props.history.push("/login/login");
            }
            return null;
        };
    
        
        if (this.state.authRequest) {
			return null
			//return <div className='pending-auth-request' ><Link to='/login/auth' className='btn btn-success'  >Pending Authentication Request</Link></div>
		} else {
			return (
				<div>
                <PropsRoute {...callBackFunctions} path='/' component={LoginRedirect} />
                <PropsRoute {...callBackFunctions} path='/login/profile' component={Profile}   />
                <PropsRoute {...callBackFunctions} path='/login/login' component={Login} />
                <PropsRoute {...callBackFunctions} path='/login/register' component={Register} />
                <PropsRoute {...callBackFunctions} path='/login/logout' component={Logout} />
                <PropsRoute {...callBackFunctions} path='/login/oauth' component={OAuth} />
                <PropsRoute {...callBackFunctions} exact={true} path='/login' component={DefaultRedirect} />
                <PropsRoute {...callBackFunctions} exact={true} path='/login/forgot' component={ForgotPassword} />
				</div>
            )
         }
    };
}
