import * as ActionTypes from '../Actions/Actions';

const drawerHandler = (state = { open : false },action) => {
    switch(action.type){
        case ActionTypes.DRAWER_OPEN:
            return {
                ...state,
                open : true
            }
        case ActionTypes.DRAWER_CLOSE:
            return {
                ...state,
                open : false
            }
        default : 
            return state
    }
}
export default drawerHandler;