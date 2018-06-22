import React, { Component } from "react";
import { connect } from 'react-redux';
import { logout,logoutFyle } from '../store/Actions/ActionCreator';
import Switch from '@material-ui/core/Switch';
import { Switch as Sw,Route } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import Redirect from './ExpenseDetails/Redirect';
import ExpenseDetail from './ExpenseDetails/ExpenseDetails';
import Login from './ExpenseDetails/Login';
import axios from 'axios';



class Expense extends Component {
    handleLogout = (e) => {
        axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/logout`,{ headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`}})
        this.props.logoutHandler();
        this.props.logoutFyle();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.authenticated === false){
            this.props.history.replace('/')
        }
    }
    render() {
        return (
            <div >
                <FormControlLabel
                    control={
                        <Switch checked={this.props.authenticated} onChange={this.handleLogout} aria-label="LoginSwitch" />
                    }
                    label={this.props.authenticated ? 'Logout' : 'Login'}
                />
                <div>
                    <Sw>
                        <Route exact path= '/expenses/login' component = { Login } />
                        <Route exact path='/expenses/redirect' component={Redirect} />
                        <Route exact path = '/expenses/expenseDetails' component = { ExpenseDetail } />
                    </Sw>
                </div>
            </div>
        )
    }
}

Expense.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    logoutHandler: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        authenticated: state.log.authenticated,
        token : state.log.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutHandler: () => dispatch(logout()),
        logoutFyle : () => dispatch(logoutFyle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Expense);