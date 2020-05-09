import { Message } from './types'
// Actions
const SET_ERROR = 'error/SET-ERROR';
const CLEAR_ERROR = 'error/CLEAR-ERROR';

// Reducer
export default function reducer(state = {}, action: Message<any> = {}) {
  switch (action.type) {
    case SET_ERROR:
      // Perform action
      return {...state, error: action.payload}
    case CLEAR_ERROR:
      // Perform action
      return {};
    default: return state;
  }
}

// Action Creators
export function setError(err: string) : Message<string> {
  return { type: SET_ERROR, payload: err+'' };
}

export function clearError() : Message<any> {
  return { type: CLEAR_ERROR };
}
