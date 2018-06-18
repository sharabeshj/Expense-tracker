import React,{ Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import green from '@material-ui/core/colors/green';
import pink from '@material-ui/core/colors/pink';

let counter = 0;
function createData(date,email,vendor,category,amount,tx_id){
    counter += 1;
    return { id : counter,date : date,email : email,vendor : vendor,category : category,amount : amount,tx_id : tx_id};
}

const columnData = [
    { id : 'date',numeric : true ,disablePadding : false,label : 'Date'},
    { id : 'email',numeric : false,disablePadding : true,label : 'User-Email'},
    { id :'vendor',numeric : false,disablePadding : true , label : 'Vendor Name'},
    { id : 'category',numeric : false,disablePadding : true,label : 'Category/Sub-Category'},
    { id : 'amount',numeric : true,disablePadding : false,label : 'Amount'}
]

class Tablehead extends Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event,property);
    };

    render(){
        const { onSelectAllClick,order,orderBy,numSelected,rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding = "checkbox">
                        <Checkbox 
                            indeterminate = { numSelected > 0 && numSelected < rowCount }
                            checked = { numSelected === rowCount }
                            onChange = { onSelectAllClick }
                        />
                    </TableCell>
                    { columnData.map(column => {
                        return (
                            <TableCell
                                key = { column.id }
                                numeric = { column.numeric }
                                padding = { column.disablePadding ? 'none' : 'default'}
                                sortDirection = { orderBy === column.id ? order : false}
                            >
                                    <Tooltip
                                        title = "Sort"
                                        placement = { column.numeric ? 'bottom-end' : 'bottom-start'}
                                        enterDelay = { 300 }
                                    >
                                        <TableSortLabel
                                            active = { orderBy === column.id }
                                            direction = { order }
                                            onClick = { this.createSortHandler(column.id)}
                                        >
                                            { column.label }
                                        </TableSortLabel>
                                    </Tooltip> 
                            </TableCell>
                        );
                    },this)}
                </TableRow>
            </TableHead>
        );
    }
}

Tablehead.propTypes = {
    numSelected : PropTypes.number.isRequired,
    onRequestSort : PropTypes.func.isRequired,
    onSelectAllClick : PropTypes.func.isRequired,
    order : PropTypes.string.isRequired,
    orderBy : PropTypes.string.isRequired,
    rowCount : PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root : {
        paddingRight : theme.spacing.unit,
    },
    highlight : 
        theme.palette.type === 'light'
            ? {
                color : theme.palette.secondary.main,
                backgroundColor : lighten(theme.palette.secondary.light,0.85),
            }
            : {
                color : theme.palette.text.primary,
                backgroundColor : theme.palette.secondary.dark,
            },
        spacer : {
            flex : '1 1 100%',
        },
        actions : {
            color : theme.palette.text.secondary,
        },
        title : {
            flex : '0 0 auto',
        },
        wrapper : {
            margin : theme.spacing.unit,
            position : 'relative'
        },
        btnroot:{
            display : 'flex',
        },
        button : {
            margin : theme.spacing.unit,
        },
        btnSucesss : {
            backgroundColor : green[500],
            '&:hover' : {
                backgroundColor : green[700]
            }
        }
        ,
        fabProgress : {
            color : green[500],
            position : 'absolute',
            top : -6,
            left : -6,
            zIndex : 1
        },
        btnProgess : {
            color : green[500],
            position : 'absolute',
            top : '50%',
            left : '50%',
            marginTop : -12,
            marginLeft : -12
        }
});

