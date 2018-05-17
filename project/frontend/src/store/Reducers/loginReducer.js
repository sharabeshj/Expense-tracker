import * as ActionTypes from '../Actions/Actions';

const loginHandler = (state = { authenticated :false },action) => {
    switch(action.type){
        case ActionTypes.LOGIN :
            return {
                ...state,
                authenticated : true,
                token : action.token
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
                token : null
            }
        default : 
            return state
    }
}

export default loginHandler;

