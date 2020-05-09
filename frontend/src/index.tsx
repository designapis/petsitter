import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as DuckUser from './duck-user'
import * as DuckJobs from './duck-jobs'
import * as DuckError from './duck-error'
import configureStore from './configureStore'
import { User } from './types'
import Api from './api'

let user : User = {}
try {
  user = JSON.parse(localStorage.getItem('user') || '{}')

  // Clear bad users
  if(!user.password)
    localStorage.removeItem('user')
  Api.setSimpleToken(user.email, user.password)
} catch(e) {
  console.error(e)
}

const store = configureStore({
  user,
  error: {},
  jobs: {
    jobsPage: {},
  },
})

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
) , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Used to extend the Window object
declare global {
  interface Window {
    api: any;
    actions: any;
  }
}

window.api = Api
window.actions = {
  user: bindActionCreators(DuckUser, store.dispatch),
  jobs: bindActionCreators(DuckJobs, store.dispatch),
  error: bindActionCreators(DuckError, store.dispatch)
}
