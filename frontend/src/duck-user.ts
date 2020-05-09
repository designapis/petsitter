// Actions
import { User,  Message, Dispatcher, GetState } from './types'
import { setError }  from './duck-error'
import Api from './api'

const SET = 'user/SET'
const PET_SITTER = 'PetSitter'
const PET_OWNER = 'PetOwner'

// Reducer
export default function reducer(state = {}, action: Message<any>) {
  switch (action.type) {
    case SET:
      return action.payload
    default: return state
  }
}

// Queries
export function hasPetSitterRole(user: User) {
  return user.roles?.includes(PET_SITTER)
}

export function hasPetOwnerRole(user: User) {
  return user.roles?.includes(PET_OWNER)
}

// Action Creators

export function getCurrentUser()  : Dispatcher {
  return (dispatch) => {
    return Api.getUser('@me').then((fetchedUser) => {
      return dispatch(storeUser(fetchedUser))
    }).catch(err => {
      dispatch(setError(err))
    })
  }
}

export function storeUser(user: User) : Dispatcher {
  return (dispatch, getState) => {
    const existingUser = getState().user || <User> JSON.parse(localStorage.getItem('user') || '{}')
    // Keep the password when we're updating the user
    if(existingUser.password && !user.password)
      user.password = existingUser.password
    localStorage.setItem('user', JSON.stringify(user))
    dispatch(setUser(user))
  }
}

export function setUser(user: User) : Message<User> {
  return { type: SET, payload: user }
}

// Async Actions
export function login(user: User) : Dispatcher {
  return async (dispatch) => {
    Api.setSimpleToken(user.email, user.password)
    dispatch(setUser(user))
    return dispatch(getCurrentUser())
  }
}

export function signup(user: User) : Dispatcher {
  return async (dispatch) => {
    return Api.createUser(user).then(() => {
      Api.setSimpleToken(user.email, user.password)
      return dispatch(storeUser(user))
    }).catch(err => {
      dispatch(setError(err))
      throw err
    })
  }
}

export function updateUser(user: User) : Dispatcher {
  return async (dispatch) => {
    return Api.updateUser(user).then((fetchedUser) => {
      Api.setSimpleToken(fetchedUser.email, user.password)
      dispatch(storeUser(fetchedUser))
    }).catch((err: any) => {
      dispatch(setError(err))
      throw err
    })
  }
}

export function deleteUser(id: string = "@me") : Dispatcher {
  return async (dispatch) => {
    return Api.deleteUser(id).then(() => {
      dispatch(logout())
    }).catch((err: any) => {
      dispatch(setError(err))
      throw err
    })
  }
}

export function logout() : Dispatcher {
  return async (dispatch) => {
    Api.clearSimpleToken()
    localStorage.removeItem('user')
    dispatch(setUser({}))
  }
}


export function user(getState: GetState) : User {
  return getState().user
}

export function userId(getState: GetState) : string {
  return user(getState).id || ''
}
