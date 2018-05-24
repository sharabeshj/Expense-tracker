import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { logoutFyle } from '../../store/Actions/ActionCreator';
import axios from 'axios';

class ExpenseDetail extends Component {
    componentDidMount(){
        if(this.props.auth === false){
            this.props.history.replace('/')
        }
        const clientTempJSON = localStorage.getItem('tempDetails');
        const clientTemp = JSON.parse(clientTempJSON);
        const payLoad = {
            code : this.props.code,
            client_id : clientTemp.client_id,
            client_secret : clientTemp.client_secret,
            grant_type : "authorization_code"
        }
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token" : this.props.token
        }
        axios.post('/expensesToken',JSON.stringify(payLoad),{ headers : headers })
            .then(res => this.refreshToken())
            .catch(e => console.log(e))
        axios.get('/expenses',{ headers : { "x-access-token" : this.props.token }})
            .then( res => console.log(res))
            .catch(e => console.log(e))
    }
    refreshToken = () => {
        const payLoad = {
            client_id : this.props.client_id,
            client_secret : this.props.client_secret,
            grant_type : "refresh_token"
        }
        const headers = {
            "Content-Type" : "application/json",
            "x-access-token" : this.props.token
        } 
        setInterval(axios.post('/expensesRefresh',JSON.stringify(payLoad)   .then(res => console.log(res)),{ headers : headers }),3600000);
    }
    componentWillUnmount(){
        localStorage.removeItem('tempDetails');
        clearInterval(this.refreshToken);
        this.props.logoutFyle();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth === false) {
            this.props.history.replace('/')
        }
    }
    handleSync = (e) => {
        axios.get('/expensesFetchAPI',{ headers : { "x-access-token" : this.props.token}})
            .then(res => console.log(res.data))
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
        code : state.auth.authCode,
        client_id : state.auth.client_id,
        client_secret : state.auth.client_secret,
        token : state.log.token
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        logoutFyle : () => dispatch(logoutFyle())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);