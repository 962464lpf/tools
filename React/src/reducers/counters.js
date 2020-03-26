// state
let dataStore = {
  count: 0
}

// reducters
function counter(state = dataStore, action) {
  switch (action.type) {
    case 'INCREMENT':
      return Object.assign({}, state, {count: state.count + 1})
    case 'DECREMENT':
      return Object.assign({}, state, {count: state.count - 1})
    default:
      return state
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。 store


export default counter
