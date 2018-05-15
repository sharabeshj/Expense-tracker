import  { combineReducers } from 'redux';
import LoginHandler   from './loginReducer';

const rootReducer = combineReducers({
    log :LoginHandler
});

export default rootReducer;

