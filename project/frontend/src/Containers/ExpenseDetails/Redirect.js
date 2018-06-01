import React,{ Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

class Redirect extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : ''
        }
    }
    componentDidMount(){
        axios.get('/authorizationCredentials',{ headers : { 'x-access-token' : this.props.token }})
            .then(res => {
                console.log(res);
                this.setState({ data : res.data.client_id })
            })
    }
    render(){
        if(this.state.data !== ''){
            window.location = 'https://staging.fyle.in/#/auth/oauth?client_id=' + this.state.data + '&redirect_uri=http://127.0.0.1:3000/expenses/';
        }
        return <p>Redirecting</p>
    }
}

const mapStateToProps = state => {
    return {
        token : state.log.token
    }
}

export default connect(mapStateToProps,null)(Redirect);