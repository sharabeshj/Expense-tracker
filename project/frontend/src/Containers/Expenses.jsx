import React, { Component } from "react";
import { connect } from 'react-redux';
import { logout,authCodeHandler,logoutFyle } from '../store/Actions/ActionCreator';
import Index from '../Components/ExpenseDetails/Index';
import Switch from '@material-ui/core/Switch';
import { Switch as Sw,Route } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import Redirect from '../Components/ExpenseDetails/Redirect';
import ExpenseDetail from '../Components/ExpenseDetails/ExpenseDetails';

const queryString = require('query-string');

class Expense extends Component {
    handleLogout = (e) => {
        this.props.logoutHandler();
        this.props.logoutFyle();
    }
    componentDidMount(){
        if(!!this.props.location.search){
            const query = queryString.parse(this.props.location.search);
            this.props.authCodeHandler(query.code);
            this.props.history.replace('/expenses/expenseDetails');
        }
    }
    componentWillMount() {
        if (this.props.authenticated === false) {
            this.props.history.replace('/login')
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.authenticated === false) {
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
                    <Route exact path={'/expenses/redirect'} component={Redirect} />
                    <Route exact path = '/expenses/expenseDetails' component = { ExpenseDetail } />
                    <Route exact path='/expenses' component={Index} />
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
        authenticated: state.log.authenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutHandler: () => dispatch(logout()),
        authCodeHandler : (code) => dispatch(authCodeHandler(code)),
        logoutFyle : () => dispatch(logoutFyle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Expense);