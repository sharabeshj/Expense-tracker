import  { combineReducers } from 'redux';
import LoginHandler   from './loginReducer';
import DrawerHandler from  './drawerReducer';

const rootReducer = combineReducers({
    log :LoginHandler,
    draw : DrawerHandler
});

export default rootReducer;

