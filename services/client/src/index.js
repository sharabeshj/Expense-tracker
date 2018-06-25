import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import configureStore from './store/ConfigureStore';
import { loadState,storeState } from './localStorage.js';

const state = loadState();

const store = configureStore(state);

store.subscribe(() => {
    storeState({
        log : store.getState().log
    });
})

ReactDOM.render(<Provider store = { store }><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();
