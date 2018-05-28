import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { logoutFyle } from '../../store/Actions/ActionCreator';
import axios from 'axios';

class ExpenseDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            expensesDetails : []
        }
    }
    componentDidMount(){
        if(this.props.auth === false){
            this.props.history.replace('/')
        }
        
        axios.get('/expenses',{ headers : { "x-access-token" : this.props.token }})
            .then( res => {
                console.log(res.data);
                this.setState({ expensesDetails : res.data.expenses});
            })
            .catch(e => console.log(e));
        let payLoad = {
            code : this.props.code,
            grant_type : "authorization_code"
       }
        axios.get('/authorizationCredentials',{ headers : { 'x-access-token' : this.props.token }})
            .then( res => {
                payLoad.client_id = res.data.client_id;
                payLoad.client_secret = res.data.client_secret;
                const headers = {
                    "Content-Type" : "application/json",
                    "x-access-token" : this.props.token
                }
            axios.post('/expensesToken',JSON.stringify(payLoad),{ headers : headers })
                .then(res => this.refresh = setInterval(this.refreshToken,3600000))
                .catch(e => console.log(e));
            })    
    }
    refreshToken = () => {
        const headers = {
            "x-access-token" : this.props.token
        } 
        axios.get('/expensesRefresh',{ headers : headers })
            .then(res => console.log(res.data));
    }
    componentWillUnmount(){
        clearInterval(this.refresh);
        this.props.logoutFyle();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth === false) {
            this.props.history.replace('/')
        }
    }
    handleSync = (e) => {
        axios.get('/expensesFetchAPI',{ headers : { "x-access-token" : this.props.token}})
            .then(res => {
                console.log(res.data);
                axios.get('/expenses',{ headers : { "x-access-token" : this.props.token }})
                .then( res => {
                    console.log(res.data);
                    this.setState({ expensesDetails : res.data.expenses});
                })
                .catch(e => console.log(e));
                })
    }
    render(){
        let details = null;
        if (this.state.expensesDetails!==[]){
            details = this.state.expensesDetails.map(expense => <li key = {expense.created_at}>{expense.expense_details}{expense.created_at}</li>)
        }
        
        return (<div>
            <button onClick = { this.handleSync }>Sync</button>
            <ul>
                {details}
            </ul>
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        auth : !!state.auth.authCode,
        code : state.auth.authCode,
        token : state.log.token
    }
}

const mapDispatchToProps = dispatch => {
    return { 
        logoutFyle : () => dispatch(logoutFyle())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);