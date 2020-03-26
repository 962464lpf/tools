import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { createStore } from "redux";
import reducers from "./reducers";
import { Provider } from "react-redux";

import HomePage from "./page/HomePage/HomePage";
import LayoutPage from "./page/LayoutPage/LayoutPage";

const Store = createStore(reducers);


function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Route path="/" exact component={HomePage}></Route>
        <Route path="/bed" component={LayoutPage}></Route>
      </Router>
    </Provider>
  )
}

export default App;
