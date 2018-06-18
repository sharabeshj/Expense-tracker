import * as ActionTypes from '../Actions/Actions';

const loginHandler = (state = { authenticated :false },action) => {
    switch(action.type){
        case ActionTypes.LOGIN :
            return {
                ...state,
                authenticated : true,
                token : action.token,
                user_id : action.user_id,
                lastLogin : action.login_time
            }
        case ActionTypes.ERROR :
            return {
                ...state,
                authenticated: false
            }
        case ActionTypes.LOGOUT:
            return {
                ...state,
                authenticated : false,
                token : null,
                user_id : null
            }
        default : 
            return state
    }
}

export default loginHandler;

