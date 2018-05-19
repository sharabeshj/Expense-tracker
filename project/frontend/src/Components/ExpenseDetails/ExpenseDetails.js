import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { logoutFyle } from '../../store/Actions/ActionCreator';

class ExpenseDetail extends Component {
    componentDidMount(){
        if(this.props.auth === null){
            this.props.history.replace('/')
        }
    }
    componentWillUnmount(){
        this.props.logoutFyle();
    }
    render(){
        return <div>HElooooo</div>
    }
}

const mapStateToProps = state => {
    return {
        auth : state.auth.code
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        logoutFyle : () => dispatch(logoutFyle())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);