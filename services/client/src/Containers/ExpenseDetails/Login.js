import React,{ Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { loggedIn } from '../../store/Actions/ActionCreator';

class Login extends Component{
    componentDidMount(){
        axios.post(`${process.env.REACT_APP_EXPENSE_SERVICE_URL}/expensesToken`,JSON.stringify({ code : this.props.authCode }),{ headers : { 'Content-Type' : 'application/json' } })
            .then(res => {
                this.props.loginHandler({ token : res.data.token });
                this.props.history.replace('/expenses/expenseDetails');
            })
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