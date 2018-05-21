import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { logoutFyle } from '../../store/Actions/ActionCreator';
import axios from 'axios';

class ExpenseDetail extends Component {
    componentDidMount(){
        if(this.props.auth === false){
            this.props.history.replace('/')
        }

    }
    componentWillUnmount(){
        this.props.logoutFyle();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth === false) {
            this.props.history.replace('/')
        }
    }
    handleSync = (e) => {

    }
    render(){
        return (<div>
            <button onClick = { this.handleSync }>Sync</button>
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        auth : !!state.auth.authCode,
        code : state.auth.authCode
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        logoutFyle : () => dispatch(logoutFyle())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);