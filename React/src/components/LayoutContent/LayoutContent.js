import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import SceneList from '../../components/AutoTest/SceneTest/SceneTest'
import ComponenTest from '../../components/AutoTest/ComponentTest/ComponentTest'
import TaskList from '../../components/AutoTest/TaskList/TaskList';
import CustomPage from '../Custom/Custom'
import Developing from '../../components/Developing/Developing'
import TestReport from '../../components/TestReport/TestReport'

class LayoutContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      // <Router>
        <Switch>
          <Route path='/bed/autotest/scenetest' component={SceneList}></Route>
          <Route path='/bed/autotest/compList' component={ComponenTest}></Route>
          <Route path='/bed/custom' component={CustomPage}></Route>
          <Route path='/bed/autotest/mytesttask' component={TaskList}></Route>
          <Route path='/bed/autotest/testreport/:id' id='a' component={TestReport}></Route>
          {/* 设置未匹配到的404路由 */}
          <Route component={Developing}></Route>
        </Switch>

      // </Router>
    );
  }
}

export default LayoutContent;