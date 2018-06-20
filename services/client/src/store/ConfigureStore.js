import { createStore,applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './Reducers/reducers';

const loggerMiddleware = createLogger();

const configureStore = (state) => {
    return createStore(
        rootReducer,
        state,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
}

export default configureStore;
