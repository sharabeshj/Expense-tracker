import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import { drawerOpen } from '../../store/Actions/ActionCreator';

const drawerWidth = 240;

const styles = theme => ({
    root : {
        flexGrow : 1,
    },
    flex : {
        flex : 1,
    },
    menuButton : {
        marginLeft : -12,
        marginRight : 20
    },
    link : {
        textDecoration : 'none',
    },
    appBar : {
        backgroundColor : '#E91E63',
        position : 'absolute',
        transition : theme.transitions.create(['margin','width'],{
            easing : theme.transitions.easing.sharp,
            duration : theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width : 'calc(100% - $(drawerWidth)px)',
        transition : theme.transitions.create(['margin','width'],{
            easing : theme.transitions.easing.easeOut,
            duration : theme.transitions.duration.enteringScreen,
        }),
    },
    'appBarShift-left': {
        marginLeft : drawerWidth,
    },
    hide : {
        display : 'none',
    },
    
});

class NavBar extends Component{
    constructor(props) {
        super(props);
        this.state = {
            anchorEl : null,
        }
    }
    handleClose = () => {
        this.setState({ anchorEl : null })
    }
    handleMenu = (e) => {
        this.setState({ anchorEl : e.currentTarget})
    }
    handleDrawerOpen = (e) => {
        this.props.dOpen();
    }
    render(){
        const { classes } = this.props;
        const open = Boolean(this.state.anchorEl);
        const dOpen = this.props.open;
        return (
            <div className = { classes.root }>
                <div className= {classes.appFrame}>
                    <AppBar position = 'static' className = {classNames(classes.appBar,{
                        [classes.appBarShift]:dOpen,[classes['appBarShift-left']]:dOpen
                    })}>
                        <ToolBar disableGutters = {!dOpen}>
                            <IconButton className = { classNames(classes.menuButton && {[classes.hide]:dOpen})} color = 'inherit' aria-label = 'Menu' onClick = {this.handleDrawerOpen}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant = 'title' color = 'inherit' className = { classes.flex }>Expense Track</Typography>
                            <Button component = {Link} to = '/' color = 'inherit'>HOME</Button>
                            {this.props.auth && (
                                <div>
                                    <IconButton aria-owns = {open ? "menu-appbar" : null}
                                        aria-haspopup = "true"
                                        onClick = {this.handleMenu}
                                        color = 'inherit'>
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu id = "menu-appbar"
                                        anchorEl = {this.state.anchorEl}
                                        anchorOrigin = {{ vertical : 'top',horizontal : 'right'}}
                                        transformOrigin = {{ vertical : 'top',horizontal : 'right'}}
                                        open = {open}
                                        onClose= {this.handleClose}>
                                        <MenuItem onClick = {this.handleClose}>Profile</MenuItem>
                                        <Link className = {classes.link} to='/expenses'><MenuItem >My Expenses</MenuItem></Link>
                                    </Menu>
                                </div>
                            )}
                        </ToolBar>
                    </AppBar>
                </div>
            </div>
        )
    }
}

NavBar.propTypes = {
    auth : PropTypes.bool.isRequired,
    classes : PropTypes.object.isRequired,
    open : PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    auth : state.log.authenticated,
    open : state.draw.open
});

const mapDispatchToProps = dispatch => {
    return {
        dOpen : () => dispatch(drawerOpen())
    }
}
   

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(NavBar));