import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import "./assets/scss/mdb.scss"
import "./assets/scss/_custom-styles.scss"
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux'
import {createStore} from 'redux'

const globalstate = {
    nav_active_bar: 0
};

const reducer = (state = globalstate, action) => {
    switch (action.payload) {
        case "header":
            return {
                nav_active_bar: "asd"
            }
            break;
    }
}

const store = createStore(reducer);
ReactDOM.render(<Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App/>
    </BrowserRouter>
</Provider>, document.getElementById('apps'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
