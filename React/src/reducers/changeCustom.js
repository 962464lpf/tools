// state
let form = {
  brand: "Twitter©2019.02.15",
  logo: "Apple"
}

// reducters
function changeCustom(state = form, action) {
  //assign:将可枚举属性的值从一个或多个源对象复制到目标，并返回目标对象
  switch (action.type) {
    case 'all':
      return Object.assign({}, state, action.custom)
    case 'logo':
      return Object.assign({}, state, {logo: action.custom.log})
    case 'brand':
      return Object.assign({}, state, {logo: action.custom.log})
    default:
      return state
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。 store


export default changeCustom
