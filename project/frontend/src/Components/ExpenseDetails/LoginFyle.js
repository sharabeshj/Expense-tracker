import React,{ Component } from 'react';
import SingleInput from '../../Components/SingleInput'; 
import { Link } from 'react-router-dom';

class LoginFyle extends Component{
    constructor(props){
        super(props);
        this.state = {
            client_id : '',
            client_secret : ''
        }
    }
    handleIdChange = (e) => {
        this.setState({ client_id : e.target.value });
    }
    handleSecretChange=(e) => {
        this.setState({ client_secret : e.target.value });
    }
    render(){
    return (
        <div>
            <SingleInput 
                inputType = 'text'
                title = "Client ID"
                name = 'client_id'
                controlFunc = {this.handleIdChange }
                content = { this.state.client_id}
                placeHolder = 'Enter your ID'/>
            <SingleInput 
                inputType = 'text'
                title = 'Client Secret'
                controlFunc = {this.handleSecretChange}
                name = 'client_secret'
                content = { this.state.client_secret}
                placeHolder = 'Enter your secret'/>
            <Link to = {'/expenses/redirect/'+this.state.client_id} ><button >Continue</button></Link>
        </div>
    )
}
}


export default LoginFyle;