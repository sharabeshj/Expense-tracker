import  { combineReducers } from 'redux';
import LoginHandler   from './loginReducer';
import DrawerHandler from  './drawerReducer';
import AuthCodeHandler from './authCodeReducer';

const rootReducer = combineReducers({
    log :LoginHandler,
    draw : DrawerHandler,
    auth : AuthCodeHandler
});

export default rootReducer;

