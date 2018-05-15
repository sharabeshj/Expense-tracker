import React,{Component} from "react";
import { connect } from 'react-redux';
import { logout } from '../store/Actions/ActionCreator';

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
            this.props.history.replace('/login')
        }
    }
    render(){
        return (
            <div>
                <button onClick = {this.handleLogout}>logout</button>
            </div>
        )
    }
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