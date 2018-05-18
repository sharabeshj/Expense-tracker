import React,{Component} from "react";
import { connect } from 'react-redux';
import { logout } from '../store/Actions/ActionCreator';
import Index from '../Components/ExpenseDetails/Index';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';

class Expense extends Component {
    handleLogout = (e) => {
        this.props.logoutHandler();
    }
    componentWillMount(){
        if(this.props.authenticated === false){
            this.props.history.replace('/login')
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.authenticated === false){
            this.props.history.replace('/')
        }
    }
    render(){
        return (
            <div >
            <FormControlLabel
            control={
              <Switch checked={this.props.authenticated} onChange={this.handleLogout} aria-label="LoginSwitch" />
            }
            label={this.props.authenticated ? 'Logout' : 'Login'}
          />
            <Index />
          </div>
        )
    }
}

Expense.propTypes = {
    authenticated : PropTypes.bool.isRequired,
    logoutHandler : PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        authenticated : state.log.authenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return { 
        logoutHandler : () => dispatch(logout())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Expense);