let TableToolbar = props => {
    const { numSelected,classes,loading,success,syncSuccess,syncLoad } = props;
    const buttonClassname = classNames({
        [classes.btnSucesss] : syncSuccess
    })
    return (
        <Toolbar
            className = { classNames(classes.root,{
                [classes.highlight]:numSelected > 0,
            })}
        >
            <div className = { classes.title }>
                {
                    numSelected > 0 ? (
                        <Typography color = "inherit" variant = "subheading">
                            { numSelected } selected
                        </Typography>
                    ): (
                        <Typography variant = "title" id = "tableTitle">
                            My Expenses
                        </Typography>
                    )
                }
            </div>
            
            <div className = { classes.spacer }/>
            <div className = {classes.wrapper}>
            <Button variant = "raised"  color = "secondary" disabled = {props.syncLoad} className = {buttonClassname} onClick = {props.handleSync}>Sync</Button>
            {syncLoad && <CircularProgress size = {24} className = {classes.btnProgess} />}
            </div>
            <div className = {classes.button}>
                { numSelected > 0 ? (
                    <Tooltip title = "Export" placement = "right">
                    <div className = {classes.wrapper}>
                        <Button variant = "fab" color = "secondary" aria-label = "Export" disabled = {props.loading} onClick = {props.handleExport} >
                            {success ? <CheckIcon />: <SaveIcon />}
                         </Button>
                        {loading && <CircularProgress size = {68} className = {classes.fabProgress}/>}
                    </div>
                    </Tooltip>
                ):(
                    <Tooltip title = "Filter list">
                        <IconButton aria-label = "Filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

TableToolbar.propTypes = {
    classes : PropTypes.object.isRequired,
    numSelected : PropTypes.number.isRequired,
    loading : PropTypes.bool.isRequired,
    success : PropTypes.bool.isRequired
};

TableToolbar = withStyles(toolbarStyles)(TableToolbar);

const styles = theme => ({
    root : {
        width : '100%',
        position : 'absolute',
        marginTop : theme.spacing.unit * 3
    },
    table : {
        minWidth : 1020,
    },
    tableWrapper : {
        overflowX : 'auto',
    },
});

class ExpenseTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            order : 'asc',
            orderBy : '',
            selected : [],
            data : [],
            page : 0,
            rowsPerPage : 5,
        };
    }

    componentWillReceiveProps(nextProps){
        let newData = [];
        newData = nextProps.expensesDetails.map(expense => {
            const data = JSON.parse(expense.expense_details);
            expense = createData(data.tx_created_at,data.us_email,data.tx_vendor,data.tx_org_category,data.tx_currency+' '+data.tx_amount,data.tx_id)
            return expense
        });
        this.setState({ data : newData });
    }
    handleRequestSort = (event,property) => {
        const orderBy = property;
        let order = 'desc';

        if(this.state.orderBy === property && this.state.order === 'desc'){
            order = 'asc';
        }

        const data = 
            order === 'desc'
                ? this.state.data.sort((a,b) => (b[orderBy] < a[orderBy] ? -1 : 1))
                : this.state.data.sort((a,b) => (a[orderBy] < b[orderBy] ? -1 : 1));

        this.setState({ data, order,orderBy });
    };

    handleSelectAllClick = (event,checked) => {
        if(checked){
            this.setState({ selected : this.state.data.map(n => n.tx_id ) });
            return;
        }
        this.setState({ selected : [] });
    };

    handleClick = (event,id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if(selectedIndex === -1){
            newSelected = newSelected.concat(selected,id);
        }else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        }else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0,-1));
        }else if (selectedIndex > 0){
            newSelected = newSelected.concat(
                selected.slice(0,selectedIndex),
                selected.slice(selectedIndex+1),
            );
        }

        this.setState({ selected : newSelected });
    };

    handleChangePage = (event,page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage : event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render(){
        const { classes } = this.props;
        const { data,order,orderBy,selected,rowsPerPage,page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage,data.length - page * rowsPerPage);

        return (
            <Paper className = { classes.root }>
                <TableToolbar numSelected = { selected.length } handleSync = {this.props.handleSync} handleExport = { () => this.props.handleExport(this.state.selected) } loading = {this.props.loading} success = {this.props.success} syncLoad = {this.props.syncLoad} syncSuccess = {this.props.syncSuccess}/>
                <div className = { classes.tableWrapper }>
                <Table className = { classes.table } aria-labelledby = "tableTitle">
                    <Tablehead 
                        numSelected = { selected.length }
                        order = { order }
                        orderBy = { orderBy }
                        onSelectAllClick = { this.handleSelectAllClick }
                        onRequestSort = { this.handleRequestSort }
                        rowCount = { data.length }
                    />
                    <TableBody>
                        { data.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map( n => {
                            const isSelected = this.isSelected(n.tx_id);
                            return (
                                <TableRow
                                    hover 
                                    onClick = { event => this.handleClick(event,n.tx_id)}
                                    role = "checkbox"
                                    aria-checked = { isSelected }
                                    tabIndex = { -1 }
                                    key = { n.id }
                                    selected = { isSelected }
                                >
                                    <TableCell padding = "checkbox">
                                        <Checkbox checked = {isSelected}/>
                                    </TableCell>
                                    <TableCell numeric>
                                        { n.date }
                                    </TableCell>
                                    <TableCell component = "th" scope = "row" padding = "none">
                                        { n.email }
                                    </TableCell>
                                    <TableCell component = "th" scope = "row" padding = "none">
                                        { n.vendor }
                                    </TableCell>
                                    <TableCell component = "th" scope = "row" padding = "none">
                                        { n.category }
                                    </TableCell>
                                    <TableCell numeric>
                                        { n.amount }
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        { emptyRows > 0 && (
                            <TableRow style = {{ height : 49 * emptyRows }}>
                                <TableCell colSpan = {6}/>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component = "div"
                    count = { data.length }
                    rowsPerPage = { rowsPerPage }
                    page = { page }
                    backIconButtonProps = {{
                        'aria-label' : 'Previous Page',
                    }}
                    onChangePage = { this.handleChangePage }
                    onChangeRowsPerPage = { this.handleChangeRowsPerPage }
                    />
            </Paper>
        );
    }
}

ExpenseTable.propTypes = {
    classes : PropTypes.object.isRequired,
    expensesDetails : PropTypes.array,
    handleExport : PropTypes.func.isRequired,
    loading : PropTypes.bool.isRequired,
    success : PropTypes.bool.isRequired
}


export default withStyles(styles)(ExpenseTable);