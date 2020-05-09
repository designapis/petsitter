// Actions
const SET = 'todo/SET';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET:
      // Perform action
      return state;
    default: return state;
  }
}

// Action Creators
export function set() {
  return { type: SET };
}
