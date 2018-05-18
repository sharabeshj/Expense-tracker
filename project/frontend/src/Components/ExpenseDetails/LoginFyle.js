import React,{ Component } from 'react';
import SingleInput from '../../Components/SingleInput'; 
import { Link } from 'react-router-dom';

class LoginFyle extends Component{
    constructor(props){
        super(props);
        this.state = {
            client : {
                client_id : '',
                client_secret : ''
            }
        }
    }
    handleChange = (e,name) => {
        const updatedState = {
            ...this.state.client
        }
        updatedState[name] = e.target.value;
        this.setState({ client : updatedState })
    }
    render(){
    return (
        <div>
            <SingleInput 
                inputType = 'text'
                title = "Client ID"
                name = 'client_id'
                controlFunc = {this.handleChange }
                content = { this.state.client.client_id}
                placeHolder = 'Enter your ID'/>
            <SingleInput 
                inputType = 'text'
                title = 'Client Secret'
                controlFunc = {this.handleChange}
                name = 'client_secret'
                content = { this.state.client.client_secret}
                placeHolder = 'Enter your secret'/>
            <Link to = {'/redirect'+this.state.client.client_id} ><button >Continue</button></Link>
        </div>
    )
}
}


export default LoginFyle;