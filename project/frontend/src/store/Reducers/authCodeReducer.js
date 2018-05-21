import * as ActionTypes from '../Actions/Actions';

const authCodeHandler = (state = { authCode : ''},action) => {
    switch(action.type){
        case ActionTypes.AUTH_CODE:
            return {
                ...state,
                authCode : action.code
            }
        case ActionTypes.LOGOUT_FYLE:
            return {
                ...state,
                authCode : null
            }
        default : 
            return state
    }
}

export default authCodeHandler;