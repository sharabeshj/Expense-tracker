import React,{ Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { refresh } from '../../store/Actions/ActionCreator';

class ExpenseDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            expensesDetails : []
        }
    }
    componentDidMount(){
        if(!!this.props.code === false && this.props.state !== 'refreshing'){
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
                .then(res => {
                    console.log(res.data);
                    this.props.refreshToken({ token : this.props.token });
                })
                .catch(e => console.log(e));
            })    
    }
    componentWillReceiveProps(nextProps) {
        if (!!nextProps.code === false && nextProps.state !== 'refreshing') {
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
            details = this.state.expensesDetails.map(expense => <li key = {JSON.parse(expense.expense_details).id}>{expense.expense_details}{expense.created_at}</li>)
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
        state  : state.auth.state,
        code : state.auth.authCode,
        token : state.log.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refreshToken : (data) => dispatch(refresh(data))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);