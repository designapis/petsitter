// Actions
import { User,  Message, Dispatcher } from '../../types'

const SET = 'ps/user/SET'

// Reducer
export default function reducer(state = {}, action: Message<any>) {
  switch (action.type) {
    case SET:
      // Perform action
      return {...state, ...action.payload }
    default: return state
  }
}

// Action Creators
export function setUser(user: User) : Message<User> {
  return { type: SET, payload: user }
}


// Async Actions
export function login(user: User) : Dispatcher {
  return (dispatch) => {
    dispatch(setUser(user))
  }
}
