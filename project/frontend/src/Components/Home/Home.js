import React,{ Component } from "react";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import pink from '@material-ui/core/colors/pink';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { logout } from '../../store/Actions/ActionCreator';
 
const styles = theme => ({
    container : {
        display : 'flex',
        flexWrap : 'wrap',
    },
    root : {
        width: '100%',
        margin : '32px auto',
        textAlign : 'center'
    },
    buttonFyle : {
        color : theme.palette.getContrastText(pink[400]),
        backgroundColor : pink[400],
        '&:hover' : {
            backgroundColor : '#F50057',
        },
    },
    margin : {
        margin : theme.spacing.unit,
        marginLeft : 'auto',
        marginRight : 'auto'
    },
});

class Home extends Component {
    componentDidMount(){
        if(this.props.authenticated === true){
            axios.post('/checkToken',{ token : this.props.token })
                .then(res => {
                    console.log(res);
                    if(res.status === 200){
                        this.props.history.replace('/expenses/expenseDetails')
                    }
                    else {
                        this.props.logoutHandler();
                        this.props.history.replace('/')
                    }
                })
            
        }
    }
    render(){
        const { classes } = this.props;
        return (
            <div className = {classes.container}>
                <Typography className = {classes.root} variant = "display3" gutterBottom>Welcome to Fyle expense</Typography>
                <Button component = { Link } to = '/expenses/redirect' variant = "raised" color = "primary" className = {classNames(classes.margin,classes.buttonFyle)}>
                Continue with Fyle
                </Button>
            </div>
        )
    }
} 

Home.propTypes = {
    classes : PropTypes.object.isRequired,
}

const mapStateToProps = state => {
    return {
        authenticated : state.log.authenticated,
        token : state.log.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutHandler : () => dispatch(logout)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Home));