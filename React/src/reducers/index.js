import {combineReducers} from 'redux'
import counter from './counters'
import changeName from './changeName'
import changeCustom from './changeCustom'



export default combineReducers({
  counter,
  changeName,
  changeCustom
})
