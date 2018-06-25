import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NavBar from '../Navigation/NavBar';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { drawerClose } from '../../store/Actions/ActionCreator';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';

const drawerWidth = 240;

const styles = theme => ({
    root : {
        backgroundColor : '#FFF',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        margin : '72px auto',
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      'content-left': {
        marginLeft: -drawerWidth,
      },
    
    contentShift: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      'contentShift-left': {
        marginLeft: 0,
      },
      appFrame : {
        height : '100%',
        zIndex : 1,
        overflow : 'hidden',
        position : 'relative',
        display : 'flex',
        width : '100%'
    },
    drawerPaper : {
        position : 'relative',
        width : drawerWidth,
    },
    drawerHeader : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'flex-end',
        padding : '0 8px',
        ...theme.mixins.toolbar,
    },
    
});
const layout = (props) => {
    const {classes} = props;
    const open = props.open;
    const handleDrawerClose = (e) => {
        props.dClose();
    }
    return (
        <div className = {classes.root}>
            <NavBar />
            <div className = {classes.appFrame}>
            <Drawer variant = 'persistent' anchor = 'left' open = {open}
                    classes = {{ paper : classes.drawerPaper }}
                    > 
                        <div className = {classes.drawerHeader}>
                            <IconButton onClick = {handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            
                        </List>
                    </Drawer>
            <div className = {classNames(classes.content,classes['content-left'],{
                [classes.contentShift]:open,
                [classes['contentShift-left']]:open,
            })}>{props.children}</div>
            </div>
        </div>
    )
}

layout.propTypes = {
    classes : PropTypes.object.isRequired,
    open : PropTypes.bool.isRequired,
}

const mapStateToProps = state => {
    return {
        open : state.draw.open
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dClose : () => (dispatch(drawerClose()))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(layout));