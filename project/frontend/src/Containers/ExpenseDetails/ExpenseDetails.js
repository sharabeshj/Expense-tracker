import React,{ Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { logout } from '../../store/Actions/ActionCreator';
import ExpenseTable from '../../Components/Table/Table';

class ExpenseDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            expensesDetails : []
        }
    }
    componentDidMount(){
            axios.post('/checkToken',{ token : this.props.token })
                .catch(e => {
                    this.props.logoutHandler();
                    this.props.history.replace('/')
                })
                .then(() => {
                    axios.get('/expenses',{ headers : { "x-access-token" : this.props.token }})
                        .then( res => {
                            this.setState({ expensesDetails : res.data.expenses});
                        })
                })
        
        }
    handleSync = (e) => {
        axios.get('/expensesFetchAPI',{ headers : { "x-access-token" : this.props.token}})
            .then(res => {
                axios.get('/expenses',{ headers : { "x-access-token" : this.props.token }})
                .then( res => {
                    this.setState({ expensesDetails : res.data.expenses});
                })
                .catch(e => console.log(e));
                })
    }
    render(){
        return (
            <ExpenseTable expensesDetails = {this.state.expensesDetails} handleSync = {this.handleSync}/>
        )
    }
}

const mapStateToProps = state => {
    return {
        token : state.log.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutHandler : () => dispatch(logout())
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);