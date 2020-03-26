import {combineReducers} from 'redux'

function changeNameAction (state = 'lpf', action) {
  switch (action.type) {
    case 'before':
    return state + action.data
    case 'after':
    return action.data + state
    default:
    return state
  }
}

function changeAgeAction (state = 21, action){
  switch (action.type) {
    case 'min':
    return state - action.data
    case 'add':
    return state + action.data
    default:
    return state
  }
 }


 
export default combineReducers({
  changeAgeAction,
  changeNameAction
})
