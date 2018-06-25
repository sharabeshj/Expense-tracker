import React,{ Component } from 'react';
import axios from 'axios';

class Redirect extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : ''
        }
    }
    componentDidMount(){
        axios.get(`${process.env.REACT_APP_EXPENSE_SERVICE_URL}/base/authorizationCredentials`)
            .then(res => {
                this.setState({ data : res.data.client_id })
            })
    }
    render(){
        if(this.state.data !== ''){
            window.location = 'https://staging.fyle.in/#/auth/oauth?client_id=' + this.state.data + '&redirect_uri=http://127.0.0.1';
        }
        return <p>Redirecting</p>
    }
}



export default Redirect;