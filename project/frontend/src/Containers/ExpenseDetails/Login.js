import React,{ Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { loggedIn } from '../../store/Actions/ActionCreator';

class Login extends Component{
    componentDidMount(){
        axios.post('/expensesToken',JSON.stringify({ code : this.props.authCode }),{ headers : { 'Content-Type' : 'application/json' } })
            .then(res => {
                console.log(res);
                this.props.loginHandler({ token : res.data.token, user_id : res.data.user_id});
                this.props.history.replace('/expenses/expenseDetails');
            })
            .catch(e => console.log('error'));
    }
    render(){
        return <p>Login successful !! Redirecting</p>
    }
}

const mapStateToProps = state => {
    return {
        token : state.log.token,
        authCode : state.auth.authCode
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginHandler : data => dispatch(loggedIn(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);