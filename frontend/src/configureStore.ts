import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { RootState } from './types'

import user from './duck-user'
import jobs from './duck-jobs'
import error from './duck-error'

const middleware = applyMiddleware(thunk)

const composedEnhancers = composeWithDevTools(middleware)

const reducer = combineReducers({
  error,
  jobs,
  user,
});

const configureStore = (initialState: RootState) => createStore(reducer, initialState, composedEnhancers)
export default configureStore;
