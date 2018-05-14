import React,{ Component } from "react";
import SingleInput from "../Components/SingleInput";

const auth = require("../Components/auth")

export default class Login extends Component{
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
        auth.login(username,password,(loggedIn) => {
            if(loggedIn){
                this.props.history.replace("/expenses");
            }
        });
    }
    handleEmail(e){
        this.setState({ username : e.target.value });
    }
    handlePassword(e){
        this.setState({ password : e.target.value });
    }
    render (){
        return (
            <form onSubmit = { this.handleSubmit }>
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
                <input type = "submit" />
            </form>
        );
    }
}