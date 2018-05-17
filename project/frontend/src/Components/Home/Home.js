import React from "react";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import pink from '@material-ui/core/colors/pink';
import { Link } from 'react-router-dom';
 
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

const home = (props) => {
    const { classes } = props;
    return (
        <div className = {classes.container}>
            <Typography className = {classes.root} variant = "display3" gutterBottom>Welcome to Fyle expense</Typography>
            <Button component = {Link} to = '/login' variant = "raised" color = "primary" className = {classNames(classes.margin,classes.buttonFyle)}>
            Login
            </Button>
        </div>
    )
}

home.propTypes = {
    classes : PropTypes.object.isRequired,
}

export default withStyles(styles)(home);