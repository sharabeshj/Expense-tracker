import React,{ Component } from "react";
import SingleInput from "../Components/SingleInput";
import { connect } from 'react-redux';
import { loginClick } from '../store/Actions/ActionCreator';
import Aux from '../hoc/Aux/Aux';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : '',
            password : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }
    handleSubmit(e){
        const username = this.state.username;
        const password = this.state.password;
        this.props.loginHandler({ username : username,password : password});
    }
    handleEmail(e){
        this.setState({ username : e.target.value });
    }
    handlePassword(e){
        this.setState({ password : e.target.value });
    }
    componentWillMount(){
        if(this.props.authenticated === true ) this.props.history.replace('/expenses');
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.authenticated === true){
            this.props.history.replace('/expenses');
        }
    }
    render (){
        return (
                <Aux>    
                    <SingleInput
                        inputType = {'text'}
                        title = {'Email'}
                        name = {'Email'}
                        content = { this.state.username }
                        controlFunc = { this.handleEmail }
                        placeholder = { 'Enter email address '}
                    />
                    <SingleInput 
                        inputType = { 'password' }
                        title = { 'Password' }
                        name = { 'Password' }
                        content = { this.state.password }
                        controlFunc = { this.handlePassword }
                        placeholder = { 'Enter your password '} 
                    />
                    <button onClick = { this.handleSubmit }>submit</button>
                </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        authenticated : state.log.authenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginHandler : (data) => dispatch(loginClick(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);