import * as ActionTypes from './Actions';
import axios from 'axios';

const loggedIn = (data,res) => {
    return {
        type : ActionTypes.LOGIN,
        data,
        token : res.data.token,
        login_time : Date.now()
    }
} 

const error = (data,e) => {
    return {
        type : ActionTypes.ERROR,
        data,
    }
}

const validate = (data) => {
    return dispatch => {
        const base64encodedData = new Buffer(data.username + ':' + data.password).toString('base64');
        const headers = { "Authorization" : "Basic " + base64encodedData };
        return axios('/obtain-auth',{ headers : headers })
                .then(res => dispatch(loggedIn(data,res)))
                .catch(e => dispatch(error(data,e)))
    }
}

export const loginClick = (data) => {
    return (dispatch,getState) => dispatch(validate(data))
}

export const logout = () => {
    return {
        type : ActionTypes.LOGOUT
    }
}

export const drawerOpen = () => {
    return {
        type : ActionTypes.DRAWER_OPEN
    }
}

export const drawerClose = () => {
    return {
        type : ActionTypes.DRAWER_CLOSE
    }
}

export const authCodeHandler = (code) => {
    return {
        type : ActionTypes.AUTH_CODE,
        code
    }
}

export const logoutFyle = () => {
    return {
        type : ActionTypes.LOGOUT_FYLE
    }
}

const refreshToken = () => {
    return {
        type : ActionTypes.REFRESH_TOKEN
    }
}

const refreshAction = (data) => {
    return dispatch => {
        const headers = {
            "x-access-token" : data.token
        } 
        axios.get('/expensesRefresh',{ headers : headers })
            .then(res => dispatch(refreshToken()));
    }
}

export const refresh = (data) => {
    return (dispatch,getState) => dispatch(refreshAction(data))
}