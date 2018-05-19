import * as ActionTypes from '../Actions/Actions';

const authCodeHandler = (state = { authCode : ''},action) => {
    switch(action.type){
        case ActionTypes.AUTH_CODE:
            return {
                ...state,
                code : action.code
            }
        case ActionTypes.LOGOUT_FYLE:
            return {
                ...state,
                code : null
            }
        default : 
            return state
    }
}

export default authCodeHandler;