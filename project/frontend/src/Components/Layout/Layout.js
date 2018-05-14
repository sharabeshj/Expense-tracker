import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    root : {
        backgroundColor : '#FFF'
    }
});
const layout = (props) => {
    const {classes} = props;
    return (
        <div className = {classes.root}>
            <div>toolbar,sidedrawer</div>
            {props.children}
        </div>
    )
}

layout.propTypes = {
    classes : PropTypes.object.isRequired
}

export default withStyles(styles)(layout);