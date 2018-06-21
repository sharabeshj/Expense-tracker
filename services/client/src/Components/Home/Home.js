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
import { logout, loggedIn } from '../../store/Actions/ActionCreator';
 
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
            axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,{ headers : { 'Content-Type' : 'application/json', Authorization : `Bearer ${this.props.token}`} })
                .then(res => {
                    if(res.data.data.active === true)
                    this.props.history.replace('/expenses/expenseDetails');
                    else this.props.logoutHandler()
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
        token : state.log.token,
        user_id : state.log.user_id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutHandler : () => dispatch(logout),
        loginHandler : (data) => dispatch(loggedIn(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Home));