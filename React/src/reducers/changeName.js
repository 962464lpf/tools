// state
let name = {
  name: 'lpf'
}

// reducters
function changeName(state = name, action) {
  switch (action.type) {
    case 'INCREMENT':
      return Object.assign({}, state, {name:  action.name})
    case 'DECREMENT':
      return Object.assign({}, state, {name: state.name + action.name})
    default:
      return state
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。 store


export default changeName
