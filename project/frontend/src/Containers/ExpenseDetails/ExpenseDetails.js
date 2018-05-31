import React,{ Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { refresh } from '../../store/Actions/ActionCreator';
import ExpenseTable from '../../Components/Table/Table';

class ExpenseDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            expensesDetails : []
        }
    }
    componentDidMount(){
        if(this.props.authenticated !== true ){
            this.props.history.replace('/')
        }
        
        axios.get('/expenses',{ headers : { "x-access-token" : this.props.token }})
            .then( res => {
                this.setState({ expensesDetails : res.data.expenses});
            })
            .catch(e => console.log(e));
                
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
            <ExpenseTable expensesDetails = {this.state.expensesDetails}/>
        )
    }
}

const mapStateToProps = state => {
    return {
        token : state.log.token,
        authenticated : state.log.authenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refreshToken : (data) => dispatch(refresh(data))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ExpenseDetail);