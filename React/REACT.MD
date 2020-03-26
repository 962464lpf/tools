react-router-dom使用
  1.引入import { HashRouter as Router, Route } from "react-router-dom";
  使用Router包裹
  <Router>
    <Route path="/" exact component={HomePage}></Route>
    <Route path="/bed" component={LayoutPage}></Route>
  </Router>
  如果有子路由自在父路由的组件中添加子路由
    <Switch>
          <Route path='/bed/autotest/scenetest' component={SceneList}></Route>
          <Route path='/bed/autotest/compList' component={ComponenTest}></Route>
          <Route path='/bed/custom' component={CustomPage}></Route>
          <Route path='/bed/autotest/mytesttask' component={TaskList}></Route>
          {/* 设置未匹配到的404路由 */}
          <Route component={Developing}></Route>
    </Switch>
  如果子路由的组件包含布局组件，在在需要显示子路由组件的布局组件中添加子路由

  使用js进行路由跳转
  import {createHashHistory} from 'history'
  const history = createHashHistory()
  routingHop (route) {
    history.push(route)
  }

  redux使用
  创建reduers目录，包含多个reducer，index.js将多个reducer合并为一个reducers
  使用combineReducers进行合并并导出  export default combineReducers({
  counter,
  changeName,
  changeCustom
  })最后再导出
  每一个reducer包含
    一个状态存储仓库state
    let name = {
      name: 'lpf'
    }
    一个对仓库state进行修改的方法，（action），zai方法中进行改变state的值，最后再返回state
    action方法定义：参数1状态存储仓库state，第二个参数action，这个action中包含一个type，表示要执行的动作类型，以及需要改变的值
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
  最后导出扎个方法（action）

  具体实现方法：
  1.在根组件中将reducers传入到各个组件中
    引入创建store方法将所有的reducer作为一个状态仓库  import { createStore } from "redux";

    引入定义的reduces import reducers from "./reducers";

    import { Provider } from "react-redux";react-redux是为了方便开发，提供了一个Provider组件，以及connect方法。Provider组件作为做上层组件，需要将store作为参数注入组件中，此后在子组件中都可以访问到store这个对象；

    const Store = createStore(reducers);
    <Provider store={Store}>
      <Router>
        <Route path="/" exact component={HomePage}></Route>
        <Route path="/bed" component={LayoutPage}></Route>
      </Router>
    </Provider>

  2.在组件中获取Store中的值
    在使用的组件中定义需要reducers中的那些reducer
    <!--得到两个reducer中的两个值  -->
      const mapStateToProps = (state) => {
      return {
        <!-- 引入name为changeName reducer -->
        name: state.changeName,
        <!-- 引入custom为changeCustom reducer -->
        custom:state.changeCustom
      }
    }
    在使用的组件中定义需要dispatch reducers中的那个reducer中的action, dispatch({})对象中必须含有type,根据type触发执行那个方法
    const mapDispatchToProps = (dispatch) => {
      return {
        <!-- 定义一个changeName方法，执行type='INCREMENT'这个action -->
        changeName: (name) => {
          dispatch({ type: 'INCREMENT', name })
        }
      }
    }
    <!-- 将组件与定义的reducer与需要dispatch的action进行结合导出 -->
    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(HeaderCom);

    组件中执行使用reducer中的state    {this.props.name.name}
    组件中执行reducer中的action       this.props.changeNamess('zyz')
	
	组件触发action 携带store中就得state与action流向 Reducer  ,reducer返回新的state，并2更新界面


	1.创建actios（告诉reducers做哪些操作）  {type: '', data: name}
	2.创建reducers （执行操作，改变数据）  combineReducers({})  
	3.创建store  
	4.构建容器组件  将组件与redux关联
	5.根组件添加store  使用Provider

