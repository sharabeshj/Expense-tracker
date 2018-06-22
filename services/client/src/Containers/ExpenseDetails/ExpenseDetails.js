import React,{ Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { logout } from '../../store/Actions/ActionCreator';
import ExpenseTable from '../../Components/Table/Table';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import Aux from '../../hoc/Aux/Aux';
import List from '@material-ui/core/List';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { SvgIcon } from '@material-ui/core';

const ReactDOMServer = require('react-dom/server');


class ExportOption extends Component {
    handleClose = () =>{
        this.props.onClose();
    }

    handleListItemClick = value => {
        this.props.handleClick(value);
        this.props.onClose();
    };

    render () {
        const { classes, onClose,selectedValue,...other} = this.props;

        return (
            <Dialog onClose = { this.handleClose } aria-labelledby = " dialog-title " {...other}>
                <DialogTitle id = "dialog-title">Export Options</DialogTitle>
                <div>
                <List>
                        <ListItem button onClick = { () => this.handleListItemClick('csv')} key = { 'csv' }>
                            <ListItemIcon>
                                <SvgIcon style = {{ width : '24px', height : '24px'}}>
                                    <path fill="#000000" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M14,15V11H10V15H12.3C12.6,17 12,18 9.7,19.38L10.85,20.2C13,19 14,16 14,15Z" />
                                </SvgIcon>
                            </ListItemIcon>
                            <ListItemText primary = "Export as zipped CSV" />
                        </ListItem>
                        <ListItem button onClick = { () => this.handleListItemClick('pdf')} key = { "pdf"}>
                            <ListItemIcon>
                                <SvgIcon style = { { width : '24px', height : '24px'}}>
                                    <path fill="#000000" d="M14,9H19.5L14,3.5V9M7,2H15L21,8V20A2,2 0 0,1 19,22H7C5.89,22 5,21.1 5,20V4A2,2 0 0,1 7,2M11.93,12.44C12.34,13.34 12.86,14.08 13.46,14.59L13.87,14.91C13,15.07 11.8,15.35 10.53,15.84V15.84L10.42,15.88L10.92,14.84C11.37,13.97 11.7,13.18 11.93,12.44M18.41,16.25C18.59,16.07 18.68,15.84 18.69,15.59C18.72,15.39 18.67,15.2 18.57,15.04C18.28,14.57 17.53,14.35 16.29,14.35L15,14.42L14.13,13.84C13.5,13.32 12.93,12.41 12.53,11.28L12.57,11.14C12.9,9.81 13.21,8.2 12.55,7.54C12.39,7.38 12.17,7.3 11.94,7.3H11.7C11.33,7.3 11,7.69 10.91,8.07C10.54,9.4 10.76,10.13 11.13,11.34V11.35C10.88,12.23 10.56,13.25 10.05,14.28L9.09,16.08L8.2,16.57C7,17.32 6.43,18.16 6.32,18.69C6.28,18.88 6.3,19.05 6.37,19.23L6.4,19.28L6.88,19.59L7.32,19.7C8.13,19.7 9.05,18.75 10.29,16.63L10.47,16.56C11.5,16.23 12.78,16 14.5,15.81C15.53,16.32 16.74,16.55 17.5,16.55C17.94,16.55 18.24,16.44 18.41,16.25M18,15.54L18.09,15.65C18.08,15.75 18.05,15.76 18,15.78H17.96L17.77,15.8C17.31,15.8 16.6,15.61 15.87,15.29C15.96,15.19 16,15.19 16.1,15.19C17.5,15.19 17.9,15.44 18,15.54M8.83,17C8.18,18.19 7.59,18.85 7.14,19C7.19,18.62 7.64,17.96 8.35,17.31L8.83,17M11.85,10.09C11.62,9.19 11.61,8.46 11.78,8.04L11.85,7.92L12,7.97C12.17,8.21 12.19,8.53 12.09,9.07L12.06,9.23L11.9,10.05L11.85,10.09Z" />
                                </SvgIcon>
                            </ListItemIcon>
                            <ListItemText primary = "Export as zipped PDF" />
                        </ListItem>
                </List>
            </div>
            </Dialog>
            
        );
    }
} 

ExportOption.propTypes = {
    onClose : PropTypes.func.isRequired,
    selectedValue : PropTypes.string
}


class ExpenseDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            expensesDetails : [],
            open : false,
            selectedValue : '',
            list : [],
            loading : false,
            success : false,
            syncLoad : false,
            syncSuccess : false 
        }
    }
    componentDidMount(){
            axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,{ headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`}})
                .catch(e => {
                    this.props.history.replace('/')
                })
                .then((res) => {
                    if(res.data.data.active === true)
                    return axios.get(`${process.env.REACT_APP_EXPENSE_SERVICE_URL}/expenses`,{ headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`}})
                    else{
                        this.props.logoutHandler();
                    this.props.history.replace('/')
                    }
                })
                .then( res => {
                    this.setState({ expensesDetails : res.data.expenses});
                })
        
        }
    handleSync = (e) => {
        this.setState({ syncLoad : true, syncSuccess : false })
        axios.get(`${process.env.REACT_APP_EXPENSE_SERVICE_URL}/expensesFetchAPI`,{ headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`}})
            .then(res => {
                return axios.get(`${process.env.REACT_APP_EXPENSE_SERVICE_URL}/expenses`,{ headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`}})
            })
            .then( res => {
                this.setState({ expensesDetails : res.data.expenses,syncLoad : false, syncSuccess : true });
            })
            .catch(e => console.log(e));
    }
    handleExport = list => {
        this.setState({ open : true,list : list });
    }
    handleBack = () => {
        this.setState({ selectedValue : '',open : false });
    }
    handleClick = (value) => {
        this.setState({ loading : true,success : false  })
        if(value === 'csv'){
            axios({ method : 'post',url : `${process.env.REACT_APP_EXPENSE_SERVICE_URL}/expenses-csv`, data : JSON.stringify({ list : this.state.list }), headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`}})
                .then(res => {
                    this.setState({ loading : false, success : true })
                })
                .catch(e => console.log(e));
        }
        if(value === 'pdf'){
            const Table = React.createFactory(ExpenseTable);
            console.log(ReactDOMServer.renderToString(Table()));
        }
    }
    render(){
        return (
            <Aux>
                <ExpenseTable expensesDetails = {this.state.expensesDetails} handleSync = {this.handleSync} handleExport = { this.handleExport } loading = {this.state.loading} success = {this.state.success}syncLoad = {this.state.syncLoad} syncSuccess = {this.state.syncSuccess}/>
                <ExportOption
                    aria-labelledby = "simple-modal-title"
                    aria-describedby = "simple-modal-description"
                    open = { this.state.open }
                    onClose = { this.handleBack }
                    handleClick = { this.handleClick }
                />
            </Aux>
        )
    }
}

ExpenseDetail.propType = {
    classes : PropTypes.object.isRequired,
};


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