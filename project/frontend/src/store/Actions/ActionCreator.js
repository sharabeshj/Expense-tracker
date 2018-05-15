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
