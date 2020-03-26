import React from 'react';
import {HashRouter as Router,  Route,  } from 'react-router-dom'
import Layout from './pages/Layout'
import Login from './pages/Login'
import {Provider} from 'react-redux'
import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Route expact path='/login' component={Login}></Route>
          <Route path='/base'>
            <Layout></Layout>
          </Route>

        </Router>
    </Provider>
    
  );
}

export default App;
