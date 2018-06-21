import * as ActionTypes from './Actions';
import axios from 'axios';

export const loggedIn = (data) => {
    return {
        type : ActionTypes.LOGIN,
        token : data.token,
        login_time : Date.now()
    }
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