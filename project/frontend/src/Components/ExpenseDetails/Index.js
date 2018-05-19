import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import pink from '@material-ui/core/colors/pink';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Link } from 'react-router-dom';


const styles = theme => ({
    container : {
        display : 'flex',
        flexWrap : 'wrap',
    },
    buttonDropBox : {
        color : theme.palette.getContrastText(pink[900]),
        backgroundColor : pink[900],
        '&:hover' : {
            backgroundColor : pink[800]
        }
    },
    margin : {
        margin : theme.spacing.unit,
        marginLeft : 'auto',
        marginRight : 'auto'
    },
    icon : {
        color :  pink[900],
        marginRight : '4px'
    },
    buttonFyle : {
        color : theme.palette.getContrastText(pink[400]),
        backgroundColor : pink[400],
        '&:hover' : {
            backgroundColor : '#F50057',
        },
    },
});

const index = (props) => {
    const { classes } = props;
    return (
        <div className = { classes.container }>
            <Button component = { Link } to = '/expenses/loginFyle' variant = "raised" color = "primary" className = {classNames(classes.margin,classes.buttonFyle)}>
            Continue with Fyle
            </Button>
            <Button variant = "raised" color = "primary" className = { classNames(classes.margin,classes.buttonDropBox)}>
            <SvgIcon className = {classes.icon}>
                <path fill="#FFFFFF" d="M12,14.56L16.35,18.16L18.2,16.95V18.3L12,22L5.82,18.3V16.95L7.68,18.16L12,14.56M7.68,2.5L12,6.09L16.32,2.5L22.5,6.5L18.23,9.94L22.5,13.36L16.32,17.39L12,13.78L7.68,17.39L1.5,13.36L5.77,9.94L1.5,6.5L7.68,2.5M12,13.68L18.13,9.94L12,6.19L5.87,9.94L12,13.68Z" />
            </SvgIcon>
            Fyle from DropBox
            </Button>
          </div>
    )
};

index.propTypes = {
    classes : PropTypes.object.isRequired
}

export default withStyles(styles)(index